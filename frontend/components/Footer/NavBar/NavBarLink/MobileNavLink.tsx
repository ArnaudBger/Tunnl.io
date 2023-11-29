import PropTypes from "prop-types";
import React from "react";
import { House } from "../../../../icons/House/House";
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Dimensions } from "react-native"

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

const screenWidth = Dimensions.get('window').width;
const navLinkCount = 5; // Update this based on the number of nav links you have
const navLinkSize = screenWidth / navLinkCount; // Dynamically calculate the width

const styles = StyleSheet.create({
  mobileNavLink: {
    alignItems: "center",
    justifyContent: "center",
    flexDirection: "column",
    width: navLinkSize, // Fixed width for each nav link
    padding: 10,
  },

  property1Default: {
    color: "#D3D3D3",
    fontFamily: "", // Specify your font family
    fontSize: 10,
    fontWeight: "400",
    textAlign: "center", // Center the text
  },
  property1Active: {
    color: "#333333",
    fontFamily: "", // Specify your font family
    fontSize: 10,
    fontWeight: "400",
    textAlign: "center", // Center the text

  },
});