import { View, Text, StyleSheet, Dimensions, ImageBackground } from "react-native";

const screenWidth = Dimensions.get('window').width;

export default function ActiveBrand() {
    return (
        <View style={styles.container}>
            <View style={styles.upperPart}>
                <Text style={styles.upperPartTitle}>
                    Most active brand this week
                </Text>
            </View>
            <View style={styles.cardContainer}>
                <ImageBackground 
                    source={require("../../../images/image-3-2x.png")} 
                    style={styles.imageBackground}
                    resizeMode="cover" 
                >
                    <View style={styles.upperCard}>
                        <View style={styles.part1ContentLeft}>
                            <Text style={styles.upperCardTitle}>Blur</Text>
                            <Text style={styles.upperCardValue}>12 Active</Text>
                        </View>
                    </View>
                </ImageBackground>
            </View>
            <View style={styles.bottomCards}>
                <View style={styles.bottomCardContainer}>
                    <ImageBackground 
                        source={require("../../../images/image-3-2.png")} 
                        style={styles.imageBackground}
                        resizeMode="cover" 
                    >
                        <View style={styles.leftCard}>
                            <View style={styles.part1ContentLeft}>
                                <Text style={styles.upperCardValue}>11 Active</Text>
                            </View>
                        </View>
                    </ImageBackground>
                </View>
                <View style={styles.bottomCardContainer}>
                    <ImageBackground 
                        source={require("../../../images/image-3-1.png")} 
                        style={styles.imageBackground}
                        resizeMode="cover" 
                    >
                        <View style={styles.rightCard}>
                            <View style={styles.part1ContentLeft}>
                                <Text style={styles.upperCardValue}>8 Active</Text>
                            </View>
                        </View>
                    </ImageBackground>
                </View>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 20,
        marginTop: 50,
        justifyContent: "center",
        flexDirection: "column",
        marginBottom: 100,
    },
    upperPartTitle: {
        fontFamily: 'System',
        fontSize: 25,
        fontWeight: "600",
    },
    bottomCards: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
    },
    cardContainer: {
        borderRadius: 10,
        overflow: 'hidden',
        marginTop: 50,
        justifyContent: "center",
    },

    bottomCardContainer: {
        borderRadius: 10,
        overflow: 'hidden',
        width: screenWidth /2 - 23,
        marginTop: 6,
    },

    imageBackground: {
        flex: 1,
        justifyContent: 'center',
        padding:20,
    },
    upperCard: {
        flexDirection: "column",
        borderRadius: 10,
        paddingLeft: 15,
        paddingBottom: 10,
        marginTop: 100,
    },
    upperCardTitle: {
        color: "#FFFFFF",
        fontSize: 20,
        fontFamily: "System",
        marginBottom: 10,
        fontWeight: 900
    },
    upperCardValue: {
        color: "#FFFFFF",
        fontSize: 12,
        fontFamily: "System",
    },
    rightCard: {
        flexDirection: "column",
        padding: 20,
        marginTop: 100
    },
    leftCard: {
        flexDirection: "column",
        padding: 20,
        marginTop: 100,
    }
});
