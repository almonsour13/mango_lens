import { query } from "@/lib/db/db";
import {  Tree } from "@/types/types";
import { convertImageToBlob } from "@/utils/image-utils";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
    try {
        const body = await req.json();
        const { userID, scanResult } = body;

        if (!scanResult) {
            return NextResponse.json(
                { error: "Invalid scan result data." },
                { status: 400 }
            );
        }
        const { treeCode, originalImage, analyzedImage, boundingBoxes, diseases } =
            scanResult;
        
            console.log(treeCode)
        if (
            !userID ||
            !treeCode ||
            !originalImage ||
            !analyzedImage ||
            !diseases ||
            !boundingBoxes
        ) {
            return NextResponse.json(
                { error: "Incomplete scan result data." },
                { status: 400 }
            );
        }
        
        const tree = await query(`SELECT * FROM tree WHERE treeCode = ?`,[treeCode]) as Tree[]
        try {
            const originalImageBlob = convertImageToBlob(originalImage);
            const insertImageResult = (await query(
                `INSERT INTO image (userID, treeID, imageData) 
                 VALUES (?, ?, ?)`,
                [userID, tree[0].treeID, originalImageBlob]
            )) as { insertId: number };

            const imageID = insertImageResult.insertId;

            const insertAnalysisResult = (await query(
                `INSERT INTO analysis (imageID) 
                 VALUES (?)`,
                [imageID]
            )) as { insertId: number };

            const analysisID = insertAnalysisResult.insertId;

            for (const detected of diseases) {
                const { diseaseID, likelihoodScore, diseaseName } = detected;

                const diseaseIdentifiedID = (await query(
                    `INSERT INTO diseaseidentified (analysisID, diseaseID, likelihoodScore) 
                         VALUES (?, ?, ?)`,
                    [analysisID, diseaseID, likelihoodScore]
                )) as { insertId: number };

                // if (diseaseIdentifiedID) {
                //     const boundingbox = boundingBoxes.filter(
                //         (box: BoundingBox) => box.diseaseName === diseaseName
                //     )[0];

                //     if (boundingbox) {
                //         await query(
                //             `INSERT INTO boundingbox (diseaseIdentifiedID, x, y, w, h) 
                //              VALUES (?, ?, ?, ?, ?)`,
                //             [
                //                 diseaseIdentifiedID.insertId,
                //                 boundingbox.x,
                //                 boundingbox.y,
                //                 boundingbox.w,
                //                 boundingbox.h,
                //             ]
                //         );
                //     }
                // }
            }
            
            const analyzedImageBlob = convertImageToBlob(analyzedImage);

            const insertAnalyzedImageResult = (await query(
                `INSERT INTO analyzedimage (analysisID, imageData) VALUES (?, ?)`,
                [analysisID, analyzedImageBlob]
            )) as { insertId: number };

            return NextResponse.json({
                message: "Analysis result and image saved successfully.",
            });
        } catch (error) {
            await query("ROLLBACK");
            throw error;
        }
    } catch (error) {
        console.error("Error in saveScan POST request:", error);
        return NextResponse.json(
            { error: "Something went wrong while saving." },
            { status: 500 }
        );
    }
}
