import {RecorderOptions} from "./types/Recorder";
import {logger} from "../logger";
import {ChildProcess, spawn} from "child_process";
import internal from "stream";
import {loadRecorderConfig} from "./recorders";

export default class Recorder {
    private readonly options: {} & RecorderOptions;
    private readonly cmd: string;
    private readonly args: any;
    private childProcess: ChildProcess | null;
    private _stream: internal.Readable | null;

    constructor (options: RecorderOptions = {}) {
        const defaults = {
            sampleRate: 16000,
            channels: 1,
            compress: false,
            threshold: 0.5,
            thresholdStart: null,
            thresholdEnd: null,
            silence: 1.0,
            recorder: 'sox',
            endOnSilence: false,
            audioType: 'wav'
        }
        this.options = Object.assign(defaults, options)

        const { cmd, args } = loadRecorderConfig(this.options.recorder || 'sox', this.options)

        if (!cmd || !args) {
            logger.fatal(`Recorder module ${this.options.recorder} is missing required properties.`);
            // Обработка ошибки, если необходимо
        }
        this.cmd = cmd
        this.args = args
        this.childProcess = null;
        this._stream = null;
    }
    public start(): this {
        if (!this.childProcess) {
            this.childProcess = spawn(this.cmd, this.args);
            const rec = this.childProcess.stdout
            const err = this.childProcess.stderr

            this._stream = rec;


            this.childProcess.on('close', (code, signal) => {
                logger.debug(`Recording process exited with code ${code} and signal ${signal}`);
                this.childProcess = null;
            });

            err?.on('data', chunk => {
                logger.error(`STDERR: ${chunk}`)
            })
            rec?.on('end', () => {
                logger.debug('Recording ended')
            })
        } else {
            logger.warn('Recording process is already running.');
        }
        return this
    }

    // Метод для остановки записи
    public stop(): void {
        if (this.childProcess) {
            this.childProcess.kill();
            this.childProcess = null;
        } else {
            logger.warn('No recording process to stop.');
        }
    }
    public pause(){
        if (!this.childProcess){
            logger.warn("Recording not started yet");
        }else {
            this.childProcess.kill("SIGSTOP");
            this._stream?.pause();
            logger.debug("Recording paused");
        }
    }
    public resume(){
        if(!this.childProcess){
            logger.warn("Recording not started yet")
        }else{
            this.childProcess.kill("SIGCONT");
            this._stream?.resume();
            logger.debug("Resumed recording");
        }
    }
    public isPaused(): boolean {
        if(!this.childProcess){
            logger.warn("Recording not started yet")
            return true
        }else {
            return this._stream!.isPaused();
        }
    }
    public stream(): internal.Readable | null{
        if (!this.childProcess){
            logger.debug('Recording not yet started');
            return null
        }else {
            return this._stream
        }
    }
}