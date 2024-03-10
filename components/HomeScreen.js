import React, { useEffect } from "react";
import { PaperProvider, DefaultTheme } from "react-native-paper";
import TaskCategories from "./TaskCategories";
import { Ionicons } from "@expo/vector-icons";
import NavbarMenu from "./NavbarMenu";

// Home component for displaying task categories
const Home = ({ navigation }) => {
  // useEffect to update the screen's navigation bar
  useEffect(() => {
    updateScreenNavbar();
  });

  // Function to update the screen's navigation bar
  const updateScreenNavbar = () => {
    navigation.setOptions({
      headerStyle: {
        backgroundColor: "#38419D",
      },
      headerTintColor: "white",
      headerLeft: () => (
        <Ionicons
          style={{ marginLeft: 20 }}
          name="home"
          size={24}
          color="white"
        />
      ),
      headerRight: () => (
        <NavbarMenu
          navigation={navigation}
          textColor={"white"}
          homeScreen={true}
        />
      ),
    });
  };

  // Render the Home component
  return (
    <PaperProvider theme={DefaultTheme}>
      <TaskCategories />
    </PaperProvider>
  );
};

export default Home;
