import { useState } from "react";
import { View, Text, TextInput, TouchableOpacity, StyleSheet } from "react-native";
import { signInWithEmailAndPassword } from "firebase/auth";

import { auth } from "../../../services/firebase/firebase";
import { normalizeEmail, isValidEmail } from "../../../shared/utils/validation";
import { getAuthErrorMessage } from "../../../shared/utils/errorMessages";
import { useAppDialog } from "../../../shared/components/AppDialog/AppDialogContext";

export default function LoginScreen({ navigation }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const { showDialog } = useAppDialog();

  const handleLogin = async () => {
    const cleanEmail = normalizeEmail(email);  // clean + lowercase email

    // check empty fields
    if (!cleanEmail || !password) {
      showDialog({
        title: "Missing information",
        message: "Please enter your email and password to continue.",
        variant: "error",
      });
      return;
    }

    // basic email format check
    if (!isValidEmail(cleanEmail)) {
      showDialog({
        title: "Invalid email",
        message: "Please enter a valid email address.",
        variant: "error",
      });
      return;
    }

    try {
      setLoading(true);
      await signInWithEmailAndPassword(auth, cleanEmail, password);  // Firebase login
    } catch (err) {
      const code = err?.code || "unknown";

      // common login failures grouped together
      if (
        code === "auth/invalid-credential" ||
        code === "auth/user-not-found" ||
        code === "auth/wrong-password"
      ) {
        showDialog({
          title: "Login failed",
          message: "Email or password is incorrect. Please try again.",
          variant: "error",
        });
        return;
      }

      // fallback to detailed error mapping
      showDialog({
        title: "Login failed",
        message: getAuthErrorMessage(code),
        variant: "error",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>AssignMate</Text>

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

      <TouchableOpacity
        style={[styles.loginBtn, loading && { opacity: 0.7 }]}
        onPress={handleLogin}
        disabled={loading}
        activeOpacity={0.85}
      >
        <Text style={styles.loginText}>{loading ? "Logging in..." : "Login"}</Text>
      </TouchableOpacity>

      <TouchableOpacity onPress={() => navigation.navigate("Signup")} activeOpacity={0.85}>
        <Text style={styles.link}>Create an account</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, justifyContent: "center", backgroundColor: "#fff" },
  title: { fontSize: 32, fontWeight: "bold", textAlign: "center", marginBottom: 30 },
  input: { borderWidth: 1, padding: 12, borderRadius: 10, marginBottom: 15, borderColor: "#ccc" },
  loginBtn: {
    backgroundColor: "#4f46e5",
    padding: 15,
    borderRadius: 10,
    alignItems: "center",
    marginBottom: 15,
  },
  loginText: { color: "#fff", fontSize: 18, fontWeight: "600" },
  link: { textAlign: "center", color: "#4f46e5" },
});
