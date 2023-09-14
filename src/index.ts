'use strict';

import Recorder from "./node-record";
import {SpeechClient} from "@google-cloud/speech"
import {google} from "@google-cloud/speech/build/protos/protos";
import AudioEncoding = google.cloud.speech.v1p1beta1.RecognitionConfig.AudioEncoding;
import {logger} from "./logger";

function main() {
	const client = new SpeechClient()
	const recorder = new Recorder({
		recorder: "rec",
		audioType: "wav",
		channels: 1,
		silence: 10.0,
		threshold: 0
	})

	const recognizeStream = client
		.streamingRecognize({
			config: {
				encoding: AudioEncoding.LINEAR16,
				sampleRateHertz: 16000,
				languageCode: "ru-RU",
			},
			interimResults: false,
		})
		.on('error', console.error)
		.on('data', data =>
			process.stdout.write(
				data.results[0] && data.results[0].alternatives[0]
					? `Transcription: ${data.results[0].alternatives[0].transcript}\n`
					: '\n\nReached transcription time limit, press Ctrl+C\n'
			)
		);
	recorder.start();
	recorder.stream()!.pipe(recognizeStream)
	logger.info("Listening, press Ctrl+C to stop.")
}

main();