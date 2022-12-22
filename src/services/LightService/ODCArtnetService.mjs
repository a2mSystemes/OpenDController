
import Artnet from 'artnet';

export default class ArtnetLight{

    _address = null;
    _port = null;
    _artnet = null;

    constructor(address = null, port= null) {
        this._address = address;
        this._port = port;
        this._artnet = new Artnet(this._address, this._port);
    };


// needs protection against 0-512 range
    on(channel = 1, universe = 1) {
        let ret = null;
        
        return new Promise((resolve, reject) => {
            this._artnet.set(universe, channel, 255, (err, res) => {
                const r = {
                    done: false, response: '', 
                    value: `universe:${universe}, channel:${channel}, value:255`, 
                    from:"ArtnetService"
                }
                if (err !== null){
                    r.response = {status: 'SUCCESS', responseCode: e};
                    reject(r);
                }
                if (res === null && err === null){
                    r.response = {status: 'NO CHANGES', responseCode: '21 no changes'};
                    resolve(r);
                }else{
                    r.response = {status: 'SUCCESS', responseCode: res};
                    resolve({status: 'SUCCESS', responseCode: res});
                }
            });
        });
    }

    // needs protection against 0-512 range
        off(channel = 1, universe = 1) {
            return new Promise((resolve, reject) => {
            this._artnet.set(universe, channel, 0, (err, res) =>{
                const r = {
                    done: false, response: '', 
                    value: `universe:${universe}, channel:${channel}, value:0`, 

                    from:"ArtnetService"
                }
                if (err !== null){
                    r.response = {status: 'SUCCESS', responseCode: e};
                    reject(r);
                }
                if (res === null && err === null){
                    r.response = {status: 'NO CHANGES', responseCode: '21 no changes'};
                    resolve(r);
                }else{
                    r.response = {status: 'SUCCESS', responseCode: res};
                    resolve({status: 'SUCCESS', responseCode: res});
                }
            })
        });
    }

        send(universe, channel, value){
            return new Promise((resolve, reject) => {
            this._artnet.set(Number(universe), Number(channel), Number(value), (err, res) => {
                const r = {
                    done: false, response: '', 
                    value: `universe:${universe}, channel:${channel}, value:${value}`, 
                    from:"ArtnetService"
                }
                if (err !== null){
                    r.response = {status: 'SUCCESS', responseCode: e};
                    reject(r);
                }
                if (res === null && err === null){
                    r.response = {status: 'NO CHANGES', responseCode: '21 no changes'};
                    resolve(r);
                }else{
                    r.response = {status: 'SUCCESS', responseCode: res};
                    resolve({status: 'SUCCESS', responseCode: res});
                }
            });
        });
    }
}