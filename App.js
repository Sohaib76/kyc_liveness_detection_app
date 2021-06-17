import * as React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import Liveness from "./src/Liveness";
import Home from "./src/Home";
import { View } from "react-native";
import FirstScreen from "./src/FirstScreen";
import CameraID from "./src/CameraID";
import TakeSelfie from "./src/TakeSelfie";
import Detected from "./src/Detected";
import SimilarityCheck from "./src/SimilarityCheck";
import Login from "./src/Login";

const Stack = createStackNavigator();

const App = () => {
  return (
    // <View>
    //   <FirstScreen />
    // </View>
    <NavigationContainer>
      <Stack.Navigator>
        <Stack.Screen
          name="Home"
          component={Home}
          options={{ title: "Demo" }}
        />
        <Stack.Screen
          name="Login"
          component={Login}
          options={{ title: "Login Screen" }}
        />
        <Stack.Screen
          name="FirstScreen"
          component={FirstScreen}
          options={{ title: "ID Verificaion" }}
        />
        <Stack.Screen
          name="CameraID"
          component={CameraID}
          options={{ title: "ID Capture" }}
        />
        <Stack.Screen
          name="TakeSelfie"
          component={TakeSelfie}
          options={{ title: "Face Verificaion" }}
        />
        <Stack.Screen
          name="SimilarityCheck"
          component={SimilarityCheck}
          options={{ title: "Similarity Check" }}
        />
        <Stack.Screen
          name="Liveness"
          component={Liveness}
          options={{ title: "Liveness Detection" }}
        />

        <Stack.Screen
          name="Detected"
          component={Detected}
          options={{ title: "Detected" }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default App;
