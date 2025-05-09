import { DrawerContentScrollView, DrawerItem } from "@react-navigation/drawer";
import { Drawer } from "expo-router/drawer";
import { DrawerContentComponentProps } from "@react-navigation/drawer";
import { Image, Text, View, StyleSheet } from "react-native";
import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons";
import AntDesign from "@expo/vector-icons/AntDesign";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import globalStyle from "@/styles/globalStyle";
import { useFocusEffect, useNavigation } from "expo-router";
import {useCallback, useEffect, useState} from "react";
import { StackActions } from "@react-navigation/native";
import * as SecureStore from 'expo-secure-store';

import { logout } from "@/utils/auth";
interface CustomDrawerContentProps extends DrawerContentComponentProps {
  children?: React.ReactNode;
}

const CustomDrawerContent: React.FC<CustomDrawerContentProps> = (props) => {
  const navigation = useNavigation();

  const [userData, setUserData] = useState({
      id: 202210920,
      name: "Ava Samantha Arce",
  })

    useEffect(() => {
        const getUserData = async () => {
            const storedSessionData = await SecureStore.getItemAsync('sessionData')

            if(storedSessionData){
                const data = await JSON.parse(storedSessionData)
                setUserData({ name: data.name, id: data.userId})
            }
        }
        getUserData();
    }, []);

  const handleLogout = useCallback(async () => {
    try {
      const response = await logout();
      console.log("Logout successful:", response);
      rootNav?.dispatch(StackActions.replace("index"));
      props.navigation.closeDrawer();
    } catch (error) {
      console.error("Logout failed:", error);
    }
  }, []);

  useFocusEffect(
    useCallback(() => {
      navigation.setOptions({
        headerShown: false,
      });
      return () => {};
    }, [navigation])
  );

  const rootNav = props.navigation.getParent();

  return (
    <DrawerContentScrollView {...props} style={styles.drawerContent}>
      <View style={styles.profileContainer}>
       <Image style={styles.profileImage} source={require("@/assets/1.png")}></Image>
        <View>
          <Text style={styles.userName}>{userData.name}</Text>
          <Text style={styles.userId}>{userData.id}</Text>
        </View>
      </View>

      <DrawerItem
        label="Profile"
        labelStyle={styles.drawerItemLabel}
        onPress={() => {
          props.navigation.navigate("profile");
          props.navigation.closeDrawer();
        }}
        icon={() => <MaterialIcons name="person" size={30} color="#fff" />}
        style={styles.drawerItem}
      />
      <DrawerItem
        label="Calendar"
        labelStyle={styles.drawerItemLabel}
        onPress={() => {
          props.navigation.navigate("calendar");
          props.navigation.closeDrawer();
        }}
        icon={() => <AntDesign name="calendar" size={30} color="#fff" />}
        style={styles.drawerItem}
      />
      <DrawerItem
        label="Help & Support"
        labelStyle={styles.drawerItemLabel}
        onPress={() => {
          props.navigation.navigate("help");
          props.navigation.closeDrawer();
        }}
        icon={() => (
          <MaterialCommunityIcons name="help-circle" size={30} color="white" />
        )}
        style={styles.drawerItem}
      />
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
    ...globalStyle.primaryBg,
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
