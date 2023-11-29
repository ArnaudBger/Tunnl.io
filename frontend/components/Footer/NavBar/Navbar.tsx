import React, { useState } from "react";
import { Bell } from "../../../icons/Bell/Bell";
import { Chats } from "../../../icons/Chats/Chats";
import { Compass } from "../../../icons/Compass/Compass";
import { Files } from "../../../icons/Files/Files";
import { House } from "../../../icons/House/House";

import { MobileNavLink } from "./NavBarLink/MobileNavLink";
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Dimensions } from "react-native"

export const MobileNav = ({ activeCategory, setActiveCategory }) => {

const renderNavLink = (IconComponent, text) => {
    return (
      <TouchableOpacity onPress={() => setActiveCategory(text)}>
        <MobileNavLink
          icon={<IconComponent state={activeCategory === text ? 'active' : 'default'} />}
          state={activeCategory === text ? 'active' : 'default'}
          text={text}
        />
      </TouchableOpacity>
    );
  };

  return (
    <View style={styles.mobileNav}>
      {renderNavLink(House, 'Home')}
      {renderNavLink(Compass, 'Discover')}
      {renderNavLink(Files, 'Contracts')}
      {renderNavLink(Bell, 'Notifications')}
      {renderNavLink(Chats, 'Chat')}
    </View>
  );
};

const screenWidth = Dimensions.get('window').width;

const styles = StyleSheet.create({
    mobileNav: {
      position: 'absolute', // Positioning it absolutely
      bottom: 0, // Anchoring it to the bottom
      left: 0, // Aligning to the left
      right: 0, // Aligning to the right to stretch across the screen
      flexDirection:"row",

      alignItems: "center", // Align child elements vertically in the center
      backgroundColor: '#FFFFFF',
      borderTopColor: '#000000',
      borderTopWidth: 1,
      width:screenWidth,
      justifyContent: "space-evenly", // Evenly distribute child elements across the horizontal axis 
    },
  });
