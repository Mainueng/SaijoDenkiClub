import { useEffect } from "react";
import { Platform, Alert } from "react-native";
import * as Location from "expo-location";
import io from "socket.io-client";
import ReactNativeForegroundService from "@supersami/rn-foreground-service";
import AsyncStorage from "@react-native-async-storage/async-storage";
import jwt_decode from "jwt-decode";
import moment from "moment";

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
            let count = 1;
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
                  //     "eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpZCI6IjI0MTk2IiwidXNlcl9pZCI6IjI0MTk2IiwidXNlcl9pbWFnZSI6bnVsbCwibmFtZSI6IlNhaWpvIiwibGFzdG5hbWUiOiJEZW5raSIsImVtYWlsIjoiY2hhbm9rdHJ1ZUBtZS5jb20iLCJ0ZWxlcGhvbmUiOiIwMTIzNDU2NzgiLCJsYXRpdHVkZSI6IjEzLjg0NjQ5NjkwNDg5Nzc5NiIsImxvbmdpdHVkZSI6IjEwMC41MzI4NjQwNjE1NTQ4NiIsInJhdGluZyI6NSwidXNlcl9yb2xlX2lkIjoiMyIsImN1c19ncm91cF9pZCI6IjAiLCJzdGF0dXMiOiIxIiwidGltZSI6MTY3OTAxOTA1NCwiZGV2aWNlX2lkIjoiMTExIiwibG9naW5fZmFjZWJvb2siOmZhbHNlfQ.zcLP0ysM7OrbwrAwqyabJCRyR3G-T5gAOErHZQ_PJfQ";
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
                      lat: location.coords.latitude,
                      lng: location.coords.longitude,
                      datetime: new Date(),
                    },
                  ];

                  let dataJSON = JSON.stringify(data);

                  if (token) {
                    count++;
                    socket.emit("/", dataJSON);
                  } else {
                    socket.disconnect();
                  }

                  // console.log(count, data);

                  const message = {
                    to: decode.device_id,
                    sound: "default",
                    title: " ",
                  };

                  let day = moment().format("ddd");

                  let startTime = "08:00:00";
                  let endTime = "17:00:00";

                  currentDate = new Date();

                  startDate = new Date(currentDate.getTime());
                  startDate.setHours(startTime.split(":")[0]);
                  startDate.setMinutes(startTime.split(":")[1]);
                  startDate.setSeconds(startTime.split(":")[2]);

                  endDate = new Date(currentDate.getTime());
                  endDate.setHours(endTime.split(":")[0]);
                  endDate.setMinutes(endTime.split(":")[1]);
                  endDate.setSeconds(endTime.split(":")[2]);

                  if (
                    count >= 15 &&
                    day !== "Sun" &&
                    startDate <= currentDate &&
                    endDate >= currentDate
                  ) {
                    await fetch("https://exp.host/--/api/v2/push/send", {
                      method: "POST",
                      headers: {
                        Accept: "application/json",
                        "Accept-encoding": "gzip, deflate",
                        "Content-Type": "application/json",
                      },
                      body: JSON.stringify(message),
                    });

                    count = 1;
                  }
                },
                {
                  delay: 60000 * 1, // delay 1 minute
                  //delay: 10000,
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

    // return () => {
    //   socket.disconnect();
    // };
  }, []);

  return null;
};

export default BackgroundService;
