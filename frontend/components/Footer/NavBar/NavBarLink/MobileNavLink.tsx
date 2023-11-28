import PropTypes from "prop-types";
import React from "react";
import { House } from "../../../../icons/House/House";
import { View, Text, TextInput, TouchableOpacity, StyleSheet } from "react-native"

export const MobileNavLink = ({
  icon = <House state="active"/>,
  state,
  text = "Home",
}) => {
  const textStyle = state === "active" ? styles.property1Active : styles.property1Default;

  return (
    <View style={styles.mobileNavLink}>
      {icon}
      <Text style={textStyle}>{text}</Text>
    </View>
  );
};

MobileNavLink.propTypes = {
  property1: PropTypes.oneOf(["active", "default"]),
  text: PropTypes.string,
};


const styles = StyleSheet.create({
  mobileNavLink: {
    alignItems: "center",
    justifyContent: "center", // Align items horizontally in the center
    flexDirection: "column",
    padding: 12,
  },
  
  house1: {
    height: 24, // Assuming the unit is pixels
    width: 24, // Assuming the unit is pixels
  },

  property1Default: {
    color: "#D3D3D3", // Replace with the appropriate color value
    fontFamily: "", // Make sure this font is loaded in your project
    fontSize: 12,
    fontWeight: "400", // normal
    letterSpacing: 0, // Adjust as needed
  },
  property1Active: {
    color: "#333333", // Replace with the appropriate color value
    fontFamily: "", // Make sure this font is loaded in your project
    fontSize: 12,
    fontWeight: "700", // semibold
    letterSpacing: -0.5, // Adjust as needed
    },
});
