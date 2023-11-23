import * as React from "react"
import { StatusBar } from "expo-status-bar"
import { StyleSheet, View } from "react-native"
import { NavigationContainer } from "@react-navigation/native"
import { createStackNavigator } from "@react-navigation/stack"
import GetStartedPage from "./components/GetStartedPage"
import LoginPage from "./components/Login"

const Stack = createStackNavigator()

export default function App() {
    return (
        <NavigationContainer>
            <Stack.Navigator
                screenOptions={{
                    headerShown: false,
                }}
            >
                <Stack.Screen name="GetStarted" component={GetStartedPage} />
                <Stack.Screen name="Login" component={LoginPage} />
            </Stack.Navigator>
            <StatusBar style="auto" />
        </NavigationContainer>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#fff",
        alignItems: "center",
        justifyContent: "center",
    },
})
