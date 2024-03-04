import React, { useEffect, useState } from "react";
import { View, Text, TouchableOpacity } from "react-native";
import { Calendar as RNCalendar } from "react-native-calendars";
import AsyncStorage from "@react-native-async-storage/async-storage";
import * as ExpoCalendar from "expo-calendar"; // Rename the imported object here

const CalendarIntegration = ({ navigation }) => {
  const [tasks, setTasks] = useState([]);

  useEffect(() => {
    fetchTasks();
  }, []);

  const fetchTasks = async () => {
    try {
      const tasksString = await AsyncStorage.getItem("tasks");
      const tasks = tasksString ? JSON.parse(tasksString) : [];
      setTasks(tasks);
    } catch (error) {
      console.error("Error fetching tasks:", error);
    }
  };

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

  return (
    <View>
      <RNCalendar
        markedDates={markDueDatesOnCalendar()}
        onDayPress={(day) => {
          // Handle day press event
          // Fetch and display tasks for the selected day
        }}
      />
      <TouchableOpacity
        onPress={() => navigation.navigate("Add Task")}
        style={{
          padding: 20,
          backgroundColor: "#3498db",
          marginTop: 20,
          borderRadius: 8,
        }}
      >
        <Text style={{ color: "#fff" }}>Add Task</Text>
      </TouchableOpacity>
      <Text>Your Task List</Text>
      {/* Display your tasks here */}
    </View>
  );
};

export default CalendarIntegration;
