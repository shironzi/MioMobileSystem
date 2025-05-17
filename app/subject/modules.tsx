import {
  View,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Text,
} from "react-native";
import React, { memo, useEffect, useState } from "react";
import ModuleCard from "@/components/ModuleCard";
import HeaderConfig from "@/utils/HeaderConfig";
import { useLocalSearchParams, useRouter } from "expo-router";
import MaterialIcon from "@expo/vector-icons/MaterialIcons";
import { getModules } from "@/utils/query";
import { useAuthGuard } from "@/utils/useAuthGuard";

type Module = {
  title: string;
  description: string;
};

const ModulesScreen = () => {
  const router = useRouter();
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
        // console.error("Error fetching modules:", err);
      } finally {
        setLoading(false);
      }
    };

    fetch();
  }, [subjectId]);

  if (loading) {
    return (
      <View>
        <Text>Loading modules…</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <ScrollView>
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
      <TouchableOpacity
        style={styles.addButton}
        onPress={() => {
          // router.push("helpDetails")
          console.log("modules")
        }}
      >
        <MaterialIcon name="add" size={30} color="#fff" />
      </TouchableOpacity>
    </View>
  );
};

export default memo(ModulesScreen);

const styles = StyleSheet.create({
  container: {
    height: "100%",
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
