import { useQuery, gql } from "@apollo/client"
import { View, StyleSheet, Dimensions } from "react-native"
import Overview from "./Base/Overview"
import ForYou from "./Base/ForYou"
import ActiveBrand from "./Base/ActiveBrand"

interface BaseProps {
    userName: string
    wallet: string
    userEmail: string
}
const Base: React.FC<BaseProps> = ({ userName, wallet, userEmail }) => {
    return (
        <View>
            <Overview userName={userName} wallet={wallet} userEmail={userEmail} />
            <ForYou />
            <ActiveBrand />
        </View>
    )
}

const screenWidth = Dimensions.get("window").width

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 20,
        justifyContent: "center",
        alignItems: "center",
        width: screenWidth
    },

    upperPart: {}
})
export default Base
