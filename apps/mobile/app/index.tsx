import { convexClient } from "@convex-dev/better-auth/client/plugins";
import { ConvexBetterAuthProvider } from "@convex-dev/better-auth/react";
import { dodopaymentsClient } from "@dodopayments/better-auth";
import { createAuthClient } from "better-auth/react";
import { ConvexReactClient } from "convex/react";
import * as Linking from "expo-linking";
import { Pressable, Text, View } from "react-native";

const ConvexClient = new ConvexReactClient(process.env.EXPO_PUBLIC_CONVEX_URL!);

const AuthClient = createAuthClient({
  baseURL: process.env.EXPO_PUBLIC_CONVEX_SITE_URL,
  plugins: [convexClient(), dodopaymentsClient()],
  fetchOptions: {
    customFetchImpl: fetch
  }
});

const EnvironmentValue = ({ label, value }: { label: string; value: string }) => {
  return (
    <View
      style={{
        width: "100%",
        borderWidth: 1,
        borderColor: "#E4E4E7",
        borderRadius: 8,
        padding: 12,
        backgroundColor: "#FFFFFF"
      }}
    >
      <Text style={{ fontSize: 12, color: "#52525B" }}>{label}</Text>
      <Text style={{ marginTop: 6, fontSize: 14, fontWeight: "600" }}>{value}</Text>
    </View>
  );
};

const ActionButton = ({ label, url }: { label: string; url: string }) => {
  return (
    <Pressable
      onPress={() => Linking.openURL(url)}
      style={{
        width: "100%",
        borderRadius: 8,
        backgroundColor: "#18181B",
        paddingVertical: 12,
        paddingHorizontal: 14
      }}
    >
      <Text style={{ color: "#FAFAFA", textAlign: "center", fontWeight: "600" }}>{label}</Text>
    </Pressable>
  );
};

const HomeScreen = () => {
  return (
    <ConvexBetterAuthProvider client={ConvexClient} authClient={AuthClient}>
      <View
        style={{
          flex: 1,
          justifyContent: "center",
          alignItems: "center",
          padding: 24,
          gap: 12,
          backgroundColor: "#F4F4F5"
        }}
      >
        <Text style={{ fontSize: 24, fontWeight: "700" }}>Fast Tech Stack Mobile</Text>
        <Text style={{ textAlign: "center", marginBottom: 4 }}>
          Use this screen to validate mobile environment wiring and open integration references.
        </Text>

        <EnvironmentValue
          label="EXPO_PUBLIC_CONVEX_URL"
          value={process.env.EXPO_PUBLIC_CONVEX_URL ? "Configured" : "Missing"}
        />
        <EnvironmentValue
          label="EXPO_PUBLIC_CONVEX_SITE_URL"
          value={process.env.EXPO_PUBLIC_CONVEX_SITE_URL ? "Configured" : "Missing"}
        />

        <ActionButton
          label="Open Web Stack Status Endpoint"
          url={`${process.env.EXPO_PUBLIC_CONVEX_SITE_URL}/api/stack/status`}
        />
        <ActionButton
          label="Open Dodo Payments Mobile Docs"
          url="https://docs.dodopayments.com/developer-resources/react-native-integration"
        />
      </View>
    </ConvexBetterAuthProvider>
  );
};

export default HomeScreen;
