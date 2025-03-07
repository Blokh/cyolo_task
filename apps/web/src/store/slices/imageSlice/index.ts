import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
import type { FileResponse } from "@/api/fileEndpoints";

export interface FileState {
  currentFile: FileResponse | null;
  files: FileResponse[];
  uploadLoading: boolean;
  uploadError: string | null;
}

const initialState: FileState = {
  currentFile: null,
  files: [],
  uploadLoading: false,
  uploadError: null,
};

export const fileSlice = createSlice({
  name: 'file',
  initialState,
  reducers: {
    setCurrentFile: (state, action: PayloadAction<FileResponse | null>) => {
      state.currentFile = action.payload;
    },
    setFiles: (state, action: PayloadAction<FileResponse[]>) => {
      state.files = action.payload;
    },
    addFile: (state, action: PayloadAction<FileResponse>) => {
      state.files.unshift(action.payload);
    },
    removeFile: (state, action: PayloadAction<string>) => {
      state.files = state.files.filter(file => file.id !== action.payload);
      if (state.currentFile?.id === action.payload) {
        state.currentFile = null;
      }
    },
    setUploadLoading: (state, action: PayloadAction<boolean>) => {
      state.uploadLoading = action.payload;
    },
    setUploadError: (state, action: PayloadAction<string | null>) => {
      state.uploadError = action.payload;
    }
  },
});

export const {
  setCurrentFile,
  setFiles,
  addFile,
  removeFile,
  setUploadLoading,
  setUploadError
} = fileSlice.actions;

export default fileSlice.reducer;