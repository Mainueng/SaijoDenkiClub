import React from "react";
import {
  View,
  Text,
  SafeAreaView,
  Image,
  Linking,
  Pressable,
  Alert,
  Platform,
} from "react-native";
import { StatusBar } from "expo-status-bar";
import styles from "../../assets/stylesheet/more/more";
import Logo from "../../assets/image/more/logo.png";
import Facebook from "../../assets/image/more/facebook.png";
import Line from "../../assets/image/more/line.png";
import Youtube from "../../assets/image/more/youtube.png";
import Viber from "../../assets/image/more/viber.png";
import Address from "../../assets/image/more/office-building.png";
import Route from "../../assets/image/more/route.png";
import Megaphone from "../../assets/image/more/megaphone.png";
import Manual from "../../assets/image/more/instructions.png";
import Catalog from "../../assets/image/more/catalog.png";

const MoreScreen = () => {
  const openURL = async (val) => {
    let supported;

    switch (true) {
      case val === "facebook":
        supported = await Linking.canOpenURL(
          "https://www.facebook.com/Saijodenkiaircon/"
        );

        if (supported) {
          await Linking.openURL("https://www.facebook.com/Saijodenkiaircon/");
        } else {
          Alert.alert("Can't open link!");
        }
        break;
      case val === "line":
        supported = await Linking.canOpenURL("https://page.line.me/fmf1324p");

        if (supported) {
          await Linking.openURL("https://page.line.me/fmf1324p");
        } else {
          Alert.alert("Can't open link!");
        }
        break;
      case val === "youtube":
        supported = await Linking.canOpenURL(
          "https://www.youtube.com/channel/UC2E6yp2kUShFnhWWhg4cLpg"
        );

        if (supported) {
          await Linking.openURL(
            "https://www.youtube.com/channel/UC2E6yp2kUShFnhWWhg4cLpg"
          );
        } else {
          Alert.alert("Can't open link!");
        }
        break;
      case val === "address":
        supported = await Linking.canOpenURL(
          "https://www.saijo-denki.co.th/index.php?route=information/contact"
        );

        if (supported) {
          await Linking.openURL(
            "https://www.saijo-denki.co.th/index.php?route=information/contact"
          );
        } else {
          Alert.alert("Can't open link!");
        }
        break;
      case val === "route":
        supported = await Linking.canOpenURL(
          "https://www.saijo-denki.co.th/index.php?route=information/contact"
        );

        if (supported) {
          let scheme = Platform.OS === "ios" ? "maps:" : "geo:";
          let url = scheme + `${"13.8484942"},${"100.5319401"}`;

          await Linking.openURL(url);
        } else {
          Alert.alert("Can't open link!");
        }
        break;
      case val === "promotion":
        supported = await Linking.canOpenURL(
          "https://www.saijo-denki.co.th/index.php?route=blog/list&type=1"
        );

        if (supported) {
          await Linking.openURL(
            "https://www.saijo-denki.co.th/index.php?route=blog/list&type=1"
          );
        } else {
          Alert.alert("Can't open link!");
        }
        break;
      case val === "manual":
        supported = await Linking.canOpenURL(
          "https://www.saijo-denki.co.th/index.php?route=document/document&type=11"
        );

        if (supported) {
          await Linking.openURL(
            "https://www.saijo-denki.co.th/index.php?route=document/document&type=11"
          );
        } else {
          Alert.alert("Can't open link!");
        }
        break;
      case val === "catalog":
        supported = await Linking.canOpenURL(
          "https://www.saijo-denki.co.th/index.php?route=document/document&type=1"
        );

        if (supported) {
          await Linking.openURL(
            "https://www.saijo-denki.co.th/index.php?route=document/document&type=1"
          );
        } else {
          Alert.alert("Can't open link!");
        }
        break;
      default:
        break;
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar style="light" />
      <View style={styles.banner_container}>
        <Image
          source={Logo}
          style={styles.banner_image}
          resizeMode={"contain"}
        />
        <Text style={styles.version}>Version 3.2.8</Text>
      </View>
      <View style={styles.link_icon_container}>
        <Text style={styles.title}>ข่าวสารและคู่มือ</Text>
        <View style={styles.icon_container}>
          <Pressable style={styles.icon} onPress={() => openURL("promotion")}>
            <Image
              source={Megaphone}
              resizeMode={"contain"}
              style={styles.icon_image}
            />
            <Text style={styles.icon_text}>โปรโมชั่น</Text>
          </Pressable>
          <Pressable style={styles.icon} onPress={() => openURL("manual")}>
            <Image
              source={Manual}
              resizeMode={"contain"}
              style={styles.icon_image}
            />
            <Text style={styles.icon_text}>คู่มือ</Text>
          </Pressable>
          <Pressable style={styles.icon} onPress={() => openURL("catalog")}>
            <Image
              source={Catalog}
              resizeMode={"contain"}
              style={styles.icon_image}
            />
            <Text style={styles.icon_text}>แค็ตตาล็อก</Text>
          </Pressable>
        </View>
      </View>
      <View style={styles.link_icon_container}>
        <Text style={styles.title}>โซเชียลมีเดีย</Text>
        <View style={styles.icon_container}>
          <Pressable style={styles.icon} onPress={() => openURL("facebook")}>
            <Image
              source={Facebook}
              resizeMode={"contain"}
              style={styles.icon_image}
            />
            <Text style={styles.icon_text}>Facebook</Text>
          </Pressable>
          <Pressable style={styles.icon} onPress={() => openURL("line")}>
            <Image
              source={Line}
              resizeMode={"contain"}
              style={styles.icon_image}
            />
            <Text style={styles.icon_text}>Line</Text>
          </Pressable>
          <Pressable style={styles.icon} onPress={() => openURL("youtube")}>
            <Image
              source={Youtube}
              resizeMode={"contain"}
              style={styles.icon_image}
            />
            <Text style={styles.icon_text}>Youtube</Text>
          </Pressable>
        </View>
      </View>
      <View style={styles.link_icon_container}>
        <Text style={styles.title}>ติดต่อ</Text>
        <View style={styles.icon_container}>
          <Pressable
            style={styles.icon}
            onPress={() => Linking.openURL(`tel:${"028321999"}`)}
          >
            <Image
              source={Viber}
              resizeMode={"contain"}
              style={styles.icon_image}
            />
            <Text style={styles.icon_text}>ศูนย์รับแจ้ง</Text>
          </Pressable>
          <Pressable style={styles.icon} onPress={() => openURL("address")}>
            <Image
              source={Address}
              resizeMode={"contain"}
              style={styles.icon_image}
            />
            <Text style={styles.icon_text}>ที่อยู่</Text>
          </Pressable>
          <Pressable style={styles.icon} onPress={() => openURL("route")}>
            <Image
              source={Route}
              resizeMode={"contain"}
              style={styles.icon_image}
            />
            <Text style={styles.icon_text}>เส้นทาง</Text>
          </Pressable>
        </View>
      </View>
    </SafeAreaView>
  );
};

export default MoreScreen;
