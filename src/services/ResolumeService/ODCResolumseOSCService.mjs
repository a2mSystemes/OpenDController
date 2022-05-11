import ODCServiceFactoryInterface from "../../core/types/ODCServiceFactoryInterface.mjs";
import ODCServiceInterface from "../../core/types/ODCServiceInterface.mjs";

class ODCResolumseOSCService extends ODCServiceInterface{
    constructor(){
        super();
    }
    getServiceType(){

    }
    getState(){

    }
    sendCommand(){

    }
    connect(){

    }
    disconnect(){

    }
    isConnected(){
        
    }
    configure(){
        
    }
    help(){
        
    }
    update(){
        
    }
    run(){
        
    }
}


class ODCResolumseOSCServiceFactory extends ODCServiceFactoryInterface{
    constructor(){
        super();
    }
    create(){
        return new ODCResolumseOSCService();
    }
}

export {ODCResolumseOSCServiceFactory, ODCResolumseOSCService}