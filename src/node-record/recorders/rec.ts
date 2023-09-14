import {RecorderOptions} from "../types/Recorder";

export function recorderConfigRec(options: RecorderOptions): {cmd: 'rec', args: (string | number | undefined)[]} {
    const cmd = 'rec'

    let args = [
        '-q', // show no progress
        '-r', options.sampleRate, // sample rate
        '-c', options.channels, // channels
        '-e', 'signed-integer', // sample encoding
        '-b', '16', // precision (bits)
        '-t', options.audioType, // audio type
        '-' // pipe
    ]

    if (options.endOnSilence) {
        args = args.concat([
            'silence', '1', '0.1', options.thresholdStart || options.threshold + '%',
            '1', options.silence, options.thresholdEnd || options.threshold + '%'
        ])
    }

    return { cmd, args }
}