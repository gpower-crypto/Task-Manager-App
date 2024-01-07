// TaskDetails.js
import React from "react";
import { View, Text, StyleSheet, Button } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";

const TaskDetails = ({ route, navigation }) => {
  const { item, categoryId } = route.params;
  const { id, title, description, dueDate, completed, priority } = item;

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

  const handleEditTask = () => {
    navigation.navigate("AddTask", {
      taskToEdit: item,
      category: { name: item.category, id: categoryId },
    });
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>{title}</Text>
      <Text style={styles.label}>{`Description:`}</Text>
      <Text style={styles.description}>{description || "No description"}</Text>
      <Text style={styles.label}>{`Due Date:`}</Text>
      <Text style={styles.dueDate}>
        {dueDate ? new Date(dueDate).toLocaleDateString() : "No due date"}
      </Text>
      <Text style={styles.label}>Priority:</Text>
      <Text style={styles.priority}>{priority}</Text>
      <Text style={styles.label}>{`Status:`}</Text>
      <Text style={styles.status}>
        {completed ? "Completed" : "Incomplete"}
      </Text>

      <View style={styles.buttonContainer}>
        <Button
          title="Delete Task"
          onPress={handleDeleteTask}
          color="#FF4949"
        />
        <Button title="Edit Task" onPress={handleEditTask} color="#4CAF50" />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: "#F4F4F4",
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 8,
    color: "#333",
  },
  label: {
    fontSize: 16,
    fontWeight: "bold",
    marginTop: 12,
    color: "#666",
  },
  description: {
    fontSize: 16,
    marginBottom: 12,
    color: "#333",
  },
  dueDate: {
    fontSize: 16,
    marginBottom: 12,
    color: "#333",
  },
  priority: {
    fontSize: 16,
    marginBottom: 12,
    color: "#333",
  },
  status: {
    fontSize: 16,
    marginBottom: 16,
    color: "#333",
  },
  buttonContainer: {
    flexDirection: "row",
    justifyContent: "space-evenly",
    marginTop: 16,
  },
});

export default TaskDetails;
