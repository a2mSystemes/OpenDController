import net from 'net';
import crypto from 'crypto';
import { rejects } from 'assert';
import { resolve } from 'path';

// Extron Sis command with telnet
// select audio input   -> [ChannelNumber]$ + CR
// view audio input     -> $ + CR
// select audio input   -> [ChannelNumber]$ + CR
// view audio input     -> $ + CR


class AudioMixerState{

    muteStatus = null;
    input = null;
    volumeLevel = null;
    signalDetected = null;
    samplingRate = null;
    encodedChannel = null;


    constructor() {}

}


export default class SSP200 {
    _pass = null;
    _ip = null
    _port = null;
    _sock = null;
    _heartbeat = null;
    _current_state = new AudioMixerState();

    constructor(pass = "extron", ip = "192.168.200.254", port = 23, heartbeat = 0.5) {
        this._pass = pass;
        this._ip = ip;
        this._port = port;
        this._heartbeat = heartbeat;
        this._sock = new net.Socket();
        this._sock.on('data', (buffer) => {
            this.parseResponse(buffer);

        });
        this._sock.on('error', (error) => { console.log(error); });
        this._sock.on('close', (data) => {
            console.log(data);
        });
        // password is required
        this._sock.on('connect', (buffer) => {
            console.log('connected');
        });
        this._sock.connect(this._port, this._ip);
        setInterval(() => {
            // console.log('hearbeat');
            this.update();
        }, this._heartbeat * 1000)
    }


    parseResponse(buffer) {
        // console.log(buffer.toString());
        if (buffer !== undefined) {
            if (buffer.slice(2, 11).toString() === 'Password:') {
                // console.log('sending password');
                this._sock.write(Buffer.from(this._pass + "\n\r"));
                let buff = Buffer.from([0x1b]) + Buffer.from("3CV\n\r");
                this._sock.write(buff);
            }
            // mute status
            if(buffer.slice(0,3).toString() === 'Amt'){
                this._current_state.muteStatus = Boolean(Number(buffer.slice(3,4).toString()));
                // console.log('mute status: ', this._current_state.muteStatus);
            }
            if(buffer.slice(0,3).toString() === 'Aud'){
                this._current_state.input = Number(buffer.slice(3,4).toString());
                // console.log('current input: ', this._current_state.input);
            }
            if(buffer.slice(0,5).toString() === 'In00 '){
                this._current_state.signalDetected = Boolean(Number(buffer.slice(5,6).toString()));
                // console.log('signal detected: ', this._current_state.signalDetected);
            }
            if(buffer.slice(0,3).toString() === 'Vol'){
                var vol = (buffer.slice(4,5).toString() === '\r') ? 
                    '0' + buffer.slice(3,4).toString() : 
                        buffer.slice(3,5).toString();
                if (buffer.slice(5,6).toString() === '0')
                    vol = '100'
                this._current_state.volumeLevel = Number(vol);
                // console.log('volume: ', this._current_state.volumeLevel);
            }

        }
    }

    async state() {
        this.update();
        return new Promise(resolve => setTimeout( () => resolve(this._current_state), 20));
    }

    update() {
        this._sock.write(Buffer.from('$\n'));
        this._sock.write(Buffer.from('V'));
        this._sock.write(Buffer.from('Z\n'));
        this._sock.write(Buffer.from([0x1b]) + Buffer.from('0LS\n'));
        // source format
        // this._sock.write(Buffer.from('33I'));
    }

    setInput(input) {
        if (isNaN(Number(input)))
            return new Promise((resolve, reject) => reject({error: input + ' is not a number !!!!'}));
        input = Number(input);
        if ( input > 0 && input <= 5 ) 
            this._sock.write(Buffer.from(input + "$\n"));
        else
            return new Promise((resolve, reject) => reject({error: input + ' is not in range 1-5'}));
        return this.state();
    }

    setVolume(vol) {

        if (isNaN(Number(vol)))
            return new Promise((resolve, reject) => reject({error: vol + ' is not a number !!!!'}));
        vol = Number(vol);
        if (vol >= 0 && vol <= 100)
            this._sock.write(Buffer.from(vol + "V"));
        else
            return new Promise((resolve, reject) => reject({error: vol + ' is not in range 0-100'}));
        return this.state();
    }

    volumeUp() {
        this._sock.write(Buffer.from("+V\n"));
        return this.state();
    }
    volumeDown() {
        this._sock.write(Buffer.from("-V\n"));
        return this.state();
    }

    mute() {
        this._sock.write(Buffer.from("1Z\n"));
        return this.state();
    }

    unmute() {
        this._sock.write(Buffer.from("0Z\n"));
        return this.state();
    }
}