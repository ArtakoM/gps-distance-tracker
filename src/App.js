import React from 'react';
import PropTypes from 'prop-types';
import TextField from '@material-ui/core/TextField';
import Grid from '@material-ui/core/Grid';
import Container from '@material-ui/core/Container';
import Typography from '@material-ui/core/Typography';
import { withStyles } from '@material-ui/core/styles';

const styles = () => ({});

class Demo extends React.Component {
  state = {
    min: 400,
    minDistance: 2,
    perKm: 100,
    waitCost: 50,
    coords: {
      lat: null,
      lon: null,
    },
    distance: 0,
  };

  componentDidMount() {
    this.trackGPS();
  }

  trackGPS = () => {
    const options = {
      enableHighAccuracy: true,
      timeout: 10000,
      maximumAge: 0
    };

    navigator.geolocation.getCurrentPosition(data => {
      this.setState({
        coords: {
          lat: data.coords.latitude,
          lon: data.coords.longitude,
        }
      })
    },this.onFailure, options);

    return navigator.geolocation.watchPosition(this.onSuccess, this.onFailure, options);
  };

  onSuccess = (data) => {
    const { coords } = this.state;

    this.calcDistance(coords.lat, data.coords.latitude, coords.lon, data.coords.longitude);
  };

  onFailure = (err) => {
    console.error('Error occurred in getting position process', err);
    alert('Error occurred in getting position process');
  };

  calcDistance = (lat1, lat2, lon1, lon2) => {
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
      if (dist < 0.03) {
        return null;
      }
      return this.setState(prevState => ({
        distance: prevState.distance + dist,
        coords: {
          lat: lat2,
          lon: lon2,
        },
      }))
    }
  };

  calcPrice = () => {
    const {
      distance,
      min,
      perKm,
      minDistance,
    } = this.state;

    if (distance > minDistance) {
      return min + (perKm * Math.floor(distance - minDistance))
    }
    return min;
  };

  handleChange = name => event => {
    this.setState({
      [name]: event.target.value,
    });
  };

  render() {
    const {
      distance,
      minDistance,
      min,
      perKm,
    } = this.state;

    return (
      <Container maxWidth="sm">
        <Grid
          container
          direction="column"
          justify="flex-start"
          alignItems="flex-start"
        >
          <TextField
            id="outlined-name"
            label="Մինիմալ"
            value={min}
            onChange={this.handleChange('min')}
            margin="normal"
            variant="outlined"
          />
          <TextField
            id="outlined-name"
            label="Ներառված կիլոմետրաժ"
            value={minDistance}
            onChange={this.handleChange('minDistance')}
            margin="normal"
            variant="outlined"
          />
          <TextField
            id="outlined-name"
            label="1կմ֊ի արժեքը"
            value={perKm}
            onChange={this.handleChange('preKm')}
            margin="normal"
            variant="outlined"
          />
        </Grid>
        <Typography
          gutterBottom
        >
          Անցած ճանապարհ - { Number(distance.toFixed(2)) }
        </Typography>
        <Typography>
          Գին - { this.calcPrice() }
        </Typography>
      </Container>
    )
  }
}

Demo.propTypes = {
  classes: PropTypes.shape({}).isRequired,
};

export default withStyles(styles)(Demo);
