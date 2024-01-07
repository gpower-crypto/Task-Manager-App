// Task.js
import React from "react";
import { List, Checkbox } from "react-native-paper";

const Task = ({ task, onToggle, onPress }) => {
  return (
    <List.Item
      title={task.title}
      onPress={onPress}
      right={() => (
        <Checkbox
          status={task.completed ? "checked" : "unchecked"}
          onPress={() => onToggle(task.id)}
        />
      )}
    />
  );
};

export default Task;
