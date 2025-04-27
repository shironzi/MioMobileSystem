import { View, Text, TextInput, Button, StyleSheet } from "react-native";
import React, { useState } from "react";
import { useRouter } from "expo-router";

const Index = () => {
  const router = useRouter();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  return (
    <View>
      <Text>Logo Here</Text>

      <View>
        <Text>Welcome Back!</Text>
        <Text>Log in to your account</Text>
      </View>

      <View>
        <TextInput
          placeholder="Username"
          value={username}
          onChangeText={setUsername}
        />
        <TextInput
          placeholder="Password"
          secureTextEntry={true}
          value={password}
          onChangeText={setPassword}
        />
        <View>
          <Text>Remember me</Text>
          <Text>Forgot Password?</Text>
        </View>
        <Button title="Login" onPress={() => router.push("/(drawer)")} />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({});

export default Index;
