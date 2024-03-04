import React, { useEffect, useState } from "react";
import { View, Text, StyleSheet, ScrollView } from "react-native";
import {
  VictoryPie,
  VictoryBar,
  VictoryChart,
  VictoryAxis,
  VictoryLine,
  VictoryGroup,
} from "victory-native";
import AsyncStorage from "@react-native-async-storage/async-storage";

const Dashboard = () => {
  const [tasks, setTasks] = useState([]);

  useEffect(() => {
    fetchTasks();
  }, []);

  const fetchTasks = async () => {
    try {
      const tasksString = await AsyncStorage.getItem("tasks");
      const allTasks = tasksString ? JSON.parse(tasksString) : [];
      setTasks(allTasks);
    } catch (error) {
      console.error("Error fetching tasks:", error);
    }
  };

  const completionPercentage = () => {
    const completedTasks = tasks.filter((task) => task.completed);
    return (completedTasks.length / tasks.length) * 100 || 0;
  };

  const groupTasksByCategories = () => {
    const tasksByCategory = tasks.reduce((acc, task) => {
      const category = task.category || "Uncategorized";
      acc[category] = (acc[category] || 0) + 1;
      return acc;
    }, {});
    return Object.entries(tasksByCategory).map(([category, count]) => ({
      x: category,
      y: count,
    }));
  };

  const groupTasksByStatus = () => {
    const tasksByStatus = tasks.reduce((acc, task) => {
      const status = task.completed ? "Completed" : "Incomplete";
      acc[status] = (acc[status] || 0) + 1;
      return acc;
    }, {});
    return Object.entries(tasksByStatus).map(([status, count]) => ({
      x: status,
      y: count,
    }));
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
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
          labels={({ datum }) => `${datum.x}\n${datum.y}%`} // Display rounded percentage below the label
        />
      </View>

      <Text style={styles.heading}>Tasks by Category</Text>
      {tasks.length > 0 && (
        <ScrollView
          horizontal={true}
          contentContainerStyle={styles.horizontalScroll}
        >
          <View style={styles.chartContainer}>
            <VictoryChart
              domainPadding={{ x: 30 }} // Adjust the x value to increase spacing between categories
              width={tasks.length * 75} // Adjust as needed based on the number of categories
            >
              <VictoryAxis
                tickValues={groupTasksByCategories().map(
                  (dataPoint) => dataPoint.x
                )}
                style={{
                  axis: { stroke: "#333" },
                  ticks: { stroke: "#333" },
                  tickLabels: { fill: "#333", fontSize: 12 },
                }}
              />
              <VictoryBar
                data={groupTasksByCategories()}
                style={{ data: { width: 15, fill: "#5bc0de" } }}
              />
            </VictoryChart>
          </View>
        </ScrollView>
      )}

      <Text style={styles.heading}>Tasks by Status</Text>
      <View style={styles.chartContainer}>
        <VictoryPie
          data={groupTasksByStatus()}
          colorScale={["#5bc0de", "#d9534f"]}
          height={200}
          padding={40}
          innerRadius={50}
          labelRadius={70}
          style={{
            parent: { marginLeft: -18 },
            labels: { fill: "#333", fontSize: 18, fontWeight: "bold" },
          }}
        />
      </View>

      <Text style={styles.heading}>Task Distribution Over Time</Text>
      {tasks.length > 0 && (
        <View style={styles.chartContainer}>
          <ScrollView horizontal={true}>
            <VictoryChart
              width={tasks.length * 120} // Adjust as needed based on the number of tasks
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
                  x: new Date(task.dueDate), // Assuming each task has a 'date' property
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

      {/* Add more charts and statistics based on your requirements */}
    </ScrollView>
  );
};

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
