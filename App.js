import React from "react";
import { Alert } from "react-native";
import Loading from "./Loading";
import * as Location from "expo-location";
import axios from "axios";
import Weather from "./Weather";

const API_KEY = "ce0aedd6975a64229e92137c61a48a2c"; // 날씨정보에 쓰일 키

export default class extends React.Component {
  state = { isLoading: true };

  getWeather = async (latitude, longitute) => {
    latitude = 35.2577;
    longitute = 128.6357; // 위치정보가 안 맞아서 하드코딩
    const {
      data: {
        main: { temp },
        weather,
      },
    } = await axios.get(
      `http://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitute}&appid=${API_KEY}&units=metric`
    ); // https://openweathermap.org로부터 날씨정보 받아오기, &units=metric은 섭씨로 바꿔줌

    this.setState({
      isLoading: false,
      condition: weather[0].main,
      temp,
    });
  };

  getLoaction = async () => {
    try {
      await Location.requestForegroundPermissionsAsync(); // 유저에게 위치접근 물어보는 설정

      const {
        coords: { latitude, longitude },
      } = await Location.getCurrentPositionAsync(); // 안드로이드 9이하부터 가능, 유저의 위치정보를 요청하여 정보를 가져옴

      this.getWeather(latitude, longitude);
    } catch (error) {
      Alert.alert("Can't find you.", "So sad");
    }
  };

  componentDidMount() {
    this.getLoaction();
  }
  render() {
    const { isLoading, temp, condition } = this.state;
    return isLoading ? (
      <Loading />
    ) : (
      <Weather temp={Math.round(temp)} condition={condition} />
    );
  }
}
