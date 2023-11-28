import * as React from "react"
import {Text} from "react-native"
import { StatusBar } from "expo-status-bar"
import { StyleSheet, View } from "react-native"
import { NavigationContainer } from "@react-navigation/native"
import { createStackNavigator } from "@react-navigation/stack"
import GetStartedPage from "./components/GetStartedPage"
import LoginPage from "./components/Login"
import { ApolloClient,InMemoryCache, ApolloProvider } from "@apollo/client"
import Home from "./components/Home"

const APIURL = 'https://api.studio.thegraph.com/query/59587/haha_subgraph/v0.0.10'

const client = new ApolloClient({
    uri: APIURL,
    cache: new InMemoryCache(),
  })

const Stack = createStackNavigator()



export default function App() {
    return (
        <ApolloProvider client={client}>
        <NavigationContainer>
            <Stack.Navigator
                screenOptions={{
                    headerShown: false,
                }}
            >   
                <Stack.Screen name="Home" component={Home} />
                <Stack.Screen name="GetStarted" component={GetStartedPage} />
                <Stack.Screen name="Login" component={LoginPage} />
            </Stack.Navigator>
            <StatusBar style="auto" />
        </NavigationContainer>
        </ApolloProvider>
    ); 
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#fff",
        alignItems: "center",
        justifyContent: "center",
    },
})
