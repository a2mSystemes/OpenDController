class ODCException extends Error{
    constructor(message, name="ODC unknown error"){
        super(message);
        this.name = name;    
    }
}
export default ODCException;