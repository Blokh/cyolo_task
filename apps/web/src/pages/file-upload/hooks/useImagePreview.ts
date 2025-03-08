import { useEffect, useState } from 'react';
import { useFindFileByPathQuery } from '@/api/fileEndpoints';

export interface UseImagePreviewOptions {
  onClose?: () => void;
}

export function useImagePreview(options?: UseImagePreviewOptions) {
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const [objectUrl, setObjectUrl] = useState<string | null>(null);

  const {
    data: imageBlob,
    isLoading,
    isError
  } = useFindFileByPathQuery(imageUrl || '', {
    skip: !imageUrl,
  });

  const openPreview = (fileUrl: string) => {
    console.log("openPreview called with:", fileUrl);
    setImageUrl(fileUrl);
    setIsOpen(true);
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
  }, []);

  return {
    isOpen,
    isLoading,
    isError,
    imageUrl,
    imageBlob,
    objectUrl,
    openPreview,
    closePreview,
  };
}