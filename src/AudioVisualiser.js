import React, { Component } from 'react';
import Button from '@material-ui/core/Button';
import { Grid, Typography } from '@material-ui/core';

class AudioVisualiser extends Component {
  constructor(props) {
    
    super(props);

    this.state = {
      logging: false,
      speaking: false
    };

    this.canvas = React.createRef();
    this.interval = null;
    this.checkingInterval = null;
    this.sampleRate = this.props.sampleRate
  }

  componentDidMount() {
    
    this.checkingInterval = setInterval(() => { this.checkIfSpoken() }, 2000)
  }

  componentDidUpdate(prevProps) {
    // if(prevProps.audioData!=this.props.audioData){
    //   this.checkIfSpoken()
    // }
    this.draw();
  }

  componentWillUnmount() {
    clearInterval(this.checkingInterval)
    if (this.interval) {
      clearInterval(this.interval)
    }
  }

  logFrequency() {
    const date = new Date()
    return "" + date.getHours() + ":" + date.getMinutes() + ":" + date.getSeconds() + "\n" + "Max value: " + this.getMax(this.props.audioData)
  }

  getMax(array) {
    return Math.max(...array)
  }

  toggleLogging() {

    this.state.logging ?
      this.setState({ logging: false }, () => this.stopLogging()) :
      this.setState({ logging: true }, () => this.startLogging())
  }

  stopLogging() {
    clearInterval(this.interval)
    this.interval = null;
  }

  startLogging() {
    this.interval = setInterval(() => {
      console.log(this.logFrequency())
    }, 1000)
  }

  checkIfSpoken() {

    // Nyquist frequency
    // https://stackoverflow.com/questions/44502536/determining-frequencies-in-js-audiocontext-analysernode
    // https://en.wikipedia.org/wiki/Nyquist_frequency

    // console.log("All frequencies \n" + this.props.audioData)
    let NF = this.sampleRate / 2;

    let singleHZStep = NF / this.props.audioData.length

    let minIndex = Math.round(this.props.options.minHZ / singleHZStep);
    let maxIndex = Math.round(this.props.options.maxHZ / singleHZStep);

    console.log("minlimit " + minIndex + ", stands for: " + minIndex*singleHZStep + " HZ")
    console.log("maxlimit " + maxIndex + ", stands for: " + maxIndex*singleHZStep + " HZ")

    let usableSoundLevels = this.props.audioData.slice(minIndex, maxIndex + 2)
    console.log("Sound levels of man-spoken frequencies\n" + usableSoundLevels)
    if (usableSoundLevels.length > 0) {
      if (usableSoundLevels.reduce((a, b) => (a + b)) / usableSoundLevels.length > this.props.options.treshhold) {
        this.setState({ speaking: true })
      } else {
        this.setState({ speaking: false })
      }
      console.log(usableSoundLevels.reduce((a, b) => (a + b)) / usableSoundLevels.length)
    }
  }

  draw() {
    const { audioData } = this.props;
    const canvas = this.canvas.current;
    const height = canvas.height;
    const width = canvas.width;
    const context = canvas.getContext('2d');
    let x = 0;
    const sliceWidth = (width * 1.0) / audioData.length;

    context.lineWidth = 2;
    context.strokeStyle = '#000000';
    context.clearRect(0, 0, width, height);

    context.beginPath();
    context.moveTo(0, height / 2);
    for (const item of audioData) {
      const y = (item / 255.0) * height;
      context.lineTo(x, y);
      x += sliceWidth;
    }
    context.lineTo(x, height / 2);
    context.stroke();
  }


  test() {
    let array = [100, 100, 150, 160, 50, 79, 4, 6, 7, 8]
    let newArray = array.slice(1, 3)
    console.log("Test \n" + newArray);
    console.log("test \n " + newArray.reduce((a, b) => (a + b)) / newArray.length)
  }

  render() {
    return (<Grid container spacing={2} direction="column" alignItems="center">
      <Grid item>
        <canvas width="1024" height="300" ref={this.canvas} />
      </Grid>
      <Grid item>
        <Typography variant="h3" color={this.state.speaking ? "primary" : "secondary"}>
          {this.state.speaking ? "Man Spoken Frequency" : "Other Frequencies"}
        </Typography>
      </Grid>
      <Grid item>
        <Button onClick={() => {
          // this.toggleLogging()
          this.test()
        }}>
          {this.state.logging ? "Stop logging" : "Start logging"}
        </Button>
      </Grid>

    </Grid>);
  }
}

export default AudioVisualiser;
