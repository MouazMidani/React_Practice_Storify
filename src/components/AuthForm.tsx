import { FC, useState } from "react"
import { View, Text, TextInput, TouchableOpacity, StyleSheet } from "react-native"
import { Colors, util } from "../../Styleguide"
import { useRouter } from "expo-router"
import { createAccount, signIn } from "../../lib/hooks/userHook"
import OTPModal from "./OTPModal"
type FormType = "sign-in" | "sign-up"

interface AuthFormProps {
  type: FormType
}

const AuthForm: FC<AuthFormProps> = ({ type }) => {
  const [isLoading, setIsLoading] = useState<boolean>(false)
  
  const [email, setEmail] = useState<string>("")
  const [isValidEmail, setIsValidEmail] = useState<boolean>(true)
  
  const [fullName, setFullName] = useState<string>("")
  
  const [accountId, setAccountId] = useState(null)

  const [password, setPassword] = useState<string>("")
  const [showPassword, setShowPassword] = useState(false)
  const [errorMessage, setErrorMessage] = useState<string>("")
  
  const validateEmail = (value: string) => {
    setEmail(value)
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    email.length > 1 && setIsValidEmail(emailRegex.test(value)) 
  }
  const router = useRouter()

  const isSignUp = type === "sign-up"

  const handleSubmit = async () => {
    console.log("-> ", { email, password, ...(isSignUp && { fullName }) })
    try {
        setIsLoading(() => true)
        console.log("-> here")
        const user = 
          isSignUp ? await createAccount({fullName, email}) : await signIn({email})

        setAccountId(() => user.accountId)
    } catch (error) {
        setErrorMessage(() => "Failed to create account. Please try again later.")
    } finally {
        setIsLoading(() => false)
    }
  }

  return (
    <View style={styles.container}>
      {/* Title Section */}
      <View style={{paddingHorizontal: 32}}>
        <View style={styles.titleSection}>
          <Text style={[util.h1, styles.title]}>
            {isSignUp ? "Sign Up" : "Sign In"}
          </Text>
          <Text style={[util.body1, styles.subtitle]}>
            {isSignUp 
              ? "Create your account to get started" 
              : "Welcome back! Please enter your details"}
          </Text>
        </View>

        {/* Form Card */}
        <View style={styles.formCard}>
          {/* Full Name Field - Only for Sign Up */}
          {isSignUp && (
            <View style={styles.inputGroup}>
              <Text style={[util.subtitle2, styles.label]}>Full Name</Text>
              <TextInput
                value={fullName}
                onChangeText={setFullName}
                placeholder="John Doe"
                placeholderTextColor={Colors.light[200]}
                style={[util.body1, styles.input]}
                readOnly={isLoading}
              />
            </View>
          )}

          {/* Email Field */}
          <View style={styles.inputGroup}>
            <Text style={[util.subtitle2, styles.label]}>Email Address</Text>
            <TextInput
              value={email}
              onChangeText={validateEmail}
              placeholder="you@example.com"
              placeholderTextColor={Colors.light[200]}
              keyboardType="email-address"
              autoCapitalize="none"
              style={[util.body1, styles.input]}
              readOnly={isLoading}
            />
            {!isValidEmail && (<Text style={{color: "red"}}>Invalid Email</Text>)}
          </View>

          {/* Submit Button */}
          <TouchableOpacity
            onPress={handleSubmit}
            style={styles.submitButton}
            activeOpacity={0.8}
          >
            <Text style={[util.button, styles.submitButtonText]}>
              {isSignUp ? "Create Account" : "Sign In"}
            </Text>
          </TouchableOpacity>

          {/* Divider */}
          <View style={styles.dividerContainer}>
            <View style={styles.dividerLine} />
            <Text style={[util.caption, styles.dividerText]}>{isSignUp ? "Already have an account? " : "Don't have an account? "}</Text>
            <View style={styles.dividerLine} />
          </View>

          {/* Switch Form Type */}
          <View style={styles.switchContainer}>
            <TouchableOpacity
              onPress={() => router.navigate(`/${isSignUp ? "sign-in" : "sign-up"}`)}
            >
              <Text style={[util.subtitle2, styles.switchLink]}>
                {isSignUp ? "Sign In" : "Sign Up"}
              </Text>
            </TouchableOpacity>
          </View>
          
        </View>
      </View>
      {accountId && email && (
        <OTPModal email={email} _accountId={accountId} />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingBottom: 40,
  },
  titleSection: {
    marginVertical: 32,
  },
  title: {
    color: Colors.oxfordBlue,
    marginBottom: 8,
    marginHorizontal: 'auto'
  },
  subtitle: {
    color: Colors.oxfordBlue,
    opacity: 0.7,
    marginHorizontal: 'auto'
  },
  formCard: {
    backgroundColor: Colors.white,
    borderRadius: 24,
    padding: 24,
    shadowColor: Colors.black,
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 5,
  },
  inputGroup: {
    marginBottom: 20,
  },
  label: {
    color: Colors.oxfordBlue,
    marginBottom: 8,
  },
  input: {
    width: "100%",
    height: 52,
    borderWidth: 2,
    borderColor: Colors.platinum,
    borderRadius: 12,
    paddingHorizontal: 16,
    color: Colors.oxfordBlue,
    backgroundColor: Colors.white,
  },
  submitButton: {
    width: "100%",
    height: 52,
    backgroundColor: Colors.orangeWeb,
    borderRadius: 12,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 24,
    shadowColor: Colors.orangeWeb,
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 4,
  },
  submitButtonText: {
    color: Colors.white,
    fontWeight: "600",
  },
  dividerContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginVertical: 24,
  },
  dividerLine: {
    flex: 1,
    height: 1,
    backgroundColor: Colors.platinum,
  },
  dividerText: {
    color: Colors.oxfordBlue,
    opacity: 0.6,
    paddingHorizontal: 12,
  },
  switchContainer: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
  },
  switchText: {
    color: Colors.oxfordBlue,
    opacity: 0.7,
  },
  switchLink: {
    color: Colors.orangeWeb,
  },
})

export default AuthForm