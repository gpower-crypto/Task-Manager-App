import React from "react";
import {
  FlatList,
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
} from "react-native";
import Task from "./Task";

// Functional component for rendering a list of tasks with checkboxes
const TaskListWithCheckbox = ({ tasks, onToggle, onPress }) => {
  return (
    <FlatList
      data={tasks}
      keyExtractor={(task) => task.id.toString()}
      renderItem={({ item }) => (
        <TouchableOpacity onPress={() => onPress(item)}>
          {/* Render each task with a TouchableOpacity for interaction */}
          <Task task={item} onToggle={() => onToggle(item.id)} />
        </TouchableOpacity>
      )}
    />
  );
};

export default TaskListWithCheckbox;
