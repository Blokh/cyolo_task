import { createFileRoute } from "@tanstack/react-router";
import UploadPage from "@/pages/file-upload/UploadFilePage.tsx";

export const Route = createFileRoute("/")({
  component: UploadPage,
});