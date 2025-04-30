import { DrawerContentScrollView, DrawerItem } from "@react-navigation/drawer";
import { Drawer } from "expo-router/drawer";
import { DrawerContentComponentProps } from "@react-navigation/drawer";
import { Image, Text, View, StyleSheet } from "react-native";
import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons";
import AntDesign from "@expo/vector-icons/AntDesign";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import globalStyle from "@/styles/globalStyle";
import { useFocusEffect, useNavigation } from "expo-router";
import { useCallback } from "react";
import { StackActions } from "@react-navigation/native";
interface CustomDrawerContentProps extends DrawerContentComponentProps {
  children?: React.ReactNode;
}

const CustomDrawerContent: React.FC<CustomDrawerContentProps> = (props) => {
  const navigation = useNavigation();

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
        <Image
          source={{
            uri: "https://scontent.fmnl30-2.fna.fbcdn.net/v/t39.30808-6/473547042_2064844093944288_35658282325017136_n.jpg?_nc_cat=109&ccb=1-7&_nc_sid=a5f93a&_nc_eui2=AeFb9Md8FoOgmLR21SVbpZvb2nz24s_aBHnafPbiz9oEeUJy40_mCUDnVSIpvwNAzNbGRSbeIy-YvhITNAT868U1&_nc_ohc=1nP6U0eCltgQ7kNvgFDIvhV&_nc_oc=AdhJNEvp15SOaPWvx9C1wsVVQeoKjq__CYlM_rJtmfNLTtwKUXln_1oHh4tae2eOAvQ&_nc_zt=23&_nc_ht=scontent.fmnl30-2.fna&_nc_gid=AIzWrGR0qsIgFV1cFXXXY9K&oh=00_AYD_2BoGL3MIWaVoLP_CcnMbbnZcX3gchnonXpdyqLZPsw&oe=67B76D5B",
          }}
          style={styles.profileImage}
        />
        <View>
          <Text style={styles.userName}>Ava Samantha Arce</Text>
          <Text style={styles.userId}>SI0001</Text>
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
        onPress={() => {
          rootNav?.dispatch(StackActions.replace("index"));
          props.navigation.closeDrawer();
        }}
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
