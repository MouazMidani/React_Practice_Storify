import {FC} from 'react'
import { Image, TouchableOpacity, View } from 'react-native'
import { StyleSheet } from 'react-native'
import Search from './Search'
import FileUploader from "../components/FileUploader"
const Header: FC = () => {
  return (
    <View style={styles.container}>
        <Search/>
        <View style={styles.headerWrapper}> {/* Header Wrapper */}
            <FileUploader />
            <TouchableOpacity style={styles.logoutContainer}>
                <Image
                    source={require("../../assets/logout.png")}
                    style={{width: 24, height: 24}}
                    alt='logout'
                    resizeMode='contain'
                />
            </TouchableOpacity>
        </View>
    </View>
  )
}
export default Header

const styles = StyleSheet.create({
    container: {
        flex:1, 
        flexDirection: 'row', 
        maxHeight: 64, 
        padding: 20, 
        justifyContent: "space-around", 
        alignItems: "center",
        zIndex: 100
    },
    logoutContainer: {
        backgroundColor: "#e5e5e5ff", 
        height: 50, 
        width: 50, 
        borderRadius: "100%", 
        justifyContent: "center", 
        alignItems: "center", 
        paddingRight: 5
    },
    headerWrapper: {
        flex:1, 
        flexDirection: 'row', 
        justifyContent: "flex-end", 
        alignItems: 'center', 
        gap: 30, 
        paddingHorizontal: 10
    }
})