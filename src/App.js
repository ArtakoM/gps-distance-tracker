import React from 'react';

class Demo extends React.Component {
  state = {
    min: 400,
    perKm: 100,
    waitCost: 50,
    coords: {
      lat: null,
      lng: null,
    },
    distance: 0,
  };

  componentDidMount() {
    this.trackGPS();
  }

  trackGPS = () => {
    const options = {
      enableHighAccuracy: false,
      timeout: 10000,
      maximumAge: 0
    };

    navigator.geolocation.getCurrentPosition(data => {
      console.log('data.coords.latitude', data.coords.latitude);
      this.setState({
        coords: {
          lat: data.coords.latitude,
          lng: data.coords.longitude,
        }
      })
    },this.onFailure, options);

    return navigator.geolocation.watchPosition(this.onSuccess, this.onFailure, options);
  };

  onSuccess = (data) => {
    const { coords } = this.state;

    console.log('data', data);

    this.calcDistance(coords.lat, data.coords.latitude, coords.lng, data.coords.longitude);
  };

  onFailure = (err) => {
    console.log('fail', err);
  };

  calcDistance = (lat1, lat2, lon1, lon2) => {
    console.log('lat1', lat1);
    if ((lat1 === lat2) && (lon1 === lon2)) {
      return 0;
    }
    else {
      const radlat1 = Math.PI * lat1/180;
      const radlat2 = Math.PI * lat2/180;
      const theta = lon1-lon2;
      const radtheta = Math.PI * theta/180;
      let dist = Math.sin(radlat1) * Math.sin(radlat2) + Math.cos(radlat1) * Math.cos(radlat2) * Math.cos(radtheta);
      if (dist > 1) {
        dist = 1;
      }
      dist = Math.acos(dist);
      dist = dist * 180/Math.PI;
      dist = dist * 60 * 1.1515 * 1.609344;
      return this.setState(prevState => ({
        distance: prevState.distance + dist,
      }))
    }
  };

  render() {
    const { distance } = this.state;

    return (
      <div>{ distance }</div>
    )
  }
}

export default Demo;

