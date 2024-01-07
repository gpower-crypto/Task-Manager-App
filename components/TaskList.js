import React, { useState, useEffect } from "react";
import {
  FlatList,
  View,
  Text,
  StyleSheet,
  TextInput,
  Modal,
  TouchableOpacity,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import Task from "./Task";
import { Ionicons } from "@expo/vector-icons";
import DropDownPicker from "react-native-dropdown-picker";
import { useNavigation, useRoute } from "@react-navigation/native";
import NavbarMenu from "./NavbarMenu";

const TaskList = ({ onDeleteCategory }) => {
  const navigation = useNavigation();
  const route = useRoute(); // Get the route

  const [tasks, setTasks] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [openStatus, setOpenStatus] = useState(false);
  const [selectedStatus, setSelectedStatus] = useState("all");
  const [openPriority, setOpenPriority] = useState(false);
  const [selectedPriority, setSelectedPriority] = useState("all");
  const [filterModalVisible, setFilterModalVisible] = useState(false);
  const [categoryToDelete, setCategoryToDelete] = useState(null);

  const { name, id } = route.params?.category;

  const [isDeleteConfirmationVisible, setDeleteConfirmationVisible] =
    useState(false);

  const openDeleteConfirmation = () => {
    setDeleteConfirmationVisible(true);
  };

  const closeDeleteConfirmation = () => {
    setDeleteConfirmationVisible(false);
  };

  const filteredTasks = tasks
    .filter((task) =>
      task.title.toLowerCase().includes(searchQuery.toLowerCase())
    )
    .filter((task) => {
      const statusFilter =
        selectedStatus === "all" ||
        (selectedStatus === "completed" && task.completed) ||
        (selectedStatus === "incomplete" && !task.completed);

      const priorityFilter =
        selectedPriority === "all" ||
        (selectedPriority !== "none" && task.priority === selectedPriority) ||
        (selectedPriority === "none" &&
          (!task.priority || task.priority === "none"));

      return (
        statusFilter && priorityFilter && (!name || task.category === name)
      );
    });

  const navigateToAddTask = () => {
    navigation.navigate("AddTask", { category: { name, id } });
  };

  const confirmDeleteCategory = async () => {
    try {
      console.log(`Deleting category ${name} and its tasks...`);

      // Get existing tasks from AsyncStorage
      const existingTasksString = await AsyncStorage.getItem("tasks");
      const existingTasks = existingTasksString
        ? JSON.parse(existingTasksString)
        : [];

      // Filter out tasks with the specified category ID
      const updatedTasks = existingTasks.filter(
        (task) => task.category !== name
      );

      // Update AsyncStorage with the filtered tasks
      await AsyncStorage.setItem("tasks", JSON.stringify(updatedTasks));

      // Remove the category from AsyncStorage or wherever it's stored
      const existingCategoriesString = await AsyncStorage.getItem("categories");
      const existingCategories = existingCategoriesString
        ? JSON.parse(existingCategoriesString)
        : [];

      // Filter out the category to be deleted
      const updatedCategories = existingCategories.filter(
        (cat) => cat.id !== id
      );

      // Update AsyncStorage with the filtered categories
      await AsyncStorage.setItem(
        "categories",
        JSON.stringify(updatedCategories)
      );

      // Clear the categoryToDelete after deletion
      setCategoryToDelete(null);

      // Navigate back to the Home screen or any other appropriate action
      navigation.navigate("Home");
    } catch (error) {
      console.error("Error deleting category:", error);
    }
  };

  const fetchTasks = async () => {
    try {
      const tasksString = await AsyncStorage.getItem("tasks");
      const storedTasks = tasksString ? JSON.parse(tasksString) : [];
      setTasks(storedTasks);
    } catch (error) {
      console.error("Error retrieving tasks from AsyncStorage:", error);
    }
  };

  useEffect(() => {
    fetchTasks();
    updateScreenNavbar();
  }, [tasks, name]);

  const updateScreenNavbar = () => {
    navigation.setOptions({
      title: name || "Task Categories",
      headerStyle: {
        backgroundColor: "blue",
      },
      headerTintColor: "white",
      headerRight: () => (
        <NavbarMenu
          navigation={navigation}
          onDeleteCategory={() => setCategoryToDelete(name)}
          onOpenDeleteConfirmation={openDeleteConfirmation}
        />
      ),
    });
  };

  const openFilterModal = () => {
    setFilterModalVisible(true);
  };

  const closeFilterModal = () => {
    setFilterModalVisible(false);
  };

  const applyFilter = () => {
    closeFilterModal();
  };

  const handleToggleComplete = (taskId) => {
    const updatedTasks = tasks.map((task) =>
      task.id === taskId ? { ...task, completed: !task.completed } : task
    );

    updateTasks(updatedTasks);
  };

  const updateTasks = async (updatedTasks) => {
    try {
      await AsyncStorage.setItem("tasks", JSON.stringify(updatedTasks));
      setTasks(updatedTasks);
    } catch (error) {
      console.error("Error updating tasks:", error);
    }
  };

  const navigateToDetails = (item) => {
    navigation.navigate("TaskDetails", { item, categoryId: id });
  };

  const clearFilters = () => {
    setSelectedStatus("all");
    setSelectedPriority("all");
    setOpenStatus(false);
    setOpenPriority(false);
    closeFilterModal();
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TextInput
          style={styles.searchInput}
          placeholder="Search tasks..."
          value={searchQuery}
          onChangeText={(text) => setSearchQuery(text)}
        />
        <TouchableOpacity onPress={openFilterModal}>
          <Ionicons name="filter" size={24} color="black" />
        </TouchableOpacity>
      </View>

      {filteredTasks.length === 0 ? (
        <Text>No tasks</Text>
      ) : (
        <FlatList
          data={filteredTasks}
          keyExtractor={(task) => task.id.toString()}
          renderItem={({ item }) => (
            <Task
              task={item}
              onPress={() => navigateToDetails(item)}
              onToggle={handleToggleComplete}
            />
          )}
        />
      )}

      <TouchableOpacity style={styles.addButton} onPress={navigateToAddTask}>
        <Text style={styles.addButtonText}>Add Task</Text>
      </TouchableOpacity>

      {/* Filter Modal */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={filterModalVisible}
        onRequestClose={closeFilterModal}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Filter Tasks</Text>

            {/* Status Dropdown */}
            <DropDownPicker
              open={openStatus}
              value={selectedStatus}
              items={[
                { label: "All", value: "all" },
                { label: "Completed", value: "completed" },
                { label: "Incomplete", value: "incomplete" },
              ]}
              setOpen={setOpenStatus}
              setValue={setSelectedStatus}
              setItems={() => {}}
              style={[styles.dropdown, { zIndex: 100 }]}
            />

            {/* Priority Dropdown */}
            <DropDownPicker
              open={openPriority}
              value={selectedPriority}
              items={[
                { label: "All", value: "all" },
                { label: "High", value: "high" },
                { label: "Medium", value: "medium" },
                { label: "Low", value: "low" },
                { label: "None", value: "none" },
              ]}
              setOpen={setOpenPriority}
              setValue={setSelectedPriority}
              setItems={() => {}}
              style={styles.dropdown}
            />

            <View style={styles.buttonContainer}>
              <TouchableOpacity
                style={styles.applyButton}
                onPress={applyFilter}
              >
                <Text style={styles.buttonText}>Apply Filter</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.clearButton}
                onPress={clearFilters}
              >
                <Text style={styles.buttonText}>Clear Filters</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      {/* Delete Confirmation Modal */}
      <Modal visible={isDeleteConfirmationVisible}>
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Confirm Deletion of Category</Text>
            <Text>
              Are you sure you want to delete the category and its tasks?
            </Text>
            <View style={styles.buttonContainer}>
              <TouchableOpacity
                style={styles.confirmButton}
                onPress={confirmDeleteCategory}
              >
                <Text style={styles.buttonText}>Confirm</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.cancelButton}
                onPress={closeDeleteConfirmation}
              >
                <Text style={styles.buttonText}>Cancel</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 8,
    marginVertical: 12,
    marginHorizontal: 14,
  },
  searchInput: {
    height: 40,
    borderColor: "gray",
    borderWidth: 1,
    borderRadius: 8,
    flex: 1,
    marginRight: 8,
    paddingHorizontal: 8,
  },
  addButton: {
    position: "absolute",
    bottom: 16,
    right: 16,
    backgroundColor: "blue",
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 8,
  },
  addButtonText: {
    color: "white",
    fontWeight: "bold",
  },
  modalContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.5)", // semi-transparent background
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
  dropdown: {
    height: 40,
    backgroundColor: "#fafafa",
    marginBottom: 10,
  },
  buttonText: {
    color: "#fff",
  },
  applyButton: {
    marginTop: 16,
    padding: 10,
    backgroundColor: "blue",
    borderRadius: 8,
    alignItems: "center",
  },
  clearButton: {
    marginTop: 16,
    padding: 10,
    backgroundColor: "red",
    borderRadius: 8,
    alignItems: "center",
  },
  buttonContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  confirmButton: {
    marginTop: 16,
    padding: 10,
    backgroundColor: "green",
    borderRadius: 8,
    alignItems: "center",
  },
  cancelButton: {
    marginTop: 16,
    padding: 10,
    backgroundColor: "red",
    borderRadius: 8,
    alignItems: "center",
  },
});

export default TaskList;
