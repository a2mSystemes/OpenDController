import { SerialPortStream } from "@serialport/stream";
import { autoDetect } from '@serialport/bindings-cpp';
import { SerialPort } from "serialport";
import ODCSerialDataReader from "./ODCSerialDataReader.mjs";


// prolific vendorId = '067B' productId = '2303'

const binding = autoDetect()

export default class ODCSerialService {
    _reader;
    _handleSerial;
    _avialable;
    _commandsPending;
    _interval;
    _closeRequested;
    _commandCounter;
    _responseObserver;
    _responses;
    _readerReadyObs;
    _readerReady;

    constructor(baudRate = 9600, path, options) {
        this.baudRate = baudRate;
        this.path = path;
        this._handleSerial = new SerialPortStream({ binding, path: this.path, baudRate: this.baudRate });
        this._reader = new ODCSerialDataReader(this._handleSerial);
        this._avialable = true;
        this._commandsPending = [];
        this._closeRequested = false;
        this._commandCounter = 1;
        this._responses = [];
        this._readerReadyObs = this._reader.getReadyObserver().subscribe((ready) => this._readerReady = !ready);
        this._interval = setInterval(async () => {
            await this._processCommands();
            if (!this._hasCommandsPending() && this._closeRequested) {
                this._close();
            }
        }, 50);
        // TODO: manage Serial options
    }

    _hasCommandsPending() {
        if (this._commandsPending.length > 0) {
            return true;
        }
        return false;
    }

    async _processCommands() {
        if (this._hasCommandsPending() && this._readerReady) {
            let command = this._commandsPending.shift();
            await this._handleSerial.write(command);
            this._commandCounter++;
        }
    }
    getCommandCounter() {
        return this._commandCounter;
    }
    sendCommand(command) {
        this._commandsPending.push(command);
        return this.observe();
    }

    close() {
        this._closeRequested = true;
    }

    _close() {
        this._reader = null;
        this._handleSerial.close();
        clearInterval(this._interval);
        console.log("serial port closed");
    }

    observe() {
        return this._reader.dataAvailable();
    }

    selectVideoInput(input) {
        input = Number(input);
        if (input !== NaN && input > 0 && input < 5) {
            return this.sendCommand(`IN${input}!`);

        } else {
            throw new Error(`Invalid input ${input}`);
        }
    }
    selectAudioInput(input) {
        input = Number(input);
        if (input !== NaN && input > 0 && input < 5) {
            return this.sendCommand(`A${input}!`);
        } else {
            throw new Error(`Invalid input ${input}`);
        }
    }

    queryVideoInput(input) {
        input = Number(input);
        if (input !== NaN && input > 0 && input < 5) {
            return this.sendCommand(`IN${input}?`);
        } else {
            throw new Error(`Invalid input ${input}`);
        }
    }

    queryVideoOutput() {
        return this.sendCommand('OUT1?');
    }

    queryTMDS() {
        return this.sendCommand('TMDS?');
    }

    queryHelp() {
        return this.sendCommand('?');
    }

    setAutoSwitch(value) {
        if (value)
            return this.sendCommand('ONAUTO!');
        else
            return this.sendCommand('OFFAUTO!');
    }

    setArc(value) {
        if (value)
            return this.sendCommand('ONARC!');
        else
            return this.sendCommand('OFFARC!');
    }

    static async createAsync(baudRate = 9600, vendorId, productId) {
        vendorId = String(vendorId);
        productId = String(productId);
        if (vendorId && productId) {
            // console.log("Scanning with : ", vendorId, " ", productId);
            let path = undefined;
            const ports = await SerialPort.list();
            for (let port of ports) {
                // console.log(port);
                if (port.vendorId === vendorId && port.productId === productId) {
                    path = port.path;
                }
            }
            if (path === undefined) {
                throw new Error(`Unable to find device with ${vendorId} and ${productId}`);
            }
            // console.log('return object');
            return new Promise((r) => {
                const service = new ODCSerialService(baudRate, path);
                // console.log(service);
                r(service);
            });
        }
        else {
            throw new Error(`bad options: baudRate:'${baudRate}' vendorId='${vendorId}' productId='${productId}'`);
        }
    }

    static create(baudRate = 9600, vendorId, productId) {
        vendorId = String(vendorId);
        productId = String(productId);
        SerialPort.list().then((ports) => {
            let path;
            for (let port of ports) {
                // console.log(port);
                if (port.vendorId === vendorId && port.productId === productId) {
                    path = port.path;
                }
            }
            if (path === undefined) {
                throw new Error(`Unable to find device with ${vendorId} and ${productId}`);
            }
            return new ODCSerialService(baudRate, path);
        }

        )
    }
}




