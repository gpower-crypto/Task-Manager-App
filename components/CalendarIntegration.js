import React, { useEffect, useState } from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { Calendar as RNCalendar } from "react-native-calendars";
import AsyncStorage from "@react-native-async-storage/async-storage";
import * as ExpoCalendar from "expo-calendar";

// CalendarIntegration component for handling calendar-related functionality
const CalendarIntegration = ({ navigation }) => {
  // State to store tasks fetched from AsyncStorage
  const [tasks, setTasks] = useState([]);

  // Fetch tasks from AsyncStorage when component mounts
  useEffect(() => {
    fetchTasks();
  }, []);

  // Function to fetch tasks from AsyncStorage
  const fetchTasks = async () => {
    try {
      const tasksString = await AsyncStorage.getItem("tasks");
      const tasks = tasksString ? JSON.parse(tasksString) : [];
      setTasks(tasks);
    } catch (error) {
      console.error("Error fetching tasks:", error);
    }
  };

  // Function to mark due dates on the calendar
  const markDueDatesOnCalendar = () => {
    const markedDates = {};

    tasks.forEach((task) => {
      if (task.dueDate) {
        const date = new Date(task.dueDate).toISOString().split("T")[0];
        markedDates[date] = { marked: true };
      }
    });

    return markedDates;
  };

  // Function to create a task in the device calendar
  const createTaskInCalendar = async (task) => {
    // Check if the calendar has been created
    const calendars = await ExpoCalendar.getCalendarsAsync();
    const targetCalendar = calendars.find(
      (cal) => cal.title === "Your App Calendar"
    );

    if (!targetCalendar) {
      // If the calendar doesn't exist, create it
      const newCalendarID = await ExpoCalendar.createCalendarAsync({
        title: "Your App Calendar",
        color: "blue",
        entityType: ExpoCalendar.EntityTypes.EVENT,
        sourceId: calendars[0].sourceId,
        source: calendars[0].source,
        name: "tasks",
        ownerAccount: "personal",
        accessLevel: ExpoCalendar.CalendarAccessLevel.OWNER,
      });

      task.calendarId = newCalendarID;
    }

    // Create the event
    const eventDetails = {
      title: task.title,
      startDate: new Date(task.dueDate),
      endDate: new Date(task.dueDate),
      calendarId: task.calendarId,
    };

    const eventId = await ExpoCalendar.createEventAsync(
      task.calendarId,
      eventDetails
    );
    console.log(`Event created: ${eventId}`);
  };

  // Function to handle day press event on the calendar
  const handleDayPress = (day) => {
    // Fetch and display tasks for the selected day
    const selectedDate = day.dateString;

    // Find tasks for the selected date
    const tasksForDate = tasks.filter(
      (task) => task.dueDate && task.dueDate.split("T")[0] === selectedDate
    );

    // Navigate to the TaskDetails page for the selected date's tasks
    if (tasksForDate.length > 0) {
      const firstTask = tasksForDate[0]; // Assuming you want to navigate to the details of the first task
      navigation.navigate("TaskDetails", {
        item: firstTask,
        categoryId: firstTask.categoryId, // Make sure to have categoryId in your task object
        backgroundColor: firstTask.categoryColor, // Use the appropriate property from your task object
        textColor: firstTask.categoryTextColor, // Use the appropriate property from your task object
      });
    } else {
      // If no tasks are found, you can handle this case or show a message
      console.log("No tasks found for the selected date");
    }
  };

  // Render the CalendarIntegration component
  return (
    <View style={styles.container}>
      <RNCalendar
        markedDates={markDueDatesOnCalendar()}
        onDayPress={handleDayPress}
        theme={{
          calendarBackground: "#f2f2f2",
          textSectionTitleColor: "#3498db",
          todayTextColor: "#3498db",
          dayTextColor: "#2d4150",
          arrowColor: "#3498db",
          selectedDayBackgroundColor: "#3498db",
          selectedDayTextColor: "#ffffff",
          textDayFontWeight: "bold",
        }}
      />
    </View>
  );
};

// Styles for the CalendarIntegration component
const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 10,
    backgroundColor: "#fff",
  },
  addTaskButton: {
    marginTop: 20,
    padding: 20,
    backgroundColor: "#38419D",
    borderRadius: 8,
    alignItems: "center",
  },
  addTaskButtonText: {
    color: "#fff",
    fontWeight: "bold",
  },
  taskListTitle: {
    marginTop: 20,
    fontSize: 18,
    fontWeight: "bold",
  },
});

export default CalendarIntegration;
