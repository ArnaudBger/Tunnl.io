import React, { useContext } from 'react';
import { DealsContext } from '../../utils/DealsContext';
import { calculateDealStage} from '../../queries/getUserDeals';
import { useNavigation } from '@react-navigation/native';
import { View, Text, StyleSheet, Dimensions, TouchableOpacity, ActivityIndicator } from "react-native";

export default function Contracts() {
    const navigation = useNavigation();
    const { deals, loading, error} = useContext(DealsContext);
    if (loading) return (
      <View style={styles.centered}>
        <ActivityIndicator size="large" color="black" />
      </View>
    );
    if (error) return <Text>Error : {error.message}</Text>;
    // Categorize deals
    const activeDeals = deals.filter(deal => deal.status == '1');
    const activeDealsLength = Object.keys(activeDeals).length;
    const doneDeals = deals.filter(deal => deal.status == '0');
    const doneDealsLength =  Object.keys(doneDeals).length;
    const failedDeals = deals.filter(deal => deal.status == '2');
    const failedDealsLength =  Object.keys(failedDeals).length;

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
          <View style={styles.stageIndicator}>
            <Text style={styles.stageText}>STAGE: {calculateDealStage(deal)}</Text>
          </View>
          <Text>Deal ID: {deal.id}</Text>
          <Text>Brand Deposit: {deal.brandDeposit}</Text>
        </TouchableOpacity>
      ))}
    </View>
    );

    return (
        <View style={styles.container}>
          <Text style={styles.mainTitle}>Smart Agreements</Text>
          {renderDeals(activeDeals, `(${activeDealsLength}) IN PROGRESS`)}
          {renderDeals(doneDeals, `(${doneDealsLength}) COMPLETED`)}
          {renderDeals(failedDeals, `(${failedDealsLength}) FAILED`)}
          <Text style={styles.poweredBy}>Powered by The Graph</Text>
          <View style={{ height: 100 }} />
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
    fontWeight: '300',
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
  poweredBy: {
    marginTop: 20,
    fontSize: 12,
    color: 'gray',
    textAlign: 'center',
  },

  stageIndicator: {
    position: 'absolute',
    top: 20,
    right: 20,
    padding: 5,
    borderRadius: 10,
    borderWidth: 1,
  },
  stageText: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#333', // Change as needed
  },
});
