import { useState } from 'react';
import { useUploadFileMutation, type FileResponse } from '@/api/fileEndpoints';
import { toast } from 'sonner';

export interface UseFileUploadOptions {
    onSuccess?: (response: FileResponse) => void;
}

export const useFileUpload = (options?: UseFileUploadOptions) => {
    const [file, setFile] = useState<File | null>(null);
    const [fileError, setFileError] = useState<string | null>(null);
    const [retentionTimeMinutes, setRetentionTimeMinutes] = useState<number>(60);
    const [uploadFile, { isLoading, isSuccess, isError, error, data }] = useUploadFileMutation();

    const validateImageFile = (file: File): boolean => {
        if (!file.type.startsWith('image/')) {
            setFileError('Only image files are allowed');
            return false;
        }
        setFileError(null);
        return true;
    };

    const handleFileChange = (newFile: File | null) => {
        if (!newFile) {
            setFile(null);
            setFileError(null);
            return;
        }

        if (validateImageFile(newFile)) {
            setFile(newFile);
        } else {
            setFile(null);
        }
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

            toast.success("Image uploaded successfully!");
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
        fileError,
        retentionTimeMinutes,
        isLoading,
        isSuccess,
        isError,
        error,
        data,
        handleFileChange,
        handleRetentionTimeChange,
        handleUpload
    };
};