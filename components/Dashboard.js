import React, { useEffect, useState } from "react";
import { View, Text, StyleSheet, ScrollView } from "react-native";
import {
  VictoryPie,
  VictoryBar,
  VictoryChart,
  VictoryAxis,
  VictoryLine,
  VictoryLabel,
} from "victory-native";
import AsyncStorage from "@react-native-async-storage/async-storage";

// Dashboard component for displaying task completion and statistics
const Dashboard = () => {
  // State to store the tasks
  const [tasks, setTasks] = useState([]);

  // useEffect to fetch tasks on component mount or when tasks state changes
  useEffect(() => {
    fetchTasks();
  }, [tasks]);

  // Function to fetch tasks from AsyncStorage
  const fetchTasks = async () => {
    try {
      const tasksString = await AsyncStorage.getItem("tasks");
      const allTasks = tasksString ? JSON.parse(tasksString) : [];
      setTasks(allTasks);
    } catch (error) {
      console.error("Error fetching tasks:", error);
    }
  };

  // Function to calculate the completion percentage of tasks
  const completionPercentage = () => {
    const completedTasks = tasks.filter((task) => task.completed);
    return (completedTasks.length / tasks.length) * 100 || 0;
  };

  // Function to group tasks by categories for charting
  const groupTasksByCategories = () => {
    const uniqueCategoryIds = [
      ...new Set(tasks.map((task) => task.categoryId)),
    ];
    const tasksByCategory = uniqueCategoryIds.reduce((acc, categoryId) => {
      const categoryTasks = tasks.filter(
        (task) => task.categoryId === categoryId
      );
      const categoryName =
        categoryTasks.length > 0
          ? categoryTasks[0].categoryName
          : "Uncategorized";
      acc[categoryName] = (acc[categoryName] || 0) + 1;
      return acc;
    }, {});

    const tasksByEachCategory = tasks.reduce((acc, task) => {
      const category = task.categoryName || "Uncategorized";
      acc[category] = (acc[category] || 0) + 1;
      return acc;
    }, {});

    const totalCount = Object.values(tasksByCategory).reduce(
      (total, count) => total + count,
      0
    );

    const categoryData = Object.entries(tasksByEachCategory).map(
      ([category, count]) => ({
        x: category,
        y: count,
      })
    );

    return { totalCount, categoryData };
  };

  // Render the Dashboard component
  return (
    <ScrollView contentContainerStyle={styles.container}>
      {/* Task Completion Chart */}
      <Text style={styles.heading}>Task Completion</Text>
      <View style={styles.chartContainer}>
        <VictoryPie
          data={[
            { x: "Completed", y: completionPercentage().toFixed(0) },
            { x: "Remaining", y: (100 - completionPercentage()).toFixed(0) },
          ]}
          colorScale={["#5cb85c", "#d9534f"]}
          height={200}
          padding={40}
          innerRadius={50}
          labelRadius={70}
          style={{
            parent: { marginLeft: -18 },
            labels: { fill: "#333", fontSize: 18, fontWeight: "bold" },
          }}
          labels={({ datum }) => `${datum.x}\n${datum.y}%`}
        />
      </View>

      {/* Tasks by Category Chart */}
      <Text style={styles.heading}>Tasks by Category</Text>
      {tasks.length > 0 && (
        <ScrollView
          horizontal={true}
          contentContainerStyle={styles.horizontalScroll}
        >
          <View style={styles.chartContainer}>
            <VictoryChart
              domainPadding={{ x: 30 }}
              width={
                groupTasksByCategories().totalCount *
                (groupTasksByCategories().totalCount === 1 ? 220 : 120)
              }
            >
              <VictoryAxis
                tickValues={groupTasksByCategories().categoryData.map(
                  (dataPoint) => dataPoint.x
                )}
                style={{
                  axis: { stroke: "#333" },
                  ticks: { stroke: "#333" },
                  tickLabels: { fill: "#333", fontSize: 12 },
                }}
              />
              <VictoryBar
                data={groupTasksByCategories().categoryData}
                style={{ data: { width: 15, fill: "#5bc0de" } }}
                labels={({ datum }) =>
                  `${datum.y} ${datum.y === 1 ? "task" : "tasks"}`
                }
                labelComponent={<VictoryLabel dy={-15} />}
              />
            </VictoryChart>
          </View>
        </ScrollView>
      )}

      {/* Task Distribution Over Time Chart */}
      <Text style={styles.heading}>Task Distribution Over Time</Text>
      {tasks.length > 0 && (
        <View style={styles.chartContainer}>
          <ScrollView horizontal={true}>
            <VictoryChart
              width={tasks.length * 320} // Adjust as needed based on the number of tasks
            >
              <VictoryAxis
                tickFormat={(t) =>
                  new Date(t).toLocaleDateString(undefined, {
                    day: "numeric",
                    month: "short",
                  })
                }
                style={{
                  axis: { stroke: "#333" },
                  ticks: { stroke: "#333" },
                  tickLabels: { fill: "#333", fontSize: 12 },
                }}
              />
              <VictoryLine
                data={tasks.map((task) => ({
                  x: new Date(task.dueDate),
                  y: 1,
                }))}
                style={{ data: { stroke: "#5bc0de", strokeWidth: 2 } }}
                height={200}
                padding={{ top: 20, bottom: 25 }}
                interpolation="monotoneX"
              />
            </VictoryChart>
          </ScrollView>
        </View>
      )}
    </ScrollView>
  );
};

// Styles for the Dashboard component
const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    padding: 16,
    backgroundColor: "#F2F5F9",
    alignItems: "center",
  },
  heading: {
    fontSize: 28,
    fontWeight: "bold",
    marginVertical: 20,
    color: "#333",
  },
  chartContainer: {
    backgroundColor: "#FFFFFF",
    borderRadius: 15,
    marginBottom: 30,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 6,
    elevation: 8,
    width: "100%",
    alignSelf: "center",
  },
  horizontalScroll: {
    paddingHorizontal: 16,
    paddingVertical: 10,
  },
});

export default Dashboard;
