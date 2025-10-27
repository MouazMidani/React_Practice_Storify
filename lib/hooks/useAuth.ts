import { useEffect } from "react";
import { useRouter } from "expo-router";
import { AuthStore } from "../stores/AuthStore";

export const useAuth = (requireAuth: boolean = true) => {
  const router = useRouter()
  const status = AuthStore((state) => state.status)
  const user = AuthStore((state) => state.user)

  useEffect(() => {
    console.log("-> ", status, requireAuth)
    if (requireAuth && status === "unauthenticated") {
      router.replace("/sign-in")
    } else if (!requireAuth && status === "authenticated") {
      router.replace("/(root)")
    }
  }, [status, requireAuth])

  return {
    status,
    user,
    isLoading: status === "loading" || status === "idle",
    isAuthenticated: status === "authenticated",
  }
}