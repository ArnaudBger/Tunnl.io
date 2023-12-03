import React, { useState } from "react"
import { View, ScrollView, StyleSheet } from "react-native"
import Contracts from "./Categories/Contracts"
import { MobileNav } from "./Footer/NavBar/Navbar"
import HeaderBar from "./HeaderBar/HeaderBar"
import Base from "./Categories/Base"
import Discover from "./Categories/Discover"
import Notifications from "./Categories/Notifications"
import Chats from "./Categories/Chats"

interface HomeProps {
    userName: string
    wallet: string
    userEmail: string
    pk: string
    checklogin: () => void
    navigation: any
}

const Home: React.FC<HomeProps> = ({ userName, wallet, userEmail, checklogin, pk }) => {
    const [activeCategory, setActiveCategory] = useState("Home")
    // Function to determine which component to render
    const renderCategoryComponent = () => {
        switch (activeCategory) {
            case "Home":
                return <Base userName={userName} wallet={wallet} userEmail={userEmail} />
            case "Discover":
                return <Discover />
            case "Contracts":
                return <Contracts />
            case "Notifications":
                return <Notifications />
            case "Chat":
                return <Chats/>
        }
    }
    return (
        <View style={styles.container}>
            <HeaderBar
                checklogin={checklogin}
                userName={userName}
                wallet={wallet}
                userEmail={userEmail}
                activeCategory={activeCategory}
            />
            <ScrollView style={styles.scrollableView}>{renderCategoryComponent()}</ScrollView>
            <MobileNav activeCategory={activeCategory} setActiveCategory={setActiveCategory} />
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        flexDirection: "column"
    },
    scrollableView: {
        flex: 1,
        marginTop: 104, // Adjust this value based on the height of your HeaderBar
        backgroundColor: "#F2F3F6"
    }
})

export default Home
