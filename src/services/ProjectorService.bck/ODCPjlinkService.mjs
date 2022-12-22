import net from 'net';
import crypto from 'crypto';
import { error } from 'console';
import { buffer } from 'stream/consumers';


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

export default class Projector {

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

    constructor(url, password, cb = () => {}, port = 4352) {
        this.url = url;
        console.log(this.url);
        if (port == undefined) {
            this.port = defaultPort;
        } else this.port = port;

        this._password = password;

        this._sendCmd('NAME', '?')
            .then((name) => {
                this._name = name;
                // console.log('name: ' + name);
                return this._sendCmd('INF1', '?');
            })
            .then((man) => {
                this._manufacturer = man;
                // console.log('manufacturer ', man);
                return this._sendCmd('INF2', '?');
            })
            .then((model) => {
                this._model = model;
                // console.log('model ', model);
                return this._sendCmd('INFO', '?');
            })
            .then((info) => {
                this._info = info;
                // console.log('info ', info);
                return this._sendCmd('CLSS', '?');
            })
            .then((clas) => {
                this._class = clas;
                // console.log('class ', clas);
                this._initialized = true;
                if (cb) cb();
            })
            .catch((err) => {
                console.error('Projector initialization error:' + JSON.stringify(err));
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

    _killSocket(socket) {
        return new Promise((res, rej) => {
            // console.log('Socket killing');
            if (socket) {
                let ended = false;
                socket.on('close', () => {
                    //console.log('Socket closed');
                    ended = true;
                    res();
                });
                socket.end();
                setTimeout(() => {
                    socket.removeAllListeners();
                    if (!ended) {
                        socket.destroy();
                        rej('Projector failed to close socket');
                    }
                }, 200);
            }
        });
    }


    async _sendCmd(cmd, arg, retry, err) {
        // if (cmd == 'INPT') console.log(cmd + ' ' + arg);
        if (!retry) retry = 0;
        return new Promise(async(res, rej) => {
            if (retry > maxRetries) {
                rej(err);
                return;
            }
            let query = false;
            if (arg == '?') query = true;
            const argString = arg == '?' ? '?' : arg.toString();
            let ending = false;
            let socket = new net.Socket();

            socket.on('data', (buf) => {
                console.log(buf.toString())
                if (buf.slice(0, 8).toString() == 'pjlink 0') {
                    socket.write(Buffer.from('%1' + cmd + ' ' + argString + '\r'));
                } else {
                    ending = true;
                    this._killSocket(socket)
                        .then(() => {
                            if (buf.slice(0, 7).toString() == '%1' + cmd + '=') {
                                if (!query) {
                                    if (buf.slice(7, 9).toString() == 'OK') {
                                        res(cmd + " cmd OK in " + retry + " attempt(s)");
                                    } else {
                                        this._sendCmd(cmd, arg, retry + 1, 'Projector returned error: ' + buf.slice(7).toString())
                                            .then((rtn) => {
                                                res(rtn);
                                            })
                                            .catch(rej);
                                    }
                                } else res(buf.slice(7).toString());
                            } else
                                this._sendCmd(
                                    cmd,
                                    arg,
                                    retry + 1,
                                    'Unexpected answer from projector'
                                )
                                .then((rtn) => {
                                    res(rtn);
                                })
                                .catch(rej);
                        })
                        .catch(rej);
                }
            });
            socket.on('error', (err) => {
                console.error('Projector socket error: ' + JSON.stringify(err));
            });
            socket.connect(this.port, this.url);
            setTimeout(() => {
                if (!ending) {
                    this._killSocket(socket)
                        .then(() => {
                            this._sendCmd(
                                    cmd,
                                    arg,
                                    retry + 1,
                                    'Failed command to projector'
                                )
                                .then((rtn) => {
                                    res(rtn);
                                })
                                .catch(rej);
                        })
                        .catch(() => {
                            this._sendCmd(
                                    cmd,
                                    arg,
                                    retry + 1,
                                    'Failed command to projector, failed to close socket, command: %1' +
                                    cmd +
                                    ' ' +
                                    arg.toString()
                                )
                                .then((rtn) => {
                                    res(rtn);
                                })
                                .catch(rej);
                        });
                }
            }, 3000);
        });
    }

    async power(state) {
        state = state.toLowerCase();

        switch (state) {
            case 'on':
                this._sendCmd('POWR', 1).then((ret) => {
                    console.log(ret);
                    return ret;
                }).catch((err)=> {console.log(err)});
                break;
            case 'off':
                this._sendCmd('POWR', 0).then((ret) => {
                    console.log(ret);
                    return ret;
                }).catch((err)=> {console.log(err)});
                break;
            default:
                return new Promise((res, rej) => {
                    rej('Invalid power command');
                });
        }
    }

    async getPower() {
        return new Promise((res, rej) => {
            this._sendCmd('POWR', '?')
                .then((val) => {
                    switch (val.slice(0, -1)) {
                        case '0':
                            res('off');
                            break;
                        case '1':
                            res('on');
                            break;
                        case '2':
                            res('cooling');
                            break;
                        case '3':
                            res('warm-up');
                            break;
                        default:
                            rej(val.slice(0, -1));
                    }
                })
                .catch(rej);
        });
    }

    async getInput() {
        return new Promise((res, rej) => {
            this._sendCmd('INPT', '?')
                .then((rtn) => {
                    // console.log('received in get ' + rtn);
                    switch (rtn.slice(0, 1)) {
                        case '1':
                            res('RGB ' + rtn.slice(1, 2));
                            break;
                        case '2':
                            res('Video ' + rtn.slice(1, 2));
                            break;
                        case '3':
                            res('Digital ' + rtn.slice(1, 2));
                            break;
                        case '4':
                            res('Storage ' + rtn.slice(1, 2));
                            break;
                        case '5':
                            res('Network ' + rtn.slice(1, 2));
                            break;
                        default:
                            res('Unknown Input: ' + rtn);
                            break;
                    }
                })
                .catch(rej);
        });
    }

    async input(type) {
        let inpt = 0;
        switch (type) {
            case 'RGB':
                inpt = 11;
                break;
            case 'VIDEO':
                inpt = 21;
                break;
            case 'HDMI1':
                inpt = 31;
                break;
            case 'HDMI2':
                inpt = 32;
                break;
            default:
                inpt = 31;
                break;
        }
        return new Promise((res, rej) => {
            // console.log('about to change input to ' + type + ' ' + inpt);
            this._sendCmd('INPT', inpt)
                .then( () => this.getInput()
                .then( (input) => res(input) ) )
                .catch((err) => {
                    if (err == 'Projector returned error: ERR2\r') {
                        rej('Input ' + type + ' ' + number + ' does not exist');
                    } else rej(err);
                });
        });
    }
}