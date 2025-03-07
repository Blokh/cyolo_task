// src/hooks/useFileUpload.ts
import { useState } from 'react';
import { useUploadFileMutation, type FileResponse } from '@/api/fileEndpoints';
import { toast } from 'sonner';

export interface UseFileUploadOptions {
    onSuccess?: (response: FileResponse) => void;
}

export function useFileUpload(options?: UseFileUploadOptions) {
    const [file, setFile] = useState<File | null>(null);
    const [retentionTimeMinutes, setRetentionTimeMinutes] = useState<number>(60); // Default 60 minutes
    const [uploadFile, { isLoading, isSuccess, isError, error, data }] = useUploadFileMutation();

    const handleFileChange = (files: File[]) => {
        setFile(files.length > 0 ? files[0] : null);
    };

    const handleRetentionTimeChange = (value: number) => {
        setRetentionTimeMinutes(value);
    };

    const handleUpload = async () => {
        if (!file) {
            toast.error("Please select a file to upload");
            return;
        }

        try {
            const retentionTimeInSeconds = retentionTimeMinutes ? retentionTimeMinutes * 60 : undefined;

            const result = await uploadFile({
                file,
                retentionTimeInSeconds
            }).unwrap();

            toast.success("File uploaded successfully!");
            setFile(null);

            if (options?.onSuccess) {
                options.onSuccess(result);
            }

            return result;
        } catch (err) {
            console.error("Failed to upload file:", err);
            toast.error(`Upload failed: ${err instanceof Error ? err.message : "Unknown error"}`);
            throw err;
        }
    };

    return {
        file,
        retentionTimeMinutes,
        isLoading,
        isSuccess,
        isError,
        error,
        data,
        handleFileChange,
        handleRetentionTimeChange,
        handleUpload,
        setFile
    };
}