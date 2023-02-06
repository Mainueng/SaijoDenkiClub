import { useEffect } from "react";
import { Platform, Alert } from "react-native";
import * as Location from "expo-location";
import io from "socket.io-client";
import ReactNativeForegroundService from "@supersami/rn-foreground-service";
import AsyncStorage from "@react-native-async-storage/async-storage";
import jwt_decode from "jwt-decode";

import { user_info } from "../api/user";

const socket = io(
  "http://car-tracking-api.ap-southeast-1.elasticbeanstalk.com",
  // "http://192.168.11.38:9000",
  {
    reconnectionDelay: 5000,
    reconnectionAttempts: 10,
    reconnection: true,
  }
);

const BackgroundService = () => {
  useEffect(() => {
    socket.on("connect", () => {
      console.log("connected");
    });

    (async () => {
      const { status: foregroundStatus } =
        await Location.requestForegroundPermissionsAsync();
      if (foregroundStatus === "granted") {
        const { status: backgroundStatus } =
          await Location.requestBackgroundPermissionsAsync();
        if (backgroundStatus === "granted") {
          try {
            let count = 0;
            if (Platform.OS === "android") {
              ReactNativeForegroundService.add_task(
                async () => {
                  let location = await Location.getCurrentPositionAsync({
                    accuracy: Location.Accuracy.BestForNavigation,
                  });

                  let car_no = "-";
                  let device_id = "";
                  let tech_id = 0;
                  let token = "";

                  token = await AsyncStorage.getItem("token");

                  // if (!token) {
                  //   token =
                  //     "eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpZCI6IjI0MTk2IiwidXNlcl9pZCI6IjI0MTk2IiwidXNlcl9pbWFnZSI6bnVsbCwibmFtZSI6IlNhaWpvIiwibGFzdG5hbWUiOiJEZW5raSIsImVtYWlsIjoiY2hhbm9rdHJ1ZUBtZS5jb20iLCJ0ZWxlcGhvbmUiOiIwMTIzNDU2NzgiLCJsYXRpdHVkZSI6IjEzLjg0NjQ5NjkwNDg5Nzc5NiIsImxvbmdpdHVkZSI6IjEwMC41MzI4NjQwNjE1NTQ4NiIsInJhdGluZyI6NSwidXNlcl9yb2xlX2lkIjoiMyIsImN1c19ncm91cF9pZCI6IjAiLCJzdGF0dXMiOiIxIiwidGltZSI6MTY3NzkxMTA1OSwiZGV2aWNlX2lkIjoiRXhwb25lbnRQdXNoVG9rZW5bX09RQ3NvT0J0Ylk4NlpLenhCN2FqbV0iLCJsb2dpbl9mYWNlYm9vayI6ZmFsc2V9.iOTpetrtvwVYK6ho0e_eudp7q-Ml0ZDdszyesOfzuTw";
                  //   await AsyncStorage.setItem("token", token);
                  // }

                  let res = await user_info(token);
                  let decode = jwt_decode(token);

                  tech_id = decode.id;
                  car_no = res.data.data[0].car_no;

                  device_id = decode.device_id.replace(
                    "ExponentPushToken[",
                    ""
                  );
                  device_id = device_id.replace("]", "");

                  let data = [
                    {
                      device_id: device_id,
                      tech_id: tech_id,
                      car_no: car_no,
                      lat: location.coords.latitude * 1,
                      lng: location.coords.longitude * 1,
                      datetime: new Date(),
                    },
                  ];

                  let dataJSON = JSON.stringify(data);

                  if (token) {
                    socket.emit("/", dataJSON);
                  } else {
                    socket.disconnect();
                  }

                  console.log(data, count++);
                },
                {
                  delay: 60000,
                  onLoop: true,
                  taskId: "taskid",
                  onError: (e) => console.log(`Error logging:`, e),
                }
              );

              ReactNativeForegroundService.start({
                id: 1244,
              });
            }
          } catch {}
        } else {
          Alert.alert(
            "Warring!",
            "Please change location permission to Allow all the time."
          );
        }
      } else {
        Alert.alert(
          "Warring!",
          "Please change location permission to Allow all the time."
        );
      }
    })();

    return () => {
      socket.disconnect;
    };
  }, []);

  return null;
};

export default BackgroundService;
