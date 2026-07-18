"use client";

import { useState } from "react";
import { Button } from "@heroui/button";
import { Share2 } from "lucide-react";
import ShareModal from "@/components/ShareModal";
import type { File as FileType } from "@/lib/db/schema";

interface ShareButtonProps {
  file: FileType;
  onShareSuccess?: () => void;
}

export default function ShareButton({ file, onShareSuccess }: ShareButtonProps) {
  const [shareModalOpen, setShareModalOpen] = useState(false);

  return (
    <>
      <Button
        variant="flat"
        size="sm"
        onClick={() => setShareModalOpen(true)}
        startContent={<Share2 className="h-4 w-4" />}
      >
        Share
      </Button>
      
      <ShareModal
        isOpen={shareModalOpen}
        onClose={() => setShareModalOpen(false)}
        file={file}
        onShareSuccess={() => {
          setShareModalOpen(false);
          if (onShareSuccess) {
            onShareSuccess();
          }
        }}
      />
    </>
  );
}
