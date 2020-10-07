import Recorder from 'recorderjs';

//webkitURL is deprecated but nevertheless
const URL = window.URL || window.webkitURL;
var $recordedAudio = null;
const VueRecorder = {
	record: null,
	
	gumStream: null,

	startRecording() {
		/*
			Simple constraints object, for more advanced audio features see
			https://addpipe.com/blog/audio-constraints-getusermedia/
		*/
	    var constraints = { audio: true, video:false }
	    $recordedAudio = null;
		/*
	    	We're using the standard promise based getUserMedia() 
	    	https://developer.mozilla.org/en-US/docs/Web/API/MediaDevices/getUserMedia
		*/
		return new Promise((resolve, reject) => {
			navigator.mediaDevices.getUserMedia(constraints).then( stream => {
				// shim for AudioContext when it's not avb. 
				var AudioContextWindowObj = window.AudioContext || window.webkitAudioContext;
				/*
					create an audio context after getUserMedia is called
					sampleRate might change after getUserMedia is called, like it does on macOS when recording through AirPods
					the sampleRate defaults to the one set in your OS for your playback device
				*/
				let audioContext = new AudioContextWindowObj();
				/*  assign to gumStream for later use  */
				this.gumStream = stream;
				
				/* use the stream */
				//MediaStreamAudioSourceNode we'll be recording
				let input = audioContext.createMediaStreamSource(stream);
				/* 
					Create the Recorder object and configure to record mono sound (1 channel)
					Recording 2 channels  will double the file size
				*/
				this.record = new Recorder( input, { numChannels: 1 } );
				//start the recording process
				this.record.record();
				resolve(true);
			}).catch( recorderERROR => {
				console.error({ recorderERROR });
				reject(false);
			});
		})
	},

	pauseRecording() {
    this.getRecordingStatus() ? this.record.stop() : this.record.record();
    return this.getRecordingStatus();
	},

	stopRecording({filename = null, type = 'audio/wav'}) {
		//tell the recorder to stop the recording
		this.record.stop();
		//stop microphone access
		this.gumStream.getAudioTracks()[0].stop();
		//create the wav blob and pass it on to createDownloadLink

		return new Promise( (resolve, reject) => {
			this.record.exportWAV(blob => this.createDownloadLink(blob, filename), type);
			setTimeout(() => {
				if ($recordedAudio === null) {
					reject($recordedAudio);
					return;
				}
				resolve($recordedAudio);
			}, 500);
		});
	},

	createDownloadLink(blob, filename) {
		var url = URL.createObjectURL(blob);

		//name of .wav file to use during upload and download (without extendion)
    filename = filename || new Date().toISOString()+".wav";
		$recordedAudio = { url, filename, blob };
	},

	getRecordedAudio() {
		return (new Promise(resolve => {
			setTimeout(() => resolve($recordedAudio), 500);
		}));
  },
  
  getRecordingStatus() {
    return this.record.recording;
  },
};

export default VueRecorder;