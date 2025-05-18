import React, {useState} from "react";
import {StyleSheet, Text, TextInput, TouchableOpacity, View} from "react-native";
import useHeaderConfig from "@/utils/HeaderConfig";
import * as DocumentPicker from "expo-document-picker"
import AntDesign from '@expo/vector-icons/AntDesign';
import globalStyles from "@/styles/globalStyles";
import {useRouter} from "expo-router";

const addAnnouncement = () => {
    useHeaderConfig("Announcement")
    const router = useRouter();

    const [title, setTitle] = useState<string>("")
    const [description, setDescription] = useState<string>("")
    const [filename, setFilename] = useState<string | undefined>();
    const [fileUrl, setFileUrl] = useState<string | undefined>();
    const [fileType, setFileType] = useState<string | undefined>();
    const [descHeight, setDescHeight] = useState(0);

    const handleFileUpload = async () => {
        const res = await DocumentPicker.getDocumentAsync({
            type: ["image/*", "application/*", "video/*", "audio/*",]
        })

        if(!res.canceled){
            const {mimeType, name, size, uri} = res.assets[0];

            setFilename(name);
            setFileUrl(uri);
            setFileType(mimeType);

            console.log(mimeType)
        }
    }

    const handlePreview = () => {
        router.push({
            pathname: "/subject/(sub-details)/announcement/announcementPreview",
            params: {title: title, description: description, fileUrl: fileUrl}
        })
    }

  return (
      <View style={{padding: 20}}>


    <View style={{backgroundColor: "#fff", borderRadius: 20}}>
        <View style={{paddingHorizontal: 26, paddingVertical: 18}}>
        <View>
          <Text>Title: </Text>
          <TextInput placeholder={"Title"} style={globalStyles.inputContainer} onChangeText={setTitle}/>
        </View>
        <View>
            <Text>Description: </Text>
            <TextInput
                style={[globalStyles.inputContainer, { height: Math.max(200, descHeight) },]}
                placeholder={"description"}
                multiline
                onContentSizeChange={(e) =>
                    setDescHeight(e.nativeEvent.contentSize.height)
                }
                textAlignVertical="top"
                onChangeText={setDescription}
            />
        </View>
        </View>
        <View style={{rowGap: 18}}>
            <View style={{width: "100%", backgroundColor: "#434242", paddingVertical: 9, paddingHorizontal: 26}}>
                <Text style={{color: "#fff"}}>File Upload</Text>
            </View>
            <View style={{paddingVertical: 9, paddingHorizontal: 26, rowGap: 18}}>
                <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: "space-between" }}>
                    <TouchableOpacity onPress={handleFileUpload} style={styles.fileUpload}>
                        <Text>Choose File</Text>
                    </TouchableOpacity>

                    <Text
                        style={[
                            styles.filename,
                            filename ? {} : { display: 'none' }  // or: { opacity: 0 }
                        ]}
                    >
                        {filename}
                    </Text>

                    <TouchableOpacity
                        onPress={() => setFilename(undefined)}
                        disabled={!filename}
                        style={filename ? {} : { display: 'none' }}
                    >
                        <AntDesign name="close" size={24} color="black" />
                    </TouchableOpacity>
                </View>
                <TouchableOpacity style={{flexDirection: "row", columnGap: 12}}>
                    <AntDesign name="plus" size={24} color="#FFBF18" />
                    <Text style={{color: "#FFBF18"}}>
                        Add File
                    </Text>
                </TouchableOpacity>
                <View style={{flexDirection: "row", justifyContent: "space-around"}}>
                    <TouchableOpacity style={{backgroundColor:"#FFBF18", borderRadius: 50, paddingHorizontal: 17}}>
                        <Text style={{textAlign: "center"}}>
                            Cancel
                        </Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={{backgroundColor:"#FFBF18", borderRadius: 50, paddingHorizontal: 17}} onPress={handlePreview}>
                        <Text style={{textAlign: "center"}}>
                            Preview
                        </Text>
                    </TouchableOpacity>
                </View>
            </View>
        </View>
    </View>
      </View>
  );
};

const styles = StyleSheet.create({
    fileUpload: {
        padding: 9,
        borderRadius: 15,
        borderWidth: 1,
        borderColor: 'rgba(0, 0, 0, 0.10)',
        backgroundColor: '#F4F4F4',
        elevation: 5,
        width: 100
    },
    fileUploadText: {
        textAlign: "center"
    },
    filename: {
        marginLeft: 10,
        fontSize: 16,
        color: '#333',
    },
})

export default addAnnouncement;
