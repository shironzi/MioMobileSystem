import type { AxiosError } from "axios";
import { useRouter } from "expo-router";
import * as SecureStore from "expo-secure-store";
import { useEffect } from "react";

export function useAuthGuard(error?: unknown) {
  const router = useRouter();

  useEffect(() => {
    if (!error) return;

    const status = (error as AxiosError)?.response?.status;

    if (status === 401 || status === 403) {
      (async () => {
        await SecureStore.deleteItemAsync("sessionData");
        router.replace("/");
      })();
    }
  }, [error, router]);
}
