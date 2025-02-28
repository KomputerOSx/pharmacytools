import { promises as fs } from "fs";
import path from "path";

export interface AppInfo {
    name: string;
    description: string;
    version: string;
    author: string;
    tags: string[];
    icon: string;
    slug: string; // Folder name for routing
}

export async function getApps(): Promise<AppInfo[]> {
    try {
        // Try different possible paths for the webApps directory
        let appsDirectory;
        const possiblePaths = [
            path.join(process.cwd(), "src/app/webApps"),
            path.join(process.cwd(), "src/webApps"),
            path.join(process.cwd(), "app/webApps"),
            path.join(process.cwd(), "webApps"),
        ];

        for (const potentialPath of possiblePaths) {
            try {
                await fs.access(potentialPath);
                appsDirectory = potentialPath;
                console.log(`Found webApps directory at: ${appsDirectory}`);
                break;
            } catch (e) {
                // Path doesn't exist or isn't accessible, try next one
            }
        }

        if (!appsDirectory) {
            console.error(
                "Could not find webApps directory in any expected location",
            );
            // Return sample data as fallback
            return getSampleApps();
        }

        const appFolders = await fs.readdir(appsDirectory);
        console.log(`Found ${appFolders.length} potential app folders`);

        const apps = await Promise.all(
            appFolders.map(async (folder) => {
                const folderPath = path.join(appsDirectory!, folder);
                const stats = await fs.stat(folderPath);

                if (stats.isDirectory()) {
                    const metadataPath = path.join(folderPath, "metadata.json");
                    try {
                        const metadataContent = await fs.readFile(
                            metadataPath,
                            "utf8",
                        );
                        const metadata = JSON.parse(metadataContent);
                        return {
                            ...metadata,
                            slug: folder,
                        };
                    } catch (error) {
                        console.log(`No metadata.json found in ${folder}`);
                        return null;
                    }
                }
                return null;
            }),
        );

        const validApps = apps.filter(Boolean) as AppInfo[];
        console.log(`Loaded ${validApps.length} valid apps with metadata`);

        return validApps.length > 0 ? validApps : getSampleApps();
    } catch (error) {
        console.error("Error loading apps:", error);
        // Return sample data as fallback
        return getSampleApps();
    }
}

// Provide sample data to use when real data can't be loaded
function getSampleApps(): AppInfo[] {
    console.log("Using sample app data");
    return [
        {
            name: "Phone Book",
            description: "Easily look up the contacts from pharmacy department",
            version: "1.0.0",
            author: "Ramyar Abdullah",
            tags: ["pharmacy", "phone", "contacts", "bleeps"],
            icon: "faPhone",
            slug: "phone-book",
        },
        {
            name: "Dose Calculator",
            description:
                "Calculate medication doses based on patient parameters",
            version: "2.1.0",
            author: "Ramyar Abdullah",
            tags: ["calculation", "dosing", "medication"],
            icon: "faCalculator",
            slug: "dose-calculator",
        },
        {
            name: "IV Compatibility",
            description: "Check compatibility between IV medications",
            version: "1.3.2",
            author: "Ramyar Abdullah",
            tags: ["IV", "compatibility", "medications"],
            icon: "faSyringe",
            slug: "iv-compatibility",
        },
        {
            name: "Drug Information",
            description: "Quick reference for pharmacological information",
            version: "1.0.1",
            author: "Ramyar Abdullah",
            tags: ["reference", "medications", "information"],
            icon: "faInfoCircle",
            slug: "drug-info",
        },
    ];
}
