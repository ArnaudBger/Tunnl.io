import React, { useState } from "react"
import { View, ScrollView, StyleSheet } from "react-native"
import Contracts from "./categories/Contracts"
import { MobileNav } from './Footer/NavBar/Navbar';
import HeaderBar from "./HeaderBar/HeaderBar";

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
            <HeaderBar />
            <ScrollView style={styles.scrollableView}>
            {renderCategoryComponent()}
            </ScrollView>
            <MobileNav activeCategory={activeCategory} setActiveCategory={setActiveCategory} />
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        flexDirection: 'column',
    },
    scrollableView: {
        flex: 1,
        marginTop: 104, // Adjust this value based on the height of your HeaderBar
    },
})
