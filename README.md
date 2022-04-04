# Frequency analysis app

This is a react-app for monitoring the frequencies of the incoming audio stream.

It detects frequencies in the given limits. By default the limits are set to detect the [human voice](https://en.wikipedia.org/wiki/Human_voice). 

## How to use it

1. [Install node.js & npm](https://nodejs.org/en/download/)
2. Install dependencies with `npm i`
3. Start the project with `npm start`
4. In the browser: go to `localhost:3000`
5. Click on "Get microphone input"
6. Try to say something, monitor the freqeuncies change while you speak and check if the label at the bottom of the page changes
7. Play with mic treshold and frequency limits for proper recognition

## [Shutout to Phil Nash for the react-web-audio repo](https://github.com/philnash/react-web-audio)
