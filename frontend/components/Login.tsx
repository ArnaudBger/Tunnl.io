import React, { useState } from "react"
import { View, Text, TextInput, TouchableOpacity, StyleSheet } from "react-native"

export default function LoginPage() {
    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")

    return (
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

            <TextInput
                style={styles.input}
                onChangeText={setPassword}
                value={password}
                placeholder="Password"
                secureTextEntry
            />

            <TouchableOpacity style={styles.button}>
                <Text style={styles.buttonText}>Sign in</Text>
            </TouchableOpacity>

            <Text style={styles.termsText}>
                By continuing, you have read and agree to our Terms and Conditions and Privacy
                Statement.
            </Text>

            <TouchableOpacity>
                <Text style={styles.linkText}>Forgot password?</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.buttonOutline}>
                <Text style={styles.buttonOutlineText}>Create an account</Text>
            </TouchableOpacity>
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 20,
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: "#fff",
    },
    title: {
        fontSize: 32,
        fontWeight: "bold",
        color: "#000",
        marginBottom: 10,
    },
    subtitle: {
        width: "75%",
        fontSize: 20,
        textAlign: "center",
        fontWeight: "700",
        marginBottom: 40,
    },
    input: {
        height: 50,
        width: "100%",
        marginVertical: 10,
        borderWidth: 1,
        padding: 10,
        borderRadius: 5,
        borderColor: "#ddd",
    },
    button: {
        backgroundColor: "rgba(0, 255, 255, 1)",
        borderRadius: 25,
        padding: 15,
        width: "100%",
        alignItems: "center",
        marginTop: 20,
    },
    buttonText: {
        color: "#14161B",
        fontSize: 18,
    },
    termsText: {
        fontSize: 14,
        color: "#888",
        textAlign: "left",
        marginTop: 20,
    },
    linkText: {
        color: "#00BFFF",
        marginTop: 20,
    },
    buttonOutline: {
        borderWidth: 1,
        borderColor: "rgba(20, 22, 27, 1)",
        borderRadius: 25,
        padding: 15,
        width: "100%",
        alignItems: "center",
        marginTop: 20,
    },
    buttonOutlineText: {
        color: "rgba(20, 22, 27, 1)",
        fontSize: 18,
    },
})
