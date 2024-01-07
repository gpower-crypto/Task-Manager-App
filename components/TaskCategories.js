import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Modal,
  TextInput,
} from "react-native";
import { useNavigation, useFocusEffect } from "@react-navigation/native";
import AsyncStorage from "@react-native-async-storage/async-storage";

const TaskCategories = () => {
  const navigation = useNavigation();
  const [categories, setCategories] = useState([]);
  const [categoryInput, setCategoryInput] = useState("");
  const [addCategoryModalVisible, setAddCategoryModalVisible] = useState(false);

  const fetchCategories = async () => {
    try {
      const categoriesString = await AsyncStorage.getItem("categories");
      const storedCategories = categoriesString
        ? JSON.parse(categoriesString)
        : [];
      setCategories(storedCategories);
    } catch (error) {
      console.error("Error retrieving categories from AsyncStorage:", error);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []); // Fetch categories on initial render

  useFocusEffect(
    React.useCallback(() => {
      fetchCategories(); // Fetch categories whenever the screen is focused
    }, [])
  );

  const addCategory = async () => {
    if (categoryInput.trim() === "") {
      return;
    }

    const newCategory = {
      id: Date.now().toString(),
      name: categoryInput,
    };

    try {
      const updatedCategories = [...categories, newCategory];
      await AsyncStorage.setItem(
        "categories",
        JSON.stringify(updatedCategories)
      );

      setCategories(updatedCategories);
      setCategoryInput("");
      setAddCategoryModalVisible(false);
    } catch (error) {
      console.error("Error adding category to AsyncStorage:", error);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.headerText}>Task Categories</Text>

      {categories.map((category) => (
        <TouchableOpacity
          key={category.id}
          style={styles.categoryItem}
          onPress={() =>
            navigation.navigate("TaskList", { category: category })
          }
        >
          <Text>{category.name}</Text>
        </TouchableOpacity>
      ))}

      <TouchableOpacity
        style={styles.addButton}
        onPress={() => setAddCategoryModalVisible(true)}
      >
        <Text style={styles.buttonText}>Add Category</Text>
      </TouchableOpacity>

      {/* Add Category Modal */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={addCategoryModalVisible}
        onRequestClose={() => setAddCategoryModalVisible(false)}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Add Category</Text>
            <TextInput
              style={styles.categoryInput}
              placeholder="Category Name"
              value={categoryInput}
              onChangeText={(text) => setCategoryInput(text)}
            />
            <TouchableOpacity style={styles.addButton} onPress={addCategory}>
              <Text style={styles.buttonText}>Add Category</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  headerText: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 16,
  },
  categoryItem: {
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#ccc",
  },
  addButton: {
    backgroundColor: "green",
    padding: 10,
    borderRadius: 8,
    alignItems: "center",
    marginTop: 16,
  },
  buttonText: {
    color: "#fff",
  },
  // Add Category Modal Styles
  modalContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  modalContent: {
    width: 300,
    padding: 20,
    borderRadius: 8,
    elevation: 5,
    backgroundColor: "#fff",
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 10,
  },
  categoryInput: {
    height: 40,
    borderColor: "gray",
    borderWidth: 1,
    borderRadius: 8,
    marginBottom: 16,
    paddingHorizontal: 8,
  },
});

export default TaskCategories;
