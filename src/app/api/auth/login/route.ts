import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
    try {
        const { password, type } = await request.json();

        // Determine which password to check based on type
        const isAdmin = type === "admin";
        const expectedPassword = isAdmin
            ? process.env.ADMIN_PASSWORD
            : process.env.PHONEBOOK_PASSWORD;

        if (!expectedPassword) {
            console.error(`${isAdmin ? "ADMIN_PASSWORD" : "PHONEBOOK_PASSWORD"} environment variable not set`);
            return NextResponse.json(
                { success: false, error: "Server configuration error" },
                { status: 500 }
            );
        }

        if (password === expectedPassword) {
            // Generate a simple session token
            const sessionToken = Buffer.from(
                `${type}-${Date.now()}-${Math.random().toString(36).substring(2)}`
            ).toString("base64");

            return NextResponse.json({
                success: true,
                token: sessionToken,
                type: type,
            });
        }

        return NextResponse.json(
            { success: false, error: "Invalid PIN" },
            { status: 401 }
        );
    } catch {
        return NextResponse.json(
            { success: false, error: "Invalid request" },
            { status: 400 }
        );
    }
}
