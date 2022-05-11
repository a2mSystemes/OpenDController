import ODCInterfaceException from './ODCInterfaceException.mjs'

class ODCServiceFactoryInterface{
    constructor(){
            if(!this.create){
            throw new ODCInterfaceException("a service factory MUST HAVE a create() method");
        }
    }
}
export default ODCServiceFactoryInterface;
