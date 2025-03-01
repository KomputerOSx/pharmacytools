// src/scripts/syncWebAppsToFirestore.ts

import * as admin from "firebase-admin";
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
 * Get the project root directory regardless of where the script is run from
 */
function getProjectRoot() {
    // When running the script directly, __dirname is src/scripts
    // Go up two levels to reach the project root
    return path.resolve(__dirname, "../..");
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
            console.log(
                "Initialized Firebase with service account from environment variable",
            );
            return admin.firestore();
        }

        // Try service account file with fs.readFileSync
        try {
            // Use absolute path from project root
            const projectRoot = getProjectRoot();
            const serviceAccountPath = path.join(
                projectRoot,
                "serviceAccount.json",
            );
            console.log("Looking for service account at:", serviceAccountPath);

            const serviceAccountContent = fs.readFileSync(
                serviceAccountPath,
                "utf8",
            );
            const serviceAccount = JSON.parse(serviceAccountContent);

            admin.initializeApp({
                credential: admin.credential.cert(serviceAccount),
            });
            console.log("Initialized Firebase with service account file");
            return admin.firestore();
        } catch (fileError) {
            console.log(
                "Service account file not found or invalid, using default credentials",
                fileError,
            );
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
 */
function getWebApps(): WebApp[] {
    // Use absolute path from project root
    const projectRoot = getProjectRoot();
    const webAppsDir = path.join(projectRoot, "src", "app", "webApps");

    console.log("Looking for web apps in:", webAppsDir);

    try {
        const appDirs = fs
            .readdirSync(webAppsDir, { withFileTypes: true })
            .filter((dirent) => dirent.isDirectory())
            .map((dirent) => dirent.name);

        const webApps: WebApp[] = [];

        for (const appDir of appDirs) {
            const appPath = path.join(webAppsDir, appDir);
            const metadataPath = path.join(appPath, "metadata.json");

            if (!fs.existsSync(metadataPath)) {
                console.log(`No metadata.json found for ${appDir}, skipping`);
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
                console.log(`Added ${appDir} to web apps list`);
            } catch (error) {
                console.error(`Error reading metadata for ${appDir}:`, error);
            }
        }

        return webApps;
    } catch (error) {
        console.error("Error reading webApps directory:", error);
        return [];
    }
}

/**
 * Syncs web apps metadata to Firestore
 */
async function syncWebAppsToFirestore() {
    console.log("Starting sync to Firestore...");

    try {
        const db = initFirebase();
        const webApps = getWebApps();

        if (webApps.length === 0) {
            console.log("No web apps found to sync");
            return {
                success: false,
                count: 0,
                message: "No web apps found to sync",
            };
        }

        const batch = db.batch();
        const webAppsCollection = db.collection("webApps");

        // First, delete all existing documents
        console.log("Fetching existing documents...");
        const existingDocs = await webAppsCollection.get();
        existingDocs.forEach((doc) => {
            batch.delete(doc.ref);
            console.log(`Marked ${doc.id} for deletion`);
        });

        // Then add all the current web apps
        for (const app of webApps) {
            const docRef = webAppsCollection.doc(app.id);
            batch.set(docRef, app.data);
            console.log(`Added ${app.id} to batch`);
        }

        // Commit the batch
        console.log("Committing batch to Firestore...");
        await batch.commit();
        console.log(
            `Successfully synced ${webApps.length} web apps to Firestore`,
        );

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

// If run directly via node/ts-node
if (require.main === module) {
    syncWebAppsToFirestore()
        .then((result) => {
            console.log("Sync result:", result);
            process.exit(result.success ? 0 : 1);
        })
        .catch((error) => {
            console.error("Unhandled error in sync process:", error);
            process.exit(1);
        });
}

export { syncWebAppsToFirestore, getWebApps };
