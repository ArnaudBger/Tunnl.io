import { View, Linking, Image, Text, StyleSheet, Dimensions, TouchableOpacity} from "react-native"
import { AntDesign } from '@expo/vector-icons'; 


export default function ForYouCard({
    imageSource = require("../../../../images/rectangle-27.png"),
    imageLogoSource = require("../../../../images/image-8.png"),
    brandName= "miam",
    campaignName = "miam",
    reach = "0",
    websiteTraffic = '0',
    value ='0',
    url ='https://www.instagram.com/supremenewyork/?hl=en'
}
) {
    const handlePress = async ( url: any) => {
        // Check if the link can be opened
        const canOpen = await Linking.canOpenURL(url);
        if (canOpen) {
            Linking.openURL(url);
        } else {
            console.log('Cannot open URL');
        }
    };

    return (
        <View style={styles.container}>
            <Image source={imageSource} style={styles.upperPart}/>
            <View style={styles.bottomContainer}>
                <View style={styles.part1}>
                    <View style={styles.part1ContentLeft}>
                    <Image source={imageLogoSource} style={styles.brandLogo}/>
                    <Text style={styles.part1ContentLeftTitle}>{brandName}</Text>
                    </View>
                    <TouchableOpacity onPress={() => handlePress(url)}>
                    <AntDesign style={styles.part1ContentRight} name="instagram" size={24} color="black" />
                    </TouchableOpacity>
                </View>
                <View style={styles.part2}>
                    <Text style={styles.part2Title}>{campaignName}</Text>
                </View>
                <View style={styles.part3}>
                <Text>Reach</Text>
                <Text>{reach}</Text>
                </View>
                <View style={styles.part4}>
                <Text>Website traffic</Text>
                <Text>{websiteTraffic}</Text>
                </View>
                <View style={styles.footerPart}>
                    <Text>{value}</Text>
                    <TouchableOpacity style={styles.footerPart}>
                    <Text style={styles.footerText}>View</Text>
                    <AntDesign name="arrowright" size={16} color="black" />
                </TouchableOpacity>
                </View>
            </View>
        </View>
    );
}


const screenWidth = Dimensions.get('window').width;

const styles = StyleSheet.create({
  container: {
      flex: 1,
      justifyContent: "center",
      width: 300, 
      height:"100%",
      flexDirection:"column",
      backgroundColor:"#FFFFFF",
      borderRadius: 10,
  },
  
  bottomContainer: {
    padding: 20,
  },

  upperPart: {
    width: "100%",
    height: 150,
    borderTopLeftRadius: 10,
    borderTopRightRadius: 10,
  },

  part1: {
    flexDirection:"row",
    alignItems:"center",
    justifyContent: "space-between",
    marginBottom: 20,
  },

  part1ContentLeft: {
    flexDirection:"row",
    alignItems:"center", 
  },

  part1ContentLeftTitle: {
    marginLeft: 5,
  },

  brandLogo: {
    height: 25,
    width: 25,
  },

  part1ContentRight: {
    alignItems:"center", 
    marginRight: 20
  },



  part2: {
   marginBottom: 20,
  },

  part2Title: {
    fontSize: 20
  },

  part3: {
    flexDirection:"row",
    alignItems:"center",
    justifyContent: "space-between",
    marginBottom: 10,
    padding: 5,
    borderBottomWidth: 1,
    borderColor: ""

  },

  part4: {
    flexDirection:"row",
    alignItems:"center",
    justifyContent: "space-between",
    padding: 5,
    marginBottom: 10,
    borderBottomWidth: 1,


  },

  footerPart: {
    marginTop: 20,
    flexDirection:"row",
    alignItems:"center",
    justifyContent: "space-between",
  },


  footerText: {
    marginRight: 5,
    fontWeight: 600
  }

})
