import { DrawerContentScrollView, DrawerItem } from "@react-navigation/drawer";
import { Drawer } from "expo-router/drawer";
import { DrawerContentComponentProps } from "@react-navigation/drawer";
import { Image, Text, View } from "react-native";
import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons";

import AntDesign from "@expo/vector-icons/AntDesign";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";

import globalStyle from "@/styles/globalStyle";
import { router } from "expo-router";

interface CustomDrawerContentProps extends DrawerContentComponentProps {
  children?: React.ReactNode;
}

const CustomDrawerContent: React.FC<CustomDrawerContentProps> = (props) => {
  return (
    <DrawerContentScrollView
      {...props}
      style={{
        ...globalStyle.primaryBg,
        alignContent: "center",
        padding: "auto",
        paddingTop: 106,
      }}
    >
      <View
        style={{
          display: "flex",
          flexDirection: "row",
          alignItems: "center",
          justifyContent: "space-evenly",
          margin: "auto",
          columnGap: 15,
          marginBottom: 50,
        }}
      >
        <Image
          source={{
            uri: "https://scontent.fcrk3-3.fna.fbcdn.net/v/t39.30808-6/453753078_3841543359397752_1250767487900252619_n.jpg?_nc_cat=100&ccb=1-7&_nc_sid=6ee11a&_nc_eui2=AeEno1FjlnSmpa43ISrhtDhsXPEaLFlSVnRc8RosWVJWdJAWTFBJGpYMiKZi0OuoxTp2Vj_9dAreqKKDt3pgxddV&_nc_ohc=76n1KV2pTvQQ7kNvgHFfngz&_nc_oc=AdhqK6Go57yQsn3kFArBeo2XmGBHQ7r_Ggg_FQ7KiA9ctSlCtCdTcQU7on3eVuQeI_0&_nc_zt=23&_nc_ht=scontent.fcrk3-3.fna&_nc_gid=AVjH3czmHKYSSI8SETaRQ0y&oh=00_AYAhPi0iT8JxzhXgwR_q3Ave3PuYaN4agNBF_chLxIeoCg&oe=67B67C07",
          }}
          width={80}
          height={80}
          style={{
            borderRadius: 180,
          }}
        />
        <Text style={{ fontSize: 16, fontWeight: "500", color: "#fff" }}>
          Aaron Josh Baon
        </Text>
      </View>
      <DrawerItem
        label={"Profile"}
        labelStyle={{ color: "#fff" }}
        onPress={() => {
          props.navigation.navigate("profile");
          props.navigation.closeDrawer();
        }}
        icon={() => <MaterialIcons name="person" size={30} color="#fff" />}
        style={{ width: "60%", margin: "auto" }}
      />
      <DrawerItem
        label={"Calendar"}
        labelStyle={{ color: "#fff" }}
        onPress={() => {
          props.navigation.navigate("calendar");
          props.navigation.closeDrawer();
        }}
        icon={() => <AntDesign name="calendar" size={30} color="#fff" />}
        style={{ width: "60%", margin: "auto" }}
      />
      <DrawerItem
        label={"Help & Support"}
        labelStyle={{ color: "#fff" }}
        onPress={() => {
          props.navigation.navigate("calendar");
          props.navigation.closeDrawer();
        }}
        icon={() => (
          <MaterialCommunityIcons name="help-circle" size={30} color="white" />
        )}
        style={{ width: "60%", margin: "auto" }}
      />
      <DrawerItem
        label={"Logout"}
        labelStyle={{ color: "#fff" }}
        onPress={() => {
          props.navigation.navigate("calendar");
          props.navigation.closeDrawer();
        }}
        icon={() => <AntDesign name="logout" size={30} color="white" />}
        style={{ width: "60%", margin: "auto" }}
      />
    </DrawerContentScrollView>
  );
};

export default function Layout() {
  return (
    <Drawer
      drawerContent={(props) => (
        <CustomDrawerContent {...props}></CustomDrawerContent>
      )}
      screenOptions={{ headerShown: false }}
    >
      <Drawer.Screen name="Profile" options={{ headerShown: true }} />
      <Drawer.Screen name="Calendar" options={{ headerShown: true }} />
    </Drawer>
  );
}
