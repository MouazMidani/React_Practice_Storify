import { useRouter } from "expo-router"
import { useEffect } from "react"
import { View, ActivityIndicator } from "react-native"
import { Appwrite, AppwriteAdmin } from "../../lib/stores/AppwriteStore"
import { AuthStore } from "../../lib/stores/AuthStore"
import { initializeAuth } from "../../lib/hooks/userHook"

export default function Index() {
  const router = useRouter()
  const status = AuthStore((state) => state.status)

  useEffect(() => {
    AppwriteAdmin.getState().init()
    Appwrite.getState().init()

    const init = async () => {
      await AuthStore.getState().hydrate()
      await initializeAuth()
    }

    init()
  }, [])

  useEffect(() => {
    if (status === "authenticated")
      router.replace("/dashboard")
    else if (status === "unauthenticated")
      router.replace("/sign-in")
  }, [status])

  return (
    <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
      <ActivityIndicator size="large" />
    </View>
  )
}