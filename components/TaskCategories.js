import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useNavigation, useFocusEffect } from "@react-navigation/native";
import { Ionicons, FontAwesome } from "@expo/vector-icons";
import CategoryModal from "./CategoryModal";
import ProgressBar from "./ProgressBar";

// TaskCategories component for displaying task categories
const TaskCategories = () => {
  const navigation = useNavigation();
  const [categories, setCategories] = useState([]);
  const [addCategoryModalVisible, setAddCategoryModalVisible] = useState(false);
  const [editCategoryData, setEditCategoryData] = useState(null);

  // Fetch categories from AsyncStorage
  const fetchCategories = async () => {
    try {
      const categoriesString = await AsyncStorage.getItem("categories");
      let storedCategories = categoriesString
        ? JSON.parse(categoriesString)
        : [];

      // Fetch tasks for each category and update the tasks count
      storedCategories = await Promise.all(
        storedCategories.map(async (category) => {
          const tasksString = await AsyncStorage.getItem("tasks");
          const storedTasks = tasksString ? JSON.parse(tasksString) : [];

          const categoryTasks = storedTasks.filter(
            (task) => task.categoryId === category.id
          );

          category.tasks = categoryTasks.length;
          category.tasksCompleted = categoryTasks.filter(
            (task) => task.completed
          ).length;
          return category;
        })
      );

      setCategories(storedCategories);
    } catch (error) {
      console.error("Error retrieving categories from AsyncStorage:", error);
    }
  };

  // Fetch categories on initial render
  useEffect(() => {
    fetchCategories();
  }, []);

  // Fetch categories whenever the screen is focused
  useFocusEffect(
    React.useCallback(() => {
      fetchCategories();
    }, [])
  );

  // Handle callback after saving or editing a category
  const handleSaveCategory = () => {
    fetchCategories();
  };

  // Handle adding a new category
  const handleAddCategory = () => {
    setEditCategoryData(null);
    setAddCategoryModalVisible(true);
  };

  // Render the TaskCategories component
  return (
    <View style={styles.container}>
      <Text style={styles.headerText}>Tasks</Text>
      <ScrollView>
        {categories.map((category) => (
          <TouchableOpacity
            key={category.id}
            style={[styles.categoryItem, { borderColor: category.color }]}
            onPress={() => navigation.navigate("TaskList", { category })}
          >
            <View style={styles.categoryInfo}>
              <View style={styles.categoryHeader}>
                <Text style={styles.categoryName}>{category.name}</Text>
                <FontAwesome
                  name="smile-o"
                  size={20}
                  color={category.color}
                  style={styles.colorIcon}
                />
              </View>
              <Text style={styles.categoryTaskCount}>
                {category.tasks ? `${category.tasks} tasks` : "No tasks"}
              </Text>
            </View>
            <ProgressBar // Use ProgressBar component
              percentage={(category?.tasksCompleted / category?.tasks) * 100} // Calculate percentage based on completed tasks
              color={category.color}
            />
            <Ionicons
              name="chevron-forward"
              size={20}
              color="#555"
              onPress={() => navigation.navigate("TaskList", { category })}
            />
          </TouchableOpacity>
        ))}

        <TouchableOpacity style={styles.addButton} onPress={handleAddCategory}>
          <Ionicons name="add" size={30} color="#fff" />
        </TouchableOpacity>
      </ScrollView>
      {/* Add Category Modal */}
      <CategoryModal
        visible={addCategoryModalVisible}
        onClose={() => setAddCategoryModalVisible(false)}
        onSave={handleSaveCategory}
      />
    </View>
  );
};

// Styles for the TaskCategories component
const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: "#f5f5f5",
  },
  headerText: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 26,
    marginTop: 9,
    color: "#333",
  },
  categoryItem: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 16,
    paddingHorizontal: 20,
    borderRadius: 12,
    marginBottom: 8,
    backgroundColor: "#fff",
    elevation: 3,
  },
  categoryInfo: {
    flex: 1,
  },
  categoryName: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#333",
  },
  categoryTaskCount: {
    fontSize: 14,
    color: "#555",
  },
  addButton: {
    backgroundColor: "#38419D",
    padding: 13,
    borderRadius: 12,
    alignItems: "center",
    marginTop: 16,
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
    paddingHorizontal: 8,
  },
  colorPicker: {
    width: "100%",
    marginBottom: 290,
  },
  categoryHeader: {
    flexDirection: "row",
    alignItems: "center",
  },
  colorIcon: {
    marginLeft: 8,
  },
  progressBarContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  progressBar: {
    height: 10,
    borderRadius: 5,
    marginVertical: 8,
  },
});

export default TaskCategories;
