import React, { useState, useEffect } from "react";
import {
  View,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Text,
  Image,
} from "react-native";
import DateTimePicker from "@react-native-community/datetimepicker";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useNavigation, useRoute } from "@react-navigation/native";
import * as ImagePicker from "expo-image-picker";

// Functional component for AddTaskScreen
const AddTaskScreen = () => {
  // State variables for task details
  const [taskTitle, setTaskTitle] = useState("");
  const [taskDescription, setTaskDescription] = useState("");
  const [dueDate, setDueDate] = useState(new Date());
  const [priority, setPriority] = useState("none");
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [selectedImages, setSelectedImages] = useState([]);

  // Navigation and route hooks
  const navigation = useNavigation();
  const route = useRoute();
  const { taskToEdit } = route.params || {};
  const { name, id, color, textColor } = route.params?.category || {};

  // useEffect to populate state when editing a task
  useEffect(() => {
    if (taskToEdit) {
      const {
        title,
        description,
        dueDate: dueDateStr,
        priority,
        image,
      } = taskToEdit;
      setTaskTitle(title || "");
      setTaskDescription(description || "");
      setDueDate(new Date(dueDateStr || new Date()));
      setPriority(priority || "medium");
      setSelectedImages(image || []);
    }
  }, [taskToEdit]);

  // Function to handle task addition or update in AsyncStorage
  const onAddTask = async (newTask) => {
    try {
      const existingTasksString = await AsyncStorage.getItem("tasks");
      const existingTasks = existingTasksString
        ? JSON.parse(existingTasksString)
        : [];

      if (taskToEdit) {
        // Update existing task
        const updatedTasks = existingTasks.map((task) =>
          task.id === taskToEdit.id ? newTask : task
        );
        await AsyncStorage.setItem("tasks", JSON.stringify(updatedTasks));
        console.log("Task updated in AsyncStorage:", newTask);
      } else {
        // Add new task
        const updatedTasks = [...existingTasks, newTask];
        await AsyncStorage.setItem("tasks", JSON.stringify(updatedTasks));
        console.log("Task added to AsyncStorage:", newTask);
      }
    } catch (error) {
      console.error("Error updating/adding task to AsyncStorage:", error);
    }
  };

  // Function to pick images from device
  const pickImage = async () => {
    try {
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [4, 3],
        quality: 1,
        multiple: true, // Allow multiple image selection
      });

      if (!result.canceled) {
        // Update the state with the selected images
        setSelectedImages(result.assets);
      }
    } catch (error) {
      console.error("Error picking image:", error);
    }
  };

  // useEffect to update screen navbar
  useEffect(() => {
    updateScreenNavbar();
  });

  // Function to handle date change in DateTimePicker
  const onChange = (event, selectedDate) => {
    const currentDate = selectedDate || dueDate;
    setShowDatePicker(false);
    setDueDate(currentDate);
  };

  // Function to show DateTimePicker modal
  const showDatePickerModal = () => {
    setShowDatePicker(true);
  };

  // Function to add or update a task
  const addTask = () => {
    if (taskTitle.trim() === "") {
      alert("Please enter a task title");
      return;
    }

    // Create a new task object
    const newTask = {
      id: taskToEdit?.id || Date.now().toString(),
      title: taskTitle,
      description: taskDescription,
      dueDate: dueDate.toISOString(),
      completed: taskToEdit?.completed || false,
      priority,
      categoryId: id,
      categoryName: name,
      image: selectedImages.map((image) => image.uri),
    };

    // Call onAddTask to handle AsyncStorage update
    onAddTask(newTask);

    // Navigate back to TaskList with category information
    navigation.navigate("TaskList", { category: route.params?.category });
  };

  // Function to update screen navbar based on category colors
  const updateScreenNavbar = () => {
    navigation.setOptions({
      title: taskToEdit && "Edit Task",
      headerStyle: {
        backgroundColor: color, // Updated header color
      },
      headerTintColor: textColor,
    });
  };

  // Function to render selected images
  const renderSelectedImages = () => {
    return selectedImages.map((image, index) => (
      <Image
        key={index}
        source={{ uri: image.uri || image }}
        style={styles.selectedImage}
      />
    ));
  };

  return (
    <View style={styles.container}>
      {/* Input for Task Title */}
      <TextInput
        style={styles.input}
        placeholder="Task Title"
        value={taskTitle}
        onChangeText={(text) => setTaskTitle(text)}
      />
      {/* Input for Task Description */}
      <TextInput
        style={styles.input}
        placeholder="Task Description"
        value={taskDescription}
        onChangeText={(text) => setTaskDescription(text)}
      />
      {/* Button to pick images */}
      <TouchableOpacity onPress={pickImage} style={styles.imagePickerButton}>
        <Text style={styles.imagePickerButtonText}>Add Image</Text>
      </TouchableOpacity>

      {/* Render selected images */}
      {renderSelectedImages()}

      {/* Button to show DatePicker */}
      <TouchableOpacity
        onPress={showDatePickerModal}
        style={styles.datePickerButton}
      >
        <Text
          style={styles.datePickerButtonText}
        >{`Due Date: ${dueDate.toDateString()}`}</Text>
      </TouchableOpacity>

      {/* Render DatePicker modal if showDatePicker is true */}
      {showDatePicker && (
        <DateTimePicker
          testID="dateTimePicker"
          value={dueDate}
          mode="date"
          is24Hour={true}
          display="default"
          onChange={onChange}
        />
      )}

      {/* Priority selection section */}
      <View style={styles.priorityContainer}>
        <Text style={styles.priorityLabel}>Priority:</Text>
        <View style={styles.radioGroup}>
          {/* Priority buttons */}
          <TouchableOpacity
            onPress={() => setPriority("high")}
            style={[
              styles.radioButton,
              { backgroundColor: priority === "high" ? "#FF5733" : "white" },
            ]}
          >
            <Text style={styles.radioText}>High</Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => setPriority("medium")}
            style={[
              styles.radioButton,
              {
                backgroundColor: priority === "medium" ? "#EB9847" : "white",
              },
            ]}
          >
            <Text style={styles.radioText}>Medium</Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => setPriority("low")}
            style={[
              styles.radioButton,
              { backgroundColor: priority === "low" ? "#72D032" : "white" },
            ]}
          >
            <Text style={styles.radioText}>Low</Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => setPriority("none")}
            style={[
              styles.radioButton,
              { backgroundColor: priority === "none" ? "#D8DED4" : "white" },
            ]}
          >
            <Text style={styles.radioText}>None</Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Button to add or update a task */}
      <TouchableOpacity
        onPress={addTask}
        style={[
          styles.addButton,
          {
            backgroundColor: color,
            color: textColor,
          },
        ]}
      >
        <Text
          style={[
            styles.buttonText,
            {
              color: textColor,
            },
          ]}
        >
          {!taskToEdit ? "Add Task" : "Update Task"}
        </Text>
      </TouchableOpacity>
    </View>
  );
};

// Styles for AddTaskScreen component
const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: "#f5f5f5",
  },
  input: {
    marginBottom: 15,
    padding: 15,
    borderColor: "#ccc",
    borderWidth: 1,
    borderRadius: 10,
  },
  datePickerButton: {
    marginBottom: 15,
    padding: 15,
    borderColor: "#ccc",
    borderWidth: 1,
    borderRadius: 10,
    alignItems: "center",
    backgroundColor: "#ecf0f1",
  },
  datePickerButtonText: {
    fontSize: 16,
  },
  priorityContainer: {
    marginBottom: 15,
  },
  priorityLabel: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 10,
    color: "#333",
  },
  radioGroup: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 8,
  },
  radioButton: {
    padding: 12,
    borderWidth: 1,
    borderRadius: 10,
    marginHorizontal: 2,
  },
  radioText: {
    fontSize: 16,
    fontWeight: "600",
  },
  addButton: {
    marginTop: 20,
    padding: 15,
    borderRadius: 10,
    alignItems: "center",
    backgroundColor: "#3498db",
  },
  buttonText: {
    fontSize: 16,
    fontWeight: "600",
  },
  imagePickerButton: {
    marginBottom: 15,
    padding: 15,
    borderColor: "#ccc",
    borderWidth: 1,
    borderRadius: 10,
    alignItems: "center",
    backgroundColor: "#ecf0f1",
  },
  imagePickerButtonText: {
    fontSize: 16,
  },
  selectedImage: {
    width: 100,
    height: 100,
    borderRadius: 10,
    marginTop: 10,
    marginBottom: 20,
  },
});

export default AddTaskScreen;
