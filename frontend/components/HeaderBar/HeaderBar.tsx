import React from "react"
import { View, Text, StyleSheet, Dimensions, TextInput } from "react-native"
import Avatar from "../Avatar/Avatar" // Assuming Avatar is also a React Native component
import Icon from "react-native-vector-icons/Ionicons"
import { TouchableOpacity } from "react-native"
import { APIENDPOINT } from "@env"
interface HeaderBarProps {
    userName: string
    wallet: string
    userEmail: string
    checklogin: () => void
    activeCategory: string
}

const HeaderBar: React.FC<HeaderBarProps> = ({ checklogin, userName, wallet, userEmail, activeCategory }) => {
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
        <View style={styles.headerBar}>{activeCategory === "Discover" ? (
              <View style={styles.discoverContainer}>
                <Avatar badge={false} src="image-1" />
                <View style={styles.searchContainer}>
                <Icon name="search-outline" size={20} style={styles.searchIcon} />
                <TextInput
                    placeholder="Search"
                    style={styles.searchInput}
                    />
                </View>
              </View>
            ) : activeCategory === "Notifications" ? (
              <View style={styles.notificationsContainer}>
                  <Text style={styles.notificationsTitle}>Notifications</Text>
              </View>
          ) : (
                <View style={styles.baseContainer}>
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
            )}
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
        justifyContent: "center",
        paddingTop: 50
    },

    baseContainer: {
      flexDirection: "row",
      justifyContent: "space-between", // Space between profileGroup and settingsLink
      alignItems: "center",
      width: "100%",
      paddingHorizontal: 25, // Add some margin to the left
    },

    notificationsContainer: {
      justifyContent: "center",
      alignItems: "center",
    },

    notificationsTitle: {
      fontSize: 20,
      fontFamily: "System",
      fontWeight: "600", // Semi-bold font weight
    },

    profileGroup: {
        flexDirection: "row", // Arrange children of profileGroup horizontally
        alignItems: "center", // Center children vertically
        // Remove flex: 1 and flexGrow: 1 to allow natural sizing
    },

    searchContainer: {
      flexDirection: "row", // Arrange children of profileGroup horizontally
      alignItems: "center", // Center children vertically
      borderWidth: 1,
      padding:8,
      borderRadius: 8,
      borderColor: "#cccccc",
      width:300,
  },

  discoverContainer: {
    flexDirection: "row", // Arrange children of profileGroup horizontally
    alignItems: "center", // Center children vertically
    width: "100%",
    paddingHorizontal: 25,
  },

    textWrapper: {
        color: "#000000",
        fontFamily: "System",
        fontSize: 14
    },

    searchInput: {
      marginLeft: 8,
    },

    settingsLink: {
    },
    
    searchIcon: {
  },
})

export default HeaderBar
