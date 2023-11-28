import React from "react";
import { View } from "react-native"
import Icon from 'react-native-vector-icons/Ionicons';


export const Chats = ({state}) => {
  // Function to determine which icon to render
  const renderIcon= () => {
    switch (state) {
        case 'active':
            return <Icon name="chatbubbles-sharp" size={30} />;
        default:
            return <Icon name="chatbubbles-outline" size={30} />; // Default case
    }
};
  return (
    <View>
      {renderIcon()}
    </View>
  );
};
