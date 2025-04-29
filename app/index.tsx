import { View, Text, TextInput, Button, StyleSheet } from "react-native";
import React, { useState } from "react";
import { useNavigation, useRouter } from "expo-router";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import FontAwesome from "@expo/vector-icons/FontAwesome";
// import { useNavigation } from "expo-router";

const Index = () => {
  const router = useRouter();
  const navigation = useNavigation();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  navigation.setOptions({
    headerShown: false,
  });

  return (
    <View style={{ padding: 20 }}>
      <Text>Logo Here</Text>

      <View>
        <Text>Welcome Back!</Text>
        <Text>Log in to your account</Text>
      </View>

      <View style={{ rowGap: 14 }}>
        <View style={styles.inputContainer}>
          <MaterialIcons name="person" size={24} color="#808080" />
          <TextInput
            placeholder="Username"
            value={username}
            onChangeText={setUsername}
          />
        </View>
        <View style={styles.inputContainer}>
          <MaterialIcons name="lock" size={24} color="#808080" />
          <TextInput
            placeholder="Password"
            secureTextEntry={true}
            value={password}
            onChangeText={setPassword}
          />
        </View>
        <View>
          <Text>Remember me</Text>
          <Text>Forgot Password?</Text>
        </View>
        <Button title="Login" onPress={() => router.push("/(drawer)")} />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#E9EDF0",
    padding: 9,
    columnGap: 17,
  },
});

export default Index;