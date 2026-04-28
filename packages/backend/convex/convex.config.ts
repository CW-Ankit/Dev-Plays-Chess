import { defineApp } from "convex/server";

import BetterAuthComponent from "./betterAuth/convex.config";

const App = defineApp();

App.use(BetterAuthComponent);

export default App;
