import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { useEffect, useState } from "react";
import { auth, db } from "../../../services/firebase/firebase";
import { doc, getDoc, collection, onSnapshot } from "firebase/firestore";

export default function HomeScreen({ navigation }) {
  const [userName, setUserName] = useState("User"); // displayed name
  const [progressPercent, setProgressPercent] = useState(0); // progress bar %

  useEffect(() => {
    const loadUser = async () => {
      try {
        const ref = doc(db, "users", auth.currentUser.uid);
        const snap = await getDoc(ref);

        // load user full name
        if (snap.exists()) {
          setUserName(snap.data().fullName || "User");
        }
      } catch (err) {
        console.log("Home user load error:", err);
      }
    };

    loadUser();
  }, []);

  useEffect(() => {
    // listen to assignment changes in real time
    const ref = collection(db, "users", auth.currentUser.uid, "assignments");

    const unsubscribe = onSnapshot(ref, (snapshot) => {
      const list = snapshot.docs.map((d) => ({ id: d.id, ...d.data() }));

      const total = list.length;
      const completed = list.filter((a) => a.status === "completed").length;

      // calculate progress %
      const progress = total === 0 ? 0 : (completed / total) * 100;
      setProgressPercent(progress);
    });

    return unsubscribe; // cleanup listener
  }, []);

  return (
    <View style={styles.container}>
      <Text style={styles.greeting}>Hello, {userName} 👋</Text>
      <Text style={styles.subtitle}>Welcome back to AssignMate</Text>

      {/* card showing today's info and progress */}
      <View style={styles.infoCard}>
        <Text style={styles.infoTitle}>Today</Text>

        <Text style={styles.infoDate}>{new Date().toDateString()}</Text>

        <Text style={styles.infoMotivation}>
          Stay on track! You've got this 💪
        </Text>

        {/* progress bar */}
        <View style={styles.progressBarContainer}>
          <View
            style={[
              styles.progressFill,
              { width: `${progressPercent}%` },
            ]}
          />
        </View>

        <Text style={styles.infoSmallText}>
          Your overall completion progress
        </Text>
      </View>

      {/* navigation buttons */}
      <TouchableOpacity
        style={styles.mainButton}
        onPress={() => navigation.navigate("Assignments")}
      >
        <Text style={styles.mainButtonText}>View Assignments</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.mainButton}
        onPress={() => navigation.navigate("Add Assignment")}
      >
        <Text style={styles.mainButtonText}>Add New Assignment</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.mainButton}
        onPress={() => navigation.navigate("Profile")}
      >
        <Text style={styles.mainButtonText}>Profile</Text>
      </TouchableOpacity>

      <View style={{ height: 40 }} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 24,
    backgroundColor: "#fff",
  },

  greeting: {
    fontSize: 28,
    fontWeight: "bold",
    marginTop: 10,
    color: "#4f46e5",
  },
  subtitle: {
    fontSize: 15,
    color: "#555",
    marginBottom: 20,
  },

  infoCard: {
    marginBottom: 25,
    padding: 18,
    backgroundColor: "#f4f5ff",
    borderRadius: 14,
    borderWidth: 1,
    borderColor: "#e0e2ff",
  },
  infoTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: "#4f46e5",
    marginBottom: 6,
  },
  infoDate: {
    fontSize: 15,
    color: "#555",
    marginBottom: 4,
  },
  infoMotivation: {
    fontSize: 15,
    color: "#4f46e5",
    fontWeight: "600",
    marginBottom: 12,
  },

  progressBarContainer: {
    width: "100%",
    height: 10,
    backgroundColor: "#e3e5ff",
    borderRadius: 10,
    marginBottom: 6,
  },
  progressFill: {
    height: "100%",
    backgroundColor: "#4f46e5",
    borderRadius: 10,
  },
  infoSmallText: {
    fontSize: 13,
    color: "#777",
  },

  mainButton: {
    backgroundColor: "#4f46e5",
    padding: 15,
    borderRadius: 12,
    marginBottom: 15,
  },
  mainButtonText: {
    color: "#fff",
    fontSize: 18,
    textAlign: "center",
    fontWeight: "600",
  },
});
