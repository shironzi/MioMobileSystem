import { View, Text, StyleSheet, TouchableOpacity, Image, Linking } from "react-native";
import React, { memo, useCallback } from "react";
import { useFocusEffect, useNavigation } from "expo-router";
import { Card } from "@rneui/themed";
import { FontAwesome } from "@expo/vector-icons";


const data = [
  {
    id: 1,
    image: "https://scontent.fmnl30-2.fna.fbcdn.net/v/t39.30808-6/473547042_2064844093944288_35658282325017136_n.jpg?_nc_cat=109&ccb=1-7&_nc_sid=a5f93a&_nc_eui2=AeFb9Md8FoOgmLR21SVbpZvb2nz24s_aBHnafPbiz9oEeUJy40_mCUDnVSIpvwNAzNbGRSbeIy-YvhITNAT868U1&_nc_ohc=1nP6U0eCltgQ7kNvgFDIvhV&_nc_ht=scontent.fmnl30-2.fna&oh=00_AfYd_2BoGL3MIWaVoLP_CcnMbbnZcX3gchnonXpdyqLZPsw&oe=67B76D5B",
    name: "Ava Samantha Arce",
    bibliography: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nullam eget nunc non arcu fermentum pharetra. Vivamus id justo vitae odio feugiat scelerisque.",
    contact: "09662303125",
    socialLink: "Facebook: @itz_naiah",
    link: "https://www.google.com",
  },
];

const profile = () => {
  const navigation = useNavigation();

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
      {data.map((item) => (
        <Card key={item.id} containerStyle={styles.cardContainer}>
        <Text style={{ fontSize: 16, fontWeight:"bold" }}>Profile</Text>
        <Image
          source={{
            uri: "https://scontent.fmnl30-2.fna.fbcdn.net/v/t39.30808-6/473547042_2064844093944288_35658282325017136_n.jpg?_nc_cat=109&ccb=1-7&_nc_sid=a5f93a&_nc_eui2=AeFb9Md8FoOgmLR21SVbpZvb2nz24s_aBHnafPbiz9oEeUJy40_mCUDnVSIpvwNAzNbGRSbeIy-YvhITNAT868U1&_nc_ohc=1nP6U0eCltgQ7kNvgFDIvhV&_nc_oc=AdhJNEvp15SOaPWvx9C1wsVVQeoKjq__CYlM_rJtmfNLTtwKUXln_1oHh4tae2eOAvQ&_nc_zt=23&_nc_ht=scontent.fmnl30-2.fna&_nc_gid=AIzWrGR0qsIgFV1cFXXXY9K&oh=00_AYD_2BoGL3MIWaVoLP_CcnMbbnZcX3gchnonXpdyqLZPsw&oe=67B76D5B",
          }}
          width={80}
          height={80}
          style={{
            width: 100,
            height: 100,
            left: 110,
            marginTop: 20,
            borderRadius: 180,
            borderWidth: 3,
            borderColor: "#fff",
          }}
        />
          <Text style={styles.iconWrapper}>
          <FontAwesome name="pencil" size={27} color="#fff" />
          </Text>
          <View style={styles.cardContent}>
            <Text style={styles.name}>{item.name}</Text>
            <Text style={styles.sectionTitle}>Biography</Text>
            <Text style={styles.bibliography}>{item.bibliography}</Text>
            <Text style={styles.sectionTitle}>Contact</Text>
            <Text style={styles.contact}>{item.contact}</Text>
            <Text style={styles.sectionTitle}>Social Links</Text>
            <Text style={styles.socialLink}>{item.socialLink}</Text>
          </View>
          <TouchableOpacity
            style={styles.button}
            onPress={() => Linking.openURL(item.link)}
          >
            <Text style={styles.buttonText}>Edit Profile</Text>
          </TouchableOpacity>
        </Card>
      ))}
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
  },
  buttonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
  
  iconWrapper: {
    position: "absolute",
    top: 110,
    right: 110, 
    backgroundColor: "#FFBF18",
    height: 32,
    width: 32,
    borderRadius: 15, 
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 2,
    borderColor: "#fff",
  },
});

export default memo(profile);