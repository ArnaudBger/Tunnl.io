import { useQuery, gql} from '@apollo/client'
import { View, StyleSheet, Dimensions} from "react-native"
import Overview from "./Base/Overview"
import ForYou from "./Base/ForYou"
import ActiveBrand from "./Base/ActiveBrand"
export default function Base() {
    return (
        <View>
        <Overview />
        <ForYou />
        <ActiveBrand />
        </View>
    );
}


const screenWidth = Dimensions.get('window').width;

const styles = StyleSheet.create({
  container: {
      flex: 1,
      padding: 20,
      justifyContent: "center",
      alignItems: "center",
      width: screenWidth,
  },

  upperPart:{

  }
})
