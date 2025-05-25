import login from "@/utils/auth";
import Ionicons from "@expo/vector-icons/Ionicons";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import { yupResolver } from "@hookform/resolvers/yup";
import { useFocusEffect, useNavigation, useRouter } from "expo-router";
import React, { memo, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import {
  Image,
  KeyboardAvoidingView,
  Platform,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import * as yup from "yup";

type FormData = {
  email: string;
  password: string;
};

const schema = yup
  .object({
    email: yup
      .string()
      .email("Invalid email address")
      .required("Email is required"),
    password: yup
      .string()
      .min(6, "Password must be at least 6 characters")
      .required("Password is required"),
  })
  .required();

const Index = () => {
  const router = useRouter();
  const navigation = useNavigation();
  const [errorMessage, setErrorMessage] = useState("");
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);

  const {
    control,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<FormData>({
    defaultValues: {
      email: "202212079@fit.edu.ph",
      password: "2003-07-10",
    },
    resolver: yupResolver(schema),
  });

  const togglePasswordVisibility = () => setIsPasswordVisible((v) => !v);

  const onSubmit = async (data: FormData) => {
    setErrorMessage("");
    try {
      const res = await login(data.email, data.password);
      if (res.status === "success") {
        router.replace("/(drawer)/(tabs)");
      } else {
        setErrorMessage("Login failed. Please try again.");
      }
    } catch (e: any) {
      console.error("Login error:", e.message);
      setErrorMessage("Failed to log in. Please check your credentials.");
    }
  };

  useFocusEffect(() => {
    navigation.setOptions({ headerShown: false });
  });

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "#fff" }}>
      <KeyboardAvoidingView
        style={{ backgroundColor: "#fff" }}
        behavior={Platform.OS === "ios" ? "padding" : "height"}
      >
        <ScrollView
          contentContainerStyle={{
            flexGrow: 1,
            justifyContent: "center",
          }}
          keyboardShouldPersistTaps="handled"
        >
          <View style={styles.upper}>
            <View style={styles.first}>
              <View style={styles.second}>
                <View style={styles.container}>
                  <Text style={styles.header}>Welcome Back!</Text>
                  <Text style={styles.sub}>Log in to your account</Text>
                  {!!errorMessage && (
                    <Text
                      style={{
                        color: "red",
                        textAlign: "center",
                        marginBottom: 10,
                      }}
                    >
                      {errorMessage}
                    </Text>
                  )}
                  <View>
                    <Image
                      source={require("@/assets/logonew.png")}
                      style={styles.logo}
                    />
                  </View>

                  <View style={{ rowGap: 10, marginTop: -100 }}>
                    <Controller
                      control={control}
                      name="email"
                      render={({ field: { value, onChange } }) => (
                        <>
                          <View
                            style={[
                              { marginBottom: -5 },
                              styles.inputContainer,
                              errors.email && { borderColor: "#FF0000" },
                            ]}
                          >
                            <MaterialIcons
                              name="person"
                              size={24}
                              color="#808080"
                            />
                            <TextInput
                              placeholder="Email"
                              value={value}
                              onChangeText={onChange}
                              autoCapitalize="none"
                              autoCorrect={false}
                              style={{ width: "100%" }}
                            />
                          </View>
                          {errors.email && (
                            <Text style={{ color: "red", marginLeft: 25 }}>
                              {errors.email.message}
                            </Text>
                          )}
                        </>
                      )}
                    />

                    <Controller
                      control={control}
                      name="password"
                      render={({ field: { value, onChange } }) => (
                        <>
                          <View
                            style={[
                              styles.inputContainer,
                              errors.password && { borderColor: "#FF0000" },
                            ]}
                          >
                            <MaterialIcons
                              name="lock"
                              size={24}
                              color="#808080"
                            />
                            <TextInput
                              placeholder="Password"
                              secureTextEntry={!isPasswordVisible}
                              value={value}
                              onChangeText={onChange}
                              style={{ width: "77%" }}
                            />
                            <TouchableOpacity
                              onPress={togglePasswordVisibility}
                            >
                              <Ionicons
                                style={{ left: -5 }}
                                name={isPasswordVisible ? "eye" : "eye-off"}
                                size={24}
                                color="#808080"
                              />
                            </TouchableOpacity>
                          </View>
                          {errors.password && (
                            <Text style={{ color: "red", marginLeft: 25 }}>
                              {errors.password.message}
                            </Text>
                          )}
                        </>
                      )}
                    />

                    <View style={styles.row}>
                      <TouchableOpacity
                        style={{ flexDirection: "row", alignItems: "center" }}
                        onPress={() => setRememberMe((prev) => !prev)}
                      >
                        <View
                          style={{
                            height: 18,
                            width: 18,
                            borderRadius: 4,
                            borderWidth: 1,
                            borderColor: "#2264dc",
                            alignItems: "center",
                            justifyContent: "center",
                            marginRight: 12,
                            left: 5,
                            backgroundColor: rememberMe ? "#2264dc" : "#fff",
                          }}
                        >
                          {rememberMe && (
                            <Ionicons name="checkmark" size={16} color="#fff" />
                          )}
                        </View>
                        <Text>Remember me</Text>
                      </TouchableOpacity>
                      <TouchableOpacity onPress={() => console.log("forgot")}>
                        <Text style={styles.forgotText}>Forgot Password?</Text>
                      </TouchableOpacity>
                    </View>

                    <TouchableOpacity
                      style={styles.button}
                      onPress={handleSubmit(onSubmit)}
                      disabled={isSubmitting}
                    >
                      <Text style={styles.buttonText}>
                        {isSubmitting ? "Logging in..." : "Login"}
                      </Text>
                    </TouchableOpacity>
                  </View>
                </View>
              </View>
            </View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  first: {
    padding: 20,
    backgroundColor: "#2E73F2",
    top: 155,
    borderTopStartRadius: 300,
    borderTopEndRadius: 300,
    left: -115,
    width: "160%",
    marginTop: 20,
  },
  second: {
    padding: 60,
    backgroundColor: "#fff",
    top: 20,
    borderTopStartRadius: 300,
    borderTopEndRadius: 300,
    width: "100%",
  },
  container: {
    padding: 70,
    paddingHorizontal: 60,
    justifyContent: "center",
    margin: 10,
    left: -5,
  },
  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#f5f5f5",
    padding: 9,
    paddingLeft: 20,
    columnGap: 5,
    margin: 15,
    borderRadius: 20,
    elevation: 2,
    borderWidth: 1,
    borderColor: "transparent",
    top: -10,
  },
  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    margin: 15,
    top: -20,
  },
  forgotText: {
    textDecorationLine: "underline",
    fontStyle: "italic",
    color: "#2264dc",
  },
  button: {
    backgroundColor: "#ffbf18",
    borderRadius: 40,
    margin: 15,
    padding: 15,
    elevation: 5,
    top: -20,
  },
  buttonText: {
    textAlign: "center",
    color: "#fff",
    fontSize: 18,
    fontWeight: "bold",
  },
  header: {
    top: 40,
    marginTop: -50,
    color: "#2264dc",
    fontSize: 28,
    fontWeight: "bold",
    margin: 15,
    letterSpacing: 1.5,
  },
  sub: {
    top: 45,
    marginLeft: 20,
    fontSize: 15,
    marginTop: -10,
    marginBottom: 50,
  },
  upper: {
    backgroundColor: "#2264dc",
  },
  logo: {
    width: 115,
    height: 150,
    alignSelf: "flex-end",
    left: 50,
    top: -110,
  },
});

export default memo(Index);
