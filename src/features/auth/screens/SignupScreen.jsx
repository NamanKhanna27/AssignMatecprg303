import { useState } from "react";
import { View, Text, TextInput, TouchableOpacity, StyleSheet } from "react-native";

import { createUserWithEmailAndPassword, signOut } from "firebase/auth";
import { doc, setDoc, serverTimestamp } from "firebase/firestore";

import { auth, db } from "../../../services/firebase/firebase";
import { useAuthFlow } from "../authFlow/AuthFlowContext";

import { normalizeEmail, isValidEmail, validatePassword } from "../../../shared/utils/validation";
import { getAuthErrorMessage, getFirestoreErrorMessage } from "../../../shared/utils/errorMessages";
import { useAppDialog } from "../../../shared/components/AppDialog/AppDialogContext";

/*
  SignupScreen responsibilities:
  - Validate fields locally (email format, password rules, confirm match)
  - Create Firebase Auth account
  - Create Firestore user profile document
  - Enforce course-required flow: Signup -> Login -> Main (by signing out after creating account)
*/
export default function SignupScreen({ navigation }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [loading, setLoading] = useState(false);
  const [name, setName] = useState("");              

  const { setLockAuthFlow } = useAuthFlow();
  const { showDialog } = useAppDialog();

  const handleSignup = async () => {
    const cleanEmail = normalizeEmail(email);

    if (!cleanEmail || !password || !confirm) {
      showDialog({
        title: "Missing information",
        message: "Please fill in all fields before creating an account.",
        variant: "error",
      });
      return;
    }

    if (!isValidEmail(cleanEmail)) {
      showDialog({
        title: "Invalid email",
        message: "Please enter a valid email address.",
        variant: "error",
      });
      return;
    }

    const pwError = validatePassword(password);
    if (pwError) {
      showDialog({
        title: "Invalid password",
        message: pwError,
        variant: "error",
      });
      return;
    }

    if (password !== confirm) {
      showDialog({
        title: "Passwords do not match",
        message: "Please make sure both password fields are identical.",
        variant: "error",
      });
      return;
    }

    try {
      setLoading(true);
      setLockAuthFlow(true);

      const cred = await createUserWithEmailAndPassword(auth, cleanEmail, password);

      try {
        // await setDoc(doc(db, "users", cred.user.uid), {
        //   email: cred.user.email,
        //   createdAt: serverTimestamp(),
        // });

        await setDoc(doc(db, "users", cred.user.uid), {
        fullName: name,
        email: cred.user.email,
        bio: "",
        createdAt: serverTimestamp(),
        });

      } catch (fireErr) {
        // Keep the app in a consistent state if profile creation fails
        await signOut(auth);

        const code = fireErr?.code || "unknown";
        showDialog({
          title: "Profile setup failed",
          message: getFirestoreErrorMessage(code),
          variant: "error",
          onClose: () => {
            navigation.reset({ index: 0, routes: [{ name: "Login" }] });
          },
        });
        return;
      }

      await signOut(auth);

      showDialog({
        title: "Account created",
        message: "Your account has been created successfully. Please log in to continue.",
        variant: "success",
        onClose: () => {
          navigation.reset({ index: 0, routes: [{ name: "Login" }] });
        },
      });
    } catch (err) {
      const code = err?.code || "unknown";
      showDialog({
        title: "Signup failed",
        message: getAuthErrorMessage(code),
        variant: "error",
      });
    } finally {
      setLoading(false);
      setLockAuthFlow(false);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Create Account</Text>

    <TextInput
      style={styles.input}
      placeholder="Full Name"
      placeholderTextColor="#666"
      value={name}
      onChangeText={setName}
    />   
    {/* =============================== */}


      <TextInput
        style={styles.input}
        placeholder="Email"
        placeholderTextColor="#666"
        autoCapitalize="none"
        keyboardType="email-address"
        value={email}
        onChangeText={setEmail}
      />

      <TextInput
        style={styles.input}
        placeholder="Password"
        placeholderTextColor="#666"
        secureTextEntry
        value={password}
        onChangeText={setPassword}
      />

      <TextInput
        style={styles.input}
        placeholder="Confirm Password"
        placeholderTextColor="#666"
        secureTextEntry
        value={confirm}
        onChangeText={setConfirm}
      />

      <TouchableOpacity
        style={[styles.btn, loading && { opacity: 0.7 }]}
        onPress={handleSignup}
        disabled={loading}
      >
        <Text style={styles.btnText}>{loading ? "Creating..." : "Sign Up"}</Text>
      </TouchableOpacity>

      <TouchableOpacity onPress={() => navigation.replace("Login")}>
        <Text style={styles.link}>Already have an account? Login</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, justifyContent: "center", backgroundColor: "#fff" },
  title: { fontSize: 28, fontWeight: "bold", textAlign: "center", marginBottom: 25 },
  input: { borderWidth: 1, padding: 12, borderRadius: 10, marginBottom: 15, borderColor: "#ccc" },
  btn: { backgroundColor: "#4f46e5", padding: 15, borderRadius: 10, alignItems: "center", marginBottom: 15 },
  btnText: { color: "#fff", fontSize: 18, fontWeight: "600" },
  link: { textAlign: "center", color: "#4f46e5" },
});