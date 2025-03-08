import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogClose,
} from "@/components/ui/dialog.tsx";
import { Button } from "@/components/ui/button.tsx";
import { Loader2, Download } from "lucide-react";

interface ImagePreviewDialogProps {
  isOpen: boolean;
  onClose: () => void;
  imageUrl: string | null;
  objectUrl: string | null;
  isLoading: boolean;
  isError: boolean;
}

export function ImagePreviewDialog({
  isOpen,
  onClose,
  imageUrl,
  objectUrl,
  isLoading,
  isError,
}: ImagePreviewDialogProps) {
  if (!isOpen) return null;

  const handleDownload = () => {
    if (objectUrl) {
      const a = document.createElement("a");
      a.href = objectUrl;

      const filename = imageUrl
        ? imageUrl.split("/").pop() || "downloaded-image"
        : "downloaded-image";

      a.download = filename;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent
        className="max-w-3xl"
        aria-describedby="image-preview-description"
      >
        <DialogHeader>
          <DialogTitle>Image Preview</DialogTitle>
          <DialogClose asChild></DialogClose>
        </DialogHeader>

        <div id="image-preview-description" className="sr-only">
          Preview of the uploaded image
        </div>

        <div className="flex flex-col items-center space-y-4">
          {isLoading && (
            <div className="flex flex-col items-center justify-center h-64 w-full">
              <Loader2 className="h-10 w-10 animate-spin text-gray-400" />
              <p className="mt-4 text-gray-500">Loading image...</p>
            </div>
          )}

          {isError && (
            <div className="flex flex-col items-center justify-center h-64 w-full">
              <p className="text-red-500">Failed to load image</p>
              <p className="text-sm text-gray-500 mt-2">Path: {imageUrl}</p>
            </div>
          )}

          {objectUrl && !isLoading && !isError && (
            <>
              <div className="max-h-[70vh] overflow-auto w-full">
                <img
                  src={objectUrl}
                  alt="Uploaded image"
                  className="w-full h-auto object-contain"
                />
              </div>
              <div className="flex justify-end w-full">
                <Button
                  onClick={handleDownload}
                  className="flex items-center gap-2"
                >
                  <Download className="h-4 w-4" />
                  Download
                </Button>
              </div>
            </>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}