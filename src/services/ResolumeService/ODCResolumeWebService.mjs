import ODCServiceFactoryInterface from "../../core/types/ODCServiceFactoryInterface.mjs";
import ODCServiceInterface from "../../core/types/ODCServiceInterface.mjs";

class ODCResolumeWebService extends ODCServiceInterface{
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

class ODCResolumeWebServiceFactory extends ODCServiceFactoryInterface{
    constructor(){
        super();
    }
    create(){
        return new ODCResolumeWebService();
    }
}

export {ODCResolumeWebServiceFactory, ODCResolumeWebService};