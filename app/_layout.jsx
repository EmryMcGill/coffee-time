import { supabase } from "@/lib/supabase";
import { useFonts } from "expo-font";
import { Stack, useRouter } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { useEffect } from "react";
import "react-native-reanimated";
import { AuthProvider, useAuth } from "../contexts/AuthContext";
import { getUserById } from "../services/userService";

const MainLayout = () => {
  const { setAuth } = useAuth();
  const router = useRouter();

  useEffect(() => {
    supabase.auth.onAuthStateChange((_event, session) => {
      if (session) {
        updateUserData(session?.user?.id);
        router.replace("(tabs)");
      } else {
        router.replace("/welcome");
      }
    });
  }, []);

  const updateUserData = async (id) => {
    const res = await getUserById(id);
    if (res.success) setAuth(res.data);
  };

  return (
    <>
      <Stack
        screenOptions={{
          headerShown: false,
        }}
      >
        <Stack.Screen name="index" />
        <Stack.Screen name="welcome" />
        <Stack.Screen name="login" />
        <Stack.Screen name="signup" />
        <Stack.Screen name="+not-found" />
        <Stack.Screen name="(tabs)" />
        <Stack.Screen
          name="createBrew"
          options={{
            presentation: "modal",
          }}
        />
        <Stack.Screen
          name="addFriends"
          options={{
            presentation: "modal",
          }}
        />
      </Stack>
      <StatusBar style="auto" />
    </>
  );
};

export default function RootLayout() {
  const [loaded] = useFonts({
    SpaceMono: require("../assets/fonts/SpaceMono-Regular.ttf"),
  });

  if (!loaded) {
    // Async font loading only occurs in development.
    return null;
  }

  return (
    <AuthProvider>
      <MainLayout />
    </AuthProvider>
  );
}
