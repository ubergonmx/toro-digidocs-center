import { getServerSession } from "next-auth";
import { cache } from "react";
import { authOptions } from "./auth";

export default cache(async () => await getServerSession(authOptions));