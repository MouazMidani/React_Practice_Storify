import { create } from "zustand"

interface UploadFile {
  id: string
  name: string
  size: number
  progress: number
  status: "uploading" | "completed" | "error"
  file: any
}

interface UploadStore {
  uploads: UploadFile[]
  addUploads: (files: UploadFile[]) => void
  updateProgress: (id: string, progress: number) => void
  markComplete: (id: string) => void
  markError: (id: string) => void
  removeUpload: (id: string) => void
}

export const useUploadStore = create<UploadStore>((set) => ({
  uploads: [],
  addUploads: (files) => set((state) => ({ uploads: [...state.uploads, ...files] })),
  updateProgress: (id, progress) =>
    set((state) => ({
      uploads: state.uploads.map((f) => (f.id === id ? { ...f, progress } : f)),
    })),
  markComplete: (id) =>
    set((state) => ({
      uploads: state.uploads.map((f) =>
        f.id === id ? { ...f, progress: 100, status: "completed" } : f
      ),
    })),
  markError: (id) =>
    set((state) => ({
      uploads: state.uploads.map((f) =>
        f.id === id ? { ...f, status: "error" } : f
      ),
    })),
  removeUpload: (id) =>
    set((state) => ({
      uploads: state.uploads.filter((f) => f.id !== id),
    })),
}))