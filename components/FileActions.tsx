"use client";

import { Star, Trash, X, ArrowUpFromLine, Download, Share2, MoreVertical } from "lucide-react";
import { Button } from "@heroui/button";
import { Dropdown, DropdownTrigger, DropdownMenu, DropdownItem } from "@heroui/dropdown";
import type { File as FileType } from "@/lib/db/schema";

interface FileActionsProps {
  file: FileType;
  onStarAction: (id: string) => void;
  onTrashAction: (id: string) => void;
  onDeleteAction: (file: FileType) => void;
  onDownloadAction: (file: FileType) => void;
  onShareAction?: (file: FileType) => void;
}

export default function FileActions({
  file,
  onStarAction,
  onTrashAction,
  onDeleteAction,
  onDownloadAction,
  onShareAction,
}: FileActionsProps) {
  return (
    <div className="flex justify-end">
      <Dropdown classNames={{ content: "bg-black/70", base: "border border-default-200 bg-default-50 shadow-xl" }} placement="bottom-end">
        <DropdownTrigger>
          <Button isIconOnly size="sm" variant="light" className="text-default-500">
            <MoreVertical className="h-5 w-5" />
          </Button>
        </DropdownTrigger>
        <DropdownMenu aria-label="File actions" variant="flat">
          {!file.isTrash && onShareAction ? (
            <DropdownItem
              key="share"
              startContent={<Share2 className="h-4 w-4" />}
              onPress={() => onShareAction(file)}
            >
              Share
            </DropdownItem>
          ) : <DropdownItem key="dummy1" className="hidden" />}

          {!file.isTrash && !file.isFolder ? (
            <DropdownItem
              key="download"
              startContent={<Download className="h-4 w-4" />}
              onPress={() => onDownloadAction(file)}
            >
              Download
            </DropdownItem>
          ) : <DropdownItem key="dummy2" className="hidden" />}

          {!file.isTrash ? (
            <DropdownItem
              key="star"
              startContent={
                <Star
                  className={`h-4 w-4 ${file.isStarred
                    ? "text-yellow-400 fill-current"
                    : "text-default-500"
                    }`}
                />
              }
              onPress={() => onStarAction(file.id)}
            >
              {file.isStarred ? "Unstar" : "Star"}
            </DropdownItem>
          ) : <DropdownItem key="dummy3" className="hidden" />}

          <DropdownItem
            key="trash"
            startContent={
              file.isTrash ? (
                <ArrowUpFromLine className="h-4 w-4" />
              ) : (
                <Trash className="h-4 w-4" />
              )
            }
            onPress={() => onTrashAction(file.id)}
            color={file.isTrash ? "success" : "default"}
          >
            {file.isTrash ? "Restore" : "Delete"}
          </DropdownItem>

          {file.isTrash ? (
            <DropdownItem
              key="remove"
              startContent={<X className="h-4 w-4" />}
              onPress={() => onDeleteAction(file)}
              color="danger"
              className="text-danger"
            >
              Remove Permanently
            </DropdownItem>
          ) : <DropdownItem key="dummy4" className="hidden" />}
        </DropdownMenu>
      </Dropdown>
    </div>
  );
}
