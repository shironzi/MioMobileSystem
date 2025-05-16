import {
  View,
  Text,
  TextInput,
  StyleSheet,
  TouchableOpacity,
  Image,
  KeyboardAvoidingView
} from "react-native";
import React, { useState, memo, useCallback } from "react";
import {
  useFocusEffect,
  useNavigation,
  useLocalSearchParams,
  useRouter,
} from "expo-router";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";

const email = "202210920@fit.edu.ph";

const auth = () => {
  const router = useRouter();
  const navigation = useNavigation();
  const [newCode, setNewCode] = useState("");
  const { from: source } = useLocalSearchParams();

  useFocusEffect(() => {
    navigation.setOptions({
      headerShown: false,
    });
  });

  const handleConfirm = useCallback(() => {
    if (source === "forgot") {
      router.back();
    } else if (source === "login") {
      router.push("/(drawer)");
    } else {
      router.push("index");
    }
  }, [source, router]);

  return (
    <KeyboardAvoidingView
      style={{ flex: 1, justifyContent: "center" }}
      behavior="padding">
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
              <Text style={{ left: 20, color: "#666" }}>{email}</Text>
            </View>
            <Text
              style={{
                left: 20,
                fontSize: 16,
                fontWeight: "500",
                marginBottom: 5,
              }}
            >
              Enter Code
            </Text>
            <Text
              style={{
                left: 20,
                fontSize: 14,
                marginBottom: 15,
                marginRight: 30,
                lineHeight: 20,
              }}
            >
              Enter the code sent to your email to change your password
            </Text>

            <View style={{ rowGap: 14 }}>
              <View style={styles.inputContainer}>
                <MaterialIcons name="pin" size={30} color="#bbb" />
                <TextInput
                  placeholder="Code"
                  keyboardType="number-pad"
                  value={newCode}
                  onChangeText={setNewCode}
                  maxLength={6}
                  inputMode="numeric"
                  style={{ width: "100%" }}
                />
              </View>
              <TouchableOpacity style={styles.button} onPress={handleConfirm}>
                <Text
                  style={{
                    textAlign: "center",
                    color: "#fff",
                    fontSize: 18,
                    fontWeight: "bold",
                  }}
                >
                  Confirm
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
    marginTop:60,
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

export default memo(auth);
