"use client";

import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import { Card, CardHeader, CardBody } from "@heroui/card";
import { Button } from "@heroui/button";
import { Input } from "@heroui/input";
import { Spinner } from "@heroui/spinner";
import { Download, Eye, Lock, Calendar, Link, Folder, File } from "lucide-react";
import axios from "axios";
import { toast } from "react-toastify";
import FileIcon from "@/components/FileIcon";
import Navbar from "@/components/Navbar";
import type { File as FileType } from "@/lib/db/schema";

export default function SharePage() {
  const params = useParams();
  const token = params?.token as string;
  const [file, setFile] = useState<FileType | null>(null);
  const [shareLink, setShareLink] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [password, setPassword] = useState("");
  const [requiresPassword, setRequiresPassword] = useState(false);
  const [passwordSubmitted, setPasswordSubmitted] = useState(false);

  useEffect(() => {
    if (!token) return;
    
    const fetchSharedFile = async () => {
      setLoading(true);
      setError(null);
      
      try {
        const response = await axios.get(`/api/share/${token}`);
        
        if (response.data.success) {
          setFile(response.data.file);
          setShareLink(response.data.shareLink);
          setRequiresPassword(!!response.data.shareLink.password);
          
          if (response.data.shareLink.password && !passwordSubmitted) {
            // Password is required but not yet submitted
            setRequiresPassword(true);
          }
        } else {
          setError(response.data.error || "Failed to load shared file");
        }
      } catch (err: any) {
        if (err.response?.status === 401 || err.response?.status === 403) {
          setError("This share link requires a password");
          setRequiresPassword(true);
        } else {
          setError(err.response?.data?.error || "Share link not found or has expired");
        }
      } finally {
        setLoading(false);
      }
    };

    fetchSharedFile();
  }, [token, passwordSubmitted]);

  const handlePasswordSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!password) {
      toast.error("Please enter a password");
      return;
    }

    try {
      // In a real implementation, you would verify the password with the backend
      // For now, we'll just mark it as submitted
      setPasswordSubmitted(true);
      
      // Re-fetch the file with password
      const response = await axios.post(`/api/share/${token}/verify`, {
        password,
      });
      
      if (response.data.success) {
        setFile(response.data.file);
        setShareLink(response.data.shareLink);
        setRequiresPassword(false);
      } else {
        toast.error("Incorrect password");
      }
    } catch (err: any) {
      toast.error(err.response?.data?.error || "Incorrect password");
    }
  };

  const handleDownload = async () => {
    if (!file) return;
    
    try {
      // Trigger file download
      window.open(file.fileUrl, "_blank");
      toast.success("Download started!");
    } catch (error) {
      toast.error("Failed to download file");
    }
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return "0 Bytes";
    const k = 1024;
    const sizes = ["Bytes", "KB", "MB", "GB", "TB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-default-50 via-primary-50/30 to-secondary-50/20">
        <Spinner size="lg" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-default-50 via-primary-50/30 to-secondary-50/20">
        <Card className="max-w-md w-full">
          <CardHeader className="text-center">
            <h2 className="text-xl font-semibold text-danger">Error</h2>
          </CardHeader>
          <CardBody className="text-center">
            <p className="text-default-600 mb-4">{error}</p>
            <Button onClick={() => window.location.href = "/"}>
              Go to Home
            </Button>
          </CardBody>
        </Card>
      </div>
    );
  }

  if (requiresPassword && !passwordSubmitted) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-default-50 via-primary-50/30 to-secondary-50/20">
        <Card className="max-w-md w-full">
          <CardHeader className="text-center">
            <div className="flex items-center justify-center gap-2 mb-2">
              <Lock className="h-6 w-6 text-primary" />
              <h2 className="text-xl font-semibold">Password Required</h2>
            </div>
            <p className="text-sm text-default-500">
              This share link is password protected
            </p>
          </CardHeader>
          <CardBody>
            <form onSubmit={handlePasswordSubmit}>
              <Input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter password"
                className="w-full mb-4"
              />
              <Button type="submit" color="primary" className="w-full">
                Unlock
              </Button>
            </form>
          </CardBody>
        </Card>
      </div>
    );
  }

  if (!file) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-default-50 via-primary-50/30 to-secondary-50/20">
        <Card className="max-w-md w-full">
          <CardHeader className="text-center">
            <h2 className="text-xl font-semibold">File Not Found</h2>
          </CardHeader>
          <CardBody className="text-center">
            <p className="text-default-600 mb-4">
              The shared file may have been deleted or the link has expired.
            </p>
            <Button onClick={() => window.location.href = "/"}>
              Go to Home
            </Button>
          </CardBody>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-default-50 via-primary-50/30 to-secondary-50/20">
      {/* Header */}
      <header className="bg-gradient-to-r from-primary-500 to-secondary-500 text-white py-4">
        <div className="container mx-auto px-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-full bg-white/20">
                <FileIcon file={file} />
              </div>
              <div>
                <h1 className="text-xl font-bold">Droply - Shared {file.isFolder ? "Folder" : "File"}</h1>
                <p className="text-sm text-white/80">
                  Shared with you via secure link
                </p>
              </div>
            </div>
            <Button
              variant="light"
              onClick={() => window.location.href = "/"}
              className="text-white"
            >
              Go to Home
            </Button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 container mx-auto px-6 py-8">
        <div className="max-w-2xl mx-auto">
          {/* File Preview Card */}
          <Card className="border border-default-200 bg-default-50 shadow-sm hover:shadow-md transition-shadow mb-6">
            <CardHeader className="text-center">
              <div className="flex items-center justify-center gap-3 mb-4">
                <FileIcon file={file} />
                <div>
                  <h2 className="text-2xl font-bold text-default-900">{file.name}</h2>
                  <p className="text-sm text-default-500">{file.type}</p>
                </div>
              </div>
            </CardHeader>
            <CardBody className="text-center">
              {/* File Details */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                <div className="flex items-center justify-center gap-2">
                  <File className="h-4 w-4 text-default-500" />
                  <span className="text-sm text-default-600">
                    {formatFileSize(file.size)}
                  </span>
                </div>
                <div className="flex items-center justify-center gap-2">
                  <Calendar className="h-4 w-4 text-default-500" />
                  <span className="text-sm text-default-600">
                    {new Date(file.createdAt).toLocaleDateString()}
                  </span>
                </div>
              </div>

              {/* Share Link Info */}
              {shareLink && (
                <div className="bg-default-100 rounded-lg p-4 mb-6">
                  <div className="flex items-center justify-center gap-2 mb-2">
                    <Link className="h-4 w-4 text-primary" />
                    <span className="text-sm font-medium text-default-700">
                      Share Link Details
                    </span>
                  </div>
                  <div className="text-xs text-default-500 space-y-1">
                    <div>
                      <span className="font-medium">Permission:</span> {shareLink.permission}
                    </div>
                    {shareLink.expiresAt && (
                      <div>
                        <span className="font-medium">Expires:</span> {new Date(shareLink.expiresAt).toLocaleString()}
                      </div>
                    )}
                    {shareLink.maxViews && (
                      <div>
                        <span className="font-medium">Views:</span> {shareLink.viewCount}/{shareLink.maxViews}
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* Download Button */}
              {!file.isFolder && (
                <Button
                  color="primary"
                  onClick={handleDownload}
                  startContent={<Download className="h-5 w-5" />}
                  className="w-full text-lg py-6"
                >
                  Download {file.name}
                </Button>
              )}

              {/* Folder Info */}
              {file.isFolder && (
                <div className="bg-primary-50 border border-primary-200 rounded-lg p-4">
                  <div className="flex items-center gap-2 mb-2">
                    <Folder className="h-5 w-5 text-primary" />
                    <span className="font-medium text-primary">
                      This is a shared folder
                    </span>
                  </div>
                  <p className="text-sm text-primary-700">
                    Folder contents can be accessed through the link. 
                    {shareLink?.permission === 'edit' && 
                      "You have edit permissions and can upload files."
                    }
                  </p>
                </div>
              )}
            </CardBody>
          </Card>

          {/* File Preview (for images) */}
          {!file.isFolder && file.fileUrl && (
            <Card className="border border-default-200 bg-default-50 shadow-sm">
              <CardHeader>
                <h3 className="text-lg font-semibold">Preview</h3>
              </CardHeader>
              <CardBody>
                {file.type.startsWith('image/') ? (
                  <img
                    src={file.fileUrl}
                    alt={file.name}
                    className="w-full max-h-96 object-contain rounded-lg"
                  />
                ) : (
                  <div className="text-center py-8">
                    <File className="h-12 w-12 text-default-400 mx-auto mb-2" />
                    <p className="text-default-500">
                      Preview not available for this file type
                    </p>
                  </div>
                )}
              </CardBody>
            </Card>
          )}
        </div>
      </main>

      {/* Footer */}
      <footer className="relative z-10 bg-gradient-to-r from-default-100/80 to-primary-100/20 backdrop-blur-sm border-t border-default-200/50 py-4">
        <div className="container mx-auto px-6 text-center">
          <p className="text-default-500 text-sm">
            Shared via Droply - Secure File Sharing
          </p>
        </div>
      </footer>
    </div>
  );
}
