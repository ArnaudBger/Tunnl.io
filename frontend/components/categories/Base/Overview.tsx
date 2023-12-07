import { useQuery, gql } from "@apollo/client"
import { View, Text, StyleSheet, Dimensions, TouchableOpacity } from "react-native"
import { AntDesign } from "@expo/vector-icons"
import { GET_TOTAL_EARNED_BY_INFLUENCER } from '../../../queries/getTotalEarned';


interface BaseProps {
    userName: string
    wallet: string
    userEmail: string
}
const Overview: React.FC<BaseProps> = ({ userName, wallet, userEmail }) => {
    const { loading, error, data} = useQuery(GET_TOTAL_EARNED_BY_INFLUENCER, {variables: { influencerId: wallet.toLowerCase() }});
    
    return (
        <View style={styles.container}>
            <View style={styles.upperPart}>
                <Text style={styles.upperPartTitle}>My Overview</Text>
            </View>
            <View style={styles.cardsContainer}>
                <View style={styles.bigCard}>
                    <View style={styles.upperPartBigCard}>
                        <Text style={styles.upperPartCardTitle}>wallet address</Text>
                    </View>
                    <View>
                        <Text style={styles.value}>{wallet}</Text>
                    </View>
                </View>
                <View style={styles.bigCard}>
                    <View style={styles.upperPartBigCard}>
                        <Text style={styles.upperPartCardTitle}>Total value earned within our platform</Text>
                    </View>
                    <View>
                        <Text style={styles.value}>
                                {data && data.user && data.user.totalAmountEarned ? data.user.totalAmountEarned : '0'} $TNL
                        </Text>
                    </View>
                </View>
                <View style={styles.littleCardsContainer}>
                    <View style={styles.littleCard1}>
                        <View>
                            <Text style={styles.upperPartCardTitle}>Email</Text>
                        </View>
                        <Text style={styles.value}>{userEmail}</Text>
                    </View>
                    <View style={styles.littleCard2}>
                        <View>
                            <Text style={styles.upperPartCardTitle}>Change</Text>
                        </View>
                        <View>
                            <Text style={styles.value}>Values</Text>
                        </View>
                    </View>
                </View>
                <TouchableOpacity style={styles.footerPart}>
                    <Text style={styles.footerText}> Show more</Text>
                    <AntDesign name="arrowright" size={16} color="black" />
                </TouchableOpacity>
            </View>
        </View>
    )
}

const screenWidth = Dimensions.get("window").width

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 20,
        justifyContent: "center",
        width: screenWidth,
        flexDirection: "column"
    },

    upperPart: {
        flexDirection: "row", // Arrange children of profileGroup horizontally
        alignItems: "center", // Center children vertically
        marginBottom: 30
    },

    upperPartTitle: {
        fontFamily: "System",
        fontSize: 20,
        fontWeight: "500"
    },

    cardsContainer: {
        flexDirection: "column"
    },

    bigCard: {
        flex: 1,
        backgroundColor: "#E8EAF1",
        padding: 10,
        borderRadius: 7, // Adjust this value for desired roundness
        marginBottom: 7
    },

    upperPartBigCard: {
        flexDirection: "row", // Arrange children of profileGroup horizontally
        alignItems: "center" // Center children vertically
    },

    upperPartCardTitle: {
        color: "#7F828B"
    },

    value: {
        fontSize: 12
    },

    littleCard1: {
        flex: 1,
        backgroundColor: "#E8EAF1",
        padding: 10,
        borderRadius: 7 // Adjust this value for desired roundness
    },

    littleCard2: {
        flex: 1,
        backgroundColor: "#E8EAF1",
        padding: 10,
        marginLeft: 7,
        borderRadius: 7 // Adjust this value for desired roundness
    },

    littleCardsContainer: {
        flexDirection: "row",
        justifyContent: "space-between" // This distributes space evenly
    },

    footerPart: {
        flexDirection: "row",
        alignItems: "center",
        marginTop: 20,
        marginLeft: 280
    },
    footerText: {
        marginRight: 5,
        fontWeight: "500"
    }
})
export default Overview
