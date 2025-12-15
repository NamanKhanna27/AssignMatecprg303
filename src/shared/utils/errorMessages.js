// Auth error messages
export function getAuthErrorMessage(code) {
  switch (code) {
    case "auth/invalid-email":
      return "Please enter a valid email address.";

    case "auth/user-not-found":
      return "No account exists with this email. Please create an account first.";

    case "auth/wrong-password":
      return "Incorrect password. Please try again.";

    case "auth/invalid-credential":
      return "Email or password is incorrect.";

    case "auth/email-already-in-use":
      return "An account with this email already exists.";

    case "auth/weak-password":
      return "Password is too weak (minimum 6 characters).";

    case "auth/too-many-requests":
      return "Too many attempts. Please try again later.";

    case "auth/network-request-failed":
      return "Network error. Check your internet connection and try again.";

    default:
      return "Something went wrong. Please try again.";
  }
}


// Firestore error messages
export function getFirestoreErrorMessage(code) {
  switch (code) {
    case "permission-denied":
      return "Permission denied. Please check Firestore rules.";

    case "unavailable":
      return "Service is unavailable right now. Try again in a moment.";

    default:
      return "Something went wrong while saving data. Please try again.";
  }
}
