import React, { memo } from "react";
import {
  FlatList,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import globalStyles from "@/styles/globalStyles";
import AntDesign from "@expo/vector-icons/AntDesign";
import ImageUpload from "@/components/ImageUpload";

interface FileInfo {
  uri: string;
  name: string;
  mimeType?: string;
}

interface Props {
  pictureItems: { file: FileInfo | null; word: string | null }[];
  setPictureItems: React.Dispatch<
    React.SetStateAction<{ file: FileInfo | null; word: string | null }[]>
  >;
  handleRemoveItem: (index: number) => void;
}

const AddPictureFlashcard = ({
  pictureItems,
  setPictureItems,
  handleRemoveItem,
}: Props) => {
  return (
    <View>
      <FlatList
        data={pictureItems}
        keyExtractor={(_, index) => index.toString()}
        contentContainerStyle={{ rowGap: 12 }}
        renderItem={({ item, index }) => (
          <View>
            <View
              style={{
                flexDirection: "row",
                justifyContent: "space-between",
              }}
            >
              <Text style={globalStyles.text1}>Number {index + 1}</Text>
              <TouchableOpacity onPress={() => handleRemoveItem(index)}>
                <AntDesign name="close" size={24} color="red" />
              </TouchableOpacity>
            </View>

            <Text style={globalStyles.text1}>Upload Image</Text>
            <ImageUpload
              handleFiles={(file) =>
                setPictureItems((prev) =>
                  prev.map((entry, i) =>
                    i === index
                      ? {
                          ...entry,
                          file,
                        }
                      : entry,
                  ),
                )
              }
              imageUri={item.file?.uri ?? null}
              handleImageRemove={function (): void {
                throw new Error("Function not implemented.");
              }}
              isError={false}
            />

            <Text style={globalStyles.text1}>Word</Text>
            <TextInput
              style={{
                width: "100%",
                borderRadius: 15,
                borderWidth: 1,
                paddingHorizontal: 14,
                paddingVertical: 7,
                borderColor: "#82828257",
                height: 45,
              }}
              placeholder="word"
              value={item.word || ""}
              onChangeText={(text) =>
                setPictureItems((prev) =>
                  prev.map((entry, i) =>
                    i === index ? { ...entry, word: text } : entry,
                  ),
                )
              }
            />

            <View
              style={{
                borderTopWidth: 1,
                borderColor: "#82828257",
                marginHorizontal: -25,
                marginVertical: 20,
              }}
            />
          </View>
        )}
      />
    </View>
  );
};

export default memo(AddPictureFlashcard);
