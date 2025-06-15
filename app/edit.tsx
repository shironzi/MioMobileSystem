import HeaderConfig from "@/utils/HeaderConfig";
import { FontAwesome } from "@expo/vector-icons";
import React, { memo, useState } from "react";
import {
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
  Image,
  Alert,
} from "react-native";
import { router, useLocalSearchParams } from "expo-router";
import * as DocumentPicker from "expo-document-picker";
import { editProfile } from "@/utils/query";

// interface SocialLink {
//   title: string;
//   url: string;
// }

interface FileInfo {
  uri: string;
  name: string;
  mimeType?: string;
}

const Edit = () => {
  const { name, biography, photo_url } = useLocalSearchParams<{
    name: string;
    biography: string;
    photo_url: string;
  }>();
  const [newBiography, setNewBiography] = useState(biography);
  const [profile_pic, setProfile_pic] = useState<FileInfo | null>(null);
  // const [contact, setContact] = useState("");
  // const [socialLinks, setSocialLinks] = useState([{ title: "", url: "" }]);

  HeaderConfig("Profile");

  const handleEditImage = async () => {
    const res = await DocumentPicker.getDocumentAsync({
      type: ["image/*"],
      copyToCacheDirectory: true,
    });

    if (!res.canceled) {
      const { uri, name, mimeType } = res.assets[0];
      setProfile_pic({ uri, name, mimeType });
    }
  };

  const handleUpdate = async () => {
    try {
      const res = await editProfile(profile_pic, biography);

      if (res.success) {
        Alert.alert(
          "Success",
          res.message,
          [
            {
              text: "OK",
              onPress: () => {
                router.back();
                router.back();
              },
            },
          ],
          { cancelable: false },
        );
      } else {
        Alert.alert("Error", "Something went wrong. Please try again.");
      }
    } catch (err) {
      console.error("Submission error:", err);
      Alert.alert("Error", "Submission failed. Please check your inputs.");
    }
  };

  // const handleSocialLinkChange = useCallback(
  //   (index: number, field: keyof SocialLink, value: string): void => {
  //     const updatedLinks: SocialLink[] = [...socialLinks];
  //     updatedLinks[index][field] = value;
  //     setSocialLinks(updatedLinks);
  //   },
  //   [socialLinks],
  // );
  //
  // const handleAddSocialLink = useCallback(() => {
  //   setSocialLinks([...socialLinks, { title: "", url: "" }]);
  // }, [socialLinks]);
  //
  // const handleRemoveSocialLink = useCallback(
  //   (index: number): void => {
  //     const updatedLinks: SocialLink[] = socialLinks.filter(
  //       (_, i) => i !== index,
  //     );
  //     setSocialLinks(updatedLinks);
  //   },
  //   [socialLinks],
  // );

  return (
    <ScrollView showsVerticalScrollIndicator={false}>
      <View style={styles.container}>
        <View style={styles.cardContainer}>
          <Text style={{ fontSize: 20, fontWeight: "bold" }}>Profile</Text>
          <TouchableOpacity style={styles.profile} onPress={handleEditImage}>
            <View style={{ borderWidth: 1, borderRadius: 360, padding: 5 }}>
              <Image
                source={
                  profile_pic?.uri
                    ? { uri: profile_pic.uri }
                    : photo_url
                      ? { uri: photo_url }
                      : require("@/assets/images/default_profile.png")
                }
                style={{
                  width: 80,
                  height: 80,
                  borderRadius: 40,
                }}
                resizeMode="contain"
              />
            </View>
            <View style={styles.iconWrapper}>
              <Text style={styles.pencil}>
                <FontAwesome name="pencil" size={15} color="#fff" />
              </Text>
            </View>
          </TouchableOpacity>
          <View style={styles.cardContent}>
            <Text style={styles.name}>{name}</Text>
            <Text style={styles.sectionTitle}>Biography</Text>
            <View style={styles.bio}>
              <TextInput
                placeholder="I am..."
                placeholderTextColor="#aaa"
                value={newBiography}
                onChangeText={setNewBiography}
                multiline={true}
              />
            </View>
            {/*<Text style={styles.sectionTitle}>Contact</Text>*/}
            {/*<View style={styles.con}>*/}
            {/*  <TextInput*/}
            {/*    style={styles.textInput}*/}
            {/*    placeholder="name@gmail.com"*/}
            {/*    placeholderTextColor="#aaa"*/}
            {/*    value={contact}*/}
            {/*    onChangeText={setContact}*/}
            {/*    multiline={true}*/}
            {/*  />*/}
            {/*</View>*/}
            {/*<Text style={styles.sectionTitle}>Social Links</Text>*/}
            {/*{socialLinks.map((link, index) => (*/}
            {/*  <View key={index} style={styles.row}>*/}
            {/*    <TextInput*/}
            {/*      style={[styles.textInputRow]}*/}
            {/*      placeholder="Title"*/}
            {/*      placeholderTextColor="#aaa"*/}
            {/*      value={link.title}*/}
            {/*      onChangeText={(value) =>*/}
            {/*        handleSocialLinkChange(index, "title", value)*/}
            {/*      }*/}
            {/*      multiline={true}*/}
            {/*    />*/}
            {/*    <Text style={styles.arrow}>›</Text>*/}
            {/*    <TextInput*/}
            {/*      style={[styles.textInputRow]}*/}
            {/*      placeholder="URL"*/}
            {/*      placeholderTextColor="#aaa"*/}
            {/*      value={link.url}*/}
            {/*      onChangeText={(value) =>*/}
            {/*        handleSocialLinkChange(index, "url", value)*/}
            {/*      }*/}
            {/*      multiline={true}*/}
            {/*    />*/}
            {/*    <TouchableOpacity*/}
            {/*      style={styles.deleteIcon}*/}
            {/*      onPress={() => handleRemoveSocialLink(index)}*/}
            {/*    >*/}
            {/*      <FontAwesome name="times" size={16} color="#aaa" />*/}
            {/*    </TouchableOpacity>*/}
            {/*  </View>*/}
            {/*))}*/}
            {/*<TouchableOpacity*/}
            {/*  style={{ flexDirection: "row", alignItems: "center" }}*/}
            {/*  onPress={handleAddSocialLink}*/}
            {/*>*/}
            {/*  <FontAwesome*/}
            {/*    name="plus"*/}
            {/*    size={12}*/}
            {/*    color="#ffbf18"*/}
            {/*    style={{ top: 0, left: 10 }}*/}
            {/*  />*/}
            {/*  <Text style={styles.addLinkText}>Add link</Text>*/}
            {/*</TouchableOpacity>*/}
          </View>
          <TouchableOpacity style={styles.button} onPress={handleUpdate}>
            <Text style={styles.buttonText}>Save Profile</Text>
          </TouchableOpacity>
        </View>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f5f5f5",
    padding: 10,
  },
  cardContainer: {
    padding: 20,
    margin: 10,
    borderRadius: 10,
    backgroundColor: "#fff",
    borderWidth: 0,
    elevation: 5,
  },
  profileImage: {
    width: 100,
    height: 100,
    alignSelf: "center",
    marginTop: 5,
    borderRadius: 50,
    borderWidth: 3,
    borderColor: "#fff",
  },
  iconWrapper: {
    position: "absolute",
    top: 65,
    right: 10,
    backgroundColor: "#FFBF18",
    height: 27,
    width: 27,
    borderRadius: 15,
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 2,
    borderColor: "#fff",
    padding: 4,
  },
  cardContent: {
    flexDirection: "column",
    alignItems: "flex-start",
  },
  name: {
    width: "100%",
    textAlign: "center",
    fontSize: 20,
    fontWeight: "bold",
    color: "#000",
    marginTop: 10,
    marginBottom: 15,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#000",
    marginBottom: 5,
  },
  bio: {
    width: "100%",
    marginTop: 10,
    paddingHorizontal: 10,
    borderRadius: 10,
    backgroundColor: "#f9f9f9",
    borderWidth: 1,
    borderColor: "#ddd",
    height: 150,
    marginBottom: 20,
  },
  con: {
    width: "100%",
    marginTop: 10,
    padding: 10,
    borderRadius: 10,
    backgroundColor: "#f9f9f9",
    borderWidth: 1,
    borderColor: "#ddd",
    height: 50,
    marginBottom: 20,
  },
  row: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 10,
    marginTop: 10,
  },
  textInputRow: {
    left: -5,
    flex: 1,
    height: 50,
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 10,
    paddingHorizontal: 10,
    backgroundColor: "#f9f9f9",
    marginHorizontal: 5,
  },
  arrow: {
    fontSize: 30,
    color: "#aaa",
    marginHorizontal: 5,
    left: -5,
  },
  deleteIcon: {
    marginLeft: 5,
    padding: 5,
  },
  addLinkText: {
    left: 15,
    color: "#ffbf18",
    fontSize: 16,
    textDecorationLine: "underline",
    marginTop: 10,
    marginBottom: 10,
  },
  button: {
    backgroundColor: "#FFBF18",
    padding: 10,
    borderRadius: 50,
    marginTop: 10,
    alignItems: "center",
    elevation: 5,
  },
  buttonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
  profile: {
    alignItems: "center",
    width: 105,
    marginHorizontal: "auto",
  },
  pencil: {
    textAlign: "center",
    padding: 5,
    width: 25,
    height: 25,
    borderRadius: 180,
    backgroundColor: "#FFBF18",
  },
});

export default memo(Edit);
