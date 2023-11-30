import React from "react";
import { View, StyleSheet } from "react-native"
import Icon from 'react-native-vector-icons/Ionicons';

export const Bell = ({ state, hasNotifications }) => {
  const renderIcon = () => {
    switch (state) {
      case 'active':
        return <Icon name="notifications-sharp" size={30} />;
      default:
        return <Icon name="notifications-outline" size={30} />;
    }
  };

  return (
    <View style={styles.iconContainer}>
      {renderIcon()}
      {hasNotifications && <View style={styles.notificationDot} />}
    </View>
  );
};

const styles = StyleSheet.create({
  iconContainer: {
    position: 'relative',
  },
  notificationDot: {
    position: 'absolute',
    top: 4,
    right: 4,
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: 'red',
  },
});
