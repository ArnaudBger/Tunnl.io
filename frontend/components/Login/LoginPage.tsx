import { GetStartedPageProps } from "@/utils/StackNavigation"
import React, { useState } from "react"
import { View, Text, TextInput, TouchableOpacity, StyleSheet } from "react-native"
import { APIENDPOINT } from "@env"
export default function LoginUserPage({ navigation, setState, checklogin }: GetStartedPageProps) {
    const [email, setEmail] = useState("")
    const [code, setCode] = useState("")
    const [loginStage, setLoginStage] = useState<"email" | "verify">("email")

    const emailLogin = async () => {
        if (APIENDPOINT) {
            try {
                const response = await fetch(`${APIENDPOINT}users/login/`, {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json"
                    },
                    body: JSON.stringify({ email: email })
                })

                if (!response.ok) {
                    alert("Please create your account")
                    throw new Error(`Error`)
                }

                setLoginStage("verify")
            } catch (error) {
            } finally {
            }
        } else {
            console.log("API endpoint is not defined")
        }
    }

    const completeLogin = async () => {
        if (APIENDPOINT) {
            try {
                const response = await fetch(`${APIENDPOINT}users/codelogin/`, {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json"
                    },
                    body: JSON.stringify({ email, code })
                })

                if (!response.ok) {
                    alert("Your verification code is invalid")
                    throw new Error(`Error `)
                }
                if (checklogin) checklogin()
                alert("login successful!")
            } catch (error) {
            } finally {
            }
        } else {
            console.log("API endpoint is not defined")
        }
    }
    return (
        <>
            {loginStage === "email" && (
                <View style={styles.container}>
                    <Text style={styles.title}>HAHA</Text>
                    <Text style={styles.subtitle}>
                        Smart agreements that pay automatically when reached
                    </Text>

                    <TextInput
                        style={styles.input}
                        onChangeText={setEmail}
                        value={email}
                        placeholder="Email Address"
                        keyboardType="email-address"
                    />

                    <TouchableOpacity
                        disabled={!email}
                        style={styles.button}
                        onPress={() => {
                            emailLogin()
                        }}
                    >
                        <Text style={styles.buttonText}>Sign in</Text>
                    </TouchableOpacity>

                    <Text style={styles.termsText}>
                        By continuing, you have read and agree to our Terms and Conditions and
                        Privacy Statement.
                    </Text>

                    <TouchableOpacity
                        style={styles.buttonOutline}
                        onPress={() => {
                            if (setState) setState("RegisterPage")
                        }}
                    >
                        <Text style={styles.buttonOutlineText}>Create an account</Text>
                    </TouchableOpacity>
                </View>
            )}
            {loginStage === "verify" && (
                <View style={styles.container}>
                    <Text style={styles.title}>Check your email</Text>
                    <Text style={styles.subtitle}>your verification code</Text>
                    <TextInput
                        style={styles.input}
                        onChangeText={setCode}
                        value={code}
                        placeholder="verification code"
                        keyboardType="default"
                    />

                    <TouchableOpacity
                        disabled={!code}
                        style={styles.button}
                        onPress={() => {
                            completeLogin()
                        }}
                    >
                        <Text style={styles.buttonText}>Continue</Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                        style={styles.buttonOutline}
                        onPress={() => {
                            if (setState) setState("LoginPage")
                        }}
                    >
                        <Text style={styles.buttonOutlineText}>Back</Text>
                    </TouchableOpacity>
                </View>
            )}
        </>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 20,
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: "#fff"
    },
    title: {
        fontSize: 32,
        fontWeight: "bold",
        color: "#000",
        marginBottom: 10
    },
    subtitle: {
        width: "75%",
        fontSize: 20,
        textAlign: "center",
        fontWeight: "700",
        marginBottom: 40
    },
    input: {
        height: 50,
        width: "100%",
        marginVertical: 10,
        borderWidth: 1,
        padding: 10,
        borderRadius: 5,
        borderColor: "#ddd"
    },
    button: {
        backgroundColor: "rgba(0, 255, 255, 1)",
        borderRadius: 25,
        padding: 15,
        width: "100%",
        alignItems: "center",
        marginTop: 20
    },
    buttonText: {
        color: "#14161B",
        fontSize: 18
    },
    termsText: {
        fontSize: 10,
        color: "#888",
        textAlign: "left",
        marginTop: 20
    },
    linkText: {
        color: "#00BFFF",
        marginTop: 20
    },
    buttonOutline: {
        borderWidth: 1,
        borderColor: "rgba(20, 22, 27, 1)",
        borderRadius: 25,
        padding: 15,
        width: "100%",
        alignItems: "center",
        marginTop: 20
    },
    buttonOutlineText: {
        color: "rgba(20, 22, 27, 1)",
        fontSize: 18
    }
})
