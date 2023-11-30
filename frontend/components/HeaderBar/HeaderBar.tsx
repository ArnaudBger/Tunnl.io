import React from "react"
import { View, Text, StyleSheet, Dimensions } from "react-native"
import Avatar from "../Avatar/Avatar" // Assuming Avatar is also a React Native component
import Icon from "react-native-vector-icons/Ionicons"
import { TouchableOpacity } from "react-native"
import { APIENDPOINT } from "@env"
interface HeaderBarProps {
    userName: string
    wallet: string
    userEmail: string
    checklogin: () => void
}

const HeaderBar: React.FC<HeaderBarProps> = ({ checklogin, userName, wallet, userEmail }) => {
    const logout = async () => {
        if (APIENDPOINT) {
            try {
                const response = await fetch(`${APIENDPOINT}users/logout/`, {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json"
                    },
                    credentials: "include"
                })

                if (!response.ok) {
                    throw new Error(`Error `)
                }
                alert("log out successful!")
            } catch (error) {
            } finally {
                checklogin()
            }
        } else {
            console.log("API endpoint is not defined")
        }
    }

    return (
        <View style={styles.headerBar}>
            <View style={styles.profileGroup}>
                <Avatar badge={false} src="image-1" />
                <Text style={styles.textWrapper}>{userName}</Text>
            </View>
            <TouchableOpacity
                style={styles.settingsLink}
                onPress={() => {
                    logout()
                }}
            >
                <Icon name="log-out-outline" size={24} />
            </TouchableOpacity>
        </View>
    )
}

const screenWidth = Dimensions.get("window").width
const styles = StyleSheet.create({
    headerBar: {
        position: "absolute",
        top: 0,
        left: 0,
        right: 0,
        backgroundColor: "#ffffff",
        borderBottomWidth: 1,
        borderColor: "#cccccc",
        height: 104,
        width: screenWidth,
        flexDirection: "row", // Arrange children horizontally
        alignItems: "center", // Center children vertically
        justifyContent: "space-between", // Space between profileGroup and settingsLink
        paddingTop: 50
    },

    profileGroup: {
        flexDirection: "row", // Arrange children of profileGroup horizontally
        alignItems: "center", // Center children vertically
        marginLeft: 20 // Add some margin to the left
        // Remove flex: 1 and flexGrow: 1 to allow natural sizing
    },

    textWrapper: {
        color: "#000000",
        fontFamily: "System",
        fontSize: 14
    },

    settingsLink: {
        marginRight: 10, // Add some margin to the right
        alignItems: "center" // Center the icon vertically
    }
    // ... other styles ...
})

export default HeaderBar
