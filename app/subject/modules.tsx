import ModuleCard from "@/components/ModuleCard";
import LoadingCard from "@/components/loadingCard";
import HeaderConfig from "@/utils/HeaderConfig";
import { router, useFocusEffect, useLocalSearchParams } from "expo-router";
import React, { memo, useCallback, useState } from "react";
import {
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { getModules } from "@/utils/modules";
import Ionicons from "@expo/vector-icons/Ionicons";
import globalStyles from "@/styles/globalStyles";

interface Module {
  id: string;
  title: string;
  description: string;
  visible: boolean;
  remedial_module?: boolean;
}

interface Assignment {
  id: string;
  title: string;
}

interface Specialized {
  id: string;
  title: string;
  difficulty: string;
}

const ModulesScreen = () => {
  const { subjectId, role } = useLocalSearchParams<{
    subjectId: string;
    role: string;
  }>();

  const [moduleList, setModuleList] = useState<Module[]>([]);
  const [remedialList, setRemedialList] = useState<Module[]>([]);
  const [assignments, setAssignments] = useState<Assignment[]>([]);
  const [specialized, setSpecialized] = useState<Specialized[]>([]);
  const [loading, setLoading] = useState(true);

  HeaderConfig("Modules");

  const handleAddModule = () => {
    const encodedModules = encodeURIComponent(JSON.stringify(moduleList)) ?? [];
    const encodedAssignments =
      encodeURIComponent(JSON.stringify(assignments)) ?? [];
    const encodedSpecialized =
      encodeURIComponent(JSON.stringify(specialized)) ?? [];
    router.push({
      pathname: "/subject/(sub-details)/Modules/AddModules",
      params: {
        modules: encodedModules,
        assignments: encodedAssignments,
        specialized: encodedSpecialized,
        subjectId: subjectId,
      },
    });
  };

  // const handleAddRemedial = () => {
  //   const encodedModules = encodeURIComponent(JSON.stringify(moduleList)) ?? [];
  //   const encodedAssignments =
  //     encodeURIComponent(JSON.stringify(assignments)) ?? [];
  //   router.push({
  //     pathname: "/subject/(sub-details)/Modules/AddRemedial",
  //     params: {
  //       modules: encodedModules,
  //       assignments: encodedAssignments,
  //       subjectId: subjectId,
  //     },
  //   });
  // };

  useFocusEffect(
    useCallback(() => {
      if (!subjectId) return;

      const fetch = async () => {
        const res = await getModules(subjectId);
        if (res.success) {
          setModuleList(res.modules);
          setRemedialList(res.remedials);
          setAssignments(res.assignments);
          setSpecialized(res.specialized);
        }
        setLoading(false);
      };

      fetch();
    }, [subjectId]),
  );

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
        <View>
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
          {/*<TouchableOpacity*/}
          {/*  style={styles.addButton}*/}
          {/*  onPress={handleAddRemedial}*/}
          {/*>*/}
          {/*  <View*/}
          {/*    style={{*/}
          {/*      top: 20,*/}
          {/*      alignSelf: "center",*/}
          {/*      flexDirection: "row",*/}
          {/*    }}*/}
          {/*  >*/}
          {/*    <Ionicons name="add-circle" size={20} color="#ffbf18" />*/}
          {/*    <Text style={styles.addText}>Add Remedial</Text>*/}
          {/*  </View>*/}
          {/*</TouchableOpacity>*/}
        </View>
      )}
      <ScrollView showsVerticalScrollIndicator={false}>
        {moduleList.length > 0 ? (
          <View>
            {moduleList.map((item, index) => (
              <ModuleCard
                key={index}
                index={index}
                id={item.id}
                title={item.title}
                visible={item.visible}
                description={item.description}
                subjectId={subjectId}
              />
            ))}

            {role === "teacher" && (
              <View style={{ marginVertical: 50 }}>
                <Text style={globalStyles.text1}>Remedials</Text>
                {remedialList.map((item, index) => (
                  <ModuleCard
                    key={index}
                    index={index}
                    id={item.id}
                    title={item.title}
                    visible={item.visible}
                    description={item.description}
                    subjectId={subjectId}
                    isRemedial={item.remedial_module}
                  />
                ))}
              </View>
            )}
          </View>
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
