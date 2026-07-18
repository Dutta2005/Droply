"use client";

import { useState, useEffect } from "react";
import { Card, CardHeader, CardBody } from "@heroui/card";
import { Button } from "@heroui/button";
import { Table, TableHeader, TableColumn, TableBody, TableRow, TableCell } from "@heroui/table";
import { Link, Copy, Check, X, Share2, Eye, Calendar, Lock, Folder, File } from "lucide-react";
import axios from "axios";
import { toast } from "react-toastify";
import Navbar from "@/components/Navbar";

export default function ShareLinksPage() {
  const [shareLinks, setShareLinks] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [copiedToken, setCopiedToken] = useState<string | null>(null);

  useEffect(() => {
    fetchShareLinks();
  }, []);

  const fetchShareLinks = async () => {
    setLoading(true);
    try {
      const response = await axios.get("/api/share/list");
      const links = response.data.shareLinks || [];
      // Add shareUrl to each link
      const linksWithUrl = links.map((link: any) => ({
        ...link,
        shareUrl: `${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}/share/${link.token}`,
      }));
      setShareLinks(linksWithUrl);
    } catch (error) {
      console.error("Error fetching share links:", error);
      toast.error("Failed to load share links. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  const handleCopyLink = async (shareUrl: string, token: string) => {
    try {
      await navigator.clipboard.writeText(shareUrl);
      setCopiedToken(token);
      toast.success("Link copied to clipboard!");
      setTimeout(() => setCopiedToken(null), 2000);
    } catch (error) {
      console.error("Error copying link:", error);
      toast.error("Failed to copy link.");
    }
  };

  const handleRevokeLink = async (token: string) => {
    try {
      await axios.delete(`/api/share/${token}`, {
        data: { userId: "current-user" }, // This will be replaced with actual userId
      });
      toast.success("Share link has been revoked");
      fetchShareLinks();
    } catch (error) {
      console.error("Error revoking share link:", error);
      toast.error("Failed to revoke share link. Please try again.");
    }
  };

  const formatDate = (date: Date | string | null) => {
    if (!date) return "Never";
    return new Date(date).toLocaleString();
  };

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-default-50 via-primary-50/30 to-secondary-50/20">
      {/* Header */}
      <Navbar user={null} />

      {/* Main Content */}
      <main className="flex-1 container mx-auto px-6 py-8">
        <div className="max-w-4xl mx-auto">
          {/* Page Header */}
          <div className="mb-8">
            <div className="flex items-center gap-3 mb-4">
              <Share2 className="h-8 w-8 text-primary" />
              <div>
                <h1 className="text-3xl font-bold text-default-900">Share Links</h1>
                <p className="text-default-600 mt-1">
                  Manage all your shared files and folders
                </p>
              </div>
            </div>
          </div>

          {/* Share Links Table */}
          <Card className="border border-default-200 bg-default-50 shadow-sm">
            <CardHeader>
              <h2 className="text-xl font-semibold">All Share Links</h2>
            </CardHeader>
            <CardBody>
              {loading ? (
                <div className="text-center py-8">
                  <p className="text-default-500">Loading share links...</p>
                </div>
              ) : shareLinks.length === 0 ? (
                <div className="text-center py-8">
                  <Share2 className="h-12 w-12 text-default-400 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-default-700 mb-2">
                    No Share Links Yet
                  </h3>
                  <p className="text-default-500">
                    Create share links for your files and folders to share them with others.
                  </p>
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <Table
                    aria-label="Share links table"
                    isStriped
                    color="default"
                    selectionMode="none"
                    classNames={{
                      base: "min-w-full",
                      th: "bg-default-100/80 text-default-800 font-semibold text-xs md:text-sm uppercase tracking-wide",
                      td: "py-3 px-2 md:py-4 md:px-4 text-xs md:text-sm",
                    }}
                  >
                    <TableHeader>
                      <TableColumn>File/Folder</TableColumn>
                      <TableColumn className="hidden sm:table-cell">Permission</TableColumn>
                      <TableColumn className="hidden md:table-cell">Created</TableColumn>
                      <TableColumn className="hidden md:table-cell">Expires</TableColumn>
                      <TableColumn className="hidden sm:table-cell">Views</TableColumn>
                      <TableColumn className="text-right">Actions</TableColumn>
                    </TableHeader>
                    <TableBody>
                      {shareLinks.map((link) => (
                        <TableRow key={link.id}>
                          <TableCell>
                            <div className="flex items-center gap-2">
                              <div className="w-8 h-8 rounded bg-primary-100 flex items-center justify-center">
                                {link.isFolder ? (
                                  <Folder className="h-4 w-4 text-primary" />
                                ) : (
                                  <File className="h-4 w-4 text-primary" />
                                )}
                              </div>
                              <div>
                                <div className="font-medium text-default-800">
                                  {link.fileName}
                                </div>
                                <div className="text-xs text-default-500">
                                  {link.isFolder ? "Folder" : link.fileType}
                                </div>
                              </div>
                            </div>
                          </TableCell>
                          <TableCell className="hidden sm:table-cell">
                            <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                              link.permission === 'edit' 
                                ? 'bg-primary-100 text-primary-700' 
                                : 'bg-default-100 text-default-700'
                            }`}>
                              {link.permission}
                            </span>
                          </TableCell>
                          <TableCell className="hidden md:table-cell">
                            {formatDate(link.createdAt)}
                          </TableCell>
                          <TableCell className="hidden md:table-cell">
                            {link.expiresAt ? formatDate(link.expiresAt) : "Never"}
                          </TableCell>
                          <TableCell className="hidden sm:table-cell">
                            <div className="flex items-center gap-2">
                              <Eye className="h-4 w-4 text-default-500" />
                              <span>
                                {link.viewCount}/{link.maxViews || "∞"}
                              </span>
                            </div>
                          </TableCell>
                          <TableCell className="text-right">
                            <div className="flex gap-2 justify-end">
                              <Button
                                size="sm"
                                variant="flat"
                                onClick={() => handleCopyLink(link.shareUrl || '', link.token)}
                                startContent={copiedToken === link.token ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                              >
                                Copy
                              </Button>
                              <Button
                                size="sm"
                                variant="flat"
                                color="danger"
                                onClick={() => handleRevokeLink(link.token)}
                                startContent={<X className="h-4 w-4" />}
                              >
                                Revoke
                              </Button>
                            </div>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              )}
            </CardBody>
          </Card>
        </div>
      </main>

      {/* Footer */}
      <footer className="relative z-10 bg-gradient-to-r from-default-100/80 to-primary-100/20 backdrop-blur-sm border-t border-default-200/50 py-4">
        <div className="container mx-auto px-6 text-center">
          <p className="text-default-500 text-sm">
            &copy; {new Date().getFullYear()} Droply. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
}
