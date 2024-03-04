import React, { useState, useEffect } from "react";
import {
  FlatList,
  View,
  Text,
  StyleSheet,
  TextInput,
  Modal,
  TouchableOpacity,
  ScrollView,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import Task from "./Task";
import { Ionicons } from "@expo/vector-icons";
import DropDownPicker from "react-native-dropdown-picker";
import { useNavigation, useRoute } from "@react-navigation/native";
import NavbarMenu from "./NavbarMenu";
import Color from "color";
import { RadioButton } from "react-native-paper";

const TaskList = ({ onDeleteCategory }) => {
  const navigation = useNavigation();
  const route = useRoute();

  const [tasks, setTasks] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedStatus, setSelectedStatus] = useState("all");
  const [filterModalVisible, setFilterModalVisible] = useState(false);
  const [categoryToDelete, setCategoryToDelete] = useState(null);
  const [selectedSort, setSelectedSort] = useState("None");
  const [openSort, setOpenSort] = useState(false);
  const [filteredTasks, setFilteredTasks] = useState(tasks);
  const { name, id, color } = route.params?.category;

  const [isDeleteConfirmationVisible, setDeleteConfirmationVisible] =
    useState(false);

  const isLightColor = (hexColor) => {
    const colorInstance = Color(hexColor);
    const luminance = colorInstance.luminosity();
    return luminance > 0.5; // Adjust this threshold as needed
  };
  const [textColor, setTextColor] = useState(
    isLightColor(color) ? "black" : "white"
  );

  const openDeleteConfirmation = () => {
    setDeleteConfirmationVisible(true);
  };

  const closeDeleteConfirmation = () => {
    setDeleteConfirmationVisible(false);
  };

  // const filteredTasks = tasks
  //   .filter((task) =>
  //     task.title.toLowerCase().includes(searchQuery.toLowerCase())
  //   )
  //   .filter((task) => {
  //     const statusFilter =
  //       selectedStatus === "all" ||
  //       (selectedStatus === "completed" && task.completed) ||
  //       (selectedStatus === "incomplete" && !task.completed);

  //     return statusFilter && (!name || task.category === name);
  //   });

  const navigateToAddTask = () => {
    navigation.navigate("Add Task", {
      category: {
        name,
        id,
        color,
        textColor: textColor,
      },
    });
  };

  const confirmDeleteCategory = async () => {
    try {
      console.log(`Deleting category ${name} and its tasks...`);

      const existingTasksString = await AsyncStorage.getItem("tasks");
      const existingTasks = existingTasksString
        ? JSON.parse(existingTasksString)
        : [];

      const updatedTasks = existingTasks.filter(
        (task) => task.category !== name
      );

      await AsyncStorage.setItem("tasks", JSON.stringify(updatedTasks));

      const existingCategoriesString = await AsyncStorage.getItem("categories");
      const existingCategories = existingCategoriesString
        ? JSON.parse(existingCategoriesString)
        : [];

      const updatedCategories = existingCategories.filter(
        (cat) => cat.id !== id
      );

      await AsyncStorage.setItem(
        "categories",
        JSON.stringify(updatedCategories)
      );

      setCategoryToDelete(null);

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
    setTextColor(isLightColor(color) ? "black" : "white");
  }, [tasks, name]);

  const updateScreenNavbar = () => {
    navigation.setOptions({
      title: name || "Task Categories",
      headerStyle: {
        backgroundColor: color, // Updated header color
      },
      headerTintColor: textColor,
      headerRight: () => (
        <NavbarMenu
          category={route.params?.category}
          navigation={navigation}
          onDeleteCategory={() => setCategoryToDelete(name)}
          onOpenDeleteConfirmation={openDeleteConfirmation}
          textColor={textColor}
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
    // Filtering logic based on selectedStatus
    const filteredTasksByStatus = tasks.filter((task) => {
      const statusFilter =
        selectedStatus === "all" ||
        (selectedStatus === "completed" && task.completed) ||
        (selectedStatus === "incomplete" && !task.completed);

      return statusFilter && (!name || task.category === name);
    });

    // Sorting logic based on selectedSort
    let sortedTasks = [...filteredTasksByStatus];

    if (selectedSort === "dueDate") {
      sortedTasks.sort((a, b) => {
        const dateA = new Date(a.dueDate);
        const dateB = new Date(b.dueDate);
        return dateA - dateB;
      });
    } else if (selectedSort === "priority") {
      sortedTasks.sort((a, b) => {
        const priorityOrder = {
          none: 0,
          low: 1,
          medium: 2,
          high: 3,
        };
        return priorityOrder[b.priority] - priorityOrder[a.priority];
      });
    }

    // Set the filtered and sorted tasks
    setFilteredTasks(sortedTasks);
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
    navigation.navigate("TaskDetails", {
      item,
      categoryId: id,
      backgroundColor: color,
      textColor: textColor,
    });
  };

  const clearFilters = () => {
    setSelectedStatus("all");
    setSelectedSort("all");
    setOpenSort(false);
    closeFilterModal();
  };

  return (
    <View style={styles.container}>
      <View style={[styles.header, { backgroundColor: color }]}>
        <TextInput
          style={[styles.searchInput, { color: textColor }]}
          placeholder="Search tasks..."
          placeholderTextColor={
            isLightColor(color) ? "black" : "rgba(255, 255, 255, 0.5)"
          }
          value={searchQuery}
          onChangeText={(text) => setSearchQuery(text)}
        />
        <TouchableOpacity onPress={openFilterModal}>
          <Ionicons name="filter" size={24} color="#333" />
        </TouchableOpacity>
      </View>

      {tasks.length === 0 ||
      (filteredTasks.length === 0 && tasks.length === 0) ? (
        <Text style={styles.noTasksText}>No tasks</Text>
      ) : (
        <FlatList
          data={filteredTasks.length === 0 ? tasks : filteredTasks}
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

      <TouchableOpacity
        style={[styles.addButton, { backgroundColor: color }]}
        onPress={navigateToAddTask}
      >
        <Text style={[styles.addButtonText, { color: textColor }]}>
          Add Task
        </Text>
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
            {/* Status Dropdown */}
            <View style={styles.dropdownContainer}>
              <Text style={styles.dropdownLabel}>VIEW</Text>
              <ScrollView>
                <RadioButton.Group
                  onValueChange={(value) => setSelectedStatus(value)}
                  value={selectedStatus}
                >
                  <View style={styles.radioButtonContainer}>
                    <RadioButton.Item
                      label="All"
                      value="all"
                      color="#3498db"
                      style={styles.radioButton}
                    />
                    <RadioButton.Item
                      label="Completed Tasks"
                      value="completed"
                      color="#3498db"
                      style={styles.radioButton}
                    />
                    <RadioButton.Item
                      label="Incomplete Tasks"
                      value="incomplete"
                      color="#3498db"
                      style={styles.radioButton}
                    />
                  </View>
                </RadioButton.Group>
              </ScrollView>
            </View>

            {/* Sort Dropdown */}
            <View style={styles.dropdownContainer}>
              <Text style={styles.dropdownLabel}>SORT BY</Text>
              <DropDownPicker
                open={openSort}
                value={selectedSort}
                items={[
                  { label: "None", value: "none" },
                  { label: "Due Date", value: "dueDate" },
                  { label: "Priority", value: "priority" },
                ]}
                setOpen={setOpenSort}
                setValue={setSelectedSort}
                setItems={() => {}}
                style={[styles.dropdown, { zIndex: 99 }]}
              />
            </View>

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
    backgroundColor: "#f5f5f5",
    paddingHorizontal: 20,
    paddingTop: 20,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 20,
    paddingVertical: 15,
    paddingHorizontal: 20,
    borderRadius: 10,
    elevation: 3,
  },
  searchInput: {
    height: 40,
    flex: 1,
    fontFamily: "System",
    fontSize: 16,
    marginLeft: 10,
  },
  addButton: {
    position: "absolute",
    bottom: 20,
    right: 20,
    paddingVertical: 15,
    paddingHorizontal: 20,
    borderRadius: 10,
    elevation: 3,
  },
  addButtonText: {
    color: "white",
    fontWeight: "bold",
    fontSize: 16,
    fontFamily: "System",
  },
  noTasksText: {
    textAlign: "center",
    marginTop: 50,
    fontSize: 18,
    color: "#555",
  },
  modalContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  modalContent: {
    width: 300,
    padding: 20,
    borderRadius: 10,
    elevation: 5,
    backgroundColor: "#fff",
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 15,
    color: "#333",
    fontFamily: "System",
  },
  dropdown: {
    height: 40,
    backgroundColor: "#ecf0f1",
    borderWidth: 0,
  },
  buttonText: {
    color: "#fff",
    fontSize: 16,
    fontFamily: "System",
  },
  applyButton: {
    marginTop: 20,
    paddingHorizontal: 7,
    paddingVertical: 12,
    backgroundColor: "#3498db",
    borderRadius: 10,
    alignItems: "center",
    elevation: 3,
  },
  clearButton: {
    marginTop: 20,
    paddingHorizontal: 7,
    paddingVertical: 12,
    backgroundColor: "#e74c3c",
    borderRadius: 10,
    alignItems: "center",
    elevation: 3,
  },
  buttonContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  confirmButton: {
    marginTop: 20,
    paddingHorizontal: 19,
    paddingVertical: 12,
    backgroundColor: "#27ae60",
    borderRadius: 10,
    alignItems: "center",
    elevation: 3,
  },
  cancelButton: {
    marginTop: 20,
    paddingHorizontal: 19,
    paddingVertical: 12,
    backgroundColor: "#e74c3c",
    borderRadius: 10,
    alignItems: "center",
    elevation: 3,
  },
  dropdownContainer: {
    marginBottom: 15,
    paddingVertical: 9,
  },
  dropdownLabel: {
    fontSize: 13,
    marginVertical: 10,
    paddingHorizontal: 8,
    color: "#555",
  },
  radioButtonContainer: {
    flexDirection: "column",
    alignItems: "flex-start",
  },
  radioButton: {},
});

export default TaskList;
