import ODCServiceFactoryInterface from "../../core/types/ODCServiceFactoryInterface.mjs";
import ODCServiceInterface from "../../core/types/ODCServiceInterface.mjs";

class ODCResolumeWebsocketService extends ODCServiceInterface{
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

class ODCResolumeWebsocketServiceFactory extends ODCServiceFactoryInterface{
    constructor(){

    }
    create(){
        return new ODCResolumeWebsocketService();
    }
}

export {ODCResolumeWebsocketServiceFactory, ODCResolumeWebsocketService};