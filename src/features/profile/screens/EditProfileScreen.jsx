import { useEffect, useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
} from "react-native";
import { auth, db } from "../../../services/firebase/firebase";
import { doc, getDoc, updateDoc } from "firebase/firestore";
import { updateEmail } from "firebase/auth";
import { useAppDialog } from "../../../shared/components/AppDialog/AppDialogContext";

export default function EditProfileScreen({ navigation }) {
  const { showDialog } = useAppDialog();

  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [bio, setBio] = useState("");
  const [initialEmail, setInitialEmail] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      try {
        const ref = doc(db, "users", auth.currentUser.uid);
        const snap = await getDoc(ref);

        if (snap.exists()) {
          const data = snap.data();
          setFullName(data.fullName || "");
          setEmail(data.email || auth.currentUser.email);
          setInitialEmail(data.email || auth.currentUser.email);
          setBio(data.bio || "");
        }
      } catch (err) {
        console.log("LOAD ERROR:", err);
      }
      setLoading(false);
    };
    load();
  }, []);

  const saveChanges = async () => {
    try {
      const uid = auth.currentUser.uid;
      const userRef = doc(db, "users", uid);

      if (email.trim() !== initialEmail.trim()) {
        await updateEmail(auth.currentUser, email.trim());
      }

      await updateDoc(userRef, {
        fullName: fullName.trim(),
        email: email.trim(),
        bio: bio.trim(),
      });

      showDialog({
        title: "Profile Updated",
        message: "Your profile has been successfully updated.",
        variant: "success",
      });

      navigation.goBack();
    } catch (err) {
      console.log("SAVE ERROR:", err);
      showDialog({
        title: "Update Failed",
        message:
          err.code === "auth/requires-recent-login"
            ? "Please log in again to change your email."
            : err.message,
        variant: "error",
      });
    }
  };

  if (loading) {
    return (
      <Text style={{ marginTop: 80, textAlign: "center" }}>Loading...</Text>
    );
  }

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>Edit Profile</Text>

      <Text style={styles.label}>Full Name</Text>
      <TextInput
        value={fullName}
        onChangeText={setFullName}
        style={styles.input}
        placeholder="Enter full name"
      />

      <Text style={styles.label}>Email</Text>
      <TextInput
        value={email}
        onChangeText={setEmail}
        style={styles.input}
        autoCapitalize="none"
        keyboardType="email-address"
        placeholder="Enter new email"
      />

      <Text style={styles.label}>Bio</Text>
      <TextInput
        value={bio}
        onChangeText={setBio}
        style={[styles.input, styles.bioInput]}
        multiline
        placeholder="Write something about yourself..."
      />

      <View style={styles.infoCard}>
        <Text style={styles.infoTitle}>Profile Tips</Text>
        <Text style={styles.infoText}>
          • Adding a bio helps personalize your profile.
        </Text>
        <Text style={styles.infoText}>
          • Your email is used for account login and notifications.
        </Text>
        <Text style={styles.infoText}>
          • Your name is visible throughout the app.
        </Text>
      </View>

      <TouchableOpacity style={styles.btn} onPress={saveChanges}>
        <Text style={styles.btnText}>Save Changes</Text>
      </TouchableOpacity>

      <View style={{ height: 40 }} />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, backgroundColor: "#fff" },

  title: {
    fontSize: 28,
    fontWeight: "bold",
    marginBottom: 25,
    textAlign: "center",
    color: "#4f46e5",
  },

  label: {
    marginTop: 10,
    marginBottom: 6,
    fontWeight: "600",
    color: "#333",
    fontSize: 14,
  },

  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    padding: 12,
    borderRadius: 10,
    backgroundColor: "#fafafa",
    fontSize: 16,
  },

  bioInput: {
    height: 100,
    textAlignVertical: "top",
  },

  infoCard: {
    marginTop: 20,
    padding: 15,
    borderRadius: 12,
    backgroundColor: "#f3f4ff",
    borderColor: "#dcdcff",
    borderWidth: 1,
  },

  infoTitle: {
    fontWeight: "700",
    fontSize: 16,
    marginBottom: 8,
    color: "#4f46e5",
  },

  infoText: {
    fontSize: 14,
    color: "#555",
    marginBottom: 4,
  },

  btn: {
    backgroundColor: "#4f46e5",
    padding: 15,
    borderRadius: 10,
    alignItems: "center",
    marginTop: 25,
  },

  btnText: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "700",
  },
});
