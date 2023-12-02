import { useQuery, gql } from '@apollo/client';
import { useNavigation } from '@react-navigation/native';
import { View, Text, StyleSheet, Dimensions, TouchableOpacity, ActivityIndicator } from "react-native";

const deals_query = gql`
  query Getdeals {
    deals {
      id
      brandDeposit
      status
    }
  }
`;

export default function Contracts() {
    const navigation = useNavigation();
    const { loading, error, data } = useQuery(deals_query);

    if (loading) return (
      <View style={styles.centered}>
        <ActivityIndicator size="large" color="black" />
      </View>
    );
    if (error) return <Text>Error : {error.message}</Text>;

    // Categorize deals
    const activeDeals = data.deals.filter(deal => deal.status == '1');
    const doneDeals = data.deals.filter(deal => deal.status == '2');
    const failedDeals = data.deals.filter(deal => deal.status == '0');

    const navigateToDetails = (deal) => {
      navigation.navigate('DetailsContract', { deal });
    };

    const renderDeals = (deals, title) => (
      <View>
        <Text style={styles.title}>{title}</Text>
        {deals.map((deal) => (
          <TouchableOpacity 
            key={deal.id} 
            style={styles.dealContainer}
            onPress={() => navigateToDetails(deal)}
          >
            <Text>Deal ID: {deal.id}</Text>
            <Text>Brand Deposit: {deal.brandDeposit}</Text>
          </TouchableOpacity>
        ))}
      </View>
    );

    return (
        <View style={styles.container}>
          <Text style={styles.mainTitle}>Smart Agreements</Text>
          {renderDeals(activeDeals, "Active Deals")}
          {renderDeals(doneDeals, "Completed Deals")}
          {renderDeals(failedDeals, "Failed Deals")}
        </View>
    );
}

const screenWidth = Dimensions.get('window').width;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    justifyContent: "flex-start",
    width: screenWidth, 
  },
  mainTitle: {
    fontSize: 24,
    fontWeight: '500',
    marginBottom: 20,
  },
  title: {
    fontSize: 16,
    fontWeight: '500',
    marginTop: 10,
  },
  dealContainer: {
    borderWidth: 1,
    borderColor: '#ddd',
    padding: 15,
    borderRadius: 8,
    marginTop: 10,
    backgroundColor: "#f9f9f9",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  centered: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 300
  },
});
