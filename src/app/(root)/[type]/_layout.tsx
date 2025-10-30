import { Slot } from "expo-router"
import { View } from "react-native"
import Sidebar from "../../../components/Sidebar"
import MobileNavigation from "../../../components/MobileNavigation"
import Header from "../../../components/Header"
import { getCurrentUser } from "../../../../lib/hooks/userHook"
import { useEffect, useState } from "react"
import Colors, { useResponsive } from "../../../../Styleguide"
import UploadQueue from "../../../components/UploadQueue"

export default function MainLayout() {
    const [fullName, setFullName] = useState("")
    const [email, setEmail] = useState("")

    const { isMd } = useResponsive()
    useEffect(() => {
        const getUser = async () => {
            const user = await getCurrentUser()
            setFullName(() => user.fullName)
            setEmail(() => user.email)
            console.log("-> current user: ", user)
        }
        getUser()
    }, [])
    
    return (
        <View style={{flex:1, flexDirection: "row"}}>
            {isMd && (
                <Sidebar fullName={fullName} email={email}/>
            )}
            <View style={{flex:1, flexDirection: "column", height: "100%"}}>
                {!isMd && (<MobileNavigation />)}
                {isMd && (<Header />)}
                {/* Main Content */}
                <View style={{flex:1, backgroundColor: Colors.platinum, padding: 15, margin: 20, borderRadius: 20, zIndex: 10}}>
                    <Slot />
                </View>
                <UploadQueue/>
            </View>
        </View>
    )
}