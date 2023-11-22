import React, { useEffect, useState } from "react"
import { View, Text, TouchableOpacity, StyleSheet } from "react-native"
import { APIENDPOINT } from "@env"

export default function MyDropdown() {
    const [isVisible, setIsVisible] = useState<boolean>(false)
    const [result, setReslut] = useState<string>("")
    const getResult = async () => {
        if (APIENDPOINT)
            try {
                const response = await fetch(APIENDPOINT)

                if (!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status}`)
                }

                const data: { success: string } = await response.json()

                setReslut(`connected backend ${data.success}`)
            } catch (error) {}
    }

    useEffect(() => {
        getResult()
    }, [])

    return (
        <View style={styles.container}>
            <TouchableOpacity onPress={() => setIsVisible(!isVisible)}>
                <Text>DEAL</Text>
                <Text>{result}</Text>
            </TouchableOpacity>
            {isVisible && (
                <View style={styles.dropdown}>
                    <TouchableOpacity
                        onPress={() => console.log("Account settings")}
                        style={styles.item}
                    >
                        <Text>Account settings</Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                        onPress={() => console.log("Documentation")}
                        style={styles.item}
                    >
                        <Text>Documentatiosn</Text>
                    </TouchableOpacity>
                    {/* This item is disabled and not pressable */}
                    <View style={[styles.item, styles.disabled]}>
                        <Text>Invite a friend (coming soon!)</Text>
                    </View>
                </View>
            )}
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        width: "100%",
        height: "100%",
        backgroundColor: "pink",
        fontSize: "100px",
    },
    dropdown: {
        // Styles for your dropdown menu
    },
    item: {
        // Styles for your menu item
        padding: 10,
    },
    disabled: {
        // Styles for your disabled item
        opacity: 0.75,
    },
})
