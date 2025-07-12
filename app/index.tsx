import login, { requestOtp } from "@/utils/auth";
import Ionicons from "@expo/vector-icons/Ionicons";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import { yupResolver } from "@hookform/resolvers/yup";
import { getAuth } from "@react-native-firebase/auth";
import { useFocusEffect, useNavigation, useRouter } from "expo-router";
import * as SecureStore from "expo-secure-store";
import React, { memo, useEffect, useState } from "react";
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
      .trim()
      .email("Invalid email address")
      .required("Email is required"),
    password: yup
      .string()
      .trim()
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
  const [onboardingIndex, setOnboardingIndex] = useState(0);

  const {
    control,
    handleSubmit,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm<FormData>({
    resolver: yupResolver(schema),
  });

  const onboardingData = [
    {
      img: require("@/assets/onboard/logo-1-mio.png"),
      title: "Let’s Start Learning!",
      description:
        "Learning becomes easier and clearer with lessons and activities designed to support deaf students and their teachers.",
      image: require("@/assets/onboard/mobile-onboard-1.png"),
    },
    {
      img: require("@/assets/onboard/logo-1-mio.png"),
      title: "Learn at Your Pace",
      description:
        "Access lessons and exercises anytime. Follow clear instructions and work through activities at a speed that feels right for you.",
      image: require("@/assets/onboard/mobile-onboard-2.png"),
    },
    {
      img: require("@/assets/onboard/logo-1-mio.png"),
      title: "Made for You",
      description:
        "Here in MIÓ, everything stays organized and easy to use—helping you focus on learning and teaching.",
      image: require("@/assets/onboard/mobile-onboard-3.png"),
    },
  ];

  const handleNext = () => {
    if (onboardingIndex < onboardingData.length - 1) {
      setOnboardingIndex((prev) => prev + 1);
    } else {
      setOnboardingIndex(-1);
    }
  };

  const togglePasswordVisibility = () => setIsPasswordVisible((v) => !v);

  const onSubmit = async (data: FormData) => {
    setErrorMessage("");
    try {
      const emailAdress = data.email.trim();
      const userPassword = data.password.trim();

      const res = await login(emailAdress, userPassword);
      console.log(res);
      if (res.status === "success") {
        if (rememberMe) {
          await SecureStore.setItemAsync(`emailAddress`, emailAdress);
          await SecureStore.setItemAsync(`password`, userPassword);
        }

        const request = await requestOtp();
        console.log(request);
        if (request) {
          router.push({
            pathname: "/(login)/LoginOtp",
            params: { message: request.message },
          });
        }
      } else {
        setErrorMessage("Login failed. Please try again.");
      }
    } catch (e: any) {
      setErrorMessage("Failed to log in. Please check your credentials.");
    }
  };

  const handleForgotPass = () => {
    router.push("/(login)/ForgotPassword");
  };

  useEffect(() => {
    const checkStoredCredentials = async () => {
      const storedEmail = await SecureStore.getItemAsync("emailAddress");
      const storedPassword = await SecureStore.getItemAsync("password");

      if (storedEmail && storedPassword) {
        setValue("email", storedEmail);
        setValue("password", storedPassword);
        setRememberMe(true);
      }
    };

    checkStoredCredentials();
    const user = getAuth().currentUser;

    if (user) {
      router.replace("/(drawer)/(tabs)");
    }
  }, []);

  useFocusEffect(() => {
    navigation.setOptions({ headerShown: false });
  });

  if (onboardingIndex >= 0) {
    const current = onboardingData[onboardingIndex];
    return (
      <SafeAreaView
        style={{ flex: 1, justifyContent: "center", backgroundColor: "#fff" }}
      >
        <View style={{ alignItems: "center", padding: 20 }}>
          <Image
            source={require("@/assets/onboard/logo-1-mio.png")}
            style={{
              width: 110,
              height: 100,
              resizeMode: "contain",
              top: 20,
              alignSelf: "center",
              left: -5,
            }}
          />
          <Image
            source={current.image}
            style={{ width: 400, height: 400, resizeMode: "contain" }}
          />
          <Text
            style={{
              fontSize: 22,
              fontWeight: "bold",
              marginVertical: 10,
              top: -65,
            }}
          >
            {current.title}
          </Text>
          <Text
            style={{
              textAlign: "center",
              marginVertical: 15,
              lineHeight: 25,
              marginHorizontal: 20,
              top: -70,
            }}
          >
            {current.description}
          </Text>
          <View
            style={{
              width: "50%",
              height: 8,
              backgroundColor: "#eee",
              borderRadius: 5,
              marginBottom: 20,
              top: -50,
              alignSelf: "center",
            }}
          >
            <View
              style={{
                height: "100%",
                width: `${
                  ((onboardingIndex + 1) / onboardingData.length) * 100
                }%`,
                backgroundColor: "#2264dc",
                borderRadius: 5,
              }}
            />
          </View>
          <TouchableOpacity
            onPress={handleNext}
            style={{
              backgroundColor: "#ffbf18",
              padding: 15,
              borderRadius: 50,
              width: "70%",
              alignItems: "center",
              bottom: 30,
              marginBottom: 30,
              elevation: 5,
            }}
          >
            <Text style={{ color: "#fff", fontWeight: "bold", fontSize: 18 }}>
              {onboardingIndex === onboardingData.length - 1
                ? "Get Started"
                : "Next"}
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => setOnboardingIndex(-1)}
            style={{ top: -60 }}
          >
            <Text style={{ marginTop: 15, color: "#808080", fontSize: 15 }}>
              Skip
            </Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "#fff" }}>
      <KeyboardAvoidingView
        style={{ backgroundColor: "#fff" }}
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        keyboardVerticalOffset={Platform.OS === "ios" ? 20 : 0}
      >
        <ScrollView
          contentContainerStyle={{
            flexGrow: 1,
            justifyContent: "center",
          }}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          <View style={styles.upper}>
            <Image
              source={require("@/assets/onboard/logo-2-mio.png")}
              style={{
                width: 200,
                height: 70,
                alignSelf: "center",
                top: 110,
              }}
            />
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
                  <View style={{ marginTop: -80 }}>
                    <Controller
                      control={control}
                      name="email"
                      render={({ field: { value, onChange } }) => (
                        <>
                          <View
                            style={[
                              styles.inputContainer,
                              errors.email && { borderColor: "#FF0000" },
                              { marginBottom: 0 },
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
                              style={{ width: "100%", color: "#000000" }}
                              placeholderTextColor="#000000"
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
                              { marginTop: 25 },
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
                              style={{ width: "77%", color: "#000000" }}
                              placeholderTextColor="#000000"
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
                            <Text
                              style={{
                                color: "red",
                                marginLeft: 25,
                                marginTop: -15,
                              }}
                            >
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
                      <TouchableOpacity onPress={handleForgotPass}>
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
    borderTopStartRadius: 300,
    borderTopEndRadius: 300,
    top: 0,
    left: -115,
    width: "160%",
    marginTop: 170,
  },
  second: {
    padding: 60,
    backgroundColor: "#fff",
    top: 15,
    borderTopStartRadius: 300,
    borderTopEndRadius: 300,
    width: "100%",
    paddingBottom: 30,
  },
  container: {
    padding: 40,
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
    top: 80,
  },
  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    margin: 15,
    top: 83,
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
    top: 80,
  },
  buttonText: {
    textAlign: "center",
    color: "#fff",
    fontSize: 18,
    fontWeight: "bold",
  },
  header: {
    top: 30,
    marginTop: -50,
    color: "#2264dc",
    fontSize: 28,
    fontWeight: "bold",
    margin: 15,
    letterSpacing: 1.5,
  },
  sub: {
    top: 30,
    marginLeft: 20,
    fontSize: 15,
    marginTop: -10,
    marginBottom: 50,
  },
  upper: {
    backgroundColor: "#2264dc",
    marginBottom: -10,
  },
  logo: {
    width: 80,
    height: 60,
    alignSelf: "flex-end",
    left: -5,
    top: -80,
  },
});

export default memo(Index);
