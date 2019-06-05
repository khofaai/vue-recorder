# vue-recorder

This package help you recorder audio on vuejs apps


[![npm](https://img.shields.io/npm/v/vue-recorder.svg)](https://www.npmjs.com/package/vue-recorder) ![license](https://img.shields.io/github/license/khofaai/vue-recorder.svg) [![npm](https://img.shields.io/npm/dw/vue-recorder.svg)](https://www.npmjs.com/package/vue-recorder) [![npm](https://img.shields.io/npm/dt/vue-recorder.svg)](https://www.npmjs.com/package/vue-recorder) [![Build Status](https://travis-ci.org/khofaai/vue-recorder.svg?branch=master)](https://travis-ci.org/khofaai/vue-recorder)

## Installation

```bash
npm i vue-recorder
```

## Usage

```javascript
  import vueRecorder from 'vue-recorder';
  export default {
    ...
    methods: {
      startRecording() {
        vueRecorder.startRecording();
      },
      stopRecording() {
        vueRecorder
          .stopRecording()
          .then( audio => {
            // audio as media file
          });
			}
    }
  }
```