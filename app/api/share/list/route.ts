import { NextRequest, NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { db } from "@/lib/db";
import { shareLinks, files } from "@/lib/db/schema";
import { eq, and } from "drizzle-orm";

export async function GET(request: NextRequest) {
  try {
    const { userId } = await auth();
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const searchParams = request.nextUrl.searchParams;
    const fileId = searchParams.get("fileId");

    // Get all share links for files owned by the user
    let shareLinksList;
    
    if (fileId) {
      // Get share links for a specific file
      shareLinksList = await db
        .select({
          id: shareLinks.id,
          fileId: shareLinks.fileId,
          token: shareLinks.token,
          permission: shareLinks.permission,
          password: shareLinks.password,
          expiresAt: shareLinks.expiresAt,
          maxViews: shareLinks.maxViews,
          viewCount: shareLinks.viewCount,
          isActive: shareLinks.isActive,
          createdAt: shareLinks.createdAt,
          fileName: files.name,
          fileType: files.type,
          isFolder: files.isFolder,
        })
        .from(shareLinks)
        .leftJoin(files, eq(shareLinks.fileId, files.id))
        .where(and(
          eq(shareLinks.createdBy, userId),
          eq(shareLinks.fileId, fileId),
          eq(shareLinks.isActive, true)
        ))
        .orderBy(shareLinks.createdAt);
    } else {
      // Get all share links for all files owned by the user
      shareLinksList = await db
        .select({
          id: shareLinks.id,
          fileId: shareLinks.fileId,
          token: shareLinks.token,
          permission: shareLinks.permission,
          password: shareLinks.password,
          expiresAt: shareLinks.expiresAt,
          maxViews: shareLinks.maxViews,
          viewCount: shareLinks.viewCount,
          isActive: shareLinks.isActive,
          createdAt: shareLinks.createdAt,
          fileName: files.name,
          fileType: files.type,
          isFolder: files.isFolder,
        })
        .from(shareLinks)
        .leftJoin(files, eq(shareLinks.fileId, files.id))
        .where(and(
          eq(shareLinks.createdBy, userId),
          eq(files.userId, userId),
          eq(shareLinks.isActive, true)
        ))
        .orderBy(shareLinks.createdAt);
    }

    // Generate share URLs for each link
    const shareLinksWithUrls = shareLinksList.map(link => ({
      ...link,
      shareUrl: `${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}/share/${link.token}`,
      // Mask password in response
      hasPassword: !!link.password,
      password: undefined,
    }));

    return NextResponse.json({
      success: true,
      shareLinks: shareLinksWithUrls,
    });
  } catch (error) {
    console.error("Error fetching share links:", error);
    return NextResponse.json(
      { error: "Failed to fetch share links" },
      { status: 500 }
    );
  }
}
