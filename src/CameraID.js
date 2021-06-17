import React, { useState, useEffect, useRef } from "react";
import { StyleSheet, Text, View, TouchableOpacity } from "react-native";
import { Camera } from "expo-camera";

export default function CameraID({ navigation }) {
  const [hasPermission, setHasPermission] = useState(null);
  const [type, setType] = useState(Camera.Constants.Type.back);
  const [camera, setCamera] = useState();

  const cameraRef = useRef(null);

  // 2.7 mb

  useEffect(() => {
    (async () => {
      const { status } = await Camera.requestPermissionsAsync(); //requestPermissionsAsync
      setHasPermission(status === "granted");
    })();
  }, []);

  const snap = async () => {
    if (cameraRef) {
      const data = await cameraRef.current.takePictureAsync();
      //const size = await cameraRef.current.getAvailablePictureSizesAsync();
      console.log(data);
      // console.log("size", size);
      navigation.navigate("FirstScreen", {
        ImgObj: data.uri,
      });
    }
  };

  if (hasPermission === null) {
    return <View />;
  }
  if (hasPermission === false) {
    return <Text>No access to camera</Text>;
  }
  return (
    <View style={styles.container}>
      <Camera
        ratio="1:1" // 4:3 , 16:9
        ref={cameraRef}
        style={styles.camera}
        type={type}
      ></Camera>
      <TouchableOpacity
        style={{
          width: 200,
          backgroundColor: "white",
          height: 50,
          marginTop: 50,
          borderRadius: 10,
          alignItems: "center",
          justifyContent: "center",
        }}
        onPress={snap}
      >
        <Text>Capture</Text>
      </TouchableOpacity>
      {/* <View style={styles.buttonContainer}>
        <TouchableOpacity
          style={styles.button}
          onPress={() => {
            setType(
              type === Camera.Constants.Type.back
                ? Camera.Constants.Type.front
                : Camera.Constants.Type.back
            );
          }}
        >
          <Text style={styles.text}> Flip </Text>
        </TouchableOpacity>
      </View> */}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: "100%",
    height: "100%",
    alignItems: "center",
    backgroundColor: "grey",
    justifyContent: "center",
  },
  camera: {
    //width: "95%", height: "38%"
    width: "95%",
    height: "35%", //28 // 35
    alignItems: "center",
    borderColor: "white",
    borderWidth: 20,
  },
  buttonContainer: {
    width: "40%",
  },
  button: {
    backgroundColor: "red",
  },
  text: {
    fontSize: 24,
  },
});
