import ModuleCard from "@/components/ModuleCard";
import LoadingCard from "@/components/loadingCard";
import HeaderConfig from "@/utils/HeaderConfig";
import { getModules } from "@/utils/query";
import { useAuthGuard } from "@/utils/useAuthGuard";
import { useLocalSearchParams } from "expo-router";
import React, { memo, useEffect, useState } from "react";
import { ScrollView, StyleSheet, Text, View } from "react-native";

type Module = {
	title: string;
	description: string;
};

const ModulesScreen = () => {
	const { subjectId } = useLocalSearchParams<{ subjectId: string }>();

	const [moduleList, setModuleList] = useState<Module[]>([]);
	const [loading, setLoading] = useState(true);

	HeaderConfig("Modules");

	useEffect(() => {
		if (!subjectId) return;

		const fetch = async () => {
			try {
				const response = await getModules(subjectId);
				setModuleList(response.modules);
				setLoading(false);
			} catch (err) {
				useAuthGuard(err);
			} finally {
				setLoading(false);
			}
		};

		fetch();
	}, [subjectId]);

	if (loading) {
		return (
			<View
				style={{
					flex: 1,
					justifyContent: "center",
					alignItems: "center",
					backgroundColor: "#fff",
				}}
			>
				<LoadingCard></LoadingCard>
			</View>
		);
	}

	return (
		<View style={styles.container}>
			<ScrollView showsVerticalScrollIndicator={false}>
				{moduleList.length > 0 ? (
					moduleList.map((item, index) => (
						<ModuleCard key={index} title={item.title} index={index} />
					))
				) : (
					<View>
						<Text>This Subject has no modules yet.</Text>
					</View>
				)}
			</ScrollView>
			{/* <TouchableOpacity
				style={styles.addButton}
				onPress={() => {
					// router.push("helpDetails")
					console.log("modules");
				}}
			>
				<MaterialIcon name="add" size={30} color="#fff" />
			</TouchableOpacity> */}
		</View>
	);
};

const styles = StyleSheet.create({
	container: {
		flex: 1,
		padding: 10,
		backgroundColor: "#fff",
	},
	addButton: {
		position: "absolute",
		bottom: 20,
		right: 20,
		backgroundColor: "#2264DC",
		height: 60,
		width: 60,
		borderRadius: 30,
		justifyContent: "center",
		alignItems: "center",
		elevation: 5,
	},
});

export default memo(ModulesScreen);
