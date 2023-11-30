import { View, StyleSheet, Dimensions, Text} from "react-native"
import NotificationCard from "./Notifications/NotificationCard";

export default function Notification({
    userName={}
}
) {

    return (
        <View style={styles.container}>
            <NotificationCard type="mintStableCoin" brand="" time="7d" />
            <NotificationCard type="mintStableCoin" brand="" time="7d" />
            <NotificationCard type="mintStableCoin" brand="" time="7d" />
        </View>
    );
}


const screenWidth = Dimensions.get('window').width;

const styles = StyleSheet.create({
  container: {
      justifyContent: "center",
      alignItems:"center",
      flexDirection:"column",
      borderRadius: 10,
      width: screenWidth,
      paddingHorizontal: 20,
  },

})
