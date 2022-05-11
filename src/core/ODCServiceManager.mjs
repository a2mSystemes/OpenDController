import { EventEmitter } from "stream";

class ODCServiceManager extends EventEmitter{
    constructor(){
        this.services = [];
        this.appRef = undefined;
    }
}

export default ODCServiceManager;