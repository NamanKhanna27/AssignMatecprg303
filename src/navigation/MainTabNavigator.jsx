// src/navigation/MainTabNavigator.jsx
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { Ionicons, MaterialIcons, Feather } from "@expo/vector-icons";

import HomeStack from "./stacks/HomeStack";
import AssignmentsStack from "./stacks/AssignmentsStack";
import AddStack from "./stacks/AddStack";
import ProgressStack from "./stacks/ProgressStack";
import ProfileStack from "./stacks/ProfileStack";

const Tab = createBottomTabNavigator();

export default function MainTabNavigator({ setIsLoggedIn }) {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerShown: false,

        // Icon function
        tabBarIcon: ({ focused, color, size }) => {
          if (route.name === "Home") {
            return <Ionicons name={focused ? "home" : "home-outline"} size={22} color={color} />;
          }

          if (route.name === "Assignments") {
            return (
              <MaterialIcons
                name="assignment"
                size={22}
                color={color}
              />
            );
          }

          if (route.name === "Add Assignment") {
            return <Ionicons name="add-circle-outline" size={26} color={color} />;
          }

          if (route.name === "Progress") {
            return <Feather name="bar-chart-2" size={22} color={color} />;
          }

          if (route.name === "Profile") {
            return <Ionicons name={focused ? "person" : "person-outline"} size={22} color={color} />;
          }
        },

        tabBarActiveTintColor: "#4f46e5", // blue
        tabBarInactiveTintColor: "gray",
        tabBarStyle: {
          height: 60,
          paddingBottom: 6,
          paddingTop: 6,
        },
        tabBarLabelStyle: {
          fontSize: 12,
        },
      })}
    >
      <Tab.Screen name="Home" component={HomeStack} />
      <Tab.Screen name="Assignments" component={AssignmentsStack} />
      <Tab.Screen name="Add Assignment" component={AddStack} />
      <Tab.Screen name="Progress" component={ProgressStack} />
      <Tab.Screen name="Profile">
        {(props) => <ProfileStack {...props} setIsLoggedIn={setIsLoggedIn} />}
      </Tab.Screen>
    </Tab.Navigator>
  );
}
