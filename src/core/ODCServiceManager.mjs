
export default class ODCServiceManager{

    
    constructor(){
        this.services = {};
    }

    addService(name, service){
        // console.log(`adding service ${name} with object ${service}`);
        this.services[name] = service;
    }

    getService(service, app){
        if(this.services.hasOwnProperty(service) ){
            // console.log('getting service : ', service)
            return this.services[service];
        }
    }

    listServices(){
        for(let service in this.services){
            console.log(service, ' :');
            console.log(this.services[service]);
        }
    }

    getServices(){
        return this.services;
    }
}

