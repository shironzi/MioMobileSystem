import login from "@/utils/auth";
import Ionicons from "@expo/vector-icons/Ionicons";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import { yupResolver } from "@hookform/resolvers/yup";
import { useFocusEffect, useNavigation, useRouter } from "expo-router";
import React, { memo, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import {
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

  const {
    control,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<FormData>({
    defaultValues: {
      email: "joshbaon1@gmail.com",
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
    <View style={styles.upper}>
      <View style={styles.first}>
        <View style={styles.second}>
          <View style={styles.container}>
            <Text style={styles.header}>Welcome Back!</Text>
            <Text style={styles.sub}>Log in to your account</Text>
            {!!errorMessage && (
              <Text
                style={{ color: "red", textAlign: "center", marginBottom: 10 }}
              >
                {errorMessage}
              </Text>
            )}

            <View style={{ rowGap: 14 }}>
              {/* Email */}
              <Controller
                control={control}
                name="email"
                render={({ field: { value, onChange } }) => (
                  <>
                    <View
                      style={[
                        styles.inputContainer,
                        errors.email && { borderColor: "#FF0000" },
                      ]}
                    >
                      <MaterialIcons name="person" size={24} color="#808080" />
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

              {/* Password */}
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
                      <MaterialIcons name="lock" size={24} color="#808080" />
                      <TextInput
                        placeholder="Password"
                        secureTextEntry={!isPasswordVisible}
                        value={value}
                        onChangeText={onChange}
                        style={{ width: "77%" }}
                      />
                      <TouchableOpacity onPress={togglePasswordVisibility}>
                        <Ionicons
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

              {/* Actions */}
              <View style={styles.row}>
                <Text>Remember me</Text>
                <TouchableOpacity onPress={() => console.log("forgot")}>
                  <Text style={styles.forgotText}>Forgot Password?</Text>
                </TouchableOpacity>
              </View>

              {/* Submit */}
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
    margin: 15,
    borderRadius: 20,
    elevation: 2,
    borderWidth: 1,
    borderColor: "transparent",
  },
  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    margin: 15,
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
    padding: 15,
  },
  buttonText: {
    textAlign: "center",
    color: "#fff",
    fontSize: 18,
    fontWeight: "bold",
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
