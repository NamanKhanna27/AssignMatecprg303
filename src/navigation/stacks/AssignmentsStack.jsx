import { createNativeStackNavigator } from "@react-navigation/native-stack";
import AssignmentsScreen from "../../features/assignments/screens/AssignmentsScreen";
import BackButton from "../../shared/components/BackButton";

const Stack = createNativeStackNavigator();

export default function AssignmentsStack() {
  return (
    <Stack.Navigator
      screenOptions={{
        headerTitleAlign: "center",
      }}
    >
      <Stack.Screen
        name="AssignmentsMain"
        component={AssignmentsScreen}
        options={({ navigation }) => ({
          title: "Assignments",
          headerLeft: () => <BackButton navigation={navigation} />,
        })}
      />
    </Stack.Navigator>
  );
}
