// NavbarMenu.js
import React, { useState } from "react";
import { View, TouchableOpacity, Text, StyleSheet } from "react-native";
import { EvilIcons } from "@expo/vector-icons";

const NavbarMenu = ({ onOpenDeleteConfirmation }) => {
  const [showMenu, setShowMenu] = useState(false);

  const toggleMenu = () => {
    setShowMenu(!showMenu);
  };

  const handleDeleteCategory = () => {
    toggleMenu();
    onOpenDeleteConfirmation();
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity onPress={toggleMenu}>
        <EvilIcons
          name={showMenu ? "close" : "navicon"}
          size={30}
          color="white"
        />
      </TouchableOpacity>

      {showMenu && (
        <View style={styles.menu}>
          <TouchableOpacity onPress={handleDeleteCategory}>
            <Text style={styles.menuItem}>Delete Category</Text>
          </TouchableOpacity>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: "absolute",
    top: 10,
    right: 10,
    flexDirection: "row",
    alignItems: "center",
    padding: 8,
    backgroundColor: "blue",
    borderRadius: 5,
    elevation: 5,
  },
  menu: {
    position: "absolute",
    top: 90,
    right: 10,
    backgroundColor: "white",
    padding: 10,
    borderRadius: 5,
    elevation: 5,
  },
  menuItem: {
    color: "black",
    fontWeight: "bold",
    marginBottom: 8,
  },
});

export default NavbarMenu;
