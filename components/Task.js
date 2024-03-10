import React from "react";
import { List, Checkbox } from "react-native-paper";
import { StyleSheet, View, Text } from "react-native";

// Task component for displaying individual tasks
const Task = ({ task, onToggle, onPress }) => {
  // Render the Task component
  return (
    <List.Item
      style={styles.taskItem}
      title={
        <View style={styles.taskItemContent}>
          <Text style={styles.taskTitle}>{task.title}</Text>
          <Text
            style={[
              styles.taskPriority,
              {
                backgroundColor: priorityColors[task.priority],
              },
            ]}
          >
            {task.priority}
          </Text>
        </View>
      }
      onPress={onPress}
      right={() => (
        <Checkbox
          status={task.completed ? "checked" : "unchecked"}
          onPress={() => onToggle(task.id)}
          color="#3498db"
        />
      )}
    />
  );
};

// Priority colors for styling tasks
const priorityColors = {
  high: "#e74c3c",
  medium: "#f39c12",
  low: "#3498db",
  none: "#95a5a6",
};

// Styles for the Task component
const styles = StyleSheet.create({
  taskItem: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    backgroundColor: "#fff",
    borderRadius: 10,
    padding: 15,
    marginBottom: 10,
    elevation: 2,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  taskItemContent: {
    flexDirection: "row",
    alignItems: "center",
  },
  taskTitle: {
    fontSize: 16,
    fontWeight: "bold",
    marginRight: 10,
    color: "#333",
  },
  taskPriority: {
    fontSize: 12,
    fontWeight: "bold",
    paddingVertical: 4,
    paddingHorizontal: 8,
    borderRadius: 8,
    color: "#fff",
  },
});

export default Task;
