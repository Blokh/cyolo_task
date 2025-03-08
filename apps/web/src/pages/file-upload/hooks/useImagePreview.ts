import { useEffect, useState } from 'react';
import { useFindFileByPathQuery } from '@/api/fileEndpoints';

export interface UseImagePreviewOptions {
  onClose?: () => void;
}

export function useImagePreview(options?: UseImagePreviewOptions) {
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [filePath, setFilePath] = useState<string | null>(null);
  const [objectUrl, setObjectUrl] = useState<string | null>(null);

  const {
    data: imageBlob,
    isLoading,
    isError,
    refetch
  } = useFindFileByPathQuery(filePath || '', {
    skip: !filePath,
  });

  useEffect(() => {
    if (isError) {
      console.error('Error loading image from URL:', filePath);
    }
    if (filePath) {
      console.log('Attempting to load image from:', filePath);
    }
  }, [filePath, isError]);

  const openPreview = (fileUrl: string) => {
    setFilePath(fileUrl);
    setIsOpen(true);

    if (objectUrl) {
      URL.revokeObjectURL(objectUrl);
      setObjectUrl(null);
    }
  };

  const closePreview = () => {
    setIsOpen(false);
    if (options?.onClose) {
      options.onClose();
    }
  };

  useEffect(() => {
    if (imageBlob instanceof Blob) {
      const url = URL.createObjectURL(imageBlob);
      setObjectUrl(url);

      return () => {
        URL.revokeObjectURL(url);
      };
    }
  }, [imageBlob]);

  useEffect(() => {
    return () => {
      if (objectUrl) {
        URL.revokeObjectURL(objectUrl);
      }
    };
  }, [objectUrl]);

  useEffect(() => {
    if (isOpen && filePath) {
      refetch();
    }
  }, [isOpen, filePath, refetch]);

  return {
    isOpen,
    isLoading,
    isError,
    imageUrl: filePath,
    imageBlob,
    objectUrl,
    openPreview,
    closePreview,
  };
}