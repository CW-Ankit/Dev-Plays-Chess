import { httpRouter } from "convex/server";

import { authComponent, createAuth } from "./betterAuth/auth";

const Http = httpRouter();

authComponent.registerRoutes(Http, createAuth);

export default Http;
