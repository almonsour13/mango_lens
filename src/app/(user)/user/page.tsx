"use client";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuGroup,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuShortcut,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Skeleton } from "@/components/ui/skeleton";
import { Table, TableBody, TableCell, TableRow } from "@/components/ui/table";
import PageWrapper from "@/components/wrapper/page-wrapper";
import { useAuth } from "@/context/auth-context";
import { useMetrics } from "@/hooks/use-metrics";
import useRecentAnalysis from "@/hooks/use-recent-analysis";
import { removeOldDatabase } from "@/stores/indexeddb";
import { loadingStore$ } from "@/stores/loading-store";
import { Image as Img } from "@/types/types";
import { format } from "date-fns";
import {
    Eye,
    LucideIcon
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export default function Dashboard() {
    const { userInfo, resetToken } = useAuth();
    
    const handleLogout = async () => {
        const response = await fetch("/api/auth/logout", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
        });
        if (response.ok) {
            window.location.href = "/signin";
            resetToken();
            removeOldDatabase();
        }
    };

    return (
        <>
            <div className="w-full flex flex-col items-center justify-center">
                <div className="px-4 h-14 w-full items-center flex justify-between">
                    <div className="flex items-center">
                        {/* <h1 className="text-md">Dashboard</h1> */}
                        <h1 className="text-md">
                            <span>{"Hi "}{userInfo?.fName},</span>
                            {/* {treeLoading && imageLoading ? "loading" : "loaded"} */}
                        </h1>
                    </div>
                    <div className="flex items-center justify-between gap-2">
                        <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                                <Avatar className="cursor-pointer h-8 w-8 border">
                                    {/* <AvatarImage
                                        src={userInfo?.profileImage}
                                        alt={`${userInfo?.fName} ${userInfo?.lName}`}
                                    /> */}
                                    <AvatarFallback className="text-xs">
                                        {(userInfo?.fName?.charAt(0) ?? "") +
                                            (userInfo?.lName?.charAt(0) ?? "")}
                                    </AvatarFallback>
                                </Avatar>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent
                                className="w-40 md:w-56"
                                align="end"
                            >
                                <DropdownMenuLabel className="flex flex-col">
                                    <span className="text-md font-medium">
                                        {userInfo?.fName} {userInfo?.lName}
                                    </span>
                                    <span className="text-xs text-muted-foreground">
                                        {userInfo?.email}
                                    </span>
                                </DropdownMenuLabel>
                                <DropdownMenuSeparator />
                                <DropdownMenuGroup>
                                    <Link href="/user/settings">
                                        <DropdownMenuItem>
                                            Profile
                                            <DropdownMenuShortcut>
                                                ⌘P
                                            </DropdownMenuShortcut>
                                        </DropdownMenuItem>
                                    </Link>
                                    <Link href="/user/feedback">
                                        <DropdownMenuItem>
                                            Feedback
                                            <DropdownMenuShortcut>
                                                ⌘F
                                            </DropdownMenuShortcut>
                                        </DropdownMenuItem>
                                    </Link>
                                    <Link href="/user/settings/account">
                                        <DropdownMenuItem>
                                            Account
                                            <DropdownMenuShortcut>
                                                ⌘A
                                            </DropdownMenuShortcut>
                                        </DropdownMenuItem>
                                    </Link>
                                    <Link href="/user/settings">
                                        <DropdownMenuItem>
                                            Settings
                                            <DropdownMenuShortcut>
                                                ⌘S
                                            </DropdownMenuShortcut>
                                        </DropdownMenuItem>
                                    </Link>
                                </DropdownMenuGroup>
                                <DropdownMenuItem onClick={handleLogout}>
                                    Log out
                                    <DropdownMenuShortcut>
                                        ⇧⌘Q
                                    </DropdownMenuShortcut>
                                </DropdownMenuItem>
                            </DropdownMenuContent>
                        </DropdownMenu>
                    </div>
                </div>
            </div>
            <Welcome />
            <PageWrapper>
                <Metrics />
                <div className="flex flex-col md:flex-row gap-4">
                    <RecentAnalysis />
                    {/* <RecentActivities /> */}
                </div>
            </PageWrapper>
        </>
    );
}
const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return "Morning";
    if (hour < 17) return "Afternoon";
    return "Evening";
};
const Welcome = () => {
    return (
        <div className="w-full px-4 py-0 flex flex-col items-center justify-center">
            <div className="w-full flex flex-col md:gap-2">
                <h1 className="text-2xl font-bold">
                    <span>Good {getGreeting()}</span>
                </h1>
                <p className="text-sm text-muted-foreground">
                    Here is a quick overview of your account and the progress
                    you have made.
                </p>
            </div>
        </div>
    );
};
interface Metric {
    name: string;
    value: number;
    detail: string;
    icon: LucideIcon;
}

const Metrics = () => {
    const { loading, metrics } = useMetrics();

    return (
        <Card className="border-0 p-0 shadow-none">
            <div className="grid gap-2 md:gap-4 grid-cols-2 lg:grid-cols-4">
                {loading 
                    ? Array.from({ length: 4 }).map((_, index) => (
                        <Skeleton  key={index} className="h-28 border w-full flex items-center justify-center p-8 animate-pulse bg-muted" />
                      ))
                    : metrics.map((metric, index) => (
                          <Card key={index} className="bg-caard shadow-none">
                              <CardHeader className="flex flex-row items-center justify-between pb-0">
                                  <CardTitle className="text-xs md:text-sm font-medium text-muted-foreground">
                                      {metric.name}
                                  </CardTitle>
                                  <metric.icon className="text-primary h-5 w-5" />
                              </CardHeader>
                              <CardContent>
                                  <div className="text-2xl font-bold">
                                      {metric.value}
                                  </div>
                                  <p className="text-xs text-muted-foreground">
                                      {metric.detail}
                                  </p>
                              </CardContent>
                          </Card>
                      ))}
            </div>
        </Card>
    );
};

type Images = Img & {
    analyzedImage: string | null;
    treeCode: string;
    diseases: { likelihoodScore: number; diseaseName: string }[];
};
const RecentAnalysis = () => {
    const { loading, analysis } = useRecentAnalysis();
    const router = useRouter();


    return (
        <Card className="border-0 p-0 shadow-none flex-1">
            <div className="py-2 w-full flex items-center justify-between">
                <CardTitle className="text-lg">Recent Analysis </CardTitle>
                {analysis && (
                <Link
                    href={`/user/gallery`}
                    className="hover:underline text-primary"
                >
                    View All
                </Link>
                    
                )}
            </div>
            <CardContent className="p-0 bg-carda border-0 rounded-md overflow-hidden">
                {loading && analysis.length === 0 ? (
                    <Skeleton className="flex-1 h-96" />
                ) : analysis ? (
                    <Table className="relative border-0">
                        {/* <TableHeader className="h-8 bg-transparent border-0">
                                <TableRow className="border-0 p-0">
                                    <TableHead>Image</TableHead>
                                    <TableHead className="table-cell">
                                        Tree Code
                                    </TableHead>
                                    <TableHead>Status</TableHead>
                                    <TableHead className="hidden md:table-cell">
                                        Analyzed At
                                    </TableHead>
                                    <TableHead className="text-right hidden md:table-cell"></TableHead>
                                </TableRow>
                            </TableHeader> */}
                        <TableBody className="border-0">
                            {analysis.slice(0, 5).map((image) => {
                                const isHealthy = image.diseases?.some(
                                    (disease) =>
                                        disease.diseaseName === "Healthy" &&
                                        disease.likelihoodScore > 30
                                );
                                return (
                                    <TableRow
                                        key={image.imageID}
                                        className="cursor-pointer border-0"
                                        onClick={() =>
                                            router.push(
                                                `/user/gallery/${image.imageID}`
                                            )
                                        }
                                    >
                                        <TableCell className="p-0 pb-1 group relative overflow-hidden">
                                            <Image
                                                src={image.imageData}
                                                alt={`Tree ${image.treeCode}`}
                                                width={64}
                                                height={64}
                                                className="rounded h-16 w-16"
                                            />
                                            {image.analyzedImage && (
                                                <Image
                                                    src={image.analyzedImage}
                                                    alt={`Tree ${image.imageID} Analyzed`}
                                                    width={64}
                                                    height={64}
                                                    className="transition-opacity h-16 w-16 duration-300 opacity-0 group-hover:opacity-100 absolute rounded bottom-0 top-0"
                                                />
                                            )}
                                        </TableCell>
                                        <TableCell className="table-cell font-medium px-0 text-center">
                                            {image.treeCode}
                                        </TableCell>
                                        <TableCell className="table-cell text-right md:text-center px-0">
                                            {isHealthy ? (
                                                <Badge
                                                    variant="default"
                                                    className="whitespace-nowrap"
                                                >
                                                    {image.diseases?.find(
                                                        (disease) =>
                                                            disease.diseaseName ===
                                                            "Healthy"
                                                    )?.likelihoodScore || 0}
                                                    % Healthy
                                                </Badge>
                                            ) : (
                                                <Badge variant="destructive">
                                                    {image.diseases
                                                        .filter(
                                                            (di) =>
                                                                di.diseaseName !==
                                                                "Healthy"
                                                        )
                                                        .reduce(
                                                            (acc, disease) =>
                                                                acc +
                                                                disease.likelihoodScore,
                                                            0
                                                        )
                                                        .toFixed(1) +
                                                        "% Diseased"}
                                                </Badge>
                                            )}
                                        </TableCell>
                                        <TableCell className="hidden md:table-cell">
                                            {format(
                                                image.uploadedAt,
                                                "d MMM, y hh:mm a"
                                            )}
                                        </TableCell>
                                        <TableCell className="text-right hidden md:table-cell">
                                            <Link
                                                href={`/user/image/${image.imageID}`}
                                            >
                                                <Eye className="h-4 w-4" />
                                            </Link>
                                        </TableCell>
                                    </TableRow>
                                );
                            })}
                        </TableBody>
                    </Table>
                ) : (
                    <div className="flex items-center justify-center">
                        No Recent Analysis
                    </div>
                )}
            </CardContent>
        </Card>
    );
};
