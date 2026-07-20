import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { share_links, files } from "@/lib/db/schema";
import { eq, and } from "drizzle-orm";
import { verifyPassword } from "@/lib/utils";

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ token: string }> }
) {
  try {
    const { token } = await params;
    const { password } = await request.json();

    if (!password) {
      return NextResponse.json(
        { error: "Password is required" },
        { status: 400 }
      );
    }

    // Find the share link
    const [shareLink] = await db
      .select()
      .from(share_links)
      .where(and(eq(share_links.token, token), eq(share_links.isActive, true)));

    if (!shareLink) {
      return NextResponse.json(
        { error: "Share link not found or has been deactivated" },
        { status: 404 }
      );
    }

    // Check if link has a password
    if (!shareLink.password) {
      return NextResponse.json(
        { error: "This share link does not require a password" },
        { status: 400 }
      );
    }

    // Verify the password
    const isValid = await verifyPassword(password, shareLink.password);

    if (!isValid) {
      return NextResponse.json(
        { error: "Incorrect password" },
        { status: 401 }
      );
    }

    // Check if link has expired
    if (shareLink.expiresAt && new Date(shareLink.expiresAt) < new Date()) {
      return NextResponse.json(
        { error: "Share link has expired" },
        { status: 410 }
      );
    }

    // Check if max views has been reached
    if (shareLink.maxViews && shareLink.viewCount >= shareLink.maxViews) {
      return NextResponse.json(
        { error: "Share link has reached maximum views" },
        { status: 429 }
      );
    }

    // Get the file details
    const [file] = await db
      .select()
      .from(files)
      .where(eq(files.id, shareLink.fileId));

    if (!file) {
      return NextResponse.json(
        { error: "File not found" },
        { status: 404 }
      );
    }

    // Check if file is in trash
    if (file.isTrash) {
      return NextResponse.json(
        { error: "File has been deleted" },
        { status: 410 }
      );
    }

    // Increment view count
    await db
      .update(share_links)
      .set({ viewCount: shareLink.viewCount + 1 })
      .where(eq(share_links.id, shareLink.id));

    // Return file info with share link details
    return NextResponse.json({
      success: true,
      file: {
        ...file,
        // Don't expose userId in shared response
        userId: undefined,
      },
      shareLink: {
        id: shareLink.id,
        permission: shareLink.permission,
        createdAt: shareLink.createdAt,
        expiresAt: shareLink.expiresAt,
        maxViews: shareLink.maxViews,
        viewCount: shareLink.viewCount + 1,
      },
    });
  } catch (error) {
    console.error("Error verifying share link password:", error);
    return NextResponse.json(
      { error: "Failed to verify password" },
      { status: 500 }
    );
  }
}
