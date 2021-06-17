import React, { useEffect, useState } from "react";
import { View, Text } from "react-native";
import { Button } from "react-native-elements";
import Icon from "react-native-vector-icons/FontAwesome";
import { Input } from "react-native-elements";

export default function Login({ navigation }) {
  const [comment, setcomment] = useState("");
  const [isEntered, setisEntered] = useState(false);

  const register = async () => {
    let formData = new FormData();
    formData.append("email", comment);
    let res = await fetch("http://52.56.254.199:8080/email-upload", {
      method: "POST",
      body: formData,
      headers: {
        "content-type": "multipart/form-data",
      },
    });

    let responseJson = await res.text();
    console.log(responseJson);
    const response = JSON.parse(responseJson);
    if (response.valid == "yes") {
      navigation.navigate("FirstScreen", { email: comment, isLogin: false });
    } else if (response.valid == "no") {
      alert("Email Already Taken");
    } else {
      alert("Network Request Failed");
    }
  };

  const login = async () => {
    let formData = new FormData();
    formData.append("email", comment);
    let res = await fetch("http://52.56.254.199:8080/email-upload", {
      method: "POST",
      body: formData,
      headers: {
        "content-type": "multipart/form-data",
      },
    });

    let responseJson = await res.text();
    console.log(responseJson);
    const response = JSON.parse(responseJson);
    if (response.valid == "yes") {
      alert("Email Not Exist");
    } else if (response.valid == "no") {
      navigation.navigate("TakeSelfie", {
        // email: comment,
        // isLogin: true,
        croppedImg: comment + ".jpg",
      });
    } else {
      alert("Network Request Failed");
    }
  };

  //   useEffect(() => {
  //     if (comment.length >= 5) {
  //       setisEntered(true);
  //     } else {
  //       setisEntered(false);
  //     }
  //   }, [comment]);

  const validate = (text) => {
    console.log(text);
    let reg = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w\w+)+$/;
    if (reg.test(text) === false) {
      console.log("Email is Not Correct");
      setcomment(text);
      setisEntered(false);
      return false;
    } else {
      setcomment(text);
      console.log("Email is Correct");
      setisEntered(true);
    }
  };

  return (
    <View
      style={{
        justifyContent: "center",
        alignItems: "center",
        marginTop: "50%",
      }}
    >
      <Input
        placeholder="Enter your email here:"
        maxLength={30}
        leftIcon={{ type: "font-awesome", name: "envelope" }}
        onChangeText={(value) => validate(value)}
        style={{ marginRight: 20, marginLeft: 10 }}
        inputContainerStyle={{ marginRight: 20, marginLeft: 20 }}
        autoCapitalize="none"
        textContentType="emailAddress"
      />
      <Button
        buttonStyle={{
          borderRadius: 10,
          margin: 10,
          width: 300,
          height: 50,
          backgroundColor: "blue",
        }}
        title="Register"
        onPress={register}
        disabled={!isEntered}
      />
      <Button
        buttonStyle={{
          borderRadius: 10,
          margin: 10,
          width: 300,
          height: 50,
          backgroundColor: "red",
        }}
        title="Login"
        disabled={!isEntered}
        onPress={login}
      />
      <Text
        style={{
          fontSize: 23,
          textAlign: "center",
          marginTop: "20%",
          marginLeft: "10%",
          marginRight: "10%",
        }}
      >
        Please Register or Login if you already had registered.
      </Text>
    </View>
  );
}
