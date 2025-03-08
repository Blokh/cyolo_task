import { api } from "@/api/api.ts";
import { z } from "zod";

export interface UploadFileParams {
  file: File;
  retentionTimeInSeconds?: number;
}

const FileResponseSchema = z.object({
  id: z.string(),
  filePath: z.string(),
  userId: z.string(),
  originalFileName: z.string(),
  isArchived: z.boolean(),
});

export type FileResponse = z.infer<typeof FileResponseSchema>;

export const fileEndpoints = api.injectEndpoints({
  endpoints: (builder) => ({
    uploadFile: builder.mutation<FileResponse, UploadFileParams>({
      query: ({ file, retentionTimeInSeconds }) => {
        const formData = new FormData();
        formData.append("file", file);

        if (retentionTimeInSeconds) {
          formData.append(
            "retentionTimeInSeconds",
            retentionTimeInSeconds.toString(),
          );
        }

        return {
          url: "file",
          method: "PUT",
          data: formData,
          headers: {
            "Content-Type": "multipart/form-data",
          },
          responseHandler: (response) => {
            return FileResponseSchema.parse(response.data);
          },
        };
      },
      invalidatesTags: ["FILES"],
    }),
    findFileByPath: builder.query<unknown, string>({
      query: (fileUrl) => ({
        url: `file/${encodeURIComponent(fileUrl)}`,
        method: "GET",
        responseHandler: (response) => {
          if (!(response.data instanceof Blob)) {
            throw new Error("Response is not a valid Blob");
          }

          return response.data;
        },
        cache: "no-cache",
      }),
    }),
  }),
});

export const {
    useUploadFileMutation,
    useFindFileByPathQuery
} = fileEndpoints