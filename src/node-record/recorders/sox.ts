import {RecorderOptions} from "../types/Recorder";

export type recorderConfigSox = (options: RecorderOptions) => {cmd: 'sox', args: (string | number | undefined)[]}
export const recorderConfigSox: recorderConfigSox =  (options) => {
    const cmd = 'sox';
    let args = [
        '--default-device',
        '--no-show-progress', // show no progress
        '--rate', options.sampleRate, // sample rate
        '--channels', options.channels, // channels
        '--encoding', 'signed-integer', // sample encoding
        '--bits', '16', // precision (bits)
        '--type', options.audioType, // audio type
        '-' // pipe
    ]
    if (options.endOnSilence) {
        args = args.concat([
            'silence', '1', '0.1', options.thresholdStart || options.threshold + '%',
            '1', options.silence, options.thresholdEnd || options.threshold + '%'
        ])
    }
    return {cmd, args}
}