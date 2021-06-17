import React, { useState, useEffect } from "react";
import { Image, View, Platform, Text } from "react-native";
import * as ImagePicker from "expo-image-picker";
import * as Permissions from "expo-permissions";
import { TouchableOpacity } from "react-native-gesture-handler";
import { Button } from "react-native-elements";
import * as ImageManipulator from "expo-image-manipulator";

export default function FirstScreen({ navigation, route }) {
  const [image, setImage] = useState(null);
  // const [croppedImg, setCroppedImg] = useState(null);

  useEffect(() => {
    // console.log(route.params.email)
    (async () => {
      if (route.params.isLogin == true) {
        navigation.navigate("TakeSelfie", {
          croppedImg: route.params.email + ".jpg",
          // image,
        });
      }

      if (Platform.OS !== "web") {
        const { status } =
          await ImagePicker.requestCameraRollPermissionsAsync();
        if (status !== "granted") {
          alert("Sorry, we need camera roll permissions to make this work!");
        }
      }
      if (route.params) {
        setImage(route.params.ImgObj);
        console.log("Props");
      }
    })();
  }, [route.params]);

  const sendIDcard = async () => {
    if (image) {
      let manipPhoto = await ImageManipulator.manipulateAsync(image, [], {
        compress: Platform.OS == "ios" ? 0 : 0.7,
        format: ImageManipulator.SaveFormat.JPEG,
      });

      console.log("m", manipPhoto);

      // const fileToUpload = image;

      // -----------------

      // -----------
      let filename = manipPhoto.uri.split("/").pop();

      // Infer the type of the image
      let match = /\.(\w+)$/.exec(filename);
      let type = match ? `image/${match[1]}` : `image`;
      console.log(type);

      // Upload the image using the fetch and FormData APIs
      let formData = new FormData();
      // Assume "photo" is the name of the form field the server expects
      formData.append("file", {
        uri: manipPhoto.uri,
        name: filename,
        type,
      });

      formData.append("email", route.params.email);
      // ToDo: Add Alert If Unable to Connect To Server

      let res = await fetch("http://52.56.254.199:8080/file-upload", {
        method: "POST",
        body: formData,
        headers: {
          "content-type": "multipart/form-data",
        },
      });

      let responseJson = await res.text();
      console.log(responseJson);
      const response = JSON.parse(responseJson);
      if (response.detection == "Saudi ID Not Detected") {
        alert("ID Not Detected");
      } else if (response.detection == "Saudi ID Detected") {
        //if no file selected the show alert
        alert("ID Detected");
        navigation.navigate("TakeSelfie", {
          croppedImg: response.croppedImage,
          image,
        });
      } else {
        alert("Network Request Failed");
      }

      // navigation.navigate("TakeSelfie", {
      //   croppedImg: "ll.jpg",
      //   image,
      // });

      // ------------------------

      // ----------
    }
  };

  const pickImage = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.All,
      allowsEditing: true,
      //aspect: [16, 9], // aspect: [4, 3],
      quality: 1,
    });

    console.log(result);

    if (!result.cancelled) {
      setImage(result.uri);
    }
  };

  return (
    <View
      style={{
        backgroundColor: "grey",
        width: "100%",
        height: "100%",
        // flex: 1,
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      {image && (
        <Image
          source={{ uri: image }}
          style={{ width: "95%", height: "35%", marginBottom: 20 }}
        />
      )}
      <Button
        buttonStyle={{
          borderRadius: 10,
          margin: 10,
          width: 300,
          height: 50,
        }}
        title="Pick ID Card from Gallery"
        onPress={pickImage}
      />
      <Button
        buttonStyle={{
          borderRadius: 10,
          margin: 10,
          width: 300,
          height: 50,
          backgroundColor: "red",
        }}
        title="Capture ID Card"
        onPress={() => navigation.navigate("CameraID")}
      />

      {image && (
        <Button
          buttonStyle={{
            borderRadius: 10,
            margin: 10,
            width: 300,
            height: 50,
            backgroundColor: "black",
          }}
          title="Send"
          onPress={sendIDcard}
        />
      )}
    </View>
  );
}
