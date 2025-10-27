import { FC, useState } from 'react'
import { Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import { navItems } from '../constants/NavItems'
import { useRouter } from 'expo-router'
import { useResponsive, Colors, util } from '../../Styleguide'

interface NavItem {
    name: string;
    url: string;
    icon: any;
}

const Sidebar: FC<{fullName: string, email: string}> = ({fullName, email}) => {
    const router = useRouter()
    const { isLg, isMd, is2xl } = useResponsive()
    
    const [hoveredUrl, setHoveredUrl] = useState<string | null>(null) 

    const handleNavigation = (path: string) => router.navigate(path)

    const sidebarWidth = isLg ? "20%" : 80 
    const logoMargin = isLg ? 20 : 10 

    const isHovered = (url: string) => url === hoveredUrl || url == "/"

    return (
        <View style={[style.container, { width: sidebarWidth }, isMd ? {paddingHorizontal: 5} : {paddingHorizontal: 30}]}>
            <Image
                source={isLg ? require("../../assets/logo_dark.png") : require("../../assets/favicon.png")}
                style={{ margin: logoMargin, width: isLg ? 210 : 70, height: 70 }}
                resizeMode='contain'
            />
            
            <View>
                {navItems.map((nav: NavItem) => (
                    <TouchableOpacity
                        key={nav.url}
                        onPress={() => handleNavigation(nav.url)}
                        onPressIn={() => setHoveredUrl(nav.url)} 
                        onPressOut={() => setHoveredUrl(null)}
                        style={[
                            style.navButton,
                            {borderRadius: isLg ? 30 : 10},
                            isHovered(nav.url) && { backgroundColor: Colors.secondary }
                        ]}
                    >
                        <View style={[style.navItemContent, { 
                            justifyContent: is2xl ? 'flex-start' : 'center',
                            marginLeft: is2xl ? 30 : -10,
                            width: 'auto',
                        }]}>
                            {/* Icon - dynamically change tintColor */}
                            <Image
                                source={nav.icon}
                                style={[
                                    style.navIcon,
                                    {
                                        tintColor: isHovered(nav.url) ? Colors.white : Colors.platinum 
                                    }
                                ]}
                            />
                            {/* Text (Desktop only) */}
                            {isLg && (
                                <Text style={[style.navText, {color: isHovered(nav.url) ? "white" : "black"}]}>{nav.name}</Text>
                            )}
                        </View>
                    </TouchableOpacity>
                ))}
            </View>
            {is2xl && (
                <View style={style.navStorageImage}>
                    <Image
                        style={{width: 250, height: 250, marginTop: -70}} 
                        source={require("../../assets/fileSearch.png")}
                    />
                </View>
            )}
            <View style={[style.userProfile, !is2xl? {justifyContent: 'center', height: 71, width: 71} : {}]}>
                <Image
                    style={{width: 60, height: 60, borderRadius: "100%"}} 
                    source={"https://www.shutterstock.com/image-vector/vector-bright-portrait-beautiful-brunette-600nw-2452267975.jpg"}
                />
                {is2xl && (
                    <View style={{display: "flex", gap: 2}}>
                        <Text style={{fontWeight: "700"}}>{fullName}</Text>
                        <Text>{email}</Text>
                    </View>
                )}
            </View>
        </View>
    )
}
export default Sidebar


const style = StyleSheet.create({
    container: {
        display: 'flex',
        flexDirection: "column",
        justifyContent: "space-around",
        alignItems: "center",
        height: '100%'        
    },
    navButton: {
        flexDirection: "row",
        alignItems: 'center',
        alignContent: 'flex-start',
        backgroundColor: 'transparent', 
        height: 60,
        marginVertical: 5,
        marginHorizontal: 10,
        width: "100%"
    },
    navItemContent: {
        display: "flex", 
        flexDirection: 'row', 
        alignItems: "center", 
        gap: 10,
        flex: 1, 
        paddingHorizontal: 40,
    },
    navIcon: {
        width: 30, 
        height: 30,
    },
    navText: {
        ...util.body1,
        color: Colors.white,
        fontWeight: '500'
    },
    navStorageImage: {
        width: "100%", 
        height: 200, 
        backgroundColor: Colors.platinum, 
        marginTop: 10, 
        borderRadius: 20, 
        display: "flex", 
        alignItems: "center"
    },
    userProfile: {
        display: "flex", 
        flexDirection: "row", 
        alignItems: "center", 
        gap: 10, 
        backgroundColor: Colors.platinumShades["500"], 
        borderRadius: 30, 
        paddingHorizontal: 10, 
        paddingVertical: 8,
    }
})