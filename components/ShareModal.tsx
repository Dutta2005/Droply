"use client";

import { useState, useEffect } from "react";
import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
} from "@heroui/modal";
import { Button } from "@heroui/button";
import { Input } from "@heroui/input";
import { Dropdown, DropdownTrigger, DropdownMenu, DropdownItem } from "@heroui/dropdown";
import { Link, Copy, Check, X, Share2, MoreVertical } from "lucide-react";
import { toast } from "react-toastify";
import axios from "axios";
import type { File as FileType } from "@/lib/db/schema";

interface ShareModalProps {
  isOpen: boolean;
  onClose: () => void;
  file: FileType | null;
  onShareSuccess: () => void;
}

interface ShareLinkWithUrl {
  id: string;
  fileId: string;
  token: string;
  permission: string;
  password: string | null;
  expiresAt: Date | null;
  maxViews: number | null;
  viewCount: number;
  isActive: boolean;
  createdBy: string;
  createdAt: Date;
  updatedAt: Date;
  shareUrl?: string;
  fileName?: string;
  fileType?: string;
  isFolder?: boolean;
}

export default function ShareModal({
  isOpen,
  onClose,
  file,
  onShareSuccess,
}: ShareModalProps) {
  const [permission, setPermission] = useState<"view" | "edit">("view");
  const [password, setPassword] = useState("");
  const [usePassword, setUsePassword] = useState(false);
  const [expiresAt, setExpiresAt] = useState("");
  const [useExpiration, setUseExpiration] = useState(false);
  const [maxViews, setMaxViews] = useState("");
  const [useMaxViews, setUseMaxViews] = useState(false);
  const [shareLinks, setShareLinks] = useState<ShareLinkWithUrl[]>([]);
  const [createdShareUrl, setCreatedShareUrl] = useState("");
  const [loading, setLoading] = useState(false);
  const [fetchingLinks, setFetchingLinks] = useState(false);
  const [copied, setCopied] = useState(false);

  // Fetch existing share links when modal opens
  useEffect(() => {
    if (file && isOpen) {
      fetchShareLinks();
    }
  }, [file, isOpen]);

  // Reset state when modal closes
  useEffect(() => {
    if (!isOpen) {
      setCreatedShareUrl("");
      setShareLinks([]);
      setCopied(false);
    }
  }, [isOpen]);

  const fetchShareLinks = async () => {
    if (!file) return;
    setFetchingLinks(true);
    try {
      const response = await axios.get(`/api/share/list?fileId=${file.id}`);
      const links = response.data.shareLinks || [];
      // Add shareUrl to each link
      const linksWithUrl = links.map((link: any) => ({
        ...link,
        shareUrl: link.shareUrl || `${process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000"}/share/${link.token}`,
        fileName: file.name,
        fileType: file.type,
        isFolder: file.isFolder,
      }));
      setShareLinks(linksWithUrl);

      // If there are existing links and no newly created URL, show the most recent one
      if (linksWithUrl.length > 0) {
        setCreatedShareUrl(
          linksWithUrl[linksWithUrl.length - 1].shareUrl || "",
        );
      }
    } catch (error) {
      console.error("Error fetching share links:", error);
    } finally {
      setFetchingLinks(false);
    }
  };

  const handleCreateShareLink = async () => {
    if (!file) {
      console.log('cant find file');
      return
    }

    console.log('CLicking the share btn...')

    setLoading(true);
    try {
      const response = await axios.post("/api/share/create", {
        fileId: file.id,
        permission,
        password: usePassword ? password : null,
        expiresAt: useExpiration ? expiresAt : null,
        maxViews: useMaxViews ? parseInt(maxViews) || null : null,
      });

      console.log(response.data)

      const shareUrl = response.data?.shareLink?.shareUrl || "";
      setCreatedShareUrl(shareUrl);
      if (shareUrl) {
        await navigator.clipboard.writeText(shareUrl);
      }

      toast.success("Share link created successfully!");
      onShareSuccess();
      fetchShareLinks();

      // Reset form
      setPermission("view");
      setPassword("");
      setUsePassword(false);
      setExpiresAt("");
      setUseExpiration(false);
      setMaxViews("");
      setUseMaxViews(false);
    } catch (error) {
      console.error("Error creating share link:", error);
      toast.error("Failed to create share link. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleCopyLink = async (shareUrl: string) => {
    try {
      await navigator.clipboard.writeText(shareUrl);
      setCopied(true);
      toast.success("Link copied to clipboard!");
      setTimeout(() => setCopied(false), 2000);
    } catch (error) {
      console.error("Error copying link:", error);
      toast.error("Failed to copy link.");
    }
  };

  const handleRevokeLink = async (token: string) => {
    try {
      await axios.delete(`/api/share/${token}`, {
        data: { userId: file?.userId },
      });
      toast.success("Share link has been revoked");
      fetchShareLinks();
    } catch (error) {
      console.error("Error revoking share link:", error);
      toast.error("Failed to revoke share link. Please try again.");
    }
  };

  const isFormValid = () => {
    if (usePassword && !password) return false;
    if (useExpiration && !expiresAt) return false;
    if (useMaxViews && !maxViews) return false;
    return true;
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      size="lg"
      backdrop="blur"
      classNames={{
        base: "border border-default-200 bg-default-50 shadow-xl",
        backdrop: "bg-black/70",
      }}
    >
      <ModalContent>
        <ModalHeader className="flex flex-col gap-1">
          <div className="flex items-center gap-2">
            <Share2 className="h-5 w-5 text-primary" />
            <h2 className="text-xl font-semibold text-default-900">Share {file?.name}</h2>
          </div>
          <p className="text-sm text-default-500">
            Create a shareable link that others can use to access this{" "}
            {file?.isFolder ? "folder" : "file"}
          </p>
        </ModalHeader>

        <ModalBody>
          {fetchingLinks && !createdShareUrl && (
            <div className="mb-4 flex items-center justify-center gap-2 py-3 text-sm text-default-500">
              <div className="h-4 w-4 animate-spin rounded-full border-2 border-primary border-t-transparent" />
              Loading existing share links...
            </div>
          )}

          {createdShareUrl && (
            <div className="mb-6 rounded-lg border border-primary-200 bg-primary-50 p-4">
              <div className="mb-2 flex items-center gap-2">
                <Link className="h-4 w-4 text-primary" />
                <h3 className="text-sm font-medium text-default-800">
                  {shareLinks.length > 0 ? "Your share link" : "Your share link"}
                </h3>
              </div>
              <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
                <Input
                  value={createdShareUrl}
                  readOnly
                  size="sm"
                  className="flex-1"
                  aria-label="Created share link"
                />
                <Button
                  size="sm"
                  variant="flat"
                  color="primary"
                  onClick={() => handleCopyLink(createdShareUrl)}
                  startContent={
                    copied ? (
                      <Check className="h-4 w-4" />
                    ) : (
                      <Copy className="h-4 w-4" />
                    )
                  }
                >
                  Copy Link
                </Button>
              </div>
              <p className="mt-2 text-xs text-default-500">
                Click &quot;Copy Link&quot; to copy this share link to your clipboard.
              </p>
            </div>
          )}

          {/* Existing Share Links */}
          {shareLinks.length > 0 && (
            <div className="mb-6">
              <h3 className="text-sm font-medium text-default-700 mb-3">
                Existing Share Links
              </h3>
              <div className="space-y-3">
                {shareLinks.map((link) => (
                  <div
                    key={link.id}
                    className="flex items-center justify-between p-3 border border-default-200 rounded-lg bg-default-50/80"
                  >
                    <div className="flex-1 min-w-0 pr-3">
                      <div className="flex items-center gap-2 mb-1">
                        <Link className="h-4 w-4 text-default-500 flex-shrink-0" />
                        <span className="text-sm font-medium truncate">
                          {link.shareUrl
                            ?.replace(/^https?:\/\//, "")
                            .substring(0, 40)}
                          ...
                        </span>
                      </div>
                      <div className="text-xs text-default-500 truncate">
                        Permission: {link.permission} | Views: {link.viewCount}/
                        {link.maxViews || "∞"} |
                        {link.expiresAt
                          ? `Expires: ${new Date(link.expiresAt).toLocaleDateString()}`
                          : "No expiration"}
                      </div>
                    </div>

                    {/* Desktop Actions */}
                    <div className="hidden sm:flex gap-2 flex-shrink-0">
                      <Button
                        size="sm"
                        variant="flat"
                        onClick={() => handleCopyLink(link.shareUrl || "")}
                        startContent={
                          copied ? (
                            <Check className="h-4 w-4" />
                          ) : (
                            <Copy className="h-4 w-4" />
                          )
                        }
                      >
                        Copy
                      </Button>
                      <Button
                        size="sm"
                        variant="flat"
                        color="danger"
                        onClick={() => handleRevokeLink(link.token)}
                        startContent={<X className="h-4 w-4" />}
                        className="bg-danger-50"
                      >
                        Revoke
                      </Button>
                    </div>

                    {/* Mobile Actions Dropdown */}
                    <div className="sm:hidden flex-shrink-0">
                      <Dropdown placement="bottom-end" classNames={{ content: "bg-black/70", base: "border border-default-200 bg-default-50 shadow-xl" }}>
                        <DropdownTrigger>
                          <Button isIconOnly size="sm" variant="light" className="text-default-500">
                            <MoreVertical className="h-5 w-5" />
                          </Button>
                        </DropdownTrigger>
                        <DropdownMenu aria-label="Link actions" variant="flat">
                          <DropdownItem
                            key="copy"
                            startContent={copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                            onPress={() => handleCopyLink(link.shareUrl || "")}
                          >
                            Copy Link
                          </DropdownItem>
                          <DropdownItem
                            key="revoke"
                            startContent={<X className="h-4 w-4" />}
                            color="danger"
                            className="text-danger"
                            onPress={() => handleRevokeLink(link.token)}
                          >
                            Revoke Link
                          </DropdownItem>
                        </DropdownMenu>
                      </Dropdown>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Create New Share Link */}
          <div>
            <h3 className="text-sm font-medium text-default-700 mb-3">
              Create New Share Link
            </h3>

            <div className="space-y-4">
              {/* Permission */}
              <div>
                <label className="block text-sm font-medium text-default-700 mb-2">
                  Permission
                </label>
                <div className="flex gap-2">
                  <Button
                    variant={permission === "view" ? "solid" : "bordered"}
                    color={permission === "view" ? "primary" : "default"}
                    size="sm"
                    onClick={() => setPermission("view")}
                    className="flex-1"
                  >
                    View Only
                  </Button>
                  <Button
                    variant={permission === "edit" ? "solid" : "bordered"}
                    color={permission === "edit" ? "primary" : "default"}
                    size="sm"
                    onClick={() => setPermission("edit")}
                    className="flex-1"
                  >
                    Can Edit
                  </Button>
                </div>
                <p className="text-xs text-default-500 mt-1">
                  {permission === "view"
                    ? "Others can only view the file"
                    : "Others can upload and modify (if folder)"}
                </p>
              </div>

              {/* Password Protection */}
              <div className="border border-default-200 rounded-lg p-4 bg-default-50/50">
                <div className="flex items-center justify-between mb-3">
                  <label className="text-sm font-medium text-default-700">
                    Password Protection
                  </label>
                  <Button
                    size="sm"
                    variant={usePassword ? "solid" : "bordered"}
                    color={usePassword ? "primary" : "default"}
                    onClick={() => setUsePassword(!usePassword)}
                  >
                    {usePassword ? "Enabled" : "Disabled"}
                  </Button>
                </div>
                {usePassword && (
                  <Input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Enter password"
                    size="sm"
                    className="w-full"
                  />
                )}
              </div>

              {/* Expiration */}
              <div className="border border-default-200 rounded-lg p-4 bg-default-50/50">
                <div className="flex items-center justify-between mb-3">
                  <label className="text-sm font-medium text-default-700">
                    Set Expiration Date
                  </label>
                  <Button
                    size="sm"
                    variant={useExpiration ? "solid" : "bordered"}
                    color={useExpiration ? "primary" : "default"}
                    onClick={() => setUseExpiration(!useExpiration)}
                  >
                    {useExpiration ? "Enabled" : "Disabled"}
                  </Button>
                </div>
                {useExpiration && (
                  <Input
                    type="datetime-local"
                    value={expiresAt}
                    onChange={(e) => setExpiresAt(e.target.value)}
                    size="sm"
                    className="w-full"
                  />
                )}
              </div>

              {/* Max Views */}
              <div className="border border-default-200 rounded-lg p-4 bg-default-50/50">
                <div className="flex items-center justify-between mb-3">
                  <label className="text-sm font-medium text-default-700">
                    Limit Number of Views
                  </label>
                  <Button
                    size="sm"
                    variant={useMaxViews ? "solid" : "bordered"}
                    color={useMaxViews ? "primary" : "default"}
                    onClick={() => setUseMaxViews(!useMaxViews)}
                  >
                    {useMaxViews ? "Enabled" : "Disabled"}
                  </Button>
                </div>
                {useMaxViews && (
                  <Input
                    type="number"
                    value={maxViews}
                    onChange={(e) => setMaxViews(e.target.value)}
                    placeholder="Enter maximum views"
                    min="1"
                    size="sm"
                    className="w-full"
                  />
                )}
              </div>
            </div>
          </div>
        </ModalBody>

        <ModalFooter className="pt-4 border-t border-default-200">
          <Button variant="light" onClick={onClose}>
            Cancel
          </Button>
          <Button
            color="primary"
            onClick={handleCreateShareLink}
            isLoading={loading}
            isDisabled={!isFormValid()}
          >
            Create Share Link
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
}
