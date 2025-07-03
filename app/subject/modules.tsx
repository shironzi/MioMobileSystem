import ModuleCard from "@/components/ModuleCard";
import LoadingCard from "@/components/loadingCard";
import HeaderConfig from "@/utils/HeaderConfig";
import { useAuthGuard } from "@/utils/useAuthGuard";
import { useLocalSearchParams } from "expo-router";
import React, { memo, useEffect, useState } from "react";
import { ScrollView, StyleSheet, Text, View } from "react-native";
import { getModules } from "@/utils/modules";

type Module = {
  id: string;
  title: string;
  description: string;
  visible: boolean;
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

  // const [isRefreshing, setIsRefreshing] = useState(false);

  // const onRefresh = () => {
  //   setIsRefreshing(true);
  //   setTimeout(() => {
  //     setIsRefreshing(false);
  //   }, 2000);
  // };

  return (
    <View style={styles.container}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        // refreshControl={
        //   <RefreshControl refreshing={isRefreshing} onRefresh={onRefresh} />
        // }
      >
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
