import * as FileSystem from 'expo-file-system';
import * as Sharing from 'expo-sharing';
import { Platform } from 'react-native';

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

export const formatDateTime = (isoString: string): string => {
  const date = new Date(isoString)

  let hours = date.getHours()
  const minutes = date.getMinutes()
  const ampm = hours >= 12 ? "pm" : "am"
  hours = hours % 12
  hours = hours ? hours : 12

  const paddedMinutes = minutes.toString().padStart(2, "0")
  const day = date.getDate()
  const month = date.toLocaleString("en-US", { month: "short" })

  return `${hours}:${paddedMinutes}${ampm}, ${day} ${month}`
}
  
export const formatFileSize = (bytes: number): string => {
  if (bytes === 0) return "0 B"
  const k = 1024
  const sizes = ["B", "KB", "MB", "GB", "TB"]
  const i = Math.floor(Math.log(bytes) / Math.log(k))
  const size = bytes / Math.pow(k, i)
  return `${size.toFixed(1)} ${sizes[i]}`
}

export async function downloadFile(url: string): Promise<void> {
  try {
    const downloadUrl = url.replace('/view?', '/download?');

    if (Platform.OS === 'web') {
      const link = document.createElement('a');
      link.href = downloadUrl;
      link.download = downloadUrl.split('/').pop() || 'file';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } else {
      const fileUri = `${FileSystem.documentDirectory}${downloadUrl.split('/').pop()}`;
      const { uri } = await FileSystem.downloadAsync(downloadUrl, fileUri);

      if (await Sharing.isAvailableAsync()) {
        await Sharing.shareAsync(uri);
      } else {
        console.log('File downloaded to:', uri);
      }
    }
  } catch (error) {
    console.error('Error downloading file:', error);
  }
}