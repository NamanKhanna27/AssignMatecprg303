import { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
  ActivityIndicator,
  ScrollView,
} from "react-native";

import { auth, db } from "../../../services/firebase/firebase";
import { doc, getDoc } from "firebase/firestore";
import { useAppDialog } from "../../../shared/components/AppDialog/AppDialogContext";

// converts stored date string → readable format
function formatJoinDate(dateString) {
  try {
    const date = new Date(dateString);
    return date.toDateString();
  } catch {
    return dateString;
  }
}

export default function ProfileScreen({ navigation }) {
  const { showDialog } = useAppDialog();

  const [userData, setUserData] = useState(null); // firestore user data
  const [loading, setLoading] = useState(true);   // loading state

  const loadUser = async () => {
    try {
      // reference to Firestore user document
      const ref = doc(db, "users", auth.currentUser.uid);
      const snap = await getDoc(ref);

      if (snap.exists()) setUserData(snap.data());
    } catch (err) {
      console.log("PROFILE LOAD ERROR:", err);
      showDialog({
        title: "Error loading profile",
        message: "Could not fetch your profile information.",
        variant: "error",
      });
    }

    setLoading(false);
  };

  useEffect(() => {
    loadUser(); // load once when screen mounts

    // reload when screen refocuses
    const unsubscribe = navigation.addListener("focus", loadUser);
    return unsubscribe;
  }, [navigation]);

  const handleLogout = async () => {
    try {
      await auth.signOut(); // Firebase logout
    } catch (e) {
      showDialog({
        title: "Logout failed",
        message: e?.message ?? "Unknown error",
        variant: "error",
      });
    }
  };

  // loading state or missing data
  if (loading || !userData) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#4f46e5" />
        <Text style={styles.loadingText}>Loading profile...</Text>
      </View>
    );
  }

  const joinedDate = formatJoinDate(auth.currentUser.metadata.creationTime);

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      {/* avatar */}
      <Image
        source={{ uri: "https://i.pravatar.cc/300" }}
        style={styles.avatar}
      />

      {/* user info */}
      <Text style={styles.name}>{userData.fullName}</Text>
      <Text style={styles.email}>{userData.email}</Text>

      {/* buttons */}
      <TouchableOpacity
        style={styles.button}
        onPress={() => navigation.navigate("EditProfile")}
      >
        <Text style={styles.buttonText}>Edit Profile</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={[styles.button, styles.logoutButton]}
        onPress={handleLogout}
      >
        <Text style={[styles.buttonText, styles.logoutText]}>Logout</Text>
      </TouchableOpacity>

      {/* info card */}
      <View style={styles.infoCard}>
        <Text style={styles.sectionTitle}>About You</Text>

        {/* bio */}
        <Text style={styles.label}>Bio</Text>
        <Text style={styles.value}>
          {userData.bio?.trim() ? userData.bio : "No bio added yet."}
        </Text>

        {/* join date */}
        <Text style={[styles.label, { marginTop: 12 }]}>Joined App</Text>
        <Text style={styles.value}>{joinedDate}</Text>
      </View>

      <View style={{ height: 50 }} />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 25,
    backgroundColor: "#fff",
  },

  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },

  loadingText: {
    marginTop: 10,
    color: "#555",
    fontSize: 16,
  },

  avatar: {
    width: 110,
    height: 110,
    borderRadius: 100,
    alignSelf: "center",
    marginTop: 20,
    marginBottom: 15,
  },

  name: {
    fontSize: 26,
    fontWeight: "600",
    textAlign: "center",
    color: "#4f46e5",
  },

  email: {
    fontSize: 15,
    color: "#555",
    textAlign: "center",
    marginBottom: 25,
  },

  button: {
    width: "90%",
    alignSelf: "center",
    padding: 14,
    borderRadius: 10,
    backgroundColor: "#4f46e5",
    alignItems: "center",
    marginBottom: 12,
  },

  buttonText: {
    color: "#fff",
    fontSize: 17,
    fontWeight: "600",
  },

  logoutButton: {
    backgroundColor: "#fee2e2",
  },

  logoutText: {
    color: "#b91c1c",
  },

  infoCard: {
    marginTop: 25,
    padding: 18,
    backgroundColor: "#f3f4ff",
    borderRadius: 14,
    borderWidth: 1,
    borderColor: "#e0e7ff",
  },

  sectionTitle: {
    fontSize: 20,
    fontWeight: "700",
    color: "#4f46e5",
    marginBottom: 10,
  },

  label: {
    fontSize: 14,
    color: "#555",
    fontWeight: "600",
    marginTop: 4,
  },

  value: {
    fontSize: 15,
    marginTop: 4,
    color: "#333",
  },
});
