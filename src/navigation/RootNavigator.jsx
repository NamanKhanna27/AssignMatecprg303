// src/navigation/RootNavigator.jsx
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { useEffect, useState } from "react";
import { onAuthStateChanged } from "firebase/auth";

import { auth } from "../services/firebase/firebase";
import { useAuthFlow } from "../features/auth/authFlow/AuthFlowContext";

import LoginScreen from "../features/auth/screens/LoginScreen";
import SignupScreen from "../features/auth/screens/SignupScreen";
import MainTabNavigator from "./MainTabNavigator";

/*
  RootNavigator controls high-level routing:
  - When authenticated and auth flow is not locked, show the main tab navigator.
  - Otherwise, show the authentication stack (Login / Signup).
*/
const Stack = createNativeStackNavigator();

export default function RootNavigator() {
  const [user, setUser] = useState(null);
  const [booting, setBooting] = useState(true);
  const { lockAuthFlow } = useAuthFlow();

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, (u) => {
      setUser(u);
      setBooting(false);
    });
    return unsub;
  }, []);

  // During initial auth hydration, avoid flashing the wrong navigator.
  if (booting) return null;

  const showMain = !!user && !lockAuthFlow;

  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      {showMain ? (
        <Stack.Screen name="Main" component={MainTabNavigator} />
      ) : (
        <>
          <Stack.Screen name="Login" component={LoginScreen} />
          <Stack.Screen name="Signup" component={SignupScreen} />
        </>
      )}
    </Stack.Navigator>
  );
}
