import React, { createContext, useContext, useMemo, useState } from "react";

const AuthFlowContext = createContext(null);

export function AuthFlowProvider({ children }) {
  const [lockAuthFlow, setLockAuthFlow] = useState(false);

  const value = useMemo(
    () => ({ lockAuthFlow, setLockAuthFlow }),
    [lockAuthFlow]
  );

  return <AuthFlowContext.Provider value={value}>{children}</AuthFlowContext.Provider>;
}

export function useAuthFlow() {
  const ctx = useContext(AuthFlowContext);
  if (!ctx) throw new Error("useAuthFlow must be used inside <AuthFlowProvider />");
  return ctx;
}