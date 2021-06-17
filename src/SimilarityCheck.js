import React, { useState, useEffect } from "react";
import { View, Text, Image, ActivityIndicator, Modal } from "react-native";
// import { CroppedImage } from "react-native-cropping";
import * as FaceDetector from "expo-face-detector";
import * as ImageManipulator from "expo-image-manipulator";
import { StyleSheet } from "react-native";
import { Button } from "react-native-elements";

export default function SimilarityCheck({ route, navigation }) {
  const [image, setimage] = useState(null);
  const [image2, setimage2] = useState(null);
  // const [x, setx] = useState(null);
  // const [y, sety] = useState(null);
  // const [width, setwidth] = useState(null);
  // const [height, setheight] = useState(null);
  const [isLoading, setisLoading] = useState(true);
  const [similaritie, setsimilaritie] = useState(0);

  useEffect(() => {
    console.log("Selfie Image", route.params.photo);
    // console.log("ID Image", route.params.Idimage);
    console.log("Percent", route.params.similarity);
    console.log("Cropped", route.params.croppedImg);
    setimage2(route.params.croppedImg);

    setsimilaritie(route.params.similarity);
    setimage(route.params.photo);

    // Face Detection On Any Image
    const detectFaces = async (imageUri) => {
      const options = { mode: FaceDetector.Constants.Mode.fast };
      return await FaceDetector.detectFacesAsync(imageUri, options);
    };

    // Crop Selfie Image
    const manipResult = async (setx, sety, setheight, setwidth) => {
      let das = await ImageManipulator.manipulateAsync(
        route.params.photo,
        [
          {
            crop: {
              originX: setx,
              originY: sety,
              width: setwidth,
              height: setheight,
            },
          },
        ],
        { format: ImageManipulator.SaveFormat.PNG } // compress: 1,
      );

      setimage(das.uri);
      // console.log("Dos", das);
    };

    console.log("manipResult");

    // const manipResult2 = async (setx, sety, setheight, setwidth) => {
    //   let das = await ImageManipulator.manipulateAsync(
    //     route.params.Idimage,
    //     [
    //       {
    //         crop: {
    //           originX: setx,
    //           originY: sety,
    //           width: setwidth,
    //           height: setheight,
    //         },
    //       },
    //     ],
    //     { format: ImageManipulator.SaveFormat.PNG }
    //   );

    //   setimage2(das.uri);
    // };

    // -------------
    // detectFaces(route.params.photo).then((faces) => {
    //   console.log("Faces 1", faces); // "Success"
    //   let x = faces.faces[0].bounds.origin.x;
    //   let y = faces.faces[0].bounds.origin.y;
    //   let height = faces.faces[0].bounds.size.height + 200;
    //   let width = faces.faces[0].bounds.size.width;
    //   manipResult(x, y, height, width);
    //   console.log("Cropped 1");
    // });

    //   detectFaces(route.params.Idimage).then((faces) => {
    //     console.log("Face 2", faces); // "Success"
    //     let x = faces.faces[0].bounds.origin.x;
    //     let y = faces.faces[0].bounds.origin.y;
    //     let height = faces.faces[0].bounds.size.height;
    //     let width = faces.faces[0].bounds.size.width;
    //     manipResult2(x, y, height, width);
    //     console.log("Cropped 2");
    //   });

    //   setisLoading(false);
  }, []);

  return (
    <View style={{ flex: 1 }}>
      {!image && !image2 && (
        <View
          style={{
            justifyContent: "center",
            alignItems: "center",
            marginBottom: 50,
          }}
        >
          <Text style={{ fontSize: 18 }}>...Loading</Text>
        </View>
      )}

      {image && image2 && (
        <>
          <View style={{ flex: 1.4, flexDirection: "row", marginTop: 20 }}>
            <Image
              source={{ uri: image }}
              style={{
                margin: 10,
                width: "45%",
                height: "80%", //     height: "35%",
                marginBottom: 20,
              }}
            />
            <View style={styles.verticleLine} />
            <Image
              source={{ uri: `http://52.56.254.199:8080/get-image/${image2}` }}
              style={{
                margin: 10,
                width: "45%",
                height: "80%",
              }}

              // Response Faster
              // Class return
              // Class Confidence
              // IOS Sort Out
              // Architecture Improve
              // Car Damage Model
              // Amplify, Cognito Registration Login Setup

              // resizeMode="contain"
            />
          </View>

          <View style={{ flex: 0.4, flexDirection: "row", marginTop: 20 }}>
            <Text style={{ textAlign: "center", width: "45%", margin: 10 }}>
              Selfie Face
            </Text>
            <View style={styles.shortVerticleLine} />
            <Text style={{ textAlign: "center", width: "45%", margin: 10 }}>
              ID Card Face
            </Text>
          </View>
        </>
      )}
      <View style={{ flex: 1.2, alignItems: "center" }}>
        <Text style={{ fontSize: 20, margin: 20 }}>
          Similarity Found : {similaritie}%
        </Text>
        <Button
          buttonStyle={{
            borderRadius: 10,
            margin: 10,
            width: 300,
            height: 50,
            backgroundColor: "blue",
          }}
          title="Next"
          onPress={() => navigation.navigate("Liveness")}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  loading: {
    position: "absolute",
    left: 0,
    right: 0,
    top: 0,
    bottom: 0,
    alignItems: "center",
    justifyContent: "center",
    height: "100%",
    width: "100%",
  },
  verticleLine: {
    height: "80%",
    width: 1,
    backgroundColor: "#909090",
    marginTop: 10,
  },

  shortVerticleLine: {
    height: "50%",
    width: 1,
    backgroundColor: "#909090",
    marginTop: 10,
  },
});
