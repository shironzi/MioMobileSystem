import React, { memo } from "react";
import { StyleSheet, Text, View } from "react-native";

const loadingCard = () => {
	return (
		<View>
			<Text>hello</Text>
		</View>
	);
};

const styles = StyleSheet.create({});

export default memo(loadingCard);
