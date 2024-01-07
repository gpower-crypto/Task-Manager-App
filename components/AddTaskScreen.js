// AddTaskScreen.js
import React, { useState, useEffect } from "react";
import {
  View,
  TextInput,
  Button,
  StyleSheet,
  TouchableOpacity,
  Text,
} from "react-native";
import DateTimePicker from "@react-native-community/datetimepicker";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useNavigation, useRoute } from "@react-navigation/native";

const AddTaskScreen = () => {
  const [taskTitle, setTaskTitle] = useState("");
  const [taskDescription, setTaskDescription] = useState("");
  const [dueDate, setDueDate] = useState(new Date());
  const [priority, setPriority] = useState("none");
  const [showDatePicker, setShowDatePicker] = useState(false);

  const navigation = useNavigation();
  const route = useRoute();
  const { taskToEdit } = route.params || {};

  useEffect(() => {
    if (taskToEdit) {
      const { title, description, dueDate: dueDateStr, priority } = taskToEdit;
      setTaskTitle(title || "");
      setTaskDescription(description || "");
      setDueDate(new Date(dueDateStr || new Date()));
      setPriority(priority || "medium");
    }
  }, [taskToEdit]);

  const onAddTask = async (newTask) => {
    try {
      const existingTasksString = await AsyncStorage.getItem("tasks");
      const existingTasks = existingTasksString
        ? JSON.parse(existingTasksString)
        : [];

      if (taskToEdit) {
        const updatedTasks = existingTasks.map((task) =>
          task.id === taskToEdit.id ? newTask : task
        );
        await AsyncStorage.setItem("tasks", JSON.stringify(updatedTasks));
        console.log("Task updated in AsyncStorage:", newTask);
      } else {
        const updatedTasks = [...existingTasks, newTask];
        await AsyncStorage.setItem("tasks", JSON.stringify(updatedTasks));
        console.log("Task added to AsyncStorage:", newTask);
      }
    } catch (error) {
      console.error("Error updating/adding task to AsyncStorage:", error);
    }
  };

  const onChange = (event, selectedDate) => {
    const currentDate = selectedDate || dueDate;
    setShowDatePicker(false);
    setDueDate(currentDate);
  };

  const showDatePickerModal = () => {
    setShowDatePicker(true);
  };

  const addTask = () => {
    if (taskTitle.trim() === "") {
      alert("Please enter a task title");
      return;
    }

    const newTask = {
      id: taskToEdit?.id || Date.now().toString(),
      title: taskTitle,
      description: taskDescription,
      dueDate: dueDate.toISOString(),
      completed: taskToEdit?.completed || false,
      priority,
      category: route.params?.category?.name,
    };

    onAddTask(newTask);

    navigation.navigate("TaskList", { category: route.params?.category });
  };

  return (
    <View style={styles.container}>
      <TextInput
        style={styles.input}
        placeholder="Task Title"
        value={taskTitle}
        onChangeText={(text) => setTaskTitle(text)}
      />
      <TextInput
        style={styles.input}
        placeholder="Task Description"
        value={taskDescription}
        onChangeText={(text) => setTaskDescription(text)}
      />
      <View style={styles.priorityContainer}>
        <Text>Priority:</Text>
        <View style={styles.radioGroup}>
          <TouchableOpacity
            onPress={() => setPriority("high")}
            style={[
              styles.radioButton,
              { backgroundColor: priority === "high" ? "#FF5733" : "white" },
            ]}
          >
            <Text>High</Text>
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
            <Text>Medium</Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => setPriority("low")}
            style={[
              styles.radioButton,
              { backgroundColor: priority === "low" ? "#72D032" : "white" },
            ]}
          >
            <Text>Low</Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => setPriority("none")}
            style={[
              styles.radioButton,
              { backgroundColor: priority === "none" ? "#D8DED4" : "white" },
            ]}
          >
            <Text>None</Text>
          </TouchableOpacity>
        </View>
      </View>
      <TouchableOpacity
        onPress={showDatePickerModal}
        style={styles.datePickerButton}
      >
        <Text>{`Due Date: ${dueDate.toDateString()}`}</Text>
      </TouchableOpacity>
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
      <Button
        title={!taskToEdit ? "Add Task" : "Update Task"}
        onPress={addTask}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  input: {
    marginVertical: 8,
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderWidth: 1,
    borderRadius: 8,
  },
  datePickerButton: {
    marginVertical: 8,
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderWidth: 1,
    borderRadius: 8,
    alignItems: "center",
  },
  priorityContainer: {
    marginVertical: 8,
  },
  radioGroup: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 8,
  },
  radioButton: {
    flex: 1,
    alignItems: "center",
    paddingVertical: 8,
    borderWidth: 1,
    borderRadius: 8,
  },
});

export default AddTaskScreen;
