import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";

/**
 * Get the current authenticated user session
 * Returns null if not authenticated
 */
export async function getCurrentUser() {
  const session = await auth();
  return session?.user || null;
}

/**
 * Require authentication - redirects to login if not authenticated
 * Use in server components or server actions
 */
export async function requireAuth() {
  const session = await auth();
  
  if (!session?.user) {
    redirect("/login");
  }
  
  return session.user;
}

/**
 * Get user ID from session
 * Returns null if not authenticated
 */
export async function getUserId(): Promise<number | null> {
  const session = await auth();
  
  if (!session?.user?.id) {
    return null;
  }
  
  return parseInt(session.user.id, 10);
}

/**
 * Require user ID - throws error if not authenticated
 * Use in API routes
 */
export async function requireUserId(): Promise<number> {
  const userId = await getUserId();
  
  if (!userId) {
    throw new Error("Unauthorized");
  }
  
  return userId;
}
