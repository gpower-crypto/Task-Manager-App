import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  Modal,
  TextInput,
  TouchableOpacity,
  Alert,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import WheelColorPicker from "react-native-wheel-color-picker";

// CategoryModal component for handling category creation and editing
const CategoryModal = ({
  visible,
  onClose,
  onSave,
  categoryData,
  onUpdate,
}) => {
  // State to store the category name
  const [categoryName, setCategoryName] = useState(categoryData?.name || "");
  // State to store the selected color for the category
  const [selectedColor, setSelectedColor] = useState(
    categoryData?.color || "#3498db"
  );

  // useEffect to update states when categoryData prop changes
  useEffect(() => {
    setCategoryName(categoryData?.name || "");
    setSelectedColor(categoryData?.color || "#3498db");
  }, [categoryData]);

  // Function to handle saving or updating a category
  const handleSave = async () => {
    // Check if category name is not blank
    if (!categoryName.trim()) {
      Alert.alert("Error", "Category name cannot be blank.");
      return;
    }

    // Create a new category object
    const newCategory = {
      id: categoryData?.id || Date.now().toString(),
      name: categoryName,
      color: selectedColor,
    };

    try {
      let updatedCategories = [];
      const categoriesString = await AsyncStorage.getItem("categories");

      if (categoriesString) {
        // If categories exist in AsyncStorage
        const storedCategories = JSON.parse(categoriesString);

        if (categoryData) {
          // Editing existing category
          const categoryIndex = storedCategories.findIndex(
            (cat) => cat.id === categoryData.id
          );
          storedCategories[categoryIndex] = newCategory;
          updatedCategories = storedCategories;
        } else {
          // Adding new category
          updatedCategories = [...storedCategories, newCategory];
        }
      } else {
        // No existing categories
        updatedCategories = [newCategory];
      }

      // Save the updated or new category to AsyncStorage
      await AsyncStorage.setItem(
        "categories",
        JSON.stringify(updatedCategories)
      );

      // Trigger the onSave callback to update the state in the parent component
      !categoryData ? onSave() : onUpdate(newCategory);
      onClose(); // Close the modal
      setCategoryName(""); // Clear the category name input
    } catch (error) {
      console.error("Error saving category to AsyncStorage:", error);
    }
  };

  // Render the CategoryModal component
  return (
    <Modal
      animationType="slide"
      transparent={true}
      visible={visible}
      onRequestClose={onClose}
    >
      <View style={styles.modalContainer}>
        <View style={styles.modalContent}>
          <Text style={styles.modalTitle}>
            {categoryData ? "List Name" : "New List"}
          </Text>
          <TextInput
            style={styles.categoryInput}
            placeholder="List Name"
            value={categoryName}
            onChangeText={(text) => setCategoryName(text)}
          />

          <WheelColorPicker
            onColorChange={(color) => setSelectedColor(color)}
            initialColor={selectedColor}
            style={styles.colorPicker}
          />

          <TouchableOpacity style={styles.addButtonModal} onPress={handleSave}>
            <Text style={styles.buttonText}>
              {categoryData ? "Save Changes" : "Add List"}
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
};

// Styles for the CategoryModal component
const styles = StyleSheet.create({
  modalContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  modalContent: {
    width: 300,
    padding: 20,
    borderRadius: 12,
    elevation: 5,
    backgroundColor: "#fff",
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 10,
    color: "#333",
  },
  categoryInput: {
    height: 40,
    borderColor: "#ccc",
    borderWidth: 1,
    borderRadius: 12,
    marginBottom: 6,
    paddingHorizontal: 12,
  },
  colorPicker: {
    width: "100%",
    marginBottom: 290,
  },
  addButtonModal: {
    backgroundColor: "#3498db",
    padding: 12,
    borderRadius: 12,
    alignItems: "center",
    marginTop: 16,
  },
  buttonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
});

export default CategoryModal;
