import { Subject, BehaviorSubject, Observable } from "rxjs";

export default class ODCSerialDataReader {

    _responseObservable;
    _listener;
    _storage = '';
    delimiter = 0x0a;
    _helpDelimiter = 0x29;
    _helpMessageIncoming;
    _errorMessageIncoming;
    _tmdsMessage;

    constructor(listener){
        this.tmds 
        this._helpMessageIncoming = new BehaviorSubject(false);
        this._errorMessageIncoming = false;
        this._tmdsMessage = false;
        listener.on('data', (data) => {
            this._handleData(data)

        });
        this._responseObservable = new Subject();
    }

    getReadyObserver(){
        return this._helpMessageIncoming.asObservable();
    }

    dataAvailable(){
        return this._responseObservable.asObservable()
    }

    observe(){
        return new Observable(subscriber => {
            subscriber.next(this._storage);
            subscriber.complete();
        });
    }

    sendResponse(){
        // console.log('sendResponse');
        this._responseObservable.next(this._storage);
        // clear response
        this._storage = '';
    }

    _handleData(data){
        if (data){
            let storageToClear = false;
            let ret = this._storage;
            for (let b of data){
                ret += String.fromCharCode(b);
            }
            // we are getting a help message
            if(this._helpMessageIncoming.getValue()){
                // end of help message
                if(ret.endsWith(')\n')){
                    storageToClear = true;
                    this._helpMessageIncoming.next(false);
                }
            }
            if(this._errorMessageIncoming){
                // end of help message
                if(ret.endsWith('?')){
                    storageToClear = true;
                    this._errorMessageIncoming = false;
                }
            }
            // console.log(ret);
            else if(ret === 'OK'){
                storageToClear = true;
            }
            else if (ret === '\nComm'){
                this._helpMessageIncoming.next(true);
            }
            // video port query
            else if (ret.endsWith('Connected')){
                storageToClear = true;
            }
            else if(ret === 'Unknown command'){
                this._errorMessageIncoming = true;
                // TODO: error received command
            }
            else if(ret === 'TMDS ON' || ret === 'TMDS OFF'){
                storageToClear = true;
            }

            this._storage = ret;
            if(storageToClear){
                this.sendResponse();
                //send the 
            }
        }
        //     if(this._helpMessageIncoming.getValue()){
        //         for(let b of data){
        //             this._storage.substring(this._storage.length -2 )
        //             if( this._storage.substring(this._storage.length -2 ) === ')\n'){
        //                 this._responseObservable.next(this._storage);

        //             }
        //         }
        //     }else{
        //         for(let b of data){
        //             let c = String.fromCharCode(b);
        //             if(c !== 'K' && c !== 'd' && c !== 'N'){ // normal data
        //                 this._storage += c;
        //             }
        //             else{
        //                 if(c !== '\n'){
        //                     this._storage += c;
        //                 }else{
        //                     return;
        //                 }
        //                 this._responseObservable.next(this._storage);
        //                 this._storage = '';
        //             }
        //         }
        //     }

        // }
    }


}