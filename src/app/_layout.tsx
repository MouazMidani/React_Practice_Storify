import { Slot, useRouter, usePathname } from "expo-router"
import { useEffect } from "react"
import { AuthStore } from "../../lib/stores/AuthStore"
import { Appwrite, AppwriteAdmin } from "../../lib/stores/AppwriteStore"
import { initializeAuth } from "../../lib/hooks/userHook"
export default function RootLayout() {
  const routePath = usePathname().split('/')[1]
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
    if (status === "authenticated"
      && !["dashboard", "image", "document", "media", "other"].includes(routePath)) {
      router.replace("/dashboard")
    } else if (status === "unauthenticated"){ 
      router.replace("/sign-in")
    }
  }, [status])
    return <Slot/>
}