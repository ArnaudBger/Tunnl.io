import React from 'react';
import { View, Image, StyleSheet } from 'react-native';


const Avatar = ({ badge = true, src = 'default' }) => {
  const imageMap: any = {
    'image-1': require('../../images/image-1.png'),
    // ... other image mappings ...
    'default': require('../../images/image-1.png'), // Default image
  };

  // Use the imageMap to get the correct require based on src
  const imageSource = imageMap[src] || imageMap['default'];

  return (
    <View style={styles.container}>
      <Image style={styles.image} source={imageSource} />
    </View>
  );
};

// Add your StyleSheet styles here

const styles = StyleSheet.create({
  container: {
   marginRight:10
    // Define your container styles
  },
  image: {
    width:35,
    height:35,
  }
});

export default Avatar;
