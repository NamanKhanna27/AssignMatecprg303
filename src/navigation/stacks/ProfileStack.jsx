import { createNativeStackNavigator } from "@react-navigation/native-stack";
import ProfileScreen from "../../features/profile/screens/ProfileScreen";
import EditProfileScreen from "../../features/profile/screens/EditProfileScreen";
import BackButton from "../../shared/components/BackButton";

const Stack = createNativeStackNavigator();

export default function ProfileStack({ setIsLoggedIn }) {
  return (
    <Stack.Navigator
      screenOptions={{
        headerTitleAlign: "center",
      }}
    >
      {/* main profile screen */}
      <Stack.Screen
        name="ProfileMain"
        options={({ navigation }) => ({
          title: "Profile",
          headerLeft: () => <BackButton navigation={navigation} />, // custom back button
        })}
      >
        {(props) => (
          <ProfileScreen {...props} setIsLoggedIn={setIsLoggedIn} />
        )}
      </Stack.Screen>

      {/* edit profile screen */}
      <Stack.Screen
        name="EditProfile"
        component={EditProfileScreen}
        options={({ navigation }) => ({
          title: "Edit Profile",
          headerLeft: () => <BackButton navigation={navigation} />,
        })}
      />
    </Stack.Navigator>
  );
}
