import {
  collection,
  addDoc,
  onSnapshot,
  query,
  orderBy,
  serverTimestamp,
  Timestamp,
  updateDoc,
  deleteDoc,
  doc,
} from "firebase/firestore";
import { db } from "../../../services/firebase/firebase";

export async function addAssignment(uid, data) {
  const { title, description, dueDate, priority } = data;

  // validate due date before saving
  if (!(dueDate instanceof Date) || Number.isNaN(dueDate.getTime())) {
    throw Object.assign(new Error("Invalid due date."), {
      code: "invalid-due-date",
    });
  }

  const colRef = collection(db, "users", uid, "assignments");

  // create new assignment doc
  const docRef = await addDoc(colRef, {
    title: title.trim(),
    description: description?.trim() ?? "",
    priority: priority,
    status: "pending",
    dueDate: Timestamp.fromDate(dueDate),
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
  });

  return docRef.id;
}

export function listenAssignments(uid, onChange, onError) {
  const colRef = collection(db, "users", uid, "assignments");
  const q = query(colRef, orderBy("dueDate", "asc")); // sort assignments by due date

  // real-time listener
  const unsub = onSnapshot(
    q,
    (snap) => {
      const items = snap.docs.map((d) => ({ id: d.id, ...d.data() }));
      onChange(items);
    },
    (err) => onError && onError(err)
  );

  return unsub;
}

export async function toggleAssignmentStatus(uid, assignmentId, currentStatus) {
  const ref = doc(db, "users", uid, "assignments", assignmentId);

  // flip between completed <-> pending
  const nextStatus =
    currentStatus === "completed" ? "pending" : "completed";

  await updateDoc(ref, {
    status: nextStatus,
    updatedAt: serverTimestamp(),
  });

  return nextStatus;
}

export async function deleteAssignment(uid, assignmentId) {
  const ref = doc(db, "users", uid, "assignments", assignmentId);

  // remove assignment document
  await deleteDoc(ref);
}
