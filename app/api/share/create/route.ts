import { NextRequest, NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { db } from "@/lib/db";
import { shareLinks, files } from "@/lib/db/schema";
import { v4 as uuidv4 } from "uuid";
import { eq, and } from "drizzle-orm";
import { generateRandomToken, hashPassword } from "@/lib/utils";

export async function POST(request: NextRequest) {
  try {
    const { userId } = await auth();
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const { fileId, permission = 'view', password, expiresAt, maxViews } = body;

    if (!fileId) {
      return NextResponse.json(
        { error: "File ID is required" },
        { status: 400 }
      );
    }

    // Verify the file exists and belongs to the user
    const [file] = await db
      .select()
      .from(files)
      .where(and(eq(files.id, fileId), eq(files.userId, userId)));

    if (!file) {
      return NextResponse.json(
        { error: "File not found or you don't have permission" },
        { status: 404 }
      );
    }

    // Validate permission
    if (!['view', 'edit'].includes(permission)) {
      return NextResponse.json(
        { error: "Invalid permission. Must be 'view' or 'edit'" },
        { status: 400 }
      );
    }

    // Generate a unique token
    const token = generateRandomToken(32);

    // Parse expiration date if provided
    let parsedExpiresAt: Date | undefined;
    if (expiresAt) {
      parsedExpiresAt = new Date(expiresAt);
      if (isNaN(parsedExpiresAt.getTime())) {
        return NextResponse.json(
          { error: "Invalid expiration date" },
          { status: 400 }
        );
      }
    }

    // Hash password if provided
    let hashedPassword: string | null = null;
    if (password) {
      hashedPassword = await hashPassword(password);
    }

    // Create share link
    const shareLinkData = {
      id: uuidv4(),
      fileId,
      token,
      permission,
      password: hashedPassword,
      expiresAt: parsedExpiresAt || null,
      maxViews: maxViews || null,
      viewCount: 0,
      isActive: true,
      createdBy: userId,
    };

    const [newShareLink] = await db
      .insert(shareLinks)
      .values(shareLinkData)
      .returning();

    // Generate the shareable URL
    const shareUrl = `${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}/share/${token}`;

    return NextResponse.json({
      success: true,
      message: "Share link created successfully",
      shareLink: {
        ...newShareLink,
        shareUrl,
      },
    });
  } catch (error) {
    console.error("Error creating share link:", error);
    return NextResponse.json(
      { error: "Failed to create share link" },
      { status: 500 }
    );
  }
}
