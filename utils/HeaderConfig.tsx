import Feather from "@expo/vector-icons/Feather";
import { useFocusEffect, useNavigation } from "expo-router";
import React, { useCallback } from "react";
import { Image, TouchableOpacity } from "react-native";

export default function useHeaderConfig(title: string) {
	const navigation = useNavigation();

	useFocusEffect(
		useCallback(() => {
			navigation.setOptions({
				headerTitle: title,
				headerStyle: { backgroundColor: "#2264DC" },
				headerTintColor: "#fff",
				headerShown: true,

				headerLeft: () => (
					<TouchableOpacity
						style={{ paddingHorizontal: 14 }}
						onPress={() => {
							navigation.goBack();
						}}
					>
						<Feather name="arrow-left" size={24} color="#fff" />
					</TouchableOpacity>
				),

				headerRight: () => (
					<Image
						source={require("@/assets/onboard/logo-2-mio.png")}
						style={{ width: 60, height: 50, marginRight: 10 }}
						resizeMode="contain"
					/>
				),
			});
		}, [navigation, title])
	);
}
