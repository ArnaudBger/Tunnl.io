import React, { useState } from "react"
import { View, Text, TextInput, TouchableOpacity, StyleSheet } from "react-native"
import Contracts from "./categories/Contracts"
import { MobileNav } from './Footer/NavBar/Navbar';

export default function Home() {
    const [activeCategory, setActiveCategory] = useState('Home');

    // Function to determine which component to render
    const renderCategoryComponent = () => {
        switch (activeCategory) {
            case 'Home':
                return ;
            case 'Discover':
                return ;
            case 'Contracts':
                return <Contracts />;
            case 'Notifications':
                return ;
            case 'Chat':
                return;
            default:
                return ; // Default case
        }
    };
    return (
        <View style={styles.container}>
            {renderCategoryComponent()}
            <MobileNav activeCategory={activeCategory} setActiveCategory={setActiveCategory} />
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 12,
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
