import React, { useState, useEffect, useRef } from "react";
import { View, Pressable, SafeAreaView, Alert, Text } from "react-native";
import { StatusBar } from "expo-status-bar";
import AsyncStorage from "@react-native-async-storage/async-storage";
import MapView, { Marker } from "react-native-maps";
import styles from "../../assets/stylesheet/home/job_location";
import * as Location from "expo-location";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { normalize } from "../../components/font";
import { update_user_info } from "../../api/user";

const ProfileLocationScreen = ({ navigation, route }) => {
  const [mapRegion, setMapRegion] = useState({
    longitude: route.params?.longitude ? parseFloat(route.params.longitude) : 0,
    latitude: route.params?.latitude ? parseFloat(route.params.latitude) : 0,
    longitudeDelta: 0.0922 / 3,
    latitudeDelta: 0.0421 / 3,
  });
  const [currentLat, setCurrentLat] = useState(0);
  const [currentLng, setCurrentLng] = useState(0);

  const mapRef = useRef(MapView);

  useEffect(() => {
    (async () => {
      let { status } = await Location.requestForegroundPermissionsAsync();
      let location = await Location.getCurrentPositionAsync();

      if (status !== "granted") {
        Alert.alert("Warring!", "Permission to access location was denied.");

        return;
      }

      setCurrentLat(location.coords.latitude);
      setCurrentLng(location.coords.longitude);
    })();
  }, []);

  const goToMyLocation = () => {
    if (currentLat && currentLng) {
      mapRef.current.animateCamera({
        center: {
          longitude: currentLng,
          latitude: currentLat,
          longitudeDelta: 0.0922 / 12,
          latitudeDelta: 0.0421 / 12,
        },
      });

      setMapRegion({
        ...mapRegion,
        latitude: currentLat,
        longitude: currentLng,
      });
    }
  };

  const movementMarker = (e) => {
    let latitude = e.nativeEvent.coordinate.latitude;
    let longitude = e.nativeEvent.coordinate.longitude;

    setMapRegion({
      ...mapRegion,
      latitude: latitude,
      longitude: longitude,
    });
  };

  const submitHandle = async () => {
    try {
      let token = await AsyncStorage.getItem("token");

      try {
        await update_user_info(
          token,
          route.params?.userID ? route.params.userID : "",
          route.params?.name ? route.params.name : "",
          route.params?.lastName ? route.params.lastName : "",
          route.params?.phoneNumber ? route.params.phoneNumber : "",
          null,
          route.params?.address ? route.params.address : "",
          route.params?.district ? route.params.district : "",
          route.params?.province ? route.params.province : "",
          route.params?.postalCode ? route.params.postalCode : "",
          mapRegion.latitude,
          mapRegion.longitude
        );

        Alert.alert("บันทึกข้อมูลสำเร็จ", "", [
          {
            text: "ตกลง",
            onPress: () => {
              navigation.goBack();
            },
          },
        ]);
      } catch (error) {
        Alert.alert(error.response.data.message);
      }
    } catch (error) {
      console.log(error);
    }
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
      <MapView ref={mapRef} style={styles.map} initialRegion={mapRegion}>
        <Marker
          coordinate={mapRegion}
          draggable
          onDragEnd={(e) => movementMarker(e)}
        ></Marker>
      </MapView>
      <Pressable style={styles.save_button} onPress={() => submitHandle()}>
        <Text style={styles.save_button_text}>บันทึก</Text>
      </Pressable>
    </SafeAreaView>
  );
};

export default ProfileLocationScreen;
