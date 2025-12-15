import React from "react";
import { NavigationContainer } from "@react-navigation/native";

import RootNavigator from "../navigation/RootNavigator";
import { AuthFlowProvider } from "../features/auth/authFlow/AuthFlowContext";
import { AppDialogProvider } from "../shared/components/AppDialog/AppDialogContext";

export default function AppProviders() {
  return (
    // provides lockAuthFlow state across the app
    <AuthFlowProvider>
      <AppDialogProvider>
        <NavigationContainer>
          <RootNavigator />
        </NavigationContainer>
      </AppDialogProvider>
    </AuthFlowProvider>
  );
}