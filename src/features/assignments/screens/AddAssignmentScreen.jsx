import { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Modal,
  Pressable,
} from "react-native";

import { auth } from "../../../services/firebase/firebase";
import { addAssignment } from "../services/assignmentService";
import { validateAssignmentTitle } from "../../../shared/utils/validation";
import { getFirestoreErrorMessage } from "../../../shared/utils/errorMessages";
import { useAppDialog } from "../../../shared/components/AppDialog/AppDialogContext";

const PRIORITY_OPTIONS = ["Low", "Medium", "High"];

export default function AddAssignmentScreen() {
  const { showDialog } = useAppDialog();

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");

  const [dueDate, setDueDate] = useState(new Date()); // stores selected due date
  const [priority, setPriority] = useState("Medium"); // selected priority

  const [loading, setLoading] = useState(false);

  const [calendarVisible, setCalendarVisible] = useState(false); // date picker modal
  const [month, setMonth] = useState(dueDate.getMonth());
  const [year, setYear] = useState(dueDate.getFullYear());

  const [showPriorityModal, setShowPriorityModal] = useState(false); // priority modal

  const formatDate = (date) => {
    const yyyy = date.getFullYear();
    const mm = String(date.getMonth() + 1).padStart(2, "0");
    const dd = String(date.getDate()).padStart(2, "0");
    return `${yyyy}-${mm}-${dd}`;
  };

  // calendar helpers
  const daysInMonth = (m, y) => new Date(y, m + 1, 0).getDate();
  const firstDayOfMonth = (m, y) => new Date(y, m, 1).getDay();

  const handleSelectDay = (day) => {
    const selected = new Date(year, month, day);
    setDueDate(selected);
    setCalendarVisible(false);
  };

  // calendar navigation
  const nextMonth = () => {
    if (month === 11) {
      setMonth(0);
      setYear(year + 1);
    } else setMonth(month + 1);
  };

  const prevMonth = () => {
    if (month === 0) {
      setMonth(11);
      setYear(year - 1);
    } else setMonth(month - 1);
  };

  const handleAddAssignment = async () => {
    const uid = auth.currentUser?.uid;
    if (!uid)
      return showDialog({
        title: "Session Expired",
        message: "Please log in again.",
        variant: "error",
      });

    // validate title
    const err = validateAssignmentTitle(title);
    if (err)
      return showDialog({
        title: "Invalid Title",
        message: err,
        variant: "error",
      });

    try {
      setLoading(true);

      // save assignment
      await addAssignment(uid, {
        title,
        description,
        dueDate,
        priority,
      });

      showDialog({
        title: "Added!",
        message: "Assignment saved successfully.",
        variant: "success",
      });

      // reset fields
      setTitle("");
      setDescription("");
      setDueDate(new Date());
      setPriority("Medium");
    } catch (e) {
      showDialog({
        title: "Error",
        message: getFirestoreErrorMessage(e.code),
        variant: "error",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Add Assignment</Text>

      {/* title input */}
      <TextInput
        style={styles.input}
        placeholder="Assignment Title"
        placeholderTextColor="#999"
        value={title}
        onChangeText={setTitle}
      />

      {/* description input */}
      <TextInput
        style={[styles.input, { height: 70 }]}
        placeholder="Description"
        placeholderTextColor="#999"
        value={description}
        onChangeText={setDescription}
        multiline
      />

      {/* due date field */}
      <Text style={styles.label}>Due Date *</Text>

      <TouchableOpacity
        style={styles.selectField}
        onPress={() => setCalendarVisible(true)}
      >
        <Text style={styles.selectText}>{formatDate(dueDate)}</Text>
      </TouchableOpacity>

      {/* calendar modal */}
      <Modal visible={calendarVisible} transparent animationType="fade">
        <Pressable
          style={styles.modalOverlay}
          onPress={() => setCalendarVisible(false)}
        >
          <Pressable style={styles.calendarCard} onPress={() => { }}>
            <View style={styles.calendarHeader}>
              <TouchableOpacity onPress={prevMonth}>
                <Text style={styles.arrow}>{"<"}</Text>
              </TouchableOpacity>

              <Text style={styles.monthLabel}>
                {new Date(year, month).toLocaleString("default", {
                  month: "long",
                })}{" "}
                {year}
              </Text>

              <TouchableOpacity onPress={nextMonth}>
                <Text style={styles.arrow}>{">"}</Text>
              </TouchableOpacity>
            </View>

            {/* week days */}
            <View style={styles.weekRow}>
              {["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"].map((d) => (
                <Text key={d} style={styles.weekLabel}>
                  {d}
                </Text>
              ))}
            </View>

            {/* days */}
            <View style={styles.daysGrid}>
              {Array(firstDayOfMonth(month, year))
                .fill(null)
                .map((_, i) => (
                  <Text key={`empty-${i}`} style={styles.dayCell} />
                ))}

              {Array(daysInMonth(month, year))
                .fill(null)
                .map((_, i) => {
                  const day = i + 1;
                  return (
                    <TouchableOpacity
                      key={day}
                      style={styles.dayBtn}
                      onPress={() => handleSelectDay(day)}
                    >
                      <Text style={styles.dayText}>{day}</Text>
                    </TouchableOpacity>
                  );
                })}
            </View>

            <TouchableOpacity
              style={styles.closeBtn}
              onPress={() => setCalendarVisible(false)}
            >
              <Text style={styles.closeText}>Close</Text>
            </TouchableOpacity>
          </Pressable>
        </Pressable>
      </Modal>

      {/* priority field */}
      <Text style={styles.label}>Priority *</Text>

      <TouchableOpacity
        style={styles.selectField}
        onPress={() => setShowPriorityModal(true)}
      >
        <Text style={styles.selectText}>{priority}</Text>
      </TouchableOpacity>

      {/* priority modal */}
      <Modal visible={showPriorityModal} transparent animationType="fade">
        <Pressable
          style={styles.modalOverlay}
          onPress={() => setShowPriorityModal(false)}
        >
          <Pressable style={styles.modalCard}>
            <Text style={styles.modalTitle}>Select Priority</Text>

            {PRIORITY_OPTIONS.map((opt) => (
              <TouchableOpacity
                key={opt}
                style={[
                  styles.optionRow,
                  priority === opt && styles.optionRowSelected,
                ]}
                onPress={() => {
                  setPriority(opt);
                  setShowPriorityModal(false);
                }}
              >
                <Text
                  style={[
                    styles.optionText,
                    priority === opt && styles.optionTextSelected,
                  ]}
                >
                  {opt}
                </Text>
              </TouchableOpacity>
            ))}

            <TouchableOpacity
              style={styles.closeBtn}
              onPress={() => setShowPriorityModal(false)}
            >
              <Text style={styles.closeText}>Close</Text>
            </TouchableOpacity>
          </Pressable>
        </Pressable>
      </Modal>

      {/* add button */}
      <TouchableOpacity
        style={[styles.addButton, loading && { opacity: 0.6 }]}
        onPress={handleAddAssignment}
      >
        <Text style={styles.addText}>
          {loading ? "Adding..." : "Add Assignment"}
        </Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, backgroundColor: "#fff" },
  title: {
    fontSize: 28,
    textAlign: "center",
    fontWeight: "700",
    color: "#4f46e5",
    marginBottom: 20,
  },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 10,
    padding: 12,
    marginBottom: 15,
    fontSize: 16,
  },
  label: {
    marginTop: 6,
    fontWeight: "700",
    marginBottom: 6,
    color: "#444",
  },
  selectField: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 10,
    padding: 12,
    marginBottom: 15,
  },
  selectText: { fontSize: 16, color: "#111" },

  addButton: {
    backgroundColor: "#4f46e5",
    padding: 15,
    marginTop: 10,
    borderRadius: 10,
    alignItems: "center",
  },
  addText: { color: "#fff", fontSize: 18, fontWeight: "700" },

  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.5)",
    justifyContent: "center",
    padding: 20,
  },
  calendarCard: {
    backgroundColor: "#fff",
    borderRadius: 14,
    padding: 20,
  },

  calendarHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 10,
    alignItems: "center",
  },
  monthLabel: {
    fontSize: 18,
    fontWeight: "700",
    color: "#4f46e5",
  },
  arrow: { fontSize: 20, fontWeight: "700", color: "#4f46e5" },

  weekRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 5,
  },
  weekLabel: { flex: 1, textAlign: "center", fontWeight: "600", color: "#777" },

  daysGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    marginBottom: 15,
  },
  dayCell: {
    width: "14.28%",
    textAlign: "center",
    paddingVertical: 10,
  },
  dayBtn: {
    width: "14.28%",
    paddingVertical: 10,
    alignItems: "center",
  },
  dayText: { fontSize: 14, color: "#333" },

  modalCard: {
    backgroundColor: "#fff",
    padding: 20,
    borderRadius: 14,
  },
  modalTitle: { fontSize: 18, fontWeight: "700", marginBottom: 12 },
  optionRow: {
    backgroundColor: "#f3f3f7",
    padding: 12,
    borderRadius: 10,
    marginBottom: 10,
  },
  optionRowSelected: {
    backgroundColor: "#e0e7ff",
  },
  optionText: { fontSize: 16, fontWeight: "600", color: "#333" },
  optionTextSelected: { color: "#4f46e5" },
  closeBtn: {
    marginTop: 10,
    padding: 12,
    backgroundColor: "#4f46e5",
    borderRadius: 10,
    alignItems: "center",
  },
  closeText: { color: "#fff", fontWeight: "700" },
});
