import { createNativeStackNavigator } from "@react-navigation/native-stack";
import AddAssignmentScreen from "../../features/assignments/screens/AddAssignmentScreen";
import BackButton from "../../shared/components/BackButton";

const Stack = createNativeStackNavigator();

export default function AddStack() {
  return (
    <Stack.Navigator
      screenOptions={{
        headerTitleAlign: "center", // center header title
      }}
    >
      {/* add assignment screen */}
      <Stack.Screen
        name="AddAssignmentMain"
        component={AddAssignmentScreen}
        options={({ navigation }) => ({
          title: "Add Assignment",
          headerLeft: () => <BackButton navigation={navigation} />, // custom back button
        })}
      />
    </Stack.Navigator>
  );
}
