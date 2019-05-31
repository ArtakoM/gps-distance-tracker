import React from 'react';
import PropTypes from 'prop-types';
import TextField from '@material-ui/core/TextField';
import Grid from '@material-ui/core/Grid';
import Container from '@material-ui/core/Container';
import Typography from '@material-ui/core/Typography';
import { withStyles } from '@material-ui/core/styles';

const styles = () => ({
  textField: {

  },
});

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
      enableHighAccuracy: false,
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
      return min + (perKm * (distance - minDistance))
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
    const { classes } = this.props;

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
            className={classes.textField}
            value={min}
            onChange={this.handleChange('min')}
            margin="normal"
            variant="outlined"
          />
          <TextField
            id="outlined-name"
            label="Ներառված կիլոմետրաժ"
            className={classes.textField}
            value={minDistance}
            onChange={this.handleChange('minDistance')}
            margin="normal"
            variant="outlined"
          />
          <TextField
            id="outlined-name"
            label="1կմ֊ի արժեքը"
            className={classes.textField}
            value={perKm}
            onChange={this.handleChange('preKm')}
            margin="normal"
            variant="outlined"
          />
        </Grid>
        <Typography
          gutterBottom
        >
          Անցած ճանապարհ - { distance }
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
