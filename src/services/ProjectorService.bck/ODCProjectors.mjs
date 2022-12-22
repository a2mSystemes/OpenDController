

export default class Projectors{
    _projectors = [];

    constructor(config) {
        for (let ip of config){
            this.addProjector(ip);
        }
    };
    addProjector(ip){
        this._projectors.push(new MyPorj(ip));
    }

    async getPower(projId){
        let proj = this._projectors[--projId];
        if (proj === undefined){
            throw new Error('Projector ID does not exists ' + projId);
        }
        proj.state.command = 'powerOn';
        await proj.getPower.then(async (res) => {
            proj.state.response = res;
            proj.state.hasError = false;
            return await proj.getState();
        }).catch((err) => {
            proj.state.response = err;
        });
    }

    async powerOn(projId){
        let proj = this._projectors[--projId];
        if (proj === undefined){
            throw new Error('Projector ID does not exists ' + projId);
        }
        proj.state.command = 'powerOn';
        await proj.power('on').then(async (res) => {
            proj.state.response = res;
            proj.state.hasError = false;
            let s = await proj.getState();
            console.log(s)
            return s;
        }).catch((err) => {
            proj.state.response = err;
        });
    }

    async powerOff(projId){
        let proj = this._projectors[--projId];
        if (proj === undefined){
            throw new Error('Projector ID does not exists ' + projId);
        }
        proj.state.command = 'powerOff';
        await proj.power('off').then(async (res) => {
            proj.state.response = res;
            proj.state.hasError = false;
            let s = await proj.getState();
            console.log(s)
            return s;
        }).catch((err) => {
            proj.state.response = err;
        });
    }

    async allOn(){
        const states = []; //
        for (let proj of this._projectors){
            let projState = proj.state;
            projState.command = 'allOn';
            proj.power('on').then((resp) => {
                projState.response = resp;
                projState.hasError = false;
                proj.getState().then((state) => states.push(state));
            }).catch((err) => {
                projState.response = err;
                proj.getState().then((state) => states.push(state));
            })
        }
        return new Promise((resolve) => states);
    }

    async allOff(){
        const states = []; //
        for (let proj of this._projectors){
            let projState = proj.state;
            projState.command = 'allOff';
            proj.power('off').then((resp) => {
                projState.response = resp;
                projState.hasError = false;
                proj.getState().then((state) => states.push(state));
            }).catch((err) => {
                projState.response = err;
                proj.getState().then((state) => states.push(state));
            })
        }
        return new Promise((resolve) => states);
    }

    async getInput(projId){
        let proj = this._projectors[--projId];
        let projState = proj.state;
        if (proj === undefined){
            throw new Error('Projector ID does not exists ' + projId);
        }
        projState.command = 'getInput';
        proj.getInput((input) => {
            projState.hasError = false;
            projState.response = input;
            return proj.getState();
        }).catch((err) => {
            projState.response = err;
            return proj.getState();
        });
    }

    async setInput(projId, input){
        let proj = this._projectors[--projId];
        if (proj === undefined){
            throw new Error('Projector ID does not exists ' + projId);
        }
        projState = proj.state;
        projState.command = 'powerOn';

        let inpt = input.toLowerCase();
        let number = 1;
            switch (inpt) {
                case 'video':
                case 'pal':
                case 'composite':
                    inpt = 'Video';
                    break;
                case 'vga':
                case 'rgb':
                case 'rvb':
                    inpt = 'RGB';
                    break;
                case 'hdmi1':
                    inpt = 'Digital';
                    break;
                case 'hdmi2':
                    inpt = 'Digital';
                    number = 2;
                    break;
                default:
                    projState.response = `unknown input ${input}`
                    proj.getState((state) => {
                        return new Promise((resolve, reject) => reject(state));
                    });
            }
            proj.input(inpt, number).then((res) => {
                projState.response = res;
                projState.hasError = false;
                return proj.getState();
            }).catch((err) => {
                projState.response = err;
                return proj.getState();

            });

    }
}