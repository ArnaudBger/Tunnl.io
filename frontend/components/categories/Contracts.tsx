import { useQuery, gql} from '@apollo/client'
import { View, Text, StyleSheet, Dimensions} from "react-native"


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


const screenWidth = Dimensions.get('window').width;

const styles = StyleSheet.create({
  container: {
      flex: 1,
      padding: 20,
      justifyContent: "center",
      alignItems: "center",
      width: screenWidth, 
  },
})
