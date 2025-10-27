import { Platform } from "react-native";
import * as DocumentPicker from "expo-document-picker";

export function useFileSelector() {
  const selectFiles = async () => {
    if (Platform.OS === "web") {
      return new Promise<FileList | null>((resolve) => {
        const input = document.createElement("input");
        input.type = "file";
        input.multiple = true;
        input.onchange = (e: any) => resolve(e.target.files);
        input.click();
      });
    } else {
      const result = await DocumentPicker.getDocumentAsync({ multiple: true });
      if (result.canceled) return null;

      // Convert expo picker files to File-like objects
      return result.assets.map((asset) => ({
        name: asset.name,
        size: asset.size ?? 0,
        uri: asset.uri,
        type: asset.mimeType,
      })) as any;
    }
  };

  return { selectFiles };
}
