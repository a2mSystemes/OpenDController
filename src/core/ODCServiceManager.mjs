
export default class ODCServiceManager{

    
    constructor(){
        this.services = {};
    }

    addService(name, service){
        if(service === 'Projector')
            console.log(service.getUrl());
        this.services[name] = service;
    }

    getService(service, app){
        if(this.services.hasOwnProperty(service) ){
            // console.log('getting service : ', service)
            return this.services[service];
        }
    }

    listServices(){
        for(var service in this.services){
            console.log(service, ' :');
            console.log(this.services[service]);
        }
    }
}

