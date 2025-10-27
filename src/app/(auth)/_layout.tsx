import { Stack } from "expo-router"
import { View, Image, Text, Pressable } from "react-native"
import { StyleSheet, useWindowDimensions  } from "react-native" 
import { Colors as stColors, util as stUtil, useResponsive } from "../../../Styleguide"
import Animated, {
    useSharedValue,
    useAnimatedStyle,
    withTiming,
  } from 'react-native-reanimated';

export const unstable_settings = {
    initialRouteName: 'sign-in',
}

export default function AuthLayout() {
    const { height } = useWindowDimensions()
    const styles = getStyles(height);

    const scale = useSharedValue(1)
    const animatedStyle = useAnimatedStyle(() => ({
      transform: [{ scale: scale.value }]
    }))

    const {isLg, isXl} = useResponsive()
    return (
        <View style={{flex: 1, flexDirection: 'row', ...(!isLg && {flexDirection: 'column'})}}>
            { !isLg && 
                (<Image 
                    style={[styles.logo, {alignSelf: "center"}]} 
                    source={require("../../../assets/logo_dark.png")} 
                    alt="logo"
                />
                )
            }
            { isLg && 
                (<View style={[styles.container,isLg && { flex: 1, flexDirection: 'column', opacity: 100, height },isXl && { width: '30%', opacity: 100 }]}>
                    <View style={styles.innerContainer}>
                    <Image 
                        style={styles.logo} 
                        source={require("../../../assets/logo.png")} 
                        alt="logo"
                    />
                        <View style={styles.logoSide}>
                            <Text style={{...stUtil.h1, color: stColors.oxfordBlueShades[300]}}>Manage your files the best way</Text>
                            <Text style={{...stUtil.body1}}> This is a place where you can store all your documents.</Text>
                        </View>
                        <Pressable
                            style={{width: 342, height: 342 }}
                            onHoverIn={() => {scale.value = withTiming(1.1, { duration: 200 })}}
                            onHoverOut={() => {scale.value = withTiming(1, { duration: 200 })}}
                            >
                            <Animated.Image
                                source={require("../../../assets/fileSearch.png")}
                                style={[styles.fileSearch, animatedStyle]}
                                resizeMode="cover"
                            />
                        </Pressable>
                    </View>
                </View>
            )}
            <View style={{flex: 1}}>
                <Stack screenOptions={{ headerShown: false }}>
                    <Stack.Screen name="sign-in" />
                    <Stack.Screen name="sign-up" />
                </Stack>
            </View>
        </View>
    )
}

const getStyles = (height: number) =>
    StyleSheet.create({
        container: {
            flex: 1,
            alignItems: "center",
            justifyContent: "center",
            padding: 10,
            minHeight: height,
            backgroundColor: stColors.brand,
            opacity: 0,
            height: 0,
        },
        innerContainer: {
            flex: 1,
            maxHeight: 800,
            maxWidth: 430,
            flexDirection: "column",
            justifyContent: "space-between",
            marginVertical: 48,
        },
        logo: {
            width: 264,
            height: 122,
            resizeMode: "contain",
        },
        fileSearch: {
            width: 342,
            height: 342,
            resizeMode: "contain",
        },
    })