import { View, Text, StyleSheet, TouchableOpacity, Image, TextInput, ScrollView } from "react-native";
import React, { memo, useCallback, useState } from "react";
import { FontAwesome } from "@expo/vector-icons";
import HeaderConfig from "@/utils/HeaderConfig";

const data = [
  {
    id: 1,
    image: require("@/assets/images/1.png"),
    name: "Ava Samantha Arce",
  },
];

interface SocialLink {
  title: string;
  url: string;
}

const Edit = () => {
  const [biography, setBiography] = useState("");
  const [contact, setContact] = useState("");
  const [socialLinks, setSocialLinks] = useState([{ title: "", url: "" }]);

  HeaderConfig("Profile");

  const handleSocialLinkChange = useCallback(
    (index: number, field: keyof SocialLink, value: string): void => {
      const updatedLinks: SocialLink[] = [...socialLinks];
      updatedLinks[index][field] = value;
      setSocialLinks(updatedLinks);
    },
    [socialLinks]
  );

  const handleAddSocialLink = useCallback(() => {
    setSocialLinks([...socialLinks, { title: "", url: "" }]);
  }, [socialLinks]);

  const handleRemoveSocialLink = useCallback(
    (index: number): void => {
      const updatedLinks: SocialLink[] = socialLinks.filter(
        (_, i) => i !== index
      );
      setSocialLinks(updatedLinks);
    },
    [socialLinks]
  );

  return (
    <ScrollView
    showsVerticalScrollIndicator={false}>
      <View style={styles.container}>
        {data.map((item) => (
          <View key={item.id} style={styles.cardContainer}>
            <Text style={{ fontSize: 20, fontWeight: "bold" }}>Profile</Text>
            <Image source={item.image} style={styles.profileImage} />
            <TouchableOpacity style={styles.iconWrapper}>
              <FontAwesome name="pencil" size={15} color="#fff" />
            </TouchableOpacity>
            <View style={styles.cardContent}>
              <Text style={styles.name}>{item.name}</Text>
              <Text style={styles.sectionTitle}>Biography</Text>
              <View style={styles.bio}>
                <TextInput
                  style={styles.textInput}
                  placeholder="I am..."
                  placeholderTextColor="#aaa"
                  value={biography}
                  onChangeText={setBiography}
                  multiline={true}
                />
              </View>
              <Text style={styles.sectionTitle}>Contact</Text>
              <View style={styles.con}>
                <TextInput
                  style={styles.textInput}
                  placeholder="name@gmail.com"
                  placeholderTextColor="#aaa"
                  value={contact}
                  onChangeText={setContact}
                  multiline={true}
                />
              </View>
              <Text style={styles.sectionTitle}>Social Links</Text>
              {socialLinks.map((link, index) => (
                <View key={index} style={styles.row}>
                  <TextInput
                    style={[styles.textInputRow]}
                    placeholder="Title"
                    placeholderTextColor="#aaa"
                    value={link.title}
                    onChangeText={(value) =>
                      handleSocialLinkChange(index, "title", value)
                    }
                    multiline={true}
                  />
                  <Text style={styles.arrow}>›</Text>
                  <TextInput
                    style={[styles.textInputRow]}
                    placeholder="URL"
                    placeholderTextColor="#aaa"
                    value={link.url}
                    onChangeText={(value) =>
                      handleSocialLinkChange(index, "url", value)
                    }
                    multiline={true}
                  />
                  <TouchableOpacity
                    style={styles.deleteIcon}
                    onPress={() => handleRemoveSocialLink(index)}
                  >
                    <FontAwesome name="times" size={16} color="#aaa" />
                  </TouchableOpacity>
                </View>
              ))}
                <TouchableOpacity style={{ flexDirection: "row", alignItems: "center" }} onPress={handleAddSocialLink}>
                <FontAwesome name="plus" size={12} color="#ffbf18" style={{top:0, left:10}}/>
                <Text style={styles.addLinkText}>Add link</Text>
                </TouchableOpacity>
            </View>
            <TouchableOpacity style={styles.button}>
              <Text style={styles.buttonText}>Save Profile</Text>
            </TouchableOpacity>
          </View>
        ))}
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
    top: 105,
    right: 125,
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
    left: -15,
    width: "100%",
    marginTop: 10,
    padding: 10,
    borderRadius: 10,
    backgroundColor: "#f9f9f9",
    borderWidth: 1,
    borderColor: "#ddd",
    height: 100,
    marginBottom: 20,
  },
  con: {
    left: -15,
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
    left:-5
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
    marginBottom:10

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
  textInput: {
    top: 5,
    paddingTop: -10,
    width: "100%",
  },
});

export default memo(Edit);
