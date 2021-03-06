import React, { Component } from 'react';
import AudioVisualiser from './AudioVisualiser';
import { Grid, Slider, Typography } from '@material-ui/core';
const defaultSampleRate = 48000
// Min and Max HZ [20-20000] for the human-spoken language 
const minHZ = 95
const maxHZ = 255

// power (volume) [0-255] of the human voice, above which it should be recognized
const treshhold = 130
class AudioAnalyser extends Component {
  constructor(props) {
    super(props);
    this.state = {
      audioData: new Uint8Array(0),
      minHZ: minHZ,
      maxHZ: maxHZ,
      treshhold: treshhold
    };
    this.sampleRate = null;
    this.tick = this.tick.bind(this);
  }

  componentDidMount() {
    this.audioContext = new (window.AudioContext ||
      window.webkitAudioContext)();
    this.analyser = this.audioContext.createAnalyser();
    // console.log("Sample Rate: " + this.audioContext.sampleRate)
    // console.log("Frequency Bin Count: " + this.analyser.frequencyBinCount);
    this.sampleRate = this.audioContext.sampleRate
    this.dataArray = new Uint8Array(this.analyser.frequencyBinCount);
    this.source = this.audioContext.createMediaStreamSource(this.props.audio);
    this.source.connect(this.analyser);
    this.rafId = requestAnimationFrame(this.tick);
  }

  tick() {
    // this.analyser.getByteTimeDomainData(this.dataArray);
    this.analyser.getByteFrequencyData(this.dataArray)
    this.setState({ audioData: this.dataArray });
    this.rafId = requestAnimationFrame(this.tick);
  }

  componentWillUnmount() {
    cancelAnimationFrame(this.rafId);
    this.analyser.disconnect();
    this.source.disconnect();
  }

  render() {
    return (
      <Grid container margin="15px" direction="column" alignContent="center" justifyContent="center">
        <Grid item xs={4}>
          <Slider aria-label="Min HZ"
            value={this.state.minHZ}
            min={0}
            max={100}
            step={5}
            marks
            onChangeCommitted={(event, value) => {
              this.setState({ minHZ: value })
            }} />
          <Typography>{"Min HZ: " + this.state.minHZ}</Typography>
        </Grid>
        <Grid item xs={4}>
          <Slider aria-label="Max HZ"
            value={this.state.maxHZ}
            min={200}
            max={300}
            step={5}
            marks
            onChangeCommitted={(event, value) => {
              this.setState({ maxHZ: value })
            }} />
          <Typography>{"Max HZ: " + this.state.maxHZ}</Typography>
        </Grid>
        <Grid item xs={4}>
          <Slider aria-label="Mic Treshhold"
            value={this.state.treshhold}
            min={0}
            max={300}
            step={5}
            marks
            onChangeCommitted={(event, value) => {
              this.setState({ treshhold: value })
            }} />
        </Grid>
        <Typography>{"Mic treshhold: " + this.state.treshhold}</Typography>
        <Grid>
          {this.state.minHZ && this.state.maxHZ && this.state.treshhold && this.state.audioData && <AudioVisualiser audioData={this.state.audioData}
            sampleRate={this.sampleRate != null ? this.sampleRate : this.props.defaultSampleRate}
            options={{ minHZ: this.state.minHZ, maxHZ: this.state.maxHZ, treshhold: this.state.treshhold }} /> }
          
        </Grid>
      </Grid>);
  }
}

export default AudioAnalyser;
