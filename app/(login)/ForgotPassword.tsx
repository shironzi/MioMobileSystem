import {
  View,
  Text,
  TextInput,
  StyleSheet,
  TouchableOpacity,
  Image,
  TouchableWithoutFeedback,
  Keyboard,
  Alert,
} from "react-native";
import React, { useState, memo } from "react";
import { useFocusEffect, useNavigation, useRouter } from "expo-router";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import { getAuth } from "@react-native-firebase/auth";

const forgotPass = () => {
  const router = useRouter();
  const navigation = useNavigation();
  const [emailAddress, setEmailAddress] = useState("");

  useFocusEffect(() => {
    navigation.setOptions({
      headerShown: false,
    });
  });

  const handleForgotRequest = () => {
    getAuth()
      .sendPasswordResetEmail(emailAddress)
      .then(() => {
        Alert.alert("Success", "Password reset email sent!");
      })
      .catch((error) => {
        if (error.code === "auth/user-not-found") {
          Alert.alert("Error", "No user found with that email.");
        } else {
          Alert.alert("Error", "Failed to send reset email.");
        }
      });
  };

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
      <View style={styles.upper}>
        <View style={styles.first}>
          <View style={styles.second}>
            <View style={styles.container}>
              <View>
                <Image
                  source={require("@/assets/logo.png")}
                  style={{ width: 100, height: 130, top: 70, right: -265 }}
                />
                <Text style={styles.header}>Welcome Back!</Text>
                <Text style={styles.sub}>Log in to your account</Text>
              </View>
              <View style={styles.row}>
                <TouchableOpacity onPress={() => router.back()}>
                  <MaterialIcons name="arrow-back" size={20} />
                </TouchableOpacity>
                <Text style={{ left: 20, color: "#666" }}>Go back</Text>
              </View>
              <Text style={{ left: 20, fontSize: 14 }}>
                Enter your Email Address
              </Text>

              <View style={{ rowGap: 14 }}>
                <View style={styles.inputContainer}>
                  <MaterialIcons name="email" size={24} color="#808080" />
                  <TextInput
                    placeholder="Email Address"
                    value={emailAddress}
                    onChangeText={setEmailAddress}
                    style={{ width: "100%" }}
                  />
                </View>
                <TouchableOpacity
                  style={styles.button}
                  onPress={handleForgotRequest}
                >
                  <Text
                    style={{
                      textAlign: "center",
                      color: "#fff",
                      fontSize: 18,
                      fontWeight: "bold",
                    }}
                  >
                    Send Verification
                  </Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </View>
      </View>
    </TouchableWithoutFeedback>
  );
};

const styles = StyleSheet.create({
  first: {
    padding: 20,
    backgroundColor: "#4d83e4",
    top: 200,
    borderTopStartRadius: 300,
    borderTopEndRadius: 300,
    left: -120,
    width: "160%",
  },
  second: {
    padding: 60,
    backgroundColor: "#fff",
    top: 20,
    borderTopStartRadius: 300,
    borderTopEndRadius: 300,
    left: 0,
    width: "100%",
  },
  container: {
    padding: 60,
    justifyContent: "center",
    top: -110,
    margin: 10,
    marginLeft: 15,
  },
  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#f2f5f5",
    padding: 9,
    paddingLeft: 20,
    columnGap: 7,
    marginBottom: -10,
    margin: 15,
    borderRadius: 20,
    elevation: 2,
  },
  row: {
    flexDirection: "row",
    alignItems: "center",
    margin: 15,
    marginTop: -20,
    marginBottom: 20,
  },
  forgotText: {
    textDecorationLine: "underline",
    fontStyle: "italic",
    color: "#666",
  },
  button: {
    backgroundColor: "#ffbf18",
    borderRadius: 40,
    margin: 15,
    marginTop: 30,
    padding: 15,
  },
  header: {
    marginTop: -50,
    color: "#2264dc",
    fontSize: 28,
    fontWeight: "bold",
    margin: 15,
    letterSpacing: 1.5,
  },
  sub: {
    marginLeft: 20,
    fontSize: 15,
    marginTop: -10,
    marginBottom: 45,
    color: "#1f1f1f",
  },
  upper: {
    backgroundColor: "#2264dc",
  },
});

export default memo(forgotPass);
