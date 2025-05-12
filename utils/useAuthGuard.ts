import { useEffect } from "react";
import { useNavigation } from "expo-router";
import { StackActions } from "@react-navigation/native";
import * as SecureStore from "expo-secure-store";

export function useAuthGuard(shouldLogout: boolean) {
    const navigation = useNavigation();
    const rootNav = navigation.getParent();

    useEffect(() => {
        if (!shouldLogout) return;

        (async () => {
            await SecureStore.deleteItemAsync("sessionData");
            rootNav?.dispatch(StackActions.replace("index"));
        })();
    }, [shouldLogout, rootNav]);
}
