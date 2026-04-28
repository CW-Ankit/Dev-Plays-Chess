import { getAuthConfigProvider } from "@convex-dev/better-auth/auth-config";
import type { AuthConfig } from "convex/server";

const AuthConfig: AuthConfig = {
  providers: [getAuthConfigProvider()]
};

export default AuthConfig;
