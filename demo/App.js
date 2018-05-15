/**
 * @author lovebing
 * @flow
 */

import React, { Component, PropTypes } from "react";

import { MapView, MapTypes, Geolocation } from "react-native-baidu-map";

import { Button, StyleSheet, View } from "react-native";

import Dimensions from "Dimensions";

export default class App extends Component {
  constructor() {
    super();

    this.state = {
      mayType: MapTypes.NORMAL,
      zoom: 10,
      center: {
        longitude: 104.08296,
        latitude: 38.65777
      },
      trafficEnabled: false,
      baiduHeatMapEnabled: false,
      markers: [
        {
          longitude: 104.08396,
          latitude: 38.542449,
          title: "Window of the world"
        },
        {
          longitude: 104.08206,
          latitude: 38.537642,
          title: ""
        },
        {
          longitude: 104.08496,
          latitude: 38.65777,
          title: ""
        }
      ]
    };
  }

  /**
   * 定位用户的位置，并显示蓝色的定位点marker。
   * 你也可以使用`GeoLocation`模块的定位来模拟。
   */
  startLocate = async () => {
    await MapView.locateUser();
  };

  planRoute = async () => {
    await MapView.planRoute(
      {
        longitude: 116.333134,
        latitude: 40.009545
      },
      {
        longitude: 116.3597960000,
        latitude: 39.9988780000
      }
    );
  };

  render() {
    return (
      <View style={styles.container}>
        <MapView
          trafficEnabled={this.state.trafficEnabled}
          baiduHeatMapEnabled={this.state.baiduHeatMapEnabled}
          zoom={this.state.zoom}
          mapType={this.state.mapType}
          center={this.state.center}
          markers={this.state.markers}
          allGesturesEnabled={true}
          draggable={true}
          style={styles.map}
          onMarkerClick={e => {
            console.log(JSON.stringify(e));
          }}
          onReceiveLocation={e => {
            const { longitude, latitude } = e;
            this.setState({
              center: {
                longitude: longitude,
                latitude: latitude
              }
            });
          }}
          onMapClick={e => {}}
        />

        <View style={styles.row}>
          <Button
            title="Normal"
            onPress={() => {
              this.setState({
                mapType: MapTypes.NORMAL
              });
            }}
          />
          <Button
            style={styles.btn}
            title="Satellite"
            onPress={() => {
              this.setState({
                mapType: MapTypes.SATELLITE
              });
            }}
          />

          <Button
            style={styles.btn}
            title="Locate"
            onPress={() => {
              console.warn("center", this.state.center);
              Geolocation.getCurrentPosition()
                .then(data => {
                  console.warn(JSON.stringify(data));
                  this.setState({
                    zoom: 15,
                    marker: {
                      latitude: data.latitude,
                      longitude: data.longitude,
                      title: "Your location"
                    },
                    center: {
                      latitude: data.latitude,
                      longitude: data.longitude,
                      rand: Math.random()
                    }
                  });
                })
                .catch(e => {
                  console.warn(e, "error");
                });
            }}
          />
        </View>

        <View style={styles.row}>
          <Button
            title="Zoom+"
            onPress={() => {
              this.setState({
                zoom: this.state.zoom + 1
              });
            }}
          />
          <Button
            title="Zoom-"
            onPress={() => {
              if (this.state.zoom > 0) {
                this.setState({
                  zoom: this.state.zoom - 1
                });
              }
            }}
          />
          <Button
            title="Route"
            onPress={() => {
              this.planRoute();
            }}
          />
        </View>

        <View style={styles.row}>
          <Button
            title="Traffic"
            onPress={() => {
              this.setState({
                trafficEnabled: !this.state.trafficEnabled
              });
            }}
          />

          <Button
            title="Baidu HeatMap"
            onPress={() => {
              this.setState({
                baiduHeatMapEnabled: !this.state.baiduHeatMapEnabled
              });
            }}
          />

          <Button title="Locate User" onPress={this.startLocate} />
        </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  row: {
    flexDirection: "row",
    height: 40
  },
  container: {
    flex: 1,
    justifyContent: "flex-start",
    alignItems: "center",
    backgroundColor: "#F5FCFF"
  },
  map: {
    width: Dimensions.get("window").width,
    height: Dimensions.get("window").height - 200,
    marginBottom: 16
  }
});
