// src/shared/components/AppDialog/AppDialogContext.jsx
import React, { createContext, useContext, useMemo, useState } from "react";
import { Modal, View, Text, TouchableOpacity, StyleSheet, Pressable } from "react-native";

/*
  AppDialogProvider centralizes user-facing dialogs so they match the AssignMate UI.

  This module supports two dialog types:
  1) showDialog: a single-action message dialog (Close button).
  2) showConfirm: a two-action confirmation dialog (Cancel + Confirm).
*/

const AppDialogContext = createContext(null);

export function AppDialogProvider({ children }) {
  // Message dialog state (single button)
  const [messageVisible, setMessageVisible] = useState(false);
  const [messageTitle, setMessageTitle] = useState("Message");
  const [messageText, setMessageText] = useState("");
  const [messageVariant, setMessageVariant] = useState("info"); // "info" | "success" | "error"
  const [messageButtonText, setMessageButtonText] = useState("Close");
  const [onMessageClose, setOnMessageClose] = useState(null);

  // Confirm dialog state (two buttons)
  const [confirmVisible, setConfirmVisible] = useState(false);
  const [confirmTitle, setConfirmTitle] = useState("Confirm");
  const [confirmText, setConfirmText] = useState("");
  const [confirmButtonText, setConfirmButtonText] = useState("Confirm");
  const [cancelButtonText, setCancelButtonText] = useState("Cancel");
  const [confirmVariant, setConfirmVariant] = useState("default"); // "default" | "danger"
  const [onConfirm, setOnConfirm] = useState(null);

  const hideDialog = () => setMessageVisible(false);
  const hideConfirm = () => setConfirmVisible(false);

  const showDialog = (options) => {
    setMessageTitle(options?.title ?? "Message");
    setMessageText(options?.message ?? "");
    setMessageVariant(options?.variant ?? "info");
    // Allow either "buttonText" or "primaryText" for the button label.
    setMessageButtonText(options?.buttonText ?? options?.primaryText ?? "Close");

    // Backward-compatible callback naming:
    // - Preferred: onClose
    // - Also accepted: onPrimaryPress (older screens)
    const callback = options?.onClose ?? options?.onPrimaryPress ?? null;
    setOnMessageClose(() => callback);
    setMessageVisible(true);
  };

  const showConfirm = (options) => {
    setConfirmTitle(options?.title ?? "Confirm");
    setConfirmText(options?.message ?? "");
    setConfirmButtonText(options?.confirmText ?? "Confirm");
    setCancelButtonText(options?.cancelText ?? "Cancel");
    setConfirmVariant(options?.variant ?? "default");
    setOnConfirm(() => options?.onConfirm ?? null);
    setConfirmVisible(true);
  };

  const value = useMemo(
    () => ({ showDialog, hideDialog, showConfirm, hideConfirm }),
    []
  );

  const messageTitleColor =
    messageVariant === "error" ? "#b91c1c" : messageVariant === "success" ? "#166534" : "#111";

  const confirmButtonStyle =
    confirmVariant === "danger" ? styles.dangerButton : styles.primaryButton;

  const confirmButtonTextStyle =
    confirmVariant === "danger" ? styles.dangerButtonText : styles.primaryButtonText;

  return (
    <AppDialogContext.Provider value={value}>
      {children}

      {/* Message dialog */}
      <Modal visible={messageVisible} transparent animationType="fade" onRequestClose={hideDialog}>
        <Pressable
          style={styles.overlay}
          onPress={() => {
            // Tapping outside should behave the same as pressing the button.
            hideDialog();
            if (onMessageClose) onMessageClose();
          }}
        >
          <Pressable style={styles.card} onPress={() => {}}>
            <View style={styles.body}>
              <Text style={[styles.title, { color: messageTitleColor }]}>{messageTitle}</Text>
              <Text style={styles.message}>{messageText}</Text>

              <TouchableOpacity
                style={styles.primaryButton}
                onPress={() => {
                  hideDialog();
                  if (onMessageClose) onMessageClose();
                }}
                activeOpacity={0.85}
              >
                <Text style={styles.primaryButtonText}>{messageButtonText}</Text>
              </TouchableOpacity>
            </View>
          </Pressable>
        </Pressable>
      </Modal>

      {/* Confirm dialog */}
      <Modal visible={confirmVisible} transparent animationType="fade" onRequestClose={hideConfirm}>
        <Pressable style={styles.overlay} onPress={hideConfirm}>
          <Pressable style={styles.card} onPress={() => {}}>
            <View style={styles.body}>
              <Text style={styles.title}>{confirmTitle}</Text>
              <Text style={styles.message}>{confirmText}</Text>

              <View style={styles.row}>
                <TouchableOpacity
                  style={styles.secondaryButton}
                  onPress={hideConfirm}
                  activeOpacity={0.85}
                >
                  <Text style={styles.secondaryButtonText}>{cancelButtonText}</Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={[confirmButtonStyle, { flex: 1 }]}
                  onPress={() => {
                    hideConfirm();
                    if (onConfirm) onConfirm();
                  }}
                  activeOpacity={0.85}
                >
                  <Text style={confirmButtonTextStyle}>{confirmButtonText}</Text>
                </TouchableOpacity>
              </View>
            </View>
          </Pressable>
        </Pressable>
      </Modal>
    </AppDialogContext.Provider>
  );
}

export function useAppDialog() {
  const ctx = useContext(AppDialogContext);
  if (!ctx) throw new Error("useAppDialog must be used inside <AppDialogProvider />");
  return ctx;
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.45)",
    alignItems: "center",
    justifyContent: "center",
    padding: 24,
  },
  card: {
    width: "100%",
    maxWidth: 420,
    backgroundColor: "#fff",
    borderRadius: 14,
    overflow: "hidden",
  },
  body: {
    padding: 18,
  },
  title: {
    fontSize: 18,
    fontWeight: "700",
    color: "#111",
    marginBottom: 8,
  },
  message: {
    fontSize: 15,
    color: "#333",
    marginBottom: 16,
    lineHeight: 20,
  },
  primaryButton: {
    backgroundColor: "#4f46e5",
    paddingVertical: 12,
    borderRadius: 10,
    alignItems: "center",
  },
  primaryButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "700",
  },
  row: {
    flexDirection: "row",
    gap: 10,
  },
  secondaryButton: {
    backgroundColor: "#f3f4f6",
    paddingVertical: 12,
    paddingHorizontal: 12,
    borderRadius: 10,
    alignItems: "center",
  },
  secondaryButtonText: {
    color: "#111",
    fontSize: 15,
    fontWeight: "700",
  },
  dangerButton: {
    backgroundColor: "#b91c1c",
    paddingVertical: 12,
    borderRadius: 10,
    alignItems: "center",
  },
  dangerButtonText: {
    color: "#fff",
    fontSize: 15,
    fontWeight: "700",
  },
});
