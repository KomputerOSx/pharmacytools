// // src/app/api/web-apps/route.ts
// import { NextResponse } from "next/server";
// import path from "path";
// import fs from "fs/promises";
//
// // Helper function to parse app name into a more readable format
// const formatAppName = (dirName: string): string => {
//     // Convert camelCase or kebab-case to Title Case
//     return dirName
//         .replace(/([A-Z])/g, " $1") // Insert space before capital letters
//         .replace(/-/g, " ") // Replace hyphens with spaces
//         .split(" ")
//         .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
//         .join(" ");
// };
//
// // Helper function to get app description from metadata if available
// const getAppDescription = async (appDir: string): Promise<string> => {
//     try {
//         // Check if there's a metadata.json file
//         const metadataPath = path.join(appDir, "metadata.json");
//         const metadataExists = await fs
//             .stat(metadataPath)
//             .then(() => true)
//             .catch(() => false);
//
//         if (metadataExists) {
//             const metadata = JSON.parse(
//                 await fs.readFile(metadataPath, "utf8"),
//             );
//             return metadata.description || "No description available";
//         }
//
//         // Fallback descriptions based on directory name
//         const dirName = path.basename(appDir);
//         switch (dirName) {
//             case "taperCalculator":
//                 return "Calculate medication tapering schedules";
//             case "contacts":
//                 return "Find pharmacy contacts easily";
//             case "crclCalculator":
//                 return "Cockcroft-Gault CrCl Formula";
//             default:
//                 return "Pharmacy tool for healthcare professionals";
//         }
//     } catch (error) {
//         console.error(`Error getting description for ${appDir}:`, error);
//         return "No description available";
//     }
// };
//
// export async function GET() {
//     console.log("API route handler triggered");
//
//     try {
//         // Try multiple possible paths for the webApps directory
//         const possiblePaths = [
//             path.join(process.cwd(), "src", "webApps"),
//             path.join(process.cwd(), "src", "app", "webApps"),
//             path.join(process.cwd(), "app", "webApps"),
//             path.join(process.cwd(), "webApps"),
//         ];
//
//         let webAppsDir = "";
//         let directories: any[] = [];
//
//         // Try each path until we find one that exists
//         for (const p of possiblePaths) {
//             try {
//                 await fs.access(p);
//                 webAppsDir = p;
//                 console.log(`Found webApps directory at: ${webAppsDir}`);
//                 directories = await fs.readdir(p, { withFileTypes: true });
//                 break;
//             } catch (err) {
//                 console.log(`Directory not found at ${p}`);
//             }
//         }
//
//         if (!webAppsDir) {
//             console.error(
//                 "Could not find webApps directory in any of the expected locations",
//             );
//             throw new Error("WebApps directory not found");
//         }
//
//         // Log all files and directories found
//         console.log(
//             "All files and directories found:",
//             directories.map((d) => d.name),
//         );
//
//         // Filter for directories only
//         const webAppDirs = directories.filter((dirent) => dirent.isDirectory());
//         console.log(
//             "Directories only:",
//             webAppDirs.map((d) => d.name),
//         );
//
//         // Create an array of web app information
//         const webApps = await Promise.all(
//             webAppDirs.map(async (dir) => {
//                 const appName = formatAppName(dir.name);
//                 const appPath = path.join(webAppsDir, dir.name);
//                 const description = await getAppDescription(appPath);
//
//                 return {
//                     name: appName,
//                     description,
//                     link: `/webApps/${dir.name}`,
//                 };
//             }),
//         );
//
//         console.log(
//             `Found ${webApps.length} web apps:`,
//             webApps.map((app) => app.name),
//         );
//
//         return NextResponse.json(webApps);
//     } catch (error) {
//         console.error("Error reading web apps directory:", error);
//
//         // Fallback to hardcoded data if directory reading fails
//         const fallbackApps = [
//             {
//                 name: "Taper Calculator",
//                 description: "Calculate medication tapering schedules",
//                 link: "/webApps/taperCalculator",
//             },
//             {
//                 name: "Contact Finder",
//                 description: "Find pharmacy contacts easily",
//                 link: "/webApps/contacts",
//             },
//             {
//                 name: "Creatinine Clearance",
//                 description: "Cockcroft-Gault CrCl Formula",
//                 link: "/webApps/crclCalculator",
//             },
//             {
//                 name: "Fourth App",
//                 description: "Description for the fourth app",
//                 link: "/webApps/fourthApp",
//             },
//         ];
//
//         console.log("Using fallback data with 4 apps");
//         return NextResponse.json(fallbackApps);
//     }
// }

// src/app/api/web-apps/route.ts
import { NextResponse } from "next/server";
import path from "path";
import fs from "fs/promises";

// Helper function to parse app name into a more readable format
const formatAppName = (dirName: string): string => {
    // Convert camelCase or kebab-case to Title Case
    return dirName
        .replace(/([A-Z])/g, " $1") // Insert space before capital letters
        .replace(/-/g, " ") // Replace hyphens with spaces
        .split(" ")
        .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
        .join(" ");
};

// Helper function to get app metadata (name and description)
const getAppMetadata = async (
    appDir: string,
    dirName: string,
): Promise<{ name: string; description: string }> => {
    try {
        // Check if there's a metadata.json file
        const metadataPath = path.join(appDir, "metadata.json");
        const metadataExists = await fs
            .stat(metadataPath)
            .then(() => true)
            .catch(() => false);

        if (metadataExists) {
            const metadata = JSON.parse(
                await fs.readFile(metadataPath, "utf8"),
            );

            // Get name and description from metadata, with fallbacks
            return {
                name: metadata.name || formatAppName(dirName),
                description:
                    metadata.description || getDefaultDescription(dirName),
            };
        }

        // Fallback to default formatting and descriptions
        return {
            name: formatAppName(dirName),
            description: getDefaultDescription(dirName),
        };
    } catch (error) {
        console.error(`Error getting metadata for ${appDir}:`, error);
        return {
            name: formatAppName(dirName),
            description: "No description available",
        };
    }
};

// Function to get default description based on directory name
const getDefaultDescription = (dirName: string): string => {
    switch (dirName) {
        case "taperCalculator":
            return "Calculate medication tapering schedules";
        case "contacts":
            return "Find pharmacy contacts easily";
        case "crclCalculator":
            return "Cockcroft-Gault CrCl Formula";
        default:
            return "Pharmacy tool for healthcare professionals";
    }
};

export async function GET() {
    console.log("API route handler triggered");

    try {
        // Try multiple possible paths for the webApps directory
        const possiblePaths = [
            path.join(process.cwd(), "src", "webApps"),
            path.join(process.cwd(), "src", "app", "webApps"),
            path.join(process.cwd(), "app", "webApps"),
            path.join(process.cwd(), "webApps"),
        ];

        let webAppsDir = "";
        let directories: any[] = [];

        // Try each path until we find one that exists
        for (const p of possiblePaths) {
            try {
                await fs.access(p);
                webAppsDir = p;
                console.log(`Found webApps directory at: ${webAppsDir}`);
                directories = await fs.readdir(p, { withFileTypes: true });
                break;
            } catch (err) {
                console.log(`Directory not found at ${p}`);
            }
        }

        if (!webAppsDir) {
            console.error(
                "Could not find webApps directory in any of the expected locations",
            );
            throw new Error("WebApps directory not found");
        }

        // Log all files and directories found
        console.log(
            "All files and directories found:",
            directories.map((d) => d.name),
        );

        // Filter for directories only
        const webAppDirs = directories.filter((dirent) => dirent.isDirectory());
        console.log(
            "Directories only:",
            webAppDirs.map((d) => d.name),
        );

        // Create an array of web app information
        const webApps = await Promise.all(
            webAppDirs.map(async (dir) => {
                const appPath = path.join(webAppsDir, dir.name);
                const { name, description } = await getAppMetadata(
                    appPath,
                    dir.name,
                );

                return {
                    name,
                    description,
                    link: `/webApps/${dir.name}`,
                };
            }),
        );

        console.log(
            `Found ${webApps.length} web apps:`,
            webApps.map((app) => app.name),
        );

        return NextResponse.json(webApps);
    } catch (error) {
        console.error("Error reading web apps directory:", error);

        // Fallback to hardcoded data if directory reading fails
        const fallbackApps = [
            {
                name: "Taper Calculator",
                description: "Calculate medication tapering schedules",
                link: "/webApps/taperCalculator",
            },
            {
                name: "Contact Finder",
                description: "Find pharmacy contacts easily",
                link: "/webApps/contacts",
            },
            {
                name: "Creatinine Clearance",
                description: "Cockcroft-Gault CrCl Formula",
                link: "/webApps/crclCalculator",
            },
            {
                name: "Fourth App",
                description: "Description for the fourth app",
                link: "/webApps/fourthApp",
            },
        ];

        console.log("Using fallback data with 4 apps");
        return NextResponse.json(fallbackApps);
    }
}
