import { View, Text, StyleSheet, Dimensions, TouchableOpacity} from "react-native"
import ForYouCard from "./ForYou/ForYouCard"
import Swiper from "react-native-swiper"

const screenWidth = Dimensions.get('window').width;



export default function ForYou() {
    
    return (
        <View style={styles.container}>
            <View style={styles.upperPart}>
                <Text style={styles.upperPartTitle}>
                For You
                </Text>
            </View>
                <Swiper
                    style={styles.wrapper}
                    showsButtons={false}
                    loop={true}
                    autoplay={true}
                    autoplayTimeout={5}
                    dot={<View style={styles.dot} />}
                    activeDot={<View style={styles.activeDot} />}
                    paginationStyle={styles.paginationStyle}
                
                >
                  <ForYouCard brandName="Supreme" campaignName="Supreme Campaign" reach="5" websiteTraffic="19000" value="$4" />
                  <ForYouCard 
                  brandName="Redbull" 
                  campaignName="Redbull Campaign" 
                  imageLogoSource={require('../../../images/image-9.png')} 
                  imageSource ={require("../../../images/rectangle-27-1.png")}
                  reach="10" 
                  websiteTraffic="20000" 
                  value="$4" 
                  url="https://www.instagram.com/redbull/?hl=en"/>
                </Swiper>
        </View>

    );
}

const styles = StyleSheet.create({
  wrapper: {
    overflow: 'visible', // Allow cards to be visible outside the swiper bounds
    height: 410,
    borderTopLeftRadius: 10,
    borderTopRightRadius: 10,
  },

  container: {
      flex: 1,
      padding: 20,
      justifyContent: "center",
      flexDirection:"column",

  },

  upperPartTitle:{
    fontFamily: 'System',
    fontSize: 25,
    fontWeight: "600",
    marginBottom: 30

  },

  cardsContainer:{
    flexDirection:"column",
  },

  bigCard: {
    flex: 1,
    backgroundColor:"#00FFFF",
    padding:10,
    borderRadius: 7, // Adjust this value for desired roundness
    marginBottom: 7,
  },


  upperPartBigCard:{
    flexDirection: 'row', // Arrange children of profileGroup horizontally
    alignItems: 'center', // Center children vertically
  },

  upperPartCardTitle: {
    color: "#7F828B"
    },

    value: {
        fontSize: 20,
    },

  littleCard1: {
        flex: 1,
        backgroundColor:"#00FFFF",
        padding:10,
        borderRadius: 7, // Adjust this value for desired roundness
  },

  littleCard2: {
    flex: 1,
    backgroundColor:"#00FFFF",
    padding:10,
    marginLeft:7,
    borderRadius: 7, // Adjust this value for desired roundness
},

  littleCardsContainer: {
    flexDirection:"row",
    justifyContent: "space-between", // This distributes space evenly
  },

  footerPart:{
    flexDirection:"row",
    alignItems:"center",
    marginTop: 20,
    marginLeft: 280
  },

  footerText: {
    marginRight: 5,
    fontWeight:500
  },

  paginationStyle: {
      position: "absolute",
      justifyContent: "flex-start",
      left: 15,
      bottom: -40,
  },
  dot: {
      backgroundColor: "transparent",
      borderWidth: 1,
      borderColor: "#14161B",
      width: 12,
      height: 12,
      borderRadius: 12,
      marginLeft: 3,
      marginRight: 3,
      marginTop: 3,
      marginBottom: 3,
  },

  activeDot: {
      backgroundColor: "#0FF",
      borderWidth: 1,
      borderColor: "#14161B",
      width: 12,
      height: 12,
      borderRadius: 12,
      marginLeft: 3,
      marginRight: 3,
      marginTop: 3,
      marginBottom: 3,
  },

  Introtext: {
      color: "#14161B",
      height: 115,
      width: "90%",
      fontSize: 28,
      fontWeight: "bold",
      textAlign: "left",
      marginBottom: 16,
  },
  explaintext: {
      color: "#545760",
      width: "90%",
      fontSize: 14,
      fontWeight: "500",
      textAlign: "left",
  },
  button: {
      position: "absolute",
      justifyContent: "flex-end",
      right: 24,
      bottom: 80,
      backgroundColor: "#0FF",
      borderRadius: 40,
      paddingVertical: 8,
      paddingHorizontal: 24,
      alignItems: "center",
      marginTop: 20,
  },

  buttonText: {
      color: "#14161B",
      fontSize: 18,
      fontWeight: "600",
      lineHeight: 32,
  },
})
