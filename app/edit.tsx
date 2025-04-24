import { View, Text, StyleSheet, TouchableOpacity, Image, TextInput, ScrollView } from "react-native";
import React, { memo, useCallback, useState } from "react";
import { useFocusEffect, useNavigation } from "expo-router";
import { Card } from "@rneui/themed";
import { FontAwesome } from "@expo/vector-icons";

const data = [
  {
    id: 1,
    image: require("@/assets/1.png"),
    name: "Ava Samantha Arce",
  },
];

const Edit = () => {
  const navigation = useNavigation();
  const [biography, setBiography] = useState("");
  const [contact, setContact] = useState("");
  const [socialLinks, setSocialLinks] = useState([{ title: "", url: "" }]);

  useFocusEffect(
    useCallback(() => {
      navigation.setOptions({
        headerTitle: "Profile",
        headerStyle: {
          backgroundColor: "#2264DC",
        },
        headerTintColor: "#fff",
      });

      return () => {
        navigation.setOptions({
          headerTitle: "",
          headerStyle: {
            backgroundColor: "",
          },
          headerTintColor: "",
        });
      };
    }, [navigation])
  );

interface SocialLink {
    title: string;
    url: string;
}

const handleSocialLinkChange = (index: number, field: keyof SocialLink, value: string): void => {
    const updatedLinks: SocialLink[] = [...socialLinks];
    updatedLinks[index][field] = value;
    setSocialLinks(updatedLinks);
};

  const handleAddSocialLink = () => {
    setSocialLinks([...socialLinks, { title: "", url: "" }]);
  };

const handleRemoveSocialLink = (index: number): void => {
    const updatedLinks: SocialLink[] = socialLinks.filter((_, i) => i !== index);
    setSocialLinks(updatedLinks);
};

  return (
    <ScrollView>
      <View style={styles.container}>
        {data.map((item) => (
          <Card key={item.id} containerStyle={styles.cardContainer}>
            <Text style={{ fontSize: 20, fontWeight: "bold" }}>Profile</Text>
            <Image
              source={item.image}
              style={styles.profileImage}
            />
            <TouchableOpacity style={styles.iconWrapper}>
              <FontAwesome name="pencil" size={15} color="#fff" />
            </TouchableOpacity>
            <View style={styles.cardContent}>
              <Text style={styles.name}>{item.name}</Text>
              <Text style={styles.sectionTitle}>Biography</Text>
              <Card containerStyle={styles.bio}>
                <TextInput
                  style={styles.textInput}
                  placeholder="I am..."
                  placeholderTextColor="#aaa"
                  value={biography}
                  onChangeText={setBiography}
                  multiline={true}
                />
              </Card>
              <Text style={styles.sectionTitle}>Contact</Text>
              <Card containerStyle={styles.con}>
                <TextInput
                  style={styles.textInput}
                  placeholder="name@gmail.com"
                  placeholderTextColor="#aaa"
                  value={contact}
                  onChangeText={setContact}
                  multiline={true}
                />
              </Card>
              <Text style={styles.sectionTitle}>Social Links</Text>
              {socialLinks.map((link, index) => (
                <View key={index} style={styles.row}>
                  <TextInput
                    style={[styles.textInputRow]}
                    placeholder="Title"
                    placeholderTextColor="#aaa"
                    value={link.title}
                    onChangeText={(value) => handleSocialLinkChange(index, "title", value)}
                    multiline={true}
                  />
                  <Text style={styles.arrow}>›</Text>
                  <TextInput
                    style={[styles.textInputRow]}
                    placeholder="URL"
                    placeholderTextColor="#aaa"
                    value={link.url}
                    onChangeText={(value) => handleSocialLinkChange(index, "url", value)}
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
              <TouchableOpacity onPress={handleAddSocialLink}>
                <Text style={styles.addLinkText}>Add link</Text>
              </TouchableOpacity>
            </View>
            <TouchableOpacity style={styles.button}>
              <Text style={styles.buttonText}>Save Profile</Text>
            </TouchableOpacity>
          </Card>
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
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
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
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 5,
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
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 5,
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
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 10,
  },
  arrow: {
    fontSize: 18,
    color: "#aaa",
    marginHorizontal: 5,
  },
  deleteIcon: {
    marginLeft: 5,
    padding: 5,
  },
  addLinkText: {
    left: 5,
    color: "#ffbf18",
    fontSize: 16,
    textDecorationLine: "underline",
    marginTop: 10,
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
  }
});

export default memo(Edit);