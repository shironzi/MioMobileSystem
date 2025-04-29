import { View, Text, StyleSheet, TouchableOpacity, Image } from "react-native";
import React, { memo, useCallback } from "react";
import { useFocusEffect, useNavigation, useRouter } from "expo-router";
import { Card } from "@rneui/themed";
import { FontAwesome } from "@expo/vector-icons";

const data = {
  id: 1,
  image:
    "https://scontent.fcrk3-1.fna.fbcdn.net/v/t1.15752-9/490985916_1202175937960521_8050126276858148282_n.jpg?stp=dst-jpg_p480x480_tt6&_nc_cat=110&ccb=1-7&_nc_sid=0024fc&_nc_eui2=AeGdS_RHXex_0OCp-aLXEeC40MR0ym5I97vQxHTKbkj3u-VWX16S8FkyS8TZDJsy7bVJnVrb4ioGAm1z_AQ6sqJ7&_nc_ohc=kgJNUn5Ix3wQ7kNvwED2EVt&_nc_oc=AdmysBOwUz556KCfGyCwdPtRHv9P9_YPyHkQRv3GdGjYsNKDajUbD4YS7tE0rFp-DQA&_nc_zt=23&_nc_ht=scontent.fcrk3-1.fna&oh=03_Q7cD2AEwoyZmSU9qAQXanXXFqDrjPo4ai2COCsq7GKVQsJlo3g&oe=6830AA7D",
  name: "Aaron Josh Baon",
  bibliography:
    "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nullam eget nunc non arcu fermentum pharetra. Vivamus id justo vitae odio feugiat scelerisque.",
  contact: "09662303125",
  socialLink: "Facebook: @josh",
  link: "https://www.google.com",
};

const profile = () => {
  const navigation = useNavigation();
  const router = useRouter();

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

  return (
    <View style={styles.container}>
      <Card key={data.id} containerStyle={styles.cardContainer}>
        <Text style={{ fontSize: 20, fontWeight: "bold" }}>Profile</Text>
        <View style={styles.profile}>
          <Image
            source={{ uri: data.image }}
            width={80}
            height={80}
            style={styles.profilePic}
          />
          <View style={styles.iconWrapper}>
            <Text style={styles.pencil}>
              <FontAwesome name="pencil" size={15} color="#fff" />
            </Text>
          </View>
        </View>
        <View style={styles.cardContent}>
          <Text style={styles.name}>{data.name}</Text>
          <Text style={styles.sectionTitle}>Biography</Text>
          <Text style={styles.bibliography}>{data.bibliography}</Text>
          <Text style={styles.sectionTitle}>Contact</Text>
          <Text style={styles.contact}>{data.contact}</Text>
          <Text style={styles.sectionTitle}>Social Links</Text>
          <Text style={styles.socialLink}>{data.socialLink}</Text>
        </View>
        <TouchableOpacity
          style={styles.button}
          onPress={() => router.push("edit")}
        >
          <Text style={styles.buttonText}>Edit Profile</Text>
        </TouchableOpacity>
      </Card>
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
