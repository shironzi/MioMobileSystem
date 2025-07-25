import {
  View,
  Text,
  TextInput,
  StyleSheet,
  TouchableOpacity,
  TouchableWithoutFeedback,
  Keyboard,
} from "react-native";
import React, { useState, memo } from "react";
import {
  useFocusEffect,
  useLocalSearchParams,
  useNavigation,
  useRouter,
} from "expo-router";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import { VerifyOtpCode } from "@/utils/auth";

const LoginOtp = () => {
  const { message } = useLocalSearchParams<{ message: string }>();

  const router = useRouter();
  const navigation = useNavigation();
  const [otp_code, setOtp_code] = useState<string>("");
  const [otpStatus, setOtpStatus] = useState<boolean>(true);
  const [otpMessage, setOtpMessage] = useState<string>("");
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

  const handleVerification = async () => {
    setIsSubmitting(true);
    const res = await VerifyOtpCode(parseInt(otp_code));

    if (res.status) {
      router.replace("/(drawer)/(tabs)");
    } else {
      setOtpStatus(false);
      setOtpMessage(res.message);
    }
    setIsSubmitting(false);
  };

  useFocusEffect(() => {
    navigation.setOptions({
      headerShown: false,
    });
  });

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
      <View style={styles.upper}>
        <View style={styles.first}>
          <View style={styles.second}>
            <View style={styles.container}>
              <View style={{ marginTop: 125 }}>
                <Text style={styles.header}>Welcome Back!</Text>
                <Text style={styles.sub}>Log in to your account</Text>
              </View>
              <View style={styles.row}>
                <TouchableOpacity
                  onPress={() => router.back()}
                  style={{
                    flexDirection: "row",
                    alignItems: "center",
                    columnGap: 10,
                  }}
                >
                  <MaterialIcons name="arrow-back" size={20} color={"#00"} />
                  <Text style={{ color: "#00" }}>Go back</Text>
                </TouchableOpacity>
              </View>
              {otpStatus ? (
                <View>
                  <Text
                    style={{
                      left: 20,
                      fontSize: 14,
                      width: "90%",
                      backgroundColor: "#eee",
                      paddingHorizontal: 20,
                      paddingVertical: 10,
                      borderRadius: 20,
                      borderWidth: 1,
                      borderColor: "#aaa",
                    }}
                  >
                    {message ??
                      "Your 6-digit OTP code has been successfully sent to your email address."}
                  </Text>
                </View>
              ) : (
                <View>
                  <Text
                    style={{
                      left: 20,
                      fontSize: 14,
                      width: "90%",
                      backgroundColor: "#eee",
                      paddingHorizontal: 20,
                      paddingVertical: 10,
                      borderRadius: 20,
                      borderWidth: 1,
                      borderColor: "#aaa",
                    }}
                  >
                    {otpMessage ?? "Invalid OTP code. Please try again."}
                  </Text>
                </View>
              )}
              <View style={{ rowGap: 14 }}>
                <View style={styles.inputContainer}>
                  <MaterialIcons name="email" size={24} color="#808080" />
                  <TextInput
                    placeholder="Enter 6 digits OTP code"
                    value={otp_code}
                    onChangeText={(text) => {
                      if (/^[0-9]*$/.test(text) && text.length <= 6) {
                        setOtp_code(text);
                      }
                    }}
                    keyboardType="numeric"
                    maxLength={6}
                    style={{ width: "100%" }}
                  />
                </View>
                <TouchableOpacity
                  style={styles.button}
                  onPress={handleVerification}
                  disabled={isSubmitting}
                >
                  <Text
                    style={{
                      textAlign: "center",
                      color: "#fff",
                      fontSize: 18,
                      fontWeight: "bold",
                    }}
                  >
                    {isSubmitting ? "Verifying..." : "Verify"}
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

export default memo(LoginOtp);
