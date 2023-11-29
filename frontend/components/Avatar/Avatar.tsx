import React from 'react';
import { View, Text, Image, StyleSheet } from 'react-native';
import PropTypes from 'prop-types';

const Avatar = ({
  badge = true,
  name = "TA",
  src = " ",
  name1,
  src1,
  size,
  image = "path/to/default/image.png", // Update with a valid local/remote path
}) => {

  // Define a function to get the image based on the size
  const getImageSource = (size) => {
    switch(size) {
      case 'sm': return "path/to/small/image.png"; // Update with valid paths
      case 'md': return "path/to/medium/image.png";
      case 'lg': return "path/to/large/image.png";
      case 'xl': return "path/to/xlarge/image.png";
      case 'two-xl': return "path/to/twoxl/image.png";
      default: return image;
    }
  };

  return (
    <View style={styles.container}>
      {src1 && (
        <>

          <Image
            style={styles.image}
            source={{ uri: getImageSource(size) }}
          />
        </>
      )}

      {!name1 && (
        <Image
          style={styles.svg}
          source={{ uri: getImageSource(size) }} // Update with the correct logic for SVGs if needed
        />
      )}

      {(src1 || !name1) && badge && <View style={styles.avatarBadge} />}

      {name1 && !src1 && (
        <>
          <Text style={styles.textWrapper}>{name}</Text>
          {badge && <View style={styles.div} />}
        </>
      )}
    </View>
  );
};

Avatar.propTypes = {
  badge: PropTypes.bool,
  name: PropTypes.string,
  src: PropTypes.string,
  name1: PropTypes.bool,
  src1: PropTypes.bool,
  size: PropTypes.oneOf(["sm", "xs", "lg", "two-xl", "xl", "md"]),
  image: PropTypes.string,
};

const styles = StyleSheet.create({
  container: {
    // Define your container styles
  },
  src: {
    // Define styles for src text
  },
  name: {
    // Define styles for name text
  },
  image: {
    // Define styles for images
  },
  svg: {
    // Define styles for SVGs (Note: React Native doesn't support SVGs natively)
  },
  avatarBadge: {
    // Define styles for avatar badge
  },
  textWrapper: {
    // Define styles for text wrapper
  },
  div: {
    // Define styles for div (Note: This is a View in React Native)
  },
  // ... any other styles you need ...
});

export default Avatar;
