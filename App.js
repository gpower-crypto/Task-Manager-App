// App.js
import React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import Home from "./components/HomeScreen";
import TaskDetails from "./components/TaskDetails";
import AddTaskScreen from "./components/AddTaskScreen";
import TaskList from "./components/TaskList";
import CalendarIntegration from "./components/CalendarIntegration";
import Dashboard from "./components/Dashboard";

const Stack = createStackNavigator();

const App = () => {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Home">
        <Stack.Screen name="Home" component={Home} />
        <Stack.Screen name="TaskList" component={TaskList} />
        <Stack.Screen name="TaskDetails" component={TaskDetails} />
        <Stack.Screen name="Add Task" component={AddTaskScreen} />
        <Stack.Screen name="Calendar" component={CalendarIntegration} />
        <Stack.Screen name="Dashboard" component={Dashboard} />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default App;
