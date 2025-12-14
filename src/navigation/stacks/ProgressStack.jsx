import { createNativeStackNavigator } from "@react-navigation/native-stack";
import ProgressScreen from "../../features/progress/screens/ProgressScreen";
import BackButton from "../../shared/components/BackButton";

const Stack = createNativeStackNavigator();

export default function ProgressStack({ navigation }) {
  return (
    <Stack.Navigator
      screenOptions={{
        headerLeft: () => <BackButton navigation={navigation} />,
        headerTitleAlign: "center",
      }}
    >
      <Stack.Screen
        name="ProgressMain"
        component={ProgressScreen}
        options={{ title: "Progress" }}
      />
    </Stack.Navigator>
  );
}
