export const parseStringify = (value: unknown) => {
    return JSON.parse(JSON.stringify(value))
}

export const getFileCategory = (mimeType: string): string => {
    if (!mimeType) return "other"
    
    if (mimeType.startsWith("image/")) return "image"
    if (mimeType.startsWith("video/")) return "video"
    if (mimeType.startsWith("audio/")) return "audio"
    if (
      mimeType.includes("pdf") ||
      mimeType.includes("document") ||
      mimeType.includes("text") ||
      mimeType.includes("msword") ||
      mimeType.includes("wordprocessingml") ||
      mimeType.includes("spreadsheet") ||
      mimeType.includes("presentation")
    ) return "document"
    
    return "other"
  }