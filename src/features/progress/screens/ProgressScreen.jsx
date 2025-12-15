import { useEffect, useState } from "react";
import { View, Text, StyleSheet, ScrollView } from "react-native";
import { ProgressChart } from "react-native-chart-kit";
import { collection, onSnapshot } from "firebase/firestore";
import { auth, db } from "../../../services/firebase/firebase";

const QUOTES = [
  "Small progress each day adds up to big results.",
  "Stay consistent — success is built daily.",
  "Your future self will thank you for what you do today.",
  "Focus on progress, not perfection.",
  "Every step forward is a step toward success.",
  "You are capable of more than you think.",
  "Discipline creates freedom.",
  "A little progress is still progress.",
  "Believe in yourself and all that you are.",
  "Dream big. Start small. Act now."
];

export default function ProgressScreen() {
  const [assignments, setAssignments] = useState([]); // all assignments
  const [quote, setQuote] = useState(""); // random quote

  useEffect(() => {
    // pick a random quote once
    const random = QUOTES[Math.floor(Math.random() * QUOTES.length)];
    setQuote(random);
  }, []);

  useEffect(() => {
    // real-time listener on user assignments
    const ref = collection(db, "users", auth.currentUser.uid, "assignments");

    const unsubscribe = onSnapshot(ref, (snapshot) => {
      const list = snapshot.docs.map((d) => ({
        id: d.id,
        ...d.data(),
      }));
      setAssignments(list);
    });

    return unsubscribe; // cleanup listener
  }, []);

  const total = assignments.length;
  const completed = assignments.filter((a) => a.status === "completed").length;
  const pending = total - completed;

  const progress = total === 0 ? 0 : completed / total; // 0–1
  const progressPercent = Math.round(progress * 100); // show full % number

  const chartData = {
    labels: [],
    data: [progress],
  };

  // sort upcoming assignments by due date
  const upcoming = [...assignments]
    .filter((a) => a.dueDate?.toDate)
    .sort((a, b) => a.dueDate.toDate() - b.dueDate.toDate())
    .slice(0, 3);

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>Your Progress</Text>

      {/* progress circle */}
      <View style={{ alignItems: "center", marginBottom: 5 }}>
        <ProgressChart
          data={chartData}
          width={220}
          height={220}
          strokeWidth={14}
          radius={40}
          hideLegend={true}
          chartConfig={{
            backgroundGradientFrom: "#fff",
            backgroundGradientTo: "#fff",
            color: (opacity = 1) => `rgba(79,70,229,${opacity})`,
          }}
          style={{ marginBottom: -20 }}
        />

        <Text style={styles.percentText}>{progressPercent}% Completed</Text>
      </View>

      {/* quote */}
      <View style={styles.quoteBox}>
        <Text style={styles.quoteText}>“{quote}”</Text>
      </View>

      {/* stats row */}
      <View style={styles.statsRow}>
        <View style={styles.statBox}>
          <Text style={styles.statNum}>{total}</Text>
          <Text style={styles.statLabel}>Total</Text>
        </View>

        <View style={styles.statBox}>
          <Text style={styles.statNum}>{completed}</Text>
          <Text style={styles.statLabel}>Completed</Text>
        </View>

        <View style={styles.statBox}>
          <Text style={styles.statNum}>{pending}</Text>
          <Text style={styles.statLabel}>Pending</Text>
        </View>
      </View>

      {/* upcoming deadlines */}
      <View style={styles.box}>
        <Text style={styles.boxTitle}>Upcoming Deadlines</Text>

        {upcoming.length === 0 ? (
          <Text style={styles.boxSub}>No upcoming deadlines.</Text>
        ) : (
          upcoming.map((a) => (
            <View key={a.id} style={{ marginBottom: 10 }}>
              <Text style={styles.deadlineTitle}>{a.title}</Text>
              <Text style={styles.deadlineDate}>
                Due: {a.dueDate.toDate().toDateString()}
              </Text>
            </View>
          ))
        )}
      </View>

      <View style={{ height: 30 }} />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 15,
    backgroundColor: "#fff",
  },

  title: {
    fontSize: 26,
    fontWeight: "700",
    textAlign: "center",
    color: "#4f46e5",
    marginBottom: 10,
  },

  percentText: {
    textAlign: "center",
    fontSize: 26,
    fontWeight: "700",
    marginBottom: 10,
    color: "#333",
  },

  // quote styles
  quoteBox: {
    paddingVertical: 12,
    paddingHorizontal: 16,
    backgroundColor: "#f3f3ff",
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#e0e0ff",
    marginBottom: 25,
    alignSelf: "center",
    maxWidth: "90%",
  },

  quoteText: {
    fontSize: 14,
    fontStyle: "italic",
    color: "#4f46e5",
    textAlign: "center",
    fontWeight: "500",
  },

  statsRow: {
    flexDirection: "row",
    justifyContent: "space-around",
    marginBottom: 30,
  },

  statBox: {
    alignItems: "center",
  },

  statNum: {
    fontSize: 26,
    fontWeight: "700",
    color: "#4f46e5",
  },

  statLabel: {
    fontSize: 14,
    color: "#777",
  },

  box: {
    padding: 15,
    borderWidth: 1,
    borderColor: "#eee",
    borderRadius: 12,
    backgroundColor: "#fafaff",
  },

  boxTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: "#4f46e5",
    marginBottom: 6,
  },

  boxSub: {
    color: "#777",
  },

  deadlineTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: "#4f46e5",
  },

  deadlineDate: {
    color: "#777",
    fontSize: 14,
    marginTop: 2,
  },
});
