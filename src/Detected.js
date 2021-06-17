import React from "react";
import { Image } from "react-native";
import { View, Text, Button } from "react-native";

export default function Detected({ navigation }) {
  return (
    <View
      style={{
        justifyContent: "center",
        alignItems: "center",
        // margin: 20,
        flex: 1,
        backgroundColor: "white",
      }}
    >
      <Image source={require("./../assets/download.png")} />
      <Text
        style={{
          fontSize: 30,
          fontWeight: "bold",
          marginBottom: 20,
        }}
      >
        ID Verified Successfully
      </Text>

      <Button
        buttonStyle={{
          borderRadius: 10,
          margin: 10,
          width: 300,
          height: 50,
          backgroundColor: "black",
          margin: 20,
        }}
        title="Verify New ID"
        onPress={() => navigation.navigate("Login")}
      />
    </View>
  );
}
