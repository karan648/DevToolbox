import { getServerSession } from "next-auth";

import { authOptions } from "@/lib/auth";

export async function getSafeServerSession() {
  try {
    return await getServerSession(authOptions);
  } catch {
    return null;
  }
}
