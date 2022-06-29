import React, { useState, useEffect, useRef, useContext } from "react";
import {
  View,
  Pressable,
  SafeAreaView,
  Image,
  Dimensions,
  Alert,
} from "react-native";
import { StatusBar } from "expo-status-bar";
import AsyncStorage from "@react-native-async-storage/async-storage";
import MapView, { Marker, Circle } from "react-native-maps";
import jwt_decode from "jwt-decode";
import styles from "../../assets/stylesheet/home/job_location";
import * as Location from "expo-location";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import JobInfoModal from "../../components/job_info_modal";
import { recommend } from "../../api/jobs";
import RepairMarker from "../../assets/image/home/repair_marker.png";
import CleanMarker from "../../assets/image/home/clean_marker.png";
import InstallMarker from "../../assets/image/home/install_marker.png";
import { normalize } from "../../components/font";
import { TabContext } from "../../components/tab_context";

const JobLocationScreen = ({ navigation }) => {
  const [latitude, setLatitude] = useState(0);
  const [longitude, setLongitude] = useState(0);
  const [recommendList, setRecommendList] = useState([]);

  const { setModalData } = useContext(TabContext);

  const { width } = Dimensions.get("window");

  const mapRef = useRef(MapView);

  useEffect(() => {
    getRecommendList();

    (async () => {
      try {
        let token = await AsyncStorage.getItem("token");
        let decode = jwt_decode(token);

        setLatitude(parseFloat(decode.latitude));
        setLongitude(parseFloat(decode.longitude));
      } catch (error) {
        console.log(error);
      }

      let { status } = await Location.requestForegroundPermissionsAsync();

      if (status !== "granted") {
        Alert.alert("Warring!", "Permission to access location was denied.");

        return;
      } else {
        let location = await Location.getCurrentPositionAsync({
          accuracy: Location.Accuracy.Balanced,
          enableHighAccuracy: true,
          timeInterval: 5,
        });

        setLatitude(location.coords.latitude);
        setLongitude(location.coords.longitude);
      }
    })();
  }, []);

  const getRecommendList = async () => {
    try {
      let token = await AsyncStorage.getItem("token");

      try {
        let res = await recommend(token);
        setRecommendList(res.data.data);
      } catch (error) {
        setRecommendList([]);
        console.log(error.response.data.message);
      }
    } catch (error) {
      console.log(error);
    }
  };

  const imageIcon = (jobType) => {
    switch (true) {
      case jobType === "1":
        return CleanMarker;
      case jobType === "2":
        return RepairMarker;
      default:
        return InstallMarker;
    }
  };

  const goToMyLocation = () => {
    mapRef.current.animateCamera({
      center: {
        latitude: parseFloat(latitude),
        longitude: parseFloat(longitude),
      },
    });
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar style="light" />
      <Pressable style={styles.current_btn} onPress={() => goToMyLocation()}>
        <View
          style={{
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <MaterialCommunityIcons
            name="crosshairs-gps"
            color="rgba(0,0,0,0.6)"
            size={normalize(18) > 28 ? 30 : normalize(18)}
          />
        </View>
      </Pressable>
      <MapView
        ref={mapRef}
        style={styles.map}
        region={{
          latitude: parseFloat(latitude),
          longitude: parseFloat(longitude),
          latitudeDelta: 0.0922 / 3,
          longitudeDelta: 0.0421 / 3,
        }}
      >
        <Circle
          center={{
            latitude: parseFloat(latitude),
            longitude: parseFloat(longitude),
          }}
          radius={width * 2}
          fillColor={"rgba(17, 179, 173, 0.15)"}
          strokeColor={"transparent"}
        ></Circle>
        {recommendList.length
          ? recommendList.map((item, index) => (
              <Marker
                coordinate={{
                  latitude: parseFloat(item.latitude),
                  longitude: parseFloat(item.longitude),
                  latitudeDelta: 0.0922 / 3,
                  longitudeDelta: 0.0421 / 3,
                }}
                key={index}
                onPress={() =>
                  setModalData({
                    openModal: true,
                    jobID: item.job_id,
                    review: item.review,
                  })
                }
              >
                <Image
                  source={imageIcon(item.job_type)}
                  resizeMode={"contain"}
                  style={{
                    height: width * 0.15,
                    width: width * 0.15,
                  }}
                />
              </Marker>
            ))
          : null}
      </MapView>
      <JobInfoModal
        updateUpcoming={null}
        updateRecommend={getRecommendList}
        nav={navigation}
        getNotification={null}
      />
    </SafeAreaView>
  );
};

export default JobLocationScreen;
