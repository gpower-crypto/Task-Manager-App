// TaskListWithCheckbox.js
import React from "react";
import {
  FlatList,
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
} from "react-native";
import Task from "./Task";

const TaskListWithCheckbox = ({ tasks, onToggle, onPress }) => {
  return (
    <FlatList
      data={tasks}
      keyExtractor={(task) => task.id.toString()}
      renderItem={({ item }) => (
        <TouchableOpacity onPress={() => onPress(item)}>
          <Task task={item} onToggle={() => onToggle(item.id)} />
        </TouchableOpacity>
      )}
    />
  );
};

export default TaskListWithCheckbox;
