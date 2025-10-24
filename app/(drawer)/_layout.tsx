import AntDesign from "@expo/vector-icons/AntDesign";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import {
  DrawerContentComponentProps,
  DrawerContentScrollView,
  DrawerItem,
} from "@react-navigation/drawer";
import { useFocusEffect, useNavigation } from "expo-router";
import { Drawer } from "expo-router/drawer";
import { useCallback, useEffect, useState } from "react";
import { Image, StyleSheet, Text, View } from "react-native";
import { StackActions } from "@react-navigation/native";
import { FontAwesome } from "@expo/vector-icons";
import { getProfile } from "@/utils/query";
import messaging from "@react-native-firebase/messaging";
import { logout } from "@/utils/auth";
import * as SecureStore from "expo-secure-store";

interface CustomDrawerContentProps extends DrawerContentComponentProps {
  children?: React.ReactNode;
}

const CustomDrawerContent: React.FC<CustomDrawerContentProps> = (props) => {
  const navigation = useNavigation();

  const [userData, setUserData] = useState<{
    id: string;
    name: string | null;
  } | null>(null);
  const [profile, setProfile] = useState<{
    biography: string;
    name: string;
    photo_url: string;
    role: string;
  }>();

  useEffect(() => {
    const setSideBarDetails = async () => {
      const name: string = (await SecureStore.getItemAsync("name")) ?? "";
      const id: string = (await SecureStore.getItemAsync("id")) ?? "";

      setUserData({ id: id, name: name });
    };

    setSideBarDetails();

    const fetchProfile = async () => {
      const res = await getProfile();
      setProfile({
        name: res.name,
        biography: res.biography,
        photo_url: res.photo_url,
        role: res.role,
      });
    };

    fetchProfile();

    const unsubscribeFCM = messaging().onMessage(async (remoteMessage) => {
      if (remoteMessage.data?.type === "profile_update") {
        console.log("Received profile update");
        await fetchProfile();
      }
    });

    return () => {
      unsubscribeFCM();
    };
  }, []);

  const handleLogout = useCallback(async () => {
    const res = await logout();

    if (res.success) {
      rootNav?.dispatch(StackActions.replace("index"));
      props.navigation.closeDrawer();
    }
  }, [props.navigation]);

  useFocusEffect(
    useCallback(() => {
      navigation.setOptions({
        headerShown: false,
      });
      return () => {};
    }, [navigation]),
  );

  const rootNav = props.navigation.getParent();

  return (
    <DrawerContentScrollView {...props} style={styles.drawerContent}>
      <View style={styles.profileContainer}>
        <View
          style={{
            borderWidth: 3,
            borderRadius: 360,
            borderColor: "#fff",
            padding: 2.5,
          }}
        >
          <Image
            source={
              profile?.photo_url
                ? { uri: profile?.photo_url }
                : require("@/assets/images/default_profile.png")
            }
            style={{
              width: 70,
              height: 70,
              resizeMode: "contain",
              borderRadius: 360,
            }}
          />
        </View>
        <View>
          <Text style={styles.userName}>{profile?.name}</Text>
          <Text style={styles.userId}>{userData?.id}</Text>
        </View>
      </View>

      <DrawerItem
        label="Profile"
        labelStyle={styles.drawerItemLabel}
        onPress={() => {
          props.navigation.navigate("profile", {
            biography: profile?.biography,
            name: profile?.name,
            photo_url: profile?.photo_url,
          });
          props.navigation.closeDrawer();
        }}
        icon={() => <MaterialIcons name="person" size={30} color="#fff" />}
        style={styles.drawerItem}
      />
      {/*<DrawerItem*/}
      {/*  label="Calendar"*/}
      {/*  labelStyle={styles.drawerItemLabel}*/}
      {/*  onPress={() => {*/}
      {/*    props.navigation.navigate("calendar");*/}
      {/*    props.navigation.closeDrawer();*/}
      {/*  }}*/}
      {/*  icon={() => <AntDesign name="calendar" size={30} color="#fff" />}*/}
      {/*  style={styles.drawerItem}*/}
      {/*/>*/}
      {/*<DrawerItem*/}
      {/*  label="Help & Support"*/}
      {/*  labelStyle={styles.drawerItemLabel}*/}
      {/*  onPress={() => {*/}
      {/*    props.navigation.navigate("help");*/}
      {/*    props.navigation.closeDrawer();*/}
      {/*  }}*/}
      {/*  icon={() => (*/}
      {/*    <MaterialCommunityIcons name="help-circle" size={30} color="white" />*/}
      {/*  )}*/}
      {/*  style={styles.drawerItem}*/}
      {/*/>*/}
      {(profile?.role === "teacher" || profile?.role === "parent") && (
        <DrawerItem
          label="Data Analytics"
          labelStyle={styles.drawerItemLabel}
          onPress={() => {
            profile?.role === "teacher"
              ? props.navigation.navigate("analytics/Analytics")
              : props.navigation.navigate("analytics/StudentAnalytics", {
                  role: profile.role,
                });
            props.navigation.closeDrawer();
          }}
          icon={() => <FontAwesome name="pie-chart" size={24} color="#fff" />}
          style={styles.drawerItem}
        />
      )}
      <DrawerItem
        label="Logout"
        labelStyle={styles.drawerItemLabel}
        onPress={handleLogout}
        icon={() => <AntDesign name="logout" size={30} color="white" />}
        style={styles.drawerItem}
      />
    </DrawerContentScrollView>
  );
};

export default function Layout() {
  return (
    <Drawer
      drawerContent={(props) => <CustomDrawerContent {...props} />}
      screenOptions={{ headerShown: false }}
    />
  );
}

const styles = StyleSheet.create({
  drawerContent: {
    backgroundColor: "#2264DC",
    alignContent: "center",
    padding: "auto",
    paddingTop: 106,
  },
  profileContainer: {
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-evenly",
    margin: "auto",
    columnGap: 15,
    marginBottom: 50,
  },
  profileImage: {
    borderRadius: 180,
    borderWidth: 3,
    borderColor: "#fff",
    width: 80,
    height: 80,
  },
  userName: {
    fontSize: 16,
    fontWeight: "500",
    color: "#fff",
  },
  userId: {
    fontSize: 14,
    fontWeight: "300",
    color: "#fff",
    textAlign: "left",
  },
  drawerItem: {
    width: "70%",
    margin: "auto",
  },
  drawerItemLabel: {
    color: "#fff",
  },
});
