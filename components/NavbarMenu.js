import React, { useState } from "react";
import { View, TouchableOpacity, Text, StyleSheet } from "react-native";
import { EvilIcons } from "@expo/vector-icons";
import CategoryModal from "./CategoryModal";
import { MaterialCommunityIcons } from "@expo/vector-icons";

// NavbarMenu component for displaying menu options
const NavbarMenu = ({
  onOpenDeleteConfirmation,
  category,
  navigation,
  textColor,
  homeScreen,
  handleShareList,
}) => {
  // State variables for handling menu visibility and edit modal visibility
  const [showMenu, setShowMenu] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);

  // Function to toggle menu visibility
  const toggleMenu = () => {
    setShowMenu(!showMenu);
  };

  // Function to toggle edit modal visibility
  const toggleEditModal = () => {
    setShowEditModal(!showEditModal);
  };

  // Function to handle category deletion
  const handleDeleteCategory = () => {
    toggleMenu();
    onOpenDeleteConfirmation();
  };

  // Function to handle category editing
  const handleEditCategory = () => {
    toggleMenu();
    toggleEditModal();
  };

  // Render the NavbarMenu component
  return (
    <View style={styles.container}>
      {/* Menu icon */}
      <TouchableOpacity onPress={toggleMenu} style={styles.menuIcon}>
        <EvilIcons
          name={showMenu ? "close" : "navicon"}
          size={30}
          color={textColor}
        />
      </TouchableOpacity>

      {/* Display the menu options */}
      {showMenu && (
        <View style={styles.menu}>
          {!homeScreen ? (
            <>
              {/* Delete List option */}
              <TouchableOpacity
                onPress={handleDeleteCategory}
                style={styles.menuItem}
              >
                <EvilIcons name="trash" size={24} color="#e74c3c" />
                <Text style={[styles.menuItemText, { color: "#e74c3c" }]}>
                  Delete List
                </Text>
              </TouchableOpacity>

              {/* Edit List option */}
              <TouchableOpacity
                onPress={handleEditCategory}
                style={styles.menuItem}
              >
                <EvilIcons name="pencil" size={24} color="#3498db" />
                <Text style={[styles.menuItemText, { color: "#3498db" }]}>
                  Edit List
                </Text>
              </TouchableOpacity>

              {/* Share option */}
              <TouchableOpacity
                onPress={handleShareList}
                style={styles.menuItem}
              >
                <EvilIcons name="share-google" size={24} color="#3498db" />
                <Text style={[styles.menuItemText, { color: "#858585" }]}>
                  Share
                </Text>
              </TouchableOpacity>
            </>
          ) : (
            <>
              {/* View Calendar option */}
              <TouchableOpacity
                onPress={() => navigation.navigate("Calendar")}
                style={styles.menuItem}
              >
                <EvilIcons name="calendar" size={24} color="#3498db" />
                <Text style={[styles.menuItemText, { color: "black" }]}>
                  View Calendar
                </Text>
              </TouchableOpacity>

              {/* Dashboard option */}
              <TouchableOpacity
                onPress={() => navigation.navigate("Dashboard")}
                style={styles.menuItem}
              >
                <EvilIcons name="chart" size={24} color="#3498db" />
                <Text style={[styles.menuItemText, { color: "black" }]}>
                  Dashboard
                </Text>
              </TouchableOpacity>

              {/* Weather option */}
              <TouchableOpacity
                onPress={() => navigation.navigate("Weather")}
                style={styles.menuItem}
              >
                <MaterialCommunityIcons
                  name="weather-cloudy"
                  size={24}
                  color="#3498db"
                />
                <Text style={[styles.menuItemText, { color: "black" }]}>
                  Weather
                </Text>
              </TouchableOpacity>
            </>
          )}
        </View>
      )}

      {/* Category edit modal */}
      <CategoryModal
        visible={showEditModal}
        onClose={toggleEditModal}
        categoryData={category}
        onUpdate={(category) => {
          navigation.navigate("TaskList", { category });
        }}
      />
    </View>
  );
};

// Styles for the NavbarMenu component
const styles = StyleSheet.create({
  container: {
    position: "absolute",
    top: 9,
    right: 10,
    flexDirection: "row",
    alignItems: "center",
    borderRadius: 10,
    zIndex: 1,
  },
  menuIcon: {
    padding: 8,
    borderRadius: 10,
  },
  menu: {
    position: "absolute",
    top: 70,
    right: 10,
    backgroundColor: "#fff",
    borderRadius: 12,
    elevation: 5,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  menuItem: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#eee",
  },
  menuItemText: {
    fontWeight: "bold",
    fontSize: 16,
    marginLeft: 16,
  },
});

export default NavbarMenu;
