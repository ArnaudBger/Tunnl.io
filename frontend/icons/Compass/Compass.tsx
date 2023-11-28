import React from "react";
import { View } from "react-native"
import Icon from 'react-native-vector-icons/Ionicons';


export const Compass = ({state}) => {
  // Function to determine which icon to render
  const renderIcon= () => {
    switch (state) {
        case 'active':
            return <Icon name="compass-sharp" size={30} />;
        default:
            return <Icon name="compass-outline" size={30} />; // Default case
    }
};
  return (
    <View>
      {renderIcon()}
    </View>
  );
};
