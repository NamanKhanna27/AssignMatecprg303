import { View, Text, StyleSheet, FlatList, TouchableOpacity } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useEffect, useMemo, useState } from "react";

import { auth } from "../../../services/firebase/firebase";
import { listenAssignments, toggleAssignmentStatus, deleteAssignment } from "../services/assignmentService";
import { useAppDialog } from "../../../shared/components/AppDialog/AppDialogContext";

// formats Firestore timestamp → YYYY-MM-DD
function formatDue(dateValue) {
  try {
    const d = dateValue?.toDate ? dateValue.toDate() : null;
    if (!d) return "—";
    const yyyy = d.getFullYear();
    const mm = String(d.getMonth() + 1).padStart(2, "0");
    const dd = String(d.getDate()).padStart(2, "0");
    return `${yyyy}-${mm}-${dd}`;
  } catch {
    return "—";
  }
}

export default function AssignmentsScreen() {
  const uid = auth.currentUser?.uid;

  const [assignments, setAssignments] = useState([]); // stored assignment list
  const [loading, setLoading] = useState(true);
  const { showDialog, showConfirm } = useAppDialog();

  const canUseFirestore = useMemo(() => !!uid, [uid]); // ensures uid exists

  useEffect(() => {
    if (!canUseFirestore) {
      setAssignments([]);
      setLoading(false);
      return;
    }

    setLoading(true);

    // real-time listener
    const unsub = listenAssignments(
      uid,
      (items) => {
        setAssignments(items);
        setLoading(false);
      },
      (err) => {
        setLoading(false);
        showDialog({
          title: "Error",
          message: err?.message ?? "Failed to load assignments.",
          variant: "error"
        });
      }
    );

    return unsub; // cleanup listener
  }, [canUseFirestore, uid]);

  const onToggleStatus = async (item) => {
    if (!uid) return;

    try {
      await toggleAssignmentStatus(uid, item.id, item.status); // toggle status
    } catch (e) {
      showDialog({
        title: "Error",
        message: e?.message ?? "Failed to update status.",
        variant: "error"
      });
    }
  };

  const onDelete = async (item) => {
    if (!uid) return;

    // confirmation dialog
    showConfirm({
      title: "Delete assignment?",
      message: item.title,
      confirmText: "Delete",
      cancelText: "Cancel",
      variant: "danger",
      onConfirm: async () => {
        try {
          await deleteAssignment(uid, item.id);
        } catch (e) {
          showDialog({
            title: "Error",
            message: e?.message ?? "Failed to delete assignment.",
            variant: "error",
          });
        }
      },
    });
  };

  // renders each assignment card
  const renderItem = ({ item }) => {
    const completed = item.status === "completed";

    return (
      <View style={styles.card}>
        <View style={styles.row}>
          <Text style={styles.title}>{item.title}</Text>

          {completed ? (
            <Ionicons name="checkmark-circle" size={22} color="#22c55e" />
          ) : (
            <Ionicons name="time-outline" size={22} color="#f59e0b" />
          )}
        </View>

        <Text style={styles.due}>Due: {formatDue(item.dueDate)}</Text>
        <Text style={styles.meta}>
          Priority: {item.priority || "—"} • Status: {item.status || "pending"}
        </Text>

        <View style={styles.actions}>
          <TouchableOpacity style={styles.actionBtn} onPress={() => onToggleStatus(item)}>
            <Text style={styles.actionText}>{completed ? "Mark Pending" : "Mark Done"}</Text>
          </TouchableOpacity>

          <TouchableOpacity style={[styles.actionBtn, styles.deleteBtn]} onPress={() => onDelete(item)}>
            <Text style={[styles.actionText, styles.deleteText]}>Delete</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  };

  if (!canUseFirestore) {
    return (
      <View style={styles.container}>
        <Text style={styles.pageTitle}>Your Assignments</Text>
        <Text style={styles.emptyText}>Not logged in. Please log in again.</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.pageTitle}>Your Assignments</Text>

      {loading ? (
        <Text style={styles.emptyText}>Loading...</Text>
      ) : assignments.length === 0 ? (
        <Text style={styles.emptyText}>No assignments yet. Add one!</Text>
      ) : (
        <FlatList
          data={assignments}
          renderItem={renderItem}
          keyExtractor={(item) => item.id}
          contentContainerStyle={{ paddingBottom: 30 }}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 18, backgroundColor: "#fff" },
  pageTitle: { fontSize: 26, fontWeight: "700", color: "#4f46e5", marginBottom: 20 },
  card: { padding: 15, backgroundColor: "#f9f9ff", marginBottom: 15, borderRadius: 12, borderWidth: 1, borderColor: "#ececff" },
  row: { flexDirection: "row", justifyContent: "space-between", alignItems: "center" },
  title: { fontSize: 18, fontWeight: "600", color: "#333" },
  due: { marginTop: 6, color: "#666" },
  meta: { marginTop: 6, color: "#666", fontSize: 13 },
  actions: { marginTop: 12, flexDirection: "row", gap: 10 },
  actionBtn: { flex: 1, paddingVertical: 10, borderRadius: 8, backgroundColor: "#4f46e5", alignItems: "center" },
  actionText: { color: "#fff", fontWeight: "700" },
  deleteBtn: { backgroundColor: "#fee2e2" },
  deleteText: { color: "#b91c1c" },
  emptyText: { textAlign: "center", marginTop: 40, fontSize: 16, color: "#666" },
});
