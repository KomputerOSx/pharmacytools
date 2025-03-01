// // src/app/api/webApps/route.ts
//
// import { NextResponse } from "next/server";
// import fs from "fs";
// import path from "path";
//
// interface WebAppData {
//     name: string;
//     description: string;
//     version: string;
//     author: string;
//     tags: string[];
//     icon: string;
// }
//
// interface WebApp {
//     id: string;
//     path: string;
//     data: WebAppData;
// }
//
// /**
//  * Scans the webApps directory and extracts metadata for each app
//  * @returns Array of web app information
//  */
//
// function getWebApps(): WebApp[] {
//     const webAppsDir = path.join(process.cwd(), "src", "app", "webApps");
//     const appDirs = fs
//         .readdirSync(webAppsDir, { withFileTypes: true })
//         .filter((dirent) => dirent.isDirectory())
//         .map((dirent) => dirent.name);
//
//     const webApps: WebApp[] = [];
//
//     for (const appDir of appDirs) {
//         const appPath = path.join(webAppsDir, appDir);
//         const metadataPath = path.join(appPath, "metadata.json");
//
//         if (!fs.existsSync(metadataPath)) {
//             continue;
//         }
//
//         try {
//             const metadataContent = fs.readFileSync(metadataPath, "utf-8");
//             const metadata: WebAppData = JSON.parse(metadataContent);
//
//             webApps.push({
//                 id: appDir,
//                 path: `/webApps/${appDir}`,
//                 data: {
//                     ...metadata,
//                 },
//             });
//         } catch (error) {
//             console.error(`Error reading metadata for ${appDir}: ${error}`);
//         }
//     }
//
//     return webApps;
// }
//
// export async function GET() {
//     try {
//         const webApps = getWebApps();
//         return NextResponse.json(webApps);
//     } catch (error) {
//         return NextResponse.json(
//             { error: "Failed to fetch web apps: " + error + "." },
//             { status: 500 },
//         );
//     }
// }

// src/app/api/webApps/route.ts

// src/app/api/webApps/route.ts

import { NextResponse } from "next/server";
import fs from "fs";
import path from "path";
import * as admin from "firebase-admin";

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
 * Initialize Firebase Admin SDK
 */
function initFirebase() {
    if (admin.apps.length) return admin.firestore();

    try {
        // Try environment variable first (preferred method)
        if (process.env.MY_FIREBASE_SERVICE_ACCOUNT) {
            const serviceAccount = JSON.parse(
                process.env.MY_FIREBASE_SERVICE_ACCOUNT,
            );
            admin.initializeApp({
                credential: admin.credential.cert(serviceAccount),
            });
            return admin.firestore();
        }

        // Try service account file with fs.readFileSync
        try {
            const serviceAccountPath = path.resolve("./serviceAccount.json");
            const serviceAccountContent = fs.readFileSync(
                serviceAccountPath,
                "utf8",
            );
            const serviceAccount = JSON.parse(serviceAccountContent);

            admin.initializeApp({
                credential: admin.credential.cert(serviceAccount),
            });
            return admin.firestore();
        } catch (fileError) {
            console.log(fileError);
            // Fall back to default credentials
            admin.initializeApp();
            return admin.firestore();
        }
    } catch (error) {
        console.error("Error initializing Firebase:", error);
        throw error;
    }
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

/**
 * Syncs web apps from local file system to Firestore
 */
async function syncWebAppsToFirestore() {
    try {
        const db = initFirebase();
        const webApps = getWebApps();

        if (webApps.length === 0) {
            return {
                success: false,
                count: 0,
                message: "No web apps found to sync",
            };
        }

        const batch = db.batch();
        const webAppsCollection = db.collection("webApps");

        // First, delete all existing documents
        const existingDocs = await webAppsCollection.get();
        existingDocs.forEach((doc) => {
            batch.delete(doc.ref);
        });

        // Then add all the current web apps
        for (const app of webApps) {
            const docRef = webAppsCollection.doc(app.id);
            batch.set(docRef, app.data);
        }

        // Commit the batch
        await batch.commit();

        return {
            success: true,
            count: webApps.length,
            deleted: existingDocs.size,
            message: `Successfully synced ${webApps.length} web apps to Firestore`,
        };
    } catch (error) {
        console.error("Error syncing web apps to Firestore:", error);
        return {
            success: false,
            error: String(error),
            message: "Failed to sync web apps to Firestore",
        };
    }
}

export async function GET(request: Request) {
    try {
        // Check if we should sync to Firestore
        const url = new URL(request.url);
        const syncParam = url.searchParams.get("sync");

        if (syncParam === "true") {
            const result = await syncWebAppsToFirestore();
            return NextResponse.json(result);
        }

        // Normal behavior: just return web apps from file system
        const webApps = getWebApps();
        return NextResponse.json(webApps);
    } catch (error) {
        return NextResponse.json(
            { error: "Failed to fetch web apps: " + error },
            { status: 500 },
        );
    }
}
