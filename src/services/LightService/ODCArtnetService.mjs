
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
        this._artnet.set(universe, channel, 255, (err, res) => 
        ret = new Promise((resolve, reject) => {
            if (err !== null) 
                reject({error: e});
            if (res === null && err === null)
                resolve({status: 'NO CHANGES', responseCode: '21 no changes'});
            else
            {
                console.log('resolving final');
                resolve({status: 'SUCCESS', responseCode: res});
            }
        }));
        return new Promise(resolve => setTimeout(()=> resolve(ret), 5));
    }

// needs protection against 0-512 range
    off(channel = 1, universe = 1) {
        let ret = null;
        this._artnet.set(universe, channel, 0, (err, res) => 
        ret = new Promise((resolve, reject) => {
            if (err !== null) 
                reject({error: e});
            if (res === null && err === null)
                resolve({status: 'NO CHANGES', responseCode: '21 no changes'});
            else
            {
                console.log('resolving final');
                resolve({status: 'SUCCESS', responseCode: res});
            }
        }));
        return new Promise(resolve => setTimeout(()=> resolve(ret), 5));
    }

    send(universe, channel, value){
        let ret = null;
        this._artnet.set(Number(universe), Number(channel), Number(value), (err, res) => {
            ret = new Promise((resolve, reject) => {
                if (err !== null) 
                    reject({error: e});
                if (res === null && err === null)
                    resolve({status: 'NO CHANGES', responseCode: '21 no changes'});
                else
                {
                    console.log('resolving final');
                    resolve({status: 'SUCCESS', responseCode: res});
                }
            });
        });
        return new Promise(resolve => setTimeout(()=> resolve(ret), 5));
    }
}