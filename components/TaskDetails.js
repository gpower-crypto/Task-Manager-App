import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  Modal,
  Dimensions,
  Alert,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Ionicons } from "@expo/vector-icons";
import DateTimePickerModal from "react-native-modal-datetime-picker";
import * as Notifications from "expo-notifications";

// TaskDetails component for displaying task details
const TaskDetails = ({ route, navigation }) => {
  const { item, categoryId, backgroundColor, textColor } = route.params;
  const { id, title, description, dueDate, completed, priority, image } = item;

  const [modalVisible, setModalVisible] = useState(false);
  const [selectedImage, setSelectedImage] = useState(null);
  const [reminderDate, setReminderDate] = useState(null);
  const [showDatePicker, setShowDatePicker] = useState(false);

  // Show date picker modal
  const showDatepicker = () => {
    setShowDatePicker(true);
  };

  // Hide date picker modal
  const hideDatePicker = () => {
    setShowDatePicker(false);
  };

  // Handle date change in date picker
  const handleDateChange = (selectedDate) => {
    const parsedDate = new Date(selectedDate);

    setReminderDate(parsedDate);
    hideDatePicker();
  };

  // Set reminder when reminder date changes
  useEffect(() => {
    setReminder();
  }, [reminderDate]);

  // Set reminder using Expo Notifications
  const setReminder = async () => {
    if (reminderDate) {
      const identifier = await Notifications.scheduleNotificationAsync({
        content: {
          title: "Task Reminder",
          body: `Don't forget about your task: ${title}`,
          data: { data: "goes here" },
        },
        trigger: { date: reminderDate },
      });

      // Show confirmation message
      Alert.alert(
        "Reminder Set",
        `You will be reminded about "${title}" on ${reminderDate.toLocaleString()}`
      );
    }
  };

  // Update screen navigation bar
  useEffect(() => {
    updateScreenNavbar();
  }, []);

  // Update screen navigation bar options
  const updateScreenNavbar = () => {
    navigation.setOptions({
      title: "Task Details",
      headerStyle: {
        backgroundColor: backgroundColor,
        elevation: 0, // Remove shadow on Android
        shadowOpacity: 0, // Remove shadow on iOS
      },
      headerTintColor: textColor,
    });
  };

  // Handle task deletion
  const handleDeleteTask = async () => {
    try {
      const tasksString = await AsyncStorage.getItem("tasks");
      const tasks = tasksString ? JSON.parse(tasksString) : [];
      const updatedTasks = tasks.filter((task) => task.id !== id);
      await AsyncStorage.setItem("tasks", JSON.stringify(updatedTasks));
      navigation.goBack();
    } catch (error) {
      console.error("Error deleting task:", error);
    }
  };

  // Handle task editing
  const handleEditTask = () => {
    navigation.navigate("Add Task", {
      taskToEdit: {
        ...item,
        image: image,
      },
      category: {
        name: item.category,
        id: categoryId,
        color: backgroundColor,
        textColor,
      },
    });
  };

  // Handle image click for displaying full-size image
  const handleImageClick = (selectedImage) => {
    setSelectedImage(selectedImage);
    setModalVisible(true);
  };

  // Render the TaskDetails component
  return (
    <View style={styles.container}>
      <Text style={styles.title}>{title}</Text>
      <Text style={styles.label}>Notes</Text>
      <Text style={styles.description}>{description || "No description"}</Text>

      <View style={styles.infoContainer}>
        <View style={styles.infoRow}>
          <Ionicons name="calendar-outline" size={20} color="#555" />
          <Text style={styles.infoText}>
            {dueDate ? new Date(dueDate).toLocaleDateString() : "No due date"}
          </Text>
        </View>
        <View style={styles.infoRow}>
          <Ionicons name="flag-outline" size={20} color="#555" />
          <Text style={styles.infoText}>{priority}</Text>
        </View>
        <View style={styles.infoRow}>
          <Ionicons
            name={
              completed ? "checkmark-circle-outline" : "close-circle-outline"
            }
            size={20}
            color={completed ? "#27ae60" : "#e74c3c"}
          />
          <Text
            style={[
              styles.infoText,
              { color: completed ? "#27ae60" : "#e74c3c", marginLeft: 8 },
            ]}
          >
            {completed ? "Completed" : "Incomplete"}
          </Text>
        </View>

        {!completed && (
          <TouchableOpacity
            onPress={showDatepicker}
            style={styles.reminderButton}
          >
            <Ionicons name="alarm" size={24} color="#3498db" />
            <Text style={styles.reminderButtonText}>Set Reminder</Text>
          </TouchableOpacity>
        )}
      </View>

      <Text style={styles.label}>Attachments</Text>

      <View style={styles.imageContainer}>
        {image && (
          <TouchableOpacity
            onPress={() => handleImageClick(image[0])}
            style={styles.imagePreview}
          >
            {image[0] && (
              <Image source={{ uri: image[0] }} style={styles.image} />
            )}
          </TouchableOpacity>
        )}
      </View>

      <View style={styles.buttonContainer}>
        <TouchableOpacity
          style={[styles.actionButton, styles.deleteButton]}
          onPress={handleDeleteTask}
        >
          <Text style={styles.buttonText}>Delete Task</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.actionButton, styles.editButton]}
          onPress={handleEditTask}
        >
          <Text style={styles.buttonText}>Edit Task</Text>
        </TouchableOpacity>
      </View>

      {/* Modal for displaying full-size image */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalContainer}>
          <TouchableOpacity
            style={styles.modalCloseButton}
            onPress={() => setModalVisible(false)}
          >
            <Ionicons name="close" size={30} color="#fff" />
          </TouchableOpacity>
          <Image source={{ uri: selectedImage }} style={styles.modalImage} />
        </View>
      </Modal>
      <DateTimePickerModal
        isVisible={showDatePicker}
        mode="date"
        onConfirm={handleDateChange}
        onCancel={hideDatePicker}
        date={reminderDate || new Date()}
      />
    </View>
  );
};

// Styles for the TaskDetails component
const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: "#f5f5f5",
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 16,
    color: "#333",
  },
  label: {
    fontSize: 18,
    fontWeight: "bold",
    marginTop: 16,
    marginBottom: 10,
    color: "#555",
  },
  description: {
    fontSize: 16,
    marginBottom: 16,
    color: "#555",
  },
  infoContainer: {
    borderTopWidth: 1,
    borderTopColor: "#ddd",
    paddingTop: 16,
  },
  infoRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 12,
  },
  infoText: {
    marginLeft: 8,
    fontSize: 16,
    color: "#555",
  },
  buttonContainer: {
    flexDirection: "row",
    justifyContent: "space-evenly",
    marginTop: 15,
  },
  actionButton: {
    flex: 1,
    padding: 15,
    borderRadius: 10,
    marginHorizontal: 7,
    alignItems: "center",
    justifyContent: "center",
  },
  deleteButton: {
    backgroundColor: "#e74c3c",
  },
  editButton: {
    backgroundColor: "#3498db",
  },
  buttonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
  },
  imageContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    marginBottom: 20,
  },
  imagePreview: {
    margin: 5,
    borderRadius: 8,
    overflow: "hidden",
  },
  image: {
    width: Dimensions.get("window").width / 3 - 20,
    height: Dimensions.get("window").width / 3 - 20,
    borderRadius: 8,
  },
  modalContainer: {
    flex: 1,
    backgroundColor: "#000",
    justifyContent: "center",
    alignItems: "center",
  },
  modalCloseButton: {
    position: "absolute",
    top: 20,
    right: 20,
    zIndex: 1,
  },
  modalImage: {
    width: "100%",
    height: "100%",
    resizeMode: "contain",
  },
  reminderButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#ecf0f1",
    paddingVertical: 10,
    paddingHorizontal: 15,
    borderRadius: 8,
    marginTop: 10,
  },
  reminderButtonText: {
    marginLeft: 10,
    color: "#3498db",
    fontSize: 16,
  },
});

export default TaskDetails;
