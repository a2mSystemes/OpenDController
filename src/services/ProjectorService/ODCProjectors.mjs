import Projector from "./ODCPjlinkService.mjs";

export default class Projectors{

    _projectors = [];

    constructor(config) {
        for (let ip of config){
            this.addProjector(ip);
        }
    };

    addProjector(ip){
        this._projectors.push(new Projector(ip));
    }

    getPower(projId){
        if(projId !== undefined && projId > 0 && projId <= this._projectors.length){
            projId--;
            // console.log('projId = ', projId);
        }
        else{
            throw new Error('Projector ID does not exists ' + projId);
        }
        return this._projectors[projId].getPower();
    }

    powerOn(projId){
        if(projId !== undefined && projId > 0 && projId <= this._projectors.length){
            projId--;
            // console.log('projId = ', projId);
        }
        else{
            throw new Error('Projector ID does not exists ' + projId);
        }
        return this._projectors[projId].power('on')
    }

    powerOff(projId){
        if(projId !== undefined && projId > 0 && projId <= this._projectors.length){
            projId--;
            // console.log('projId = ', projId);
        }
        else{
            throw new Error('Projector ID does not exists ' + projId);
        }
        return this._projectors[projId].power('off')
    }

    async allOn(){
        this._projectors.forEach((proj) => proj.power('on') );
        return new Promise((resolve, reject) =>{
            resolve({Message : 'ALL ON OK'})
            }
        );
    }

    async allOff(){
        this._projectors.forEach((proj) => proj.power('off') );
        return new Promise((resolve, reject) =>{
            resolve({Message : 'ALL OFF OK'})
            }
        );
    }

    async getInput(projId){
        if(projId !== undefined && projId > 0 && projId <= this._projectors.length){
            projId--;
            // console.log('projId = ', projId);
        }
        else{
            throw new Error('Projector ID does not exists ' + projId);
        }
        return this._projectors[projId].getInput();
    }

    async setInput(projId, input){
        if(projId !== undefined && projId > 0 && projId <= this._projectors.length){
            projId--;
            // console.log('projId = ', projId);
        }
        else{
            throw new Error('Projector ID does not exists ' + projId);
        }
        let inpt = input.toLowerCase();
        // console.log('inpt = ', inpt);
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