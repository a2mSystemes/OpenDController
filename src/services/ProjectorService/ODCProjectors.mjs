import Projector from "./ODCPjlinkService.mjs";

export default class Projectors{

    _projectors = new Array();

    constructor(config) {
        console.log('construct projectors with ', config);
        let projectors = config;
        projectors.forEach(proj => {
            console.log(proj);
            this.addProjector(proj);
             });
    };

    addProjector(ip){
        this._projectors.push(new Projector(ip));
    }

    getPower(projId){
        if(projId !== undefined && projId > 0 && projId <= this._projectors.length){
            projId--;
            console.log('projId = ', projId);
        }
        else{
            console.log('Projector ID does not exists');
            return new Promise((resolve, reject) => reject({error : 'Projector ID does not exists ' + projId}));
        }
        return this._projectors[projId].getPower();
    }

    powerOn(projId){
        if(projId !== undefined && projId > 0 && projId <= this._projectors.length){
            projId--;
            console.log('projId = ', projId);
        }
        else{
            console.log('Projector ID does not exists');
            return new Promise((resolve, reject) => reject({error : 'Projector ID does not exists ' + projId}));
        }
        return this._projectors[projId].power('on')
    }

    powerOff(projId){
        if(projId !== undefined && projId > 0 && projId <= this._projectors.length){
            projId--;
            console.log('projId = ', projId);
        }
        else{
            console.log('Projector ID does not exists');
            return new Promise((resolve, reject) => reject({error : 'Projector ID does not exists ' + projId}));
        }
        return this._projectors[projId].power('off')
    }

    allOn(){
        this._projectors.forEach((proj) => proj.power('on') );
        return new Promise((resolve, reject) =>{
            resolve({Message : 'ALL ON OK'})
            }
        );
    }

    allOff(){
        this._projectors.forEach((proj) => proj.power('off') );
        return new Promise((resolve, reject) =>{
            resolve({Message : 'ALL OFF OK'})
            }
        );
    }

    getInput(projId){
        if(projId !== undefined && projId > 0 && projId <= this._projectors.length){
            projId--;
            console.log('projId = ', projId);
        }
        else{
            console.log('Projector ID does not exists');
            return new Promise((resolve, reject) => reject({error : 'Projector ID does not exists ' + projId}));
        }
        return this._projectors[projId].getInput();
    }

    setInput(projId, input){
        if(projId !== undefined && projId > 0 && projId <= this._projectors.length){
            projId--;
            console.log('projId = ', projId);
        }
        else{
            console.log('Projector ID does not exists');
            return new Promise((resolve, reject) => reject({error : 'Projector ID does not exists ' + projId}));
        }
        let inpt = input.toLowerCase();
        console.log('inpt = ', inpt);
            switch (inpt) {
                case 'video':
                case 'pal':
                case 'composite':
                    inpt = 'video';
                    break;
                case 'vga':
                case 'rgb':
                case 'rvb':
                    inpt = 'RGB';
                    break;
                case 'hdmi1':
                    inpt = 'hdmi1';
                    break;
                case 'hdmi2':
                    inpt = 'hdmi2';
                    break;
                default:
                    return new Promise((resolve, reject) => reject('Unknown input'));
            }
            return this._projectors[projId].input(inpt.toUpperCase());
    }
}