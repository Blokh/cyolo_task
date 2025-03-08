import { useFileUpload } from "./hooks/useFileUpload";
import { useImagePreview } from "./hooks/useImagePreview";
import { ImagePreviewDialog } from "@/pages/file-upload/components/ImagePreviewDialog.tsx";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Loader2, UploadCloud, CheckCircle, AlertCircle, Image } from "lucide-react";
import { useState } from "react";
import {FileUpload} from "@/components/ui/file-upload.tsx";

export default function UploadPage() {
  const [fileError, setFileError] = useState<string | null>(null);

  const {
    file,
    retentionTimeMinutes,
    isLoading,
    isSuccess,
    isError,
    error,
    data,
    handleFileChange: setFile,
    handleRetentionTimeChange,
    handleUpload,
  } = useFileUpload({
    onSuccess: (response) => {
      if (response.filePath) {
        console.log("Calling openPreview with:", response.filePath);
        imagePreviewHooks.openPreview(response.filePath);
      } else {
        console.error("No filePath in response");
      }
      },
  });

  const imagePreviewHooks = useImagePreview();

  const handleFileChange = (newFile: File) => {
    setFileError(null);

    if (!newFile) {
      setFile(null);
      return;
    }

    if (newFile && newFile.type && !newFile.type.startsWith('image/')) {
      setFileError("Only image files are allowed (JPG, PNG, GIF, etc.)");
      setFile(null);
      return;
    }

    setFile(newFile);
  };

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (file && !fileError) {
      handleUpload();
    }
  };

  const isUploadButtonDisabled = !file || !!fileError || isLoading;

  return (
      <div className="container mx-auto py-8 px-4">
        <div className="max-w-md mx-auto">
          <Card className="w-full">
            <CardHeader>
              <CardTitle>Upload New Image</CardTitle>
            </CardHeader>
            <form onSubmit={onSubmit}>
              <CardContent className="space-y-6">
                <div className="space-y-2">
                  <Label htmlFor="file-upload">Image</Label>
                  <FileUpload
                      onChange={(files: File[]) => handleFileChange(files[0])}
                  />
                  {fileError && (
                      <p className="text-sm text-red-500">{fileError}</p>
                  )}
                  <p className="text-xs text-gray-500">
                    Only image files are accepted (JPG, PNG, GIF, etc.)
                  </p>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="retention-time">
                    Retention Time (Seconds){" "}
                    <span className="text-xs text-gray-500">(Optional)</span>
                  </Label>
                  <Input
                      id="retention-time"
                      type="number"
                      min={1}
                      value={retentionTimeMinutes}
                      onChange={(e) =>
                          handleRetentionTimeChange(parseInt(e.target.value) || 60)
                      }
                      placeholder="60"
                      disabled={isLoading}
                  />
                  <p className="text-xs text-gray-500">
                    Minimum 1 minute (files will be deleted after this time)
                  </p>
                </div>

                {isSuccess && (
                    <div className="rounded-lg bg-green-50 p-3 text-green-700 flex items-center gap-2">
                      <CheckCircle className="h-5 w-5" />
                      <span>Image uploaded successfully!</span>
                    </div>
                )}

                {isError && (
                    <div className="rounded-lg bg-red-50 p-3 text-red-700 flex items-center gap-2">
                      <AlertCircle className="h-5 w-5" />
                      <span>
                    Upload failed:{" "}
                        {error instanceof Error ? error.message : "Unknown error"}
                  </span>
                    </div>
                )}
              </CardContent>
              <CardFooter className="flex flex-col space-y-4">
                <Button
                    type="submit"
                    className="w-full"
                    disabled={isUploadButtonDisabled}
                >
                  {isLoading ? (
                      <span className="flex items-center gap-2">
                    <Loader2 className="h-5 w-5 animate-spin" />
                    Uploading...
                  </span>
                  ) : (
                      <span className="flex items-center gap-2">
                    <UploadCloud className="h-5 w-5" />
                    Upload Image
                  </span>
                  )}
                </Button>

                {isSuccess && data?.filePath && (
                    <Button
                        type="button"
                        variant="outline"
                        className="w-full"
                        onClick={() => imagePreviewHooks.openPreview(data.filePath)}
                    >
                  <span className="flex items-center gap-2">
                    <Image className="h-5 w-5" />
                    View Uploaded Image
                  </span>
                    </Button>
                )}
              </CardFooter>
            </form>
          </Card>
        </div>

        <ImagePreviewDialog
            isOpen={imagePreviewHooks.isOpen}
            onClose={imagePreviewHooks.closePreview}
            imageUrl={imagePreviewHooks.imageUrl}
            objectUrl={imagePreviewHooks.objectUrl}
            isLoading={imagePreviewHooks.isLoading}
            isError={imagePreviewHooks.isError}
        />
      </div>
  );
}