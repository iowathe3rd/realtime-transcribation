import {RecorderOptions} from "../types/Recorder";
import {recorderConfigArecord} from "./arecord";
import {recorderConfigRec} from "./rec";
import {recorderConfigSox} from "./sox";

export function loadRecorderConfig(recorderName: string, options: RecorderOptions) {
    switch (recorderName) {
        case 'rec':
            return recorderConfigRec(options);
        case 'sox':
            return recorderConfigSox(options);
        case 'arecord':
            return recorderConfigArecord(options);
        default:
            throw new Error(`Unknown recorder: ${recorderName}`);
    }
}