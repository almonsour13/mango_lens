import { MetaData } from "@/constant/metaData";
import { ImageAnalysisDetails } from "@/types/types";
import { format } from "date-fns";

export const generateImage = async (imageDetails: ImageAnalysisDetails) => {
    const canvas = document.createElement("canvas");
    const context = canvas.getContext("2d");

    if (!context) {
        throw new Error("Canvas context is not available.");
    }

    const { title, icons } = MetaData;
    const icon = icons.icon;

    // Set canvas dimensions
    const width = 1200;
    const height = 1600;
    canvas.width = width;
    canvas.height = height;

    // Set background color
    context.fillStyle = "#ffffff";
    context.fillRect(0, 0, width, height);

    // Add a subtle background pattern
    // context.fillStyle = "#f0f0f0";
    // for (let i = 0; i < width; i += 20) {
    //     for (let j = 0; j < height; j += 20) {
    //         context.fillRect(i, j, 10, 10);
    //     }
    // }

    // Load and render images
    const loadImage = (src: string): Promise<HTMLImageElement> => {
        return new Promise((resolve, reject) => {
            const img = new Image();
            img.crossOrigin = "anonymous"; // To avoid CORS issues
            img.src = src;
            img.onload = () => resolve(img);
            img.onerror = reject;
        });
    };

    const renderImage = (
        img: HTMLImageElement,
        x: number,
        y: number,
        label: string
    ) => {
        const imageWidth = 450;
        const imageHeight = 450;

        // Draw a white background for the image
        context.fillStyle = "white";
        context.fillRect(x - 10, y - 10, imageWidth, imageHeight);

        // Draw a border around the image
        context.strokeStyle = "black";
        context.lineWidth = 2;
        context.strokeRect(x - 10, y - 10, imageWidth, imageHeight);

        // Draw the image
        context.drawImage(img, x, y, imageWidth, imageHeight);

        // Add the label below the image
        context.font = "bold 24px Arial";
        context.fillStyle = "#333333";
        context.textAlign = "center";
        context.fillText(label, x + imageWidth / 2, y + imageHeight + 40);
    };

    try {
        // Load images
        const [originalImage, analyzedImage, appIcon] = await Promise.all([
            loadImage(imageDetails.imageData),
            loadImage(imageDetails.analyzedImage),
            loadImage(icon),
        ]);

        // Add header
        context.fillStyle = "hsl(142, 86%, 28%)";
        context.fillRect(0, 0, width, 100);

        // Add app icon
        context.drawImage(appIcon, 20, 20, 60, 60);

        // Add app title
        context.font = "bold 36px Arial";
        context.fillStyle = "#ffffff";
        context.textAlign = "left";
        context.fillText(title, 100, 65);

        // Add title
        context.font = "bold 40px Arial";
        context.fillStyle = "#2d3748";
        context.textAlign = "center";
        context.fillText("Tree Image Analysis Report", width / 2, 180);

        // Render images
        renderImage(originalImage, 75, 220, "Original Image");
        renderImage(analyzedImage, 675, 220, "Analyzed Image");

        // Add analysis details
        const textStartX = 75;
        let textY = 800;
        const lineHeight = 40;

        context.font = "bold 28px Arial";
        context.fillStyle = "#2d3748";
        context.textAlign = "left";
        context.fillText("Analysis Details", textStartX, textY);
        textY += lineHeight * 1.5;

        context.font = "24px Arial";
        context.fillStyle = "#4a5568";

        context.fillText(
            `Tree Code: ${imageDetails.treeCode}`,
            textStartX,
            textY
        );

        textY += lineHeight;

        context.fillText(
            `Analyzed At: ${format(imageDetails.analyzedAt, "PPpp")}`,
            textStartX,
            textY
        );
        textY += lineHeight * 1.5;

        context.font = "bold 28px Arial";
        context.fillStyle = "#2d3748";
        context.fillText("Diseases Detected:", textStartX, textY);
        textY += lineHeight;

        context.font = "24px Arial";
        context.fillStyle = "#4a5568";
        if (imageDetails.diseases.length > 0) {
            imageDetails.diseases.forEach((disease) => {
                context.fillText(
                    `• ${
                        disease.diseaseName
                    }: ${disease.likelihoodScore.toFixed(2)}%`,
                    textStartX + 20,
                    textY
                );
                textY += lineHeight;
            });
        } else {
            context.fillText("None", textStartX + 20, textY);
        }

        // Add footer
        context.fillStyle = "hsl(142, 86%, 28%)";
        context.fillRect(0, height - 60, width, 60);
        context.font = "18px Arial";
        context.fillStyle = "#ffffff";
        context.textAlign = "center";
        context.fillText(
            `Generated by ${title} on ${format(new Date(), "PPpp")}`,
            width / 2,
            height - 25
        );

        // Export the canvas content as an image file
        const dataUrl = canvas.toDataURL("image/png");
        const link = document.createElement("a");
        link.download = `tree-${imageDetails.treeCode}-image-report.png`;
        link.href = dataUrl;
        link.click();
    } catch (error) {
        console.error("Error generating analysis report:", error);
        throw new Error("Failed to generate analysis report");
    }
};