import ODCException from "./ODCException.mjs";

class ODCInterfaceException extends ODCException{
    constructor(message){
        super(message,);
        this.name = "ODCInterfaceException"; 
    }
}

export default ODCInterfaceException;