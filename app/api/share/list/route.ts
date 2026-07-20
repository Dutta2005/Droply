import { NextRequest, NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { db } from "@/lib/db";
import { share_links, files } from "@/lib/db/schema";
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
          id: share_links.id,
          fileId: share_links.fileId,
          token: share_links.token,
          permission: share_links.permission,
          password: share_links.password,
          expiresAt: share_links.expiresAt,
          maxViews: share_links.maxViews,
          viewCount: share_links.viewCount,
          isActive: share_links.isActive,
          createdAt: share_links.createdAt,
          fileName: files.name,
          fileType: files.type,
          isFolder: files.isFolder,
        })
        .from(share_links)
        .leftJoin(files, eq(share_links.fileId, files.id))
        .where(and(
          eq(share_links.createdBy, userId),
          eq(share_links.fileId, fileId),
          eq(share_links.isActive, true)
        ))
        .orderBy(share_links.createdAt);
    } else {
      // Get all share links for all files owned by the user
      shareLinksList = await db
        .select({
          id: share_links.id,
          fileId: share_links.fileId,
          token: share_links.token,
          permission: share_links.permission,
          password: share_links.password,
          expiresAt: share_links.expiresAt,
          maxViews: share_links.maxViews,
          viewCount: share_links.viewCount,
          isActive: share_links.isActive,
          createdAt: share_links.createdAt,
          fileName: files.name,
          fileType: files.type,
          isFolder: files.isFolder,
        })
        .from(share_links)
        .leftJoin(files, eq(share_links.fileId, files.id))
        .where(and(
          eq(share_links.createdBy, userId),
          eq(files.userId, userId),
          eq(share_links.isActive, true)
        ))
        .orderBy(share_links.createdAt);
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
