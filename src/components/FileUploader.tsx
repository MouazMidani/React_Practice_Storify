import React from "react";
import { View, Text, TouchableOpacity } from "react-native";
import { Upload } from "lucide-react-native";
import { Colors } from "../../Styleguide";
import { useAppwriteUpload } from "../../lib/hooks/useFiles";

export default function FileUploader() {
  const { uploadMultiple } = useAppwriteUpload()

  const handlePress = async () => {
    const input = document.createElement("input");
    input.type = "file";
    input.multiple = true;
    input.onchange = async (e: any) => {
      if (e.target.files) await uploadMultiple(e.target.files);
    };
    input.click();
  };

  return (
    <View>
      <TouchableOpacity
        style={{
          flexDirection: "row",
          alignItems: "center",
          backgroundColor: Colors.orangeWeb,
          paddingHorizontal: 16,
          paddingVertical: 10,
          borderRadius: 8,
          gap: 8,
        }}
        onPress={handlePress}
      >
        <Upload size={20} color={Colors.white} />
        <Text style={{ color: Colors.white, fontSize: 14, fontWeight: "600" }}>
          Upload Files
        </Text>
      </TouchableOpacity>
    </View>
  );
}
