import React from 'react';
import { View, StyleSheet, Text, ScrollView, TouchableOpacity } from "react-native";
import Icon from 'react-native-vector-icons/Ionicons';
import { calculateDealStage } from '../../../queries/getUserDeals'; 

const DetailsContract = ({ route, navigation }) => {
    const { deal } = route.params;
    const dealStage = calculateDealStage(deal);
    const goBackToHome = () => {
        navigation.navigate('Home');
    };

    const formatDate = (timestamp) => {
        const date = new Date(parseInt(timestamp) * 1000);
        return date.toLocaleDateString("en-US") + ' ' + date.toLocaleTimeString("en-US");
    };

    const InformationRow = ({ label, value}) => (
        <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>{label}:</Text>
            <Text style={styles.infoValue}>{value}</Text>
        </View>
    );
    
    console.log(dealStage)
    return (
        <View style={styles.container}>
            <View style={styles.headerBar}>
                <TouchableOpacity onPress={goBackToHome} style={styles.backButton}>
                    <Icon name="arrow-back-outline" size={30} color="#000" />
                </TouchableOpacity>
                <Text style={styles.headerTitle}>Agreement Details</Text>
            </View>
    
            <ScrollView style={styles.contentContainer}>
                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>Basic Information</Text>
                    <InformationRow label="Deal ID" value={deal?.id} />
                    <InformationRow label="Brand Deposit" value={deal?.brandDeposit} />
                    <InformationRow label="Brand Address" value={deal?.brand.id} />
                    <InformationRow label="Influencer Address" value={deal?.influencer.id} />
                    <InformationRow label="Current Stage" value={dealStage} />
                </View>
    
                {dealStage !== 'SIGNING' && (
                    <View style={styles.section}>
                        <Text style={styles.sectionTitle}>Signing Information</Text>
                        <InformationRow label="Time" value={formatDate(deal?.dealSigned[0]?.blockTimestamp)} />
                        <InformationRow label="Transaction Hash" value={deal?.dealSigned[0]?.transactionHash} />
                    </View>
                )}
    
                {['VERIFICATION', 'PERFORMANCE'].includes(dealStage) && (
                    <View style={styles.section}>
                        <Text style={styles.sectionTitle}>Posting Information</Text>
                        <InformationRow label="Time" value={formatDate(deal?.contentPosted[0]?.blockTimestamp)} />
                        <InformationRow label="Content Posted" value={deal?.contentPosted[0]?.postURL} />
                        <InformationRow label="Transaction Hash" value={deal?.contentPosted[0]?.transactionHash} />
                    </View>
                )}
    
                {['PERFORMANCE'].includes(dealStage) && (
                    <View style={styles.section}>
                        <Text style={styles.sectionTitle}>Verification Information</Text>
                        {deal?.contentAccepted && deal?.contentAccepted.length > 0 && (
                            <>
                                <InformationRow label="Status" value="Accepted" />
                                <InformationRow label="Time" value={formatDate(deal?.contentAccepted[0]?.blockTimestamp)} />
                                <InformationRow label="Transaction Hash" value={deal?.contentAccepted[0]?.transactionHash} />
                            </>
                        )}
    
                        {deal?.contentDisputed && deal?.contentDisputed.length > 0 && (
                            <>
                                <InformationRow label="Status" value="Disputed" />
                                <InformationRow label="Time" value={formatDate(deal?.contentDisputed[0]?.blockTimestamp)} />
                                <InformationRow label="Transaction Hash" value={deal?.contentDisputed[0]?.transactionHash} isHash />
                            </>
                        )}
                    </View>
                )}
    
                {dealStage === 'PERFORMANCE' && (
                    <View style={styles.section}>
                        <Text style={styles.sectionTitle}>Performance Information</Text>
                        <InformationRow label="Performance Ends On" value={formatDate(deal?.performDeadline)} />
                    </View>
                )}
    
                {dealStage === 'Completed' && (
                    <View style={styles.section}>
                        <Text style={styles.sectionTitle}>Deal Completed</Text>
                        <Text style={styles.detailText}>Deal successfully completed.</Text>
                    </View>
                )}
                <View style={{ height: 200 }}></View>
            </ScrollView>
        </View>
    );
    
}

const styles = StyleSheet.create({
    container: {
        flexDirection:"column",
    },
    headerBar: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: 10,
        backgroundColor: 'white',
        height: 104,
        borderBottomWidth: 1,
        borderColor: "#cccccc",
        paddingTop: 50,
    },
    backButton: {
        marginRight: 10,
    },
    headerTitle: {
        fontSize: 20,
        fontWeight: 'bold',
    },
    contentContainer: {
        padding: 20,
        marginTop: 5,
    },
    section: {
        marginBottom: 20,
        padding: 10,
        borderRadius: 8,
        backgroundColor: "#f9f9f9",
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
        elevation: 5,
    },
    sectionTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        marginBottom: 10,
    },
    detailText: {
        fontSize: 16,
        marginBottom: 5,
    },
    infoRow: {
        flexDirection: 'row',
        marginBottom: 5,
    },
    infoLabel: {
        fontWeight: 'bold',
        marginRight: 5,
    },
    infoValue: {
        flex: 1, // Take up remaining space
    },
});

export default DetailsContract;
