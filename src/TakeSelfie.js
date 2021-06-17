import React from "react";
import { StyleSheet, Text, View } from "react-native";
import { Camera } from "expo-camera";
import { DeviceMotion } from "expo-sensors";
import * as Permissions from "expo-permissions";
import * as FaceDetector from "expo-face-detector";
import * as ImageManipulator from "expo-image-manipulator";

export default class TakeSelfie extends React.Component {
  static defaultProps = {
    countDownSeconds: 5,
    motionInterval: 500, //ms between each device motion reading
    motionTolerance: 1, //allowed variance in acceleration
    cameraType: Camera.Constants.Type.front, //front vs rear facing camera
  };

  state = {
    croppedImg: null,
    hasCameraPermission: null,
    faceDetecting: true, //when true, we look for faces
    faceDetected: false, //when true, we've found a face
    countDownSeconds: 5, //current available seconds before photo is taken
    countDownStarted: false, //starts when face detected
    pictureTaken: false, //true when photo has been taken
    motion: null, //captures the device motion object
    detectMotion: false, //when true we attempt to determine if device is still
  };

  countDownTimer = null;

  async UNSAFE_componentWillMount() {
    const { status } = await Permissions.askAsync(Permissions.CAMERA);
    this.setState({ hasCameraPermission: status === "granted" });
  }

  async componentDidMount() {
    //alert("Component Did Update");
    this.motionListener = DeviceMotion.addListener(this.onDeviceMotion);
    setTimeout(() => {
      //MH - tempm - wait 5 seconds for now before detecting motion
      this.detectMotion(true);
    }, 5000);

    // alert(this.props.route.params.croppedImg);
    console.log(this.props.route.params);
    this.setState({
      croppedImg: this.props.route.params.croppedImg,
    });

    // --------------------------------
    //Delete Later , Only For Testing {

    // let filename = this.props.route.params.image.split("/").pop();

    // // Infer the type of the image
    // let match = /\.(\w+)$/.exec(filename);
    // let type = match ? `image/${match[1]}` : `image`;

    // let formData = new FormData();
    // formData.append("file", {
    //   uri: this.props.route.params.image,
    //   name: filename,
    //   type: type,
    // });
    // console.log(this.props.route.params.image);

    // let photoo = { uri: this.props.route.params.image };

    // var path = this.props.route.params.croppedImg;

    // let newPath = path.replace(".jpg", "");

    // console.log("New Path", newPath);

    // formData.append("croppedImage", newPath);

    // // var split = path.split(".");
    // // var x = split.slice(0, split.length - 1).join(".");
    // // console.log(x);

    // let res = await fetch("http://18.130.221.239:8080/selfie-upload", {
    //   method: "POST",
    //   body: formData,
    //   headers: {
    //     "content-type": "multipart/form-data",
    //   },
    // });

    // let responseJson = await res.text();
    // console.log("resJson", responseJson);
    // const response = JSON.parse(responseJson);
    // if (response.similarity == "No Similarity Found") {
    //   alert("Face Not Matched With ID Card");
    //   this.props.navigation.goBack();
    // } else if (response.similarity == "Similarity Found") {
    //   //if no file selected the show alert
    //   alert("Face Matched Successfully");
    //   this.props.navigation.navigate("SimilarityCheck", {
    //     photo: photoo.uri, //        photo: photo.uri,
    //     similarity: response.percent,
    //     Idimage: this.props.route.params.image,
    //     croppedImg: this.state.croppedImg,
    //   });
    // } else {
    //   alert("Network Request Failed");
    // }

    //}

    // --------------------------------

    // -------------------------

    // let filename = this.props.route.params.image.split("/").pop();

    // // Infer the type of the image
    // let match = /\.(\w+)$/.exec(filename);
    // let type = match ? `image/${match[1]}` : `image`;

    // let formData = new FormData();
    // formData.append("file", {
    //   uri: this.props.route.params.image,
    //   name: filename,
    //   type: type,
    // });
    // // Assume "photo" is the name of the form field the server expects

    // var path = this.props.route.params.croppedImg;

    // let newPath = path.replace(".jpg", "");

    // // formData.append("file", this.props.route.params.image);

    // console.log("Image", this.props.route.params.image);

    // console.log("cropped Img", path);

    // formData.append("croppedImage", newPath);

    // let res = await fetch("http://3.8.167.74:8080/selfie-upload", {
    //   method: "POST",
    //   body: formData,
    //   headers: {
    //     "content-type": "multipart/form-data",
    //   },
    // });

    // // const timeTaken = new Date() - start;

    // let responseJson = await res.text();
    // console.log(responseJson);
    // // console.log("Time Taken", timeTaken);

    // const response = JSON.parse(responseJson);
    // if (response.similarity == "No Similarity Found") {
    //   alert("Face Not Matched With ID Card");
    //   this.props.navigation.goBack();
    // } else if (response.similarity == "Similarity Found") {
    //   //if no file selected the show alert
    //   alert("Face Matched Successfully");
    //   this.props.navigation.navigate("SimilarityCheck", {
    //     photo: this.props.route.params.image, //        photo: photo.uri,
    //     similarity: response.percent,
    //     croppedImg: this.props.route.params.croppedImg,
    //     // Idimage: this.props.route.params.image,
    //   });
    // } else {
    //   alert("Network Request Failed");
    // }
  }

  UNSAFE_componentWillUpdate(nextProps, nextState) {
    // alert("Component Will Update");
    if (this.state.detectMotion && nextState.motion && this.state.motion) {
      if (
        Math.abs(nextState.motion.x - this.state.motion.x) <
          this.props.motionTolerance &&
        Math.abs(nextState.motion.y - this.state.motion.y) <
          this.props.motionTolerance &&
        Math.abs(nextState.motion.z - this.state.motion.z) <
          this.props.motionTolerance
      ) {
        //still
        this.detectFaces(true);
        this.detectMotion(false);
      } else {
        //moving
      }
    }
  }

  detectMotion = (doDetect) => {
    this.setState({
      detectMotion: doDetect,
    });
    if (doDetect) {
      DeviceMotion.setUpdateInterval(this.props.motionInterval);
    } else if (!doDetect && this.state.faceDetecting) {
      this.motionListener.remove();
    }
  };

  onDeviceMotion = (rotation) => {
    this.setState({
      motion: rotation.accelerationIncludingGravity,
    });
  };

  detectFaces(doDetect) {
    this.setState({
      faceDetecting: doDetect,
    });
  }

  render() {
    const { hasCameraPermission } = this.state;
    if (hasCameraPermission === null) {
      return <View />;
    } else if (hasCameraPermission === false) {
      return <Text>No access to camera</Text>;
    } else {
      return (
        <View style={{ flex: 1 }}>
          <Camera
            style={{ flex: 1 }}
            type={this.props.cameraType}
            onFacesDetected={
              // alert("Detected")
              this.state.faceDetecting ? this.handleFacesDetected : undefined
            }
            onFaceDetectionError={this.handleFaceDetectionError}
            faceDetectorSettings={{
              mode: FaceDetector.Constants.Mode.fast,
              detectLandmarks: FaceDetector.Constants.Mode.none,
              runClassifications: FaceDetector.Constants.Mode.none,
            }}
            ref={(ref) => {
              this.camera = ref;
            }}
          >
            <View
              style={{
                flex: 1,
                backgroundColor: "transparent",
                flexDirection: "row",
                position: "absolute",
                bottom: 0,
              }}
            >
              <Text style={styles.textStandard}>
                {this.state.faceDetected ? "Face Detected" : "No Face Detected"}
              </Text>
            </View>
            <View
              style={{
                flex: 1,
                backgroundColor: "transparent",
                flexDirection: "row",
                width: "100%",
                height: "100%",
                justifyContent: "center",
                alignItems: "center",
                display:
                  this.state.faceDetected && !this.state.pictureTaken
                    ? "flex"
                    : "none",
              }}
            >
              <Text style={styles.countdown}>
                {this.state.countDownSeconds}
              </Text>
            </View>
          </Camera>
        </View>
      );
    }
  }

  handleFaceDetectionError = () => {
    //
  };
  handleFacesDetected = ({ faces }) => {
    if (faces.length === 1) {
      // console.log(faces);
      // alert("Face");
      this.setState({
        faceDetected: true,
      });
      if (!this.state.faceDetected && !this.state.countDownStarted) {
        this.initCountDown();
      }
    } else {
      this.setState({ faceDetected: false });
      this.cancelCountDown();
    }
  };
  initCountDown = () => {
    this.setState({
      countDownStarted: true,
    });
    this.countDownTimer = setInterval(this.handleCountDownTime, 1000);
  };
  cancelCountDown = () => {
    clearInterval(this.countDownTimer);
    this.setState({
      countDownSeconds: this.props.countDownSeconds,
      countDownStarted: false,
    });
  };
  handleCountDownTime = () => {
    if (this.state.countDownSeconds > 0) {
      let newSeconds = this.state.countDownSeconds - 1;
      this.setState({
        countDownSeconds: newSeconds,
      });
    } else {
      this.cancelCountDown();
      this.takePicture();
    }
  };
  takePicture = () => {
    this.setState({
      pictureTaken: true,
    });
    if (this.camera) {
      console.log("take picture");
      let photo = this.camera.takePictureAsync({
        onPictureSaved: this.onPictureSaved,
      });
    }
  };
  onPictureSaved = async (photo) => {
    console.log("OnPictureSavedCalled");
    this.detectFaces(false);

    let manipPhoto = await ImageManipulator.manipulateAsync(photo.uri, [], {
      compress: 0.5,
      format: ImageManipulator.SaveFormat.JPEG,
    });

    console.log("manipPhoto", manipPhoto);

    let filename = manipPhoto.uri.split("/").pop();

    // let filename = this.props.route.params.image.split("/").pop();

    // Infer the type of the image
    let match = /\.(\w+)$/.exec(filename);
    let type = match ? `image/${match[1]}` : `image`;

    // Upload the image using the fetch and FormData APIs
    let formData = new FormData();
    // Assume "photo" is the name of the form field the server expects
    console.log("Photo URI", photo.uri);
    console.log("Manip Photo", manipPhoto.uri);
    console.log("Filename", filename);
    console.log("Type", type);

    formData.append("file", {
      uri: manipPhoto.uri,
      // uri: this.props.route.params.image,
      name: filename,
      type,
    });

    var path = this.state.croppedImg;

    let newPath = path.replace(".jpg", "");

    console.log(newPath);

    formData.append("croppedImage", newPath);

    console.log("Fetch Request Sending");
    const start = new Date();

    let res = await fetch("http://52.56.254.199:8080/selfie-upload", {
      method: "POST",
      body: formData,
      headers: {
        "content-type": "multipart/form-data",
      },
    });
    // .then((response) => response.text())
    // .then((json) => console.log(json))
    // .catch((error) => console.error(error));

    const timeTaken = new Date() - start;

    let responseJson = await res.text();
    console.log(responseJson);
    console.log("Time Taken", timeTaken);

    const response = JSON.parse(responseJson);
    if (response.similarity == "No Similarity Found") {
      alert("Face Not Matched With ID Card");
      this.props.navigation.goBack();
    } else if (response.similarity == "Similarity Found") {
      //if no file selected the show alert
      alert("Face Matched Successfully");
      this.props.navigation.navigate("SimilarityCheck", {
        photo: manipPhoto.uri, //        photo: photo.uri,
        //photo: this.props.route.params.image,
        similarity: response.percent,
        croppedImg: this.state.croppedImg,
        // Idimage: this.props.route.params.image,
      });
    } else {
      alert("Network Request Failed");
    }

    // this.props.navigation.navigate("SimilarityCheck", {
    //   photo: photo.uri,
    //   Idimage: this.props.route.params.image,
    // });
  };
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
  },
  textStandard: {
    fontSize: 18,
    marginBottom: 10,
    color: "white",
  },
  countdown: {
    fontSize: 40,
    color: "white",
  },
});
