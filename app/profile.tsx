import HeaderConfig from "@/utils/HeaderConfig";
import { FontAwesome } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import React, { memo, useEffect, useState } from "react";
import { Image, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { getProfile } from "@/utils/query";

interface FileInfo {
  uri: string;
  name: string;
  mimeType?: string;
}

const profile = () => {
  const router = useRouter();
  const [name, setName] = useState<string>("");
  const [bibliography, setBibliography] = useState<string>("");
  const [photo_url, setPhoto_url] = useState();

  HeaderConfig("Profile");

  useEffect(() => {
    const fetchProfile = async () => {
      const res = await getProfile();

      setName(res.name);
      setBibliography(res.biography);
      setPhoto_url(res.photo_url);

      console.log(res);
    };

    fetchProfile();
  }, []);

  return (
    <View style={styles.container}>
      <View style={styles.cardContainer}>
        <Text style={{ fontSize: 20, fontWeight: "bold" }}>Profile</Text>
        <View style={styles.profile}>
          <View style={{ borderWidth: 1, borderRadius: 360, padding: 5 }}>
            <Image
              source={
                photo_url
                  ? { uri: photo_url }
                  : require("@/assets/images/default_profile.png")
              }
              style={{
                width: 80,
                height: 80,
              }}
              resizeMode="contain"
            />
          </View>
          <View style={styles.iconWrapper}>
            <Text style={styles.pencil}>
              <FontAwesome name="pencil" size={15} color="#fff" />
            </Text>
          </View>
        </View>
        <View style={styles.cardContent}>
          <Text style={styles.name}>{name}</Text>
          <Text style={styles.sectionTitle}>Biography</Text>
          <Text style={styles.bibliography}>{bibliography}</Text>
          {/*<Text style={styles.sectionTitle}>Contact</Text>*/}
          {/*<Text style={styles.contact}>{data.contact}</Text>*/}
          {/*<Text style={styles.sectionTitle}>Social Links</Text>*/}
          {/*<Text style={styles.socialLink}>{data.socialLink}</Text>*/}
        </View>
        <TouchableOpacity
          style={styles.button}
          onPress={() =>
            router.push({
              pathname: "/edit",
              params: {
                name: name,
                photo_url: photo_url,
                bibliography: bibliography,
              },
            })
          }
        >
          <Text style={styles.buttonText}>Edit Profile</Text>
        </TouchableOpacity>
      </View>
    </View>
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
  image: {
    width: "100%",
    height: 200,
    borderRadius: 10,
    marginBottom: 15,
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
    marginTop: 20,
    marginBottom: 15,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#000",
    marginBottom: 5,
  },
  bibliography: {
    fontSize: 16,
    color: "#000",
    textAlign: "left",
    lineHeight: 24,
    marginBottom: 15,
  },
  contact: {
    fontSize: 16,
    color: "#000",
    marginBottom: 15,
  },
  socialLink: {
    fontSize: 16,
    color: "#000",
    marginBottom: 15,
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

  iconWrapper: {
    borderRadius: 180,
    marginTop: -32,
    marginLeft: 70,
    backgroundColor: "#fff",
    padding: 3,
  },
  profilePic: {
    width: 125,
    height: 125,
    marginTop: 20,
    borderRadius: 180,
    borderWidth: 3,
    borderColor: "#fff",
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

export default memo(profile);
