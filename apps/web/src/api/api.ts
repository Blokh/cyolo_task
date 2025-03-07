import { createApi } from "@reduxjs/toolkit/query/react";
import { axiosBaseQuery } from "@/utils/axoisBaseQuery.ts";

export const api = createApi({
  reducerPath: "api",
  tagTypes: ['FILES'],
  baseQuery: axiosBaseQuery(),
  endpoints: () => ({}),
});
