import { FileUpload } from "@/components/ui/file-upload";
import { useFileUpload } from "./hooks/useFileUpload";
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
import { Loader2, UploadCloud, CheckCircle, AlertCircle } from "lucide-react";

export default function UploadPage() {
  const {
    file,
    retentionTimeMinutes,
    isLoading,
    isSuccess,
    isError,
    error,
    handleFileChange,
    handleRetentionTimeChange,
    handleUpload,
  } = useFileUpload({
    onSuccess: (response) => {
      console.log("Upload successful:", response);
      // Any additional success handling
    },
  });

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    handleUpload();
  };

  return (
    <div className="container mx-auto py-8 px-4">
      <div className="max-w-md mx-auto">
        <Card className="w-full">
          <CardHeader>
            <CardTitle>Upload New File</CardTitle>
          </CardHeader>
          <form onSubmit={onSubmit}>
            <CardContent className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="file-upload">File</Label>
                <FileUpload
                  value={file ? [file] : []}
                  onValueChange={handleFileChange}
                  accept="image/*,application/pdf"
                  maxFiles={1}
                  maxSize={10 * 1024 * 1024} // 10MB
                  disabled={isLoading}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="retention-time">
                  Retention Time (minutes){" "}
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
                  <span>File uploaded successfully!</span>
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
            <CardFooter>
              <Button
                type="submit"
                className="w-full"
                disabled={!file || isLoading}
              >
                {isLoading ? (
                  <span className="flex items-center gap-2">
                    <Loader2 className="h-5 w-5 animate-spin" />
                    Uploading...
                  </span>
                ) : (
                  <span className="flex items-center gap-2">
                    <UploadCloud className="h-5 w-5" />
                    Upload File
                  </span>
                )}
              </Button>
            </CardFooter>
          </form>
        </Card>
      </div>
    </div>
  );
}
