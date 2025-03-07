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
          url: "files/upload",
          method: "POST",
          body: formData,
          responseHandler: (response: unknown) => {
            return FileResponseSchema.parse(response);
          },
        };
      },
      invalidatesTags: ["FILES"],
    }),
    findFileByPath: builder.query<unknown, string>({
      query: (fileUrl) => ({
        url: fileUrl,
        method: "GET",
        responseHandler: (response: unknown) => {
          if (!(response instanceof Blob)) {
            throw new Error("Response is not a valid Blob");
          }

          return response as Blob;
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