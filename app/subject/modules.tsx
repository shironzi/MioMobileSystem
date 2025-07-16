import ModuleCard from "@/components/ModuleCard";
import LoadingCard from "@/components/loadingCard";
import HeaderConfig from "@/utils/HeaderConfig";
import { useAuthGuard } from "@/utils/useAuthGuard";
import { router, useLocalSearchParams } from "expo-router";
import React, { memo, useEffect, useState } from "react";
import {
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { getModules } from "@/utils/modules";
import Ionicons from "@expo/vector-icons/Ionicons";

interface Module {
  id: string;
  title: string;
  description: string;
  visible: boolean;
}

const ModulesScreen = () => {
  const { subjectId, role } = useLocalSearchParams<{
    subjectId: string;
    role: string;
  }>();

  const [moduleList, setModuleList] = useState<Module[]>([]);
  const [assignments, setAssignments] = useState<
    { id: string; title: string }[]
  >([]);
  const [loading, setLoading] = useState(true);

  HeaderConfig("Modules");

  const handleAddModule = () => {
    const encodedModules = encodeURIComponent(JSON.stringify(moduleList)) ?? [];
    const encodedAssignments =
      encodeURIComponent(JSON.stringify(assignments)) ?? [];
    router.push({
      pathname: "/subject/(sub-details)/Modules/AddModules",
      params: {
        modules: encodedModules,
        assignments: encodedAssignments,
        subjectId: subjectId,
      },
    });
  };

  useEffect(() => {
    if (!subjectId) return;

    const fetch = async () => {
      try {
        const response = await getModules(subjectId);
        setModuleList(response.modules);
        setAssignments(response.assignments);
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
      {role === "teacher" && (
        <TouchableOpacity style={styles.addButton} onPress={handleAddModule}>
          <View
            style={{
              top: 20,
              alignSelf: "center",
              flexDirection: "row",
            }}
          >
            <Ionicons name="add-circle" size={20} color="#ffbf18" />
            <Text style={styles.addText}>Add Module</Text>
          </View>
        </TouchableOpacity>
      )}
      <ScrollView showsVerticalScrollIndicator={false}>
        {moduleList.length > 0 ? (
          moduleList.map((item, index) => (
            <ModuleCard
              key={index}
              index={index}
              id={item.id}
              title={item.title}
              visible={item.visible}
              description={item.description}
              subjectId={subjectId}
            />
          ))
        ) : (
          <View>
            <Text>This Subject has no modules yet.</Text>
          </View>
        )}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 10,
    backgroundColor: "#fff",
    height: "100%",
  },
  addButton: {
    left: -28,
    width: "98%",
    backgroundColor: "#fcefcc",
    borderColor: "#ffbf18",
    borderWidth: 2,
    borderRadius: 20,
    borderStyle: "dashed",
    margin: 30,
    marginBottom: 20,
    height: 60,
    marginVertical: 5,
  },
  addText: {
    color: "#ffbf18",
    fontWeight: 500,
    marginHorizontal: 10,
  },
});

export default memo(ModulesScreen);
