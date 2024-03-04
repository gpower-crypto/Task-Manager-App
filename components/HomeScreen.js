// Home.js
import React, { useEffect } from "react";
import { TouchableOpacity } from "react-native";
import { PaperProvider, DefaultTheme } from "react-native-paper";
import TaskCategories from "./TaskCategories";
import { Ionicons } from "@expo/vector-icons";
import NavbarMenu from "./NavbarMenu";

const Home = ({ navigation }) => {
  useEffect(() => {
    updateScreenNavbar();
  });

  const updateScreenNavbar = () => {
    navigation.setOptions({
      headerStyle: {
        backgroundColor: "#38419D", // Updated header color
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
  return (
    <PaperProvider theme={DefaultTheme}>
      <TaskCategories />
    </PaperProvider>
  );
};

export default Home;
