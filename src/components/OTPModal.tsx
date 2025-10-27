import { FC, useState, useRef, useEffect } from "react"
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
} from "react-native"
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
  withTiming,
  withSequence,
  withRepeat,
  Easing,
} from "react-native-reanimated"

import { useRouter } from "expo-router"
import { sendEmailOTP, verifySecret } from "../../lib/hooks/userHook"

const OTPModal: FC<{email: string, _accountId:string}> = ({email, _accountId}: {email: string; _accountId: string}) => {
  const [otp, setOtp] = useState<string[]>(["", "", "", "", "", ""])
  const [isVerifying, setIsVerifying] = useState<boolean>(false)
  const [isSuccess, setIsSuccess] = useState<boolean>(false)
  const inputRefs = useRef<(TextInput | null)[]>([])
  const [accountId, setAccountId] = useState(_accountId)
  console.log("-> ", accountId, _accountId)
  const router = useRouter()

  // Animated values
  const shakeTranslate = useSharedValue(0)
  const buttonScale = useSharedValue(1)
  const successOpacity = useSharedValue(0)
  const successTranslate = useSharedValue(-10)
  const spinRotation = useSharedValue(0)

  useEffect(() => {
    inputRefs.current[0]?.focus()
  }, [])

  useEffect(() => {
    if (isVerifying) {
      spinRotation.value = withRepeat(
        withTiming(360, { duration: 1000, easing: Easing.linear }),
        -1,
        false
      )
    }
  }, [isVerifying])

  useEffect(() => {
    if (isSuccess) {
      successOpacity.value = withTiming(1, { duration: 300 })
      successTranslate.value = withTiming(0, { duration: 300 })
    } else {
      successOpacity.value = 0
      successTranslate.value = -10
    }
  }, [isSuccess])

  const handleChange = (index: number, value: string) => {
    if (value.length > 1) value = value.slice(-1)
    if (!/^\d*$/.test(value)) return

    const newOtp = [...otp]
    newOtp[index] = value
    setOtp(newOtp)

    if (value && index < 5)
      inputRefs.current[index + 1]?.focus()
  }

  const handleKeyPress = (index: number, key: string) => key === "Backspace" && !otp[index] && index > 0 && inputRefs.current[index - 1]?.focus()

  const triggerShake = () => {
    shakeTranslate.value = withSequence(
      withTiming(-8, { duration: 50 }),
      withTiming(8, { duration: 50 }),
      withTiming(-8, { duration: 50 }),
      withTiming(8, { duration: 50 }),
      withTiming(-8, { duration: 50 }),
      withTiming(0, { duration: 50 })
    )
  }

  const handleVerify = () => {
    const password = otp.join("")
    if (password.length !== 6) return

    setIsVerifying(true)
    buttonScale.value = withSpring(0.95)

    setTimeout(async () => {
      setIsVerifying(false)
      const sessionId = await verifySecret({accountId, password})
      buttonScale.value = withSpring(1)
      spinRotation.value = 0

      if (sessionId) {
        setIsSuccess(true)
        router.navigate("/")
      } else {
        triggerShake()
        setTimeout(() => {
          setOtp(["", "", "", "", "", ""])
          inputRefs.current[0]?.focus()
        }, 300)
      }
    }, 1500)
  }

  const handleResend = async () => {
    setOtp(["", "", "", "", "", ""])
    setIsSuccess(false)
    buttonScale.value = withSpring(1)
    inputRefs.current[0]?.focus()
    const userId = await sendEmailOTP({email})
    userId && setAccountId(userId)
  }

  const shakeStyle = useAnimatedStyle(() => ({
    transform: [{ translateX: shakeTranslate.value }],
  }))

  const buttonAnimatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: buttonScale.value }],
  }))

  const successStyle = useAnimatedStyle(() => ({
    opacity: successOpacity.value,
    transform: [{ translateY: successTranslate.value }],
  }))

  const spinStyle = useAnimatedStyle(() => ({
    transform: [{ rotate: `${spinRotation.value}deg` }],
  }))

  const isButtonDisabled = otp.join("").length !== 6 || isVerifying

  return (
    <View style={styles.container}>
      <Animated.View style={[styles.modal, shakeStyle]}>
        {/* Icon Circle */}
        <View style={styles.iconCircle}>
          <Text style={styles.iconText}>✉</Text>
        </View>

        <View style={styles.content}>
          <Text style={styles.title}>Verify Your Code</Text>
          <Text style={styles.subtitle}>
            Enter the 6-digit code sent to {email}
          </Text>

          {/* OTP Input */}
          <View style={styles.otpContainer}>
            {otp.map((digit, index) => (
              <TextInput
                key={index}
                // ref={(el) => (inputRefs.current[index] = el)}
                style={[
                  styles.otpInput,
                  digit && styles.otpInputFilled,
                  isSuccess && styles.otpInputSuccess,
                ]}
                keyboardType="numeric"
                maxLength={1}
                value={digit}
                onChangeText={(value) => handleChange(index, value)}
                onKeyPress={({ nativeEvent }) =>
                  handleKeyPress(index, nativeEvent.key)
                }
                editable={!isVerifying && !isSuccess}
                selectTextOnFocus
              />
            ))}
          </View>

          {/* Success Message */}
          {isSuccess && (
            <Animated.View style={[styles.successContainer, successStyle]}>
              <Text style={styles.successIcon}>✓</Text>
              <Text style={styles.successText}>Verification Successful!</Text>
            </Animated.View>
          )}

          {/* Verify Button */}
          <Animated.View style={buttonAnimatedStyle}>
            <TouchableOpacity
              style={[
                styles.button,
                isSuccess && styles.buttonSecondary,
                isButtonDisabled && styles.buttonDisabled,
              ]}
              onPress={isSuccess ? handleResend : handleVerify}
              disabled={isButtonDisabled}
              activeOpacity={0.8}
            >
              {isVerifying ? (
                <View style={styles.buttonContent}>
                  <Animated.View style={spinStyle}>
                    <Text style={styles.spinner}>⟳</Text>
                  </Animated.View>
                  <Text style={styles.buttonText}>Verifying...</Text>
                </View>
              ) : (
                <Text style={styles.buttonText}>
                  {isSuccess ? "Try Again" : "Verify Code"}
                </Text>
              )}
            </TouchableOpacity>
          </Animated.View>

          {/* Resend Code */}
          {!isSuccess && (
            <TouchableOpacity onPress={handleResend} style={styles.resendButton}>
              <Text style={styles.resendText}>
                Didn't receive the code? Resend
              </Text>
            </TouchableOpacity>
          )}
        </View>

        {/* Decorative corner */}
        <View style={styles.decorativeCorner}>
          <View style={styles.decorativeCircle} />
        </View>
      </Animated.View>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    position: "absolute",
    backgroundColor: "#14213d4D",
    height: "100%", width: "100%",
    padding: 16,
    justifyContent: "center",
    alignItems: "center",
  },
  modal: {
    width: "100%",
    maxWidth: 420,
    backgroundColor: "#ffffff",
    borderRadius: 24,
    padding: 32,
    shadowColor: "#000000",
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.3,
    shadowRadius: 20,
    elevation: 10,
  },
  iconCircle: {
    position: "absolute",
    top: -48,
    left: "50%",
    marginLeft: -48,
    width: 96,
    height: 96,
    borderRadius: 48,
    backgroundColor: "#fca311",
    justifyContent: "center",
    alignItems: "center",
    shadowColor: "#000000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 8,
  },
  iconText: {
    fontSize: 48,
    color: "#ffffff",
  },
  content: {
    marginTop: 40,
  },
  title: {
    fontSize: 28,
    fontWeight: "bold",
    color: "#14213d",
    textAlign: "center",
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 14,
    color: "#000000",
    opacity: 0.6,
    textAlign: "center",
    marginBottom: 32,
  },
  otpContainer: {
    flexDirection: "row",
    justifyContent: "center",
    gap: 12,
    marginBottom: 32,
  },
  otpInput: {
    width: 48,
    height: 56,
    borderWidth: 2,
    borderColor: "#e5e5e5",
    borderRadius: 12,
    fontSize: 24,
    fontWeight: "bold",
    color: "#14213d",
    textAlign: "center",
    backgroundColor: "#ffffff",
  },
  otpInputFilled: {
    borderColor: "#fca311",
  },
  otpInputSuccess: {
    backgroundColor: "#e5e5e5",
  },
  successContainer: {
    backgroundColor: "#e5e5e5",
    borderRadius: 12,
    padding: 16,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    marginBottom: 24,
  },
  successIcon: {
    fontSize: 24,
    color: "#fca311",
  },
  successText: {
    fontSize: 16,
    fontWeight: "600",
    color: "#14213d",
  },
  button: {
    backgroundColor: "#fca311",
    borderRadius: 12,
    padding: 16,
    alignItems: "center",
    marginBottom: 16,
  },
  buttonSecondary: {
    backgroundColor: "#14213d",
  },
  buttonDisabled: {
    opacity: 0.5,
  },
  buttonContent: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  buttonText: {
    color: "#ffffff",
    fontSize: 18,
    fontWeight: "600",
  },
  spinner: {
    fontSize: 20,
    color: "#ffffff",
  },
  resendButton: {
    alignItems: "center",
  },
  resendText: {
    fontSize: 14,
    color: "#fca311",
    fontWeight: "500",
  },
  decorativeCorner: {
    position: "absolute",
    bottom: 0,
    right: 0,
    width: 128,
    height: 128,
    overflow: "hidden",
    borderBottomRightRadius: 24,
    opacity: 0.1,
  },
  decorativeCircle: {
    position: "absolute",
    bottom: 0,
    right: 0,
    width: 160,
    height: 160,
    borderRadius: 80,
    backgroundColor: "#fca311",
  },
});

export default OTPModal