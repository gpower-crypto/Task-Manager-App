import React from "react";
import { View, Text } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { Ionicons } from "@expo/vector-icons";

const ProgressBar = ({ percentage, color }) => {
  // If the task is completed or percentage is 100%, show the completion text and icon
  if (percentage == 100) {
    return (
      <View style={styles.completedContainer}>
        <Ionicons name="checkmark-circle" size={24} color="#4CAF50" />
        <Text style={styles.completedText}>Completed</Text>
      </View>
    );
  }

  // If the task is not completed, show the progress bar
  return (
    <View style={styles.progressBarContainer}>
      {/* Background Space */}
      <LinearGradient
        colors={["#ddd", "#ddd"]} // Set the background color here
        style={styles.progressBarBackground}
      />

      {/* Actual Progress */}
      <LinearGradient
        colors={[color, "#ddd"]}
        style={[styles.progressBar, { width: `${percentage}%` }]}
      />
    </View>
  );
};

const styles = {
  // Define styles for ProgressBar component
  progressBarContainer: {
    flexDirection: "row",
    alignItems: "center",
    width: "40%",
    marginHorizontal: 40,
  },
  progressBarBackground: {
    height: 10,
    borderRadius: 5,
    position: "absolute",
    width: "100%",
  },
  progressBar: {
    height: 10,
    borderRadius: 5,
    marginVertical: 8,
  },
  completedContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginHorizontal: 45,
  },
  completedText: {
    marginLeft: 5,
    color: "#4CAF50",
  },
};

export default ProgressBar;
