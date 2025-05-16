import {
  View,
  Text,
  TextInput,
  StyleSheet,
  TouchableOpacity,
  Image,
  KeyboardAvoidingView
} from "react-native";
import React, { useState, memo } from "react";
import { useFocusEffect, useNavigation, useRouter } from "expo-router";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import { CheckBox } from "@rneui/themed";
import validator from 'validator';
import Ionicons from '@expo/vector-icons/Ionicons';

import login from "@/utils/auth";

const Index = () => {
  const router = useRouter();
  const navigation = useNavigation();
  const [email, setEmail] = useState("aaronbaon1@gmail.com");
  const [password, setPassword] = useState("2003-07-10");
  const [rememberMe, setRememberMe] = useState(false);
  const [isCredentialsValid, setIsCredentialsValid] = useState(true);
  const [isEmailValid, setIsEmailValid] = useState(true);
  const [errorMessage, setErrorMessage] = useState("")
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);

  const togglePasswordVisibility = () => {
    setIsPasswordVisible(!isPasswordVisible);
  };

  const handleLogin = async () => {
    router.push("/(drawer)");

    // try {

    //   if(validator.isEmail(email)){
    //     setIsEmailValid(true)
    //     const responseStatus = await login(email, password);
    //     if(responseStatus === 200){
    //       router.push("/(drawer)");
    //     }else if(responseStatus === 401){
    //       setErrorMessage("Invalid Credentials")
    //       setPassword("")
    //       setIsCredentialsValid(false);
    //     }

    //   }else{
    //     setErrorMessage("Invalid Email Address")
    //     setIsEmailValid(false);
    //   }

    // } catch (error) {
    //   console.error("Login failed:", error);
    // }
  };

  useFocusEffect(() => {
    navigation.setOptions({
      headerShown: false,
    });
  });

  return (
    <KeyboardAvoidingView
      behavior="padding"
      style={{ flex: 1, justifyContent: "center" }}
    >
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
            <Text
              style={
                isEmailValid && isCredentialsValid
                  ? { opacity: 0 }
                  : { opacity: 100 }
              }
            >
              {errorMessage}
            </Text>
          </View>

          <View style={{ rowGap: 14 }}>
            <View
              style={[
                styles.inputContainer,
                isCredentialsValid && isEmailValid
                  ? { borderColor: "transparent" }
                  : { borderColor: "#FF0000" },
              ]}
            >
              <MaterialIcons name="person" size={24} color="#808080" />
              <TextInput
                placeholder="Email"
                value={email}
                onChangeText={(value) => {
                  setEmail(value);
                }}
                autoCapitalize="none"
                autoCorrect={false}
                style={{ width: "100%" }}
              />
            </View>

            <View
              style={[
                styles.inputContainer,
                isCredentialsValid
                  ? { borderColor: "transparent" }
                  : { borderColor: "#FF0000" },
              ]}
            >
              <MaterialIcons name="lock" size={24} color="#808080" />
              <TextInput
                placeholder="Password"
                secureTextEntry={!isPasswordVisible}
                value={password}
                onChangeText={setPassword}
                style={{ width: "70%" }}
              />
              <TouchableOpacity onPress={togglePasswordVisibility}>
                {isPasswordVisible ? (
                  <Ionicons name="eye" size={24} color="#808080" />
                ) : (
                  <Ionicons name="eye-off" size={24} color="#808080" />
                )}
              </TouchableOpacity>
            </View>

            <View style={styles.row}>
              <View style={styles.checkboxContainer}>
                <CheckBox
                  size={20}
                  checked={rememberMe}
                  onPress={() => setRememberMe(!rememberMe)}
                  containerStyle={styles.checkbox}
                />
                <Text>Remember me</Text>
              </View>
              <TouchableOpacity
                onPress={() =>
                  router.push({
                    pathname: "/auth",
                    params: { from: "forgot" },
                  })
                }
              >
                <Text style={styles.forgotText}>Forgot Password?</Text>
              </TouchableOpacity>
            </View>
            <TouchableOpacity style={styles.button} onPress={handleLogin}>
              <Text
                style={{
                  textAlign: "center",
                  color: "#fff",
                  fontSize: 18,
                  fontWeight: "bold",
                }}
              >
                Login
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </View>
  </View>
</KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  first: {
    padding: 20,
    marginTop:30,
    backgroundColor: "#4d83e4",
    top: 140,
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
    paddingVertical:60
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
    borderWidth: 1
  },
  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    margin: 15,
  },
  checkboxContainer: {
    left: -5,
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 0,
  },
  checkbox: {
    padding: 0,
    margin: 0,
    marginRight: 5,
    backgroundColor: "#fff",
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
    marginTop: 0,
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
    marginBottom: 50,
  },
  upper: {
    backgroundColor: "#2264dc",
  },
});

export default memo(Index);
