import { NextResponse } from "next/server";
import fs from "fs";
import path from "path";

interface WebAppData {
    name: string;
    description: string;
    version: string;
    author: string;
    tags: string[];
    icon: string;
}

interface WebApp {
    id: string;
    path: string;
    data: WebAppData;
}

/**
 * Scans the webApps directory and extracts metadata for each app
 * @returns Array of web app information
 */

function getWebApps(): WebApp[] {
    const webAppsDir = path.join(process.cwd(), "src", "app", "webApps");
    const appDirs = fs
        .readdirSync(webAppsDir, { withFileTypes: true })
        .filter((dirent) => dirent.isDirectory())
        .map((dirent) => dirent.name);

    const webApps: WebApp[] = [];

    for (const appDir of appDirs) {
        const appPath = path.join(webAppsDir, appDir);
        const metadataPath = path.join(appPath, "metadata.json");

        if (!fs.existsSync(metadataPath)) {
            continue;
        }

        try {
            const metadataContent = fs.readFileSync(metadataPath, "utf-8");
            const metadata: WebAppData = JSON.parse(metadataContent);

            webApps.push({
                id: appDir,
                path: `/webApps/${appDir}`,
                data: {
                    ...metadata,
                },
            });
        } catch (error) {
            console.error(`Error reading metadata for ${appDir}: ${error}`);
        }
    }

    return webApps;
}

export async function GET() {
    try {
        const webApps = getWebApps();
        return NextResponse.json(webApps);
    } catch (error) {
        return NextResponse.json(
            { error: "Failed to fetch web apps" },
            { status: 500 },
        );
    }
}
