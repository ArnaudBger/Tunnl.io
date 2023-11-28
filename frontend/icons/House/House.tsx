import React from "react";
import { View, StyleSheet } from "react-native"
import Icon from 'react-native-vector-icons/Ionicons';

export const House = ({state}) => {
  // Function to determine which icon to render
  const renderIcon= () => {
    switch (state) {
        case 'active':
            return <Icon name="home-sharp" size={30} />;
        default:
            return <Icon name="home-outline" size={30} />; // Default case
    }
};
  return (
    <View>
      {renderIcon()}
    </View>
  );
};
  