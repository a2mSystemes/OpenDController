import { isObject } from 'core-js/core/object';
import ProjectorState from './ODCProjectorState.mjs'

const maxRetries = 5;
// PJLINK commands

// POWER QUERY
// %1POWR ?

// INPUT QUERY
// %1INPT ?
// RESP 
// %1INPT=OK

// INPUT VGA 
// %1INPT 11
// INPUT VIDEO 
// %1INPT 21
// INPUT HDMI 1 
// %1INPT 31
// INPUT HDMI 2
// %1INPT 32


class RxProjector{
    
    url;
    port;
    _password;
    _name = null;
    _manufacturer = null;
    _model = null;
    _info = null;
    _class = null;
    _initialized = false;
    _power_state = null;
    _input_state = null;
    state;
    _rxIO

    constructor(url, password, cb = () => {}, port = 4352) {
        this._rxIO = new IO();
        console.log('MyProj created')
        super(ip, password, cb, port);
        this.state = new ProjectorState();
        this.initProj();
    }

    initProj(){
        this.state.model = this.model;
        this.state.vendor = this._manufacturer;
        this.state.info = this._info;
        this.state.Class = this._class;
        this.state.ip = this.url;
        this.getPower().then((pwr) => {
            this.state.powerState = pwr;
            return this.getInput()
        }).then((input) => {
            this.state.input = input;
        });
    }

    getState(){
        this.getPower().then((pwr) => {
            this.state.powerState = pwr;
            console.log(this.state);
            return this.getInput()
        }).then((input) => {
            this.state.input = input;
            console.log(this.state);
            return this.state
        });
    }



   

    get name() {
        return this._name;
    }

    get manufacturer() {
        return this._manufacturer;
    }

    get model() {
        return this._model;
    }

    get auxInfo() {
        return this._info;
    }

    get url(){
        return this.url;
    }

    _killSocket(socket) {}


    async _sendCmd(cmd, arg, retry, err) {}

    async power(state) {}

    async getPower() {}

    async getInput() {}

    async input(type) {}

}