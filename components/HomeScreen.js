// Home.js
import React from "react";
import { PaperProvider, DefaultTheme } from "react-native-paper";
import TaskCategories from "./TaskCategories";

const Home = () => {
  return (
    <PaperProvider theme={DefaultTheme}>
      <TaskCategories />
    </PaperProvider>
  );
};

export default Home;
