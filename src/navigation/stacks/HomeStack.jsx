// src/navigation/stacks/HomeStack.jsx
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import HomeScreen from "../../features/home/screens/HomeScreen";

const Stack = createNativeStackNavigator();

export default function HomeStack() {
  return (
    <Stack.Navigator>
      <Stack.Screen
        name="HomeMain"
        component={HomeScreen}
        options={{ headerShown: true }}
      />
    </Stack.Navigator>
  );
}
