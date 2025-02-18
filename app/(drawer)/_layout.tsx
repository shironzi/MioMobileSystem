import { DrawerContentScrollView, DrawerItem } from "@react-navigation/drawer";
import { Drawer } from "expo-router/drawer";
import { DrawerContentComponentProps } from "@react-navigation/drawer";
import { Image, Text, View } from "react-native";
import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons";

import AntDesign from "@expo/vector-icons/AntDesign";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";

import globalStyle from "@/styles/globalStyle";

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
            uri: "https://scontent.fmnl30-2.fna.fbcdn.net/v/t39.30808-6/473547042_2064844093944288_35658282325017136_n.jpg?_nc_cat=109&ccb=1-7&_nc_sid=a5f93a&_nc_eui2=AeFb9Md8FoOgmLR21SVbpZvb2nz24s_aBHnafPbiz9oEeUJy40_mCUDnVSIpvwNAzNbGRSbeIy-YvhITNAT868U1&_nc_ohc=1nP6U0eCltgQ7kNvgFDIvhV&_nc_oc=AdhJNEvp15SOaPWvx9C1wsVVQeoKjq__CYlM_rJtmfNLTtwKUXln_1oHh4tae2eOAvQ&_nc_zt=23&_nc_ht=scontent.fmnl30-2.fna&_nc_gid=AIzWrGR0qsIgFV1cFXXXY9K&oh=00_AYD_2BoGL3MIWaVoLP_CcnMbbnZcX3gchnonXpdyqLZPsw&oe=67B76D5B",
          }}
          width={80}
          height={80}
          style={{
            borderRadius: 180,
            borderWidth: 3,
            borderColor: "#fff",
          }}
        />
        <View>
          <Text style={{ fontSize: 16, fontWeight: "500", color: "#fff" }}>
            Ava Samantha Arce
          </Text>
          <Text
            style={{
              fontSize: 14,
              fontWeight: "300",
              color: "#fff",
              textAlign: "left",
            }}
          >
            SI0001
          </Text>
        </View>
      </View>

      <DrawerItem
        label={"Profile"}
        labelStyle={{ color: "#fff" }}
        onPress={() => {
          props.navigation.navigate("profile");
          props.navigation.closeDrawer();
        }}
        icon={() => <MaterialIcons name="person" size={30} color="#fff" />}
        style={{ width: "70%", margin: "auto" }}
      />
      <DrawerItem
        label={"Calendar"}
        labelStyle={{ color: "#fff" }}
        onPress={() => {
          props.navigation.navigate("calendar");
          props.navigation.closeDrawer();
        }}
        icon={() => <AntDesign name="calendar" size={30} color="#fff" />}
        style={{ width: "70%", margin: "auto" }}
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
        style={{ width: "70%", margin: "auto" }}
      />
      <DrawerItem
        label={"Logout"}
        labelStyle={{ color: "#fff" }}
        onPress={() => {
          props.navigation.navigate("calendar");
          props.navigation.closeDrawer();
        }}
        icon={() => <AntDesign name="logout" size={30} color="white" />}
        style={{ width: "70%", margin: "auto" }}
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
      {/* <Drawer.Screen name="Profile" options={{ headerShown: true }} />
      <Drawer.Screen name="Calendar" options={{ headerShown: true }} /> */}
    </Drawer>
  );
}
