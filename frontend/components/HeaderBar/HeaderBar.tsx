import React from 'react';
import { View, Text, StyleSheet, Dimensions } from 'react-native';
import Avatar from '../Avatar/Avatar'; // Assuming Avatar is also a React Native component

const HeaderBar = () => {
  return (
    <View style={styles.headerBar}>
      <View style={styles.headerContent}>
        <View style={styles.profileGroup}>
          <Avatar badge={false} name="TA" name1={true} size="sm" src="" src1={false} />
          <Text style={styles.textWrapper}>Brooklyn Simmons</Text>
        </View>
        <View style={styles.settingsLink} />
      </View>
    </View>
  );
};

const screenWidth = Dimensions.get('window').width;

const styles = StyleSheet.create({
  headerBar: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    backgroundColor: '#ffffff', // Replaced 'background-color'
    borderBottomWidth: 1, // Replaced 'border-bottom-width' (React Native doesn't support border styles)
    borderColor: '#cccccc', // Replaced 'var(--collection-1-cool-gray-cool-gray-400)', use actual color value
    height: 104, // Removed 'px'
    width: screenWidth,
  },
  headerContent: {
    alignItems: 'center',
    flex: 1,
    position: 'relative',
    left: 24, // Removed 'px'
    top: 64, // Removed 'px'
    width: 342, // Removed 'px'
  },
  profileGroup: {
    alignItems: 'center',
    flex: 1,
    flexGrow: 1,
    // 'gap' is not supported in React Native, consider using margin or padding
  },
  textWrapper: {
    color: '#000000',
    flex: 1,
    fontFamily: 'System', // Replaced 'var(--14px-source-sans-regular-font-family)', use actual font name
    fontSize: 14, // Replaced 'var(--14px-source-sans-regular-font-size)', removed 'px'
    // 'fontStyle', 'fontWeight', 'letterSpacing', 'lineHeight' should be specified directly, if known
  },
  settingsLink: {
    // 'backgroundImage' is not supported, use <Image> component instead
    width: 24, // Removed 'px'
    height: 24, // Removed 'px'
    // Consider adding styles for an Image component to replace the background image
  },
  // Add other styles as needed
});


export default HeaderBar;
