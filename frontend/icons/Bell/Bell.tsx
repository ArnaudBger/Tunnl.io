import React from "react";
import { View } from "react-native"
import Icon from 'react-native-vector-icons/Ionicons';


export const Bell = ({state}) => {
  // Function to determine which icon to render
  const renderIcon= () => {
    switch (state) {
        case 'active':
            return <Icon name="notifications-sharp" size={30} />;
        default:
            return <Icon name="notifications-outline" size={30} />; // Default case
    }
};
  return (
    <View>
      {renderIcon()}
    </View>
  );
};
