import { useQuery, gql} from '@apollo/client'
import { View, Text, TextInput, TouchableOpacity, StyleSheet } from "react-native"


const deals_query = gql`
  query Getdeals{
    deals {
      id
      brandDeposit
      brand {
        id
      }
      influencer {
        id
      }
    }
  }
`;


export default function Contracts() {
    const { loading, error, data } = useQuery(deals_query);

    if (loading) return <Text>Loading...</Text>;
    if (error) return <Text>Error : {error.message}</Text>;
    
    return (
        <View style={styles.container}>
        {data && data.deals && data.deals.map(({ id, brandDeposit, brand, influencer}) => (
          <View key={id}>
            <Text>{id}</ Text>
            <Text>{brandDeposit}</ Text>
            <Text>{brand.id}</ Text>
            <Text>{influencer.id}</ Text>
          </View>
        ))}
        </View>

    );
}


const styles = StyleSheet.create({
  container: {
      flex: 1,
      padding: 20,
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
