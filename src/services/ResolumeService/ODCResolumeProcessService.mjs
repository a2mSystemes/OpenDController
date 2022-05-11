import path from "path";
import { PLAYBACK_STATUS, SERVICE_TYPE } from "../../core/constants/ODCConstants.mjs";
import ODCServiceFactoryInterface from "../../core/types/ODCServiceFactoryInterface.mjs";
import ODCServiceInterface from "../../core/types/ODCServiceInterface.mjs";
import fs from 'fs';
import { spawn } from "child_process";
import find from 'find-process';
import { sleep } from "../../core/utils/ODCUtils.mjs";

class ResolumeState{
    constructor(){
        this.started = false;
        this.currentCompo = "";
        this.status =  PLAYBACK_STATUS.NOT_READY;
    }
}


class ODCResolumeProcessService extends ODCServiceInterface{
    constructor(){
        super();
        this.serviceType = SERVICE_TYPE.PLAYBACK_SERVICE;
        this.resolumePath = path.join("c:", "Program Files", "Resolume Arena", "Arena.exe");
        this.compoRoot = path.join("c:", "Users", "a-mma","OneDrive", "Dokumente", "Resolume Arena", "Compositions");
        this.state = new ResolumeState();
        this.availableCompos = [];
        this.selectedCompo = 0;
        this.connected = false;
        this.pid = -1;
        this.init();
    }


    async init(){
        return new Promise(async resolve => {
            await this.scanRoot();
            resolve()
        }).catch(err => reject());
    }

    // to be in the interface
    async getRoot(){
        return new Promise(resolve => resolve(this.compoRoot));
    }

    // to be in the interface
    async setRoot(dir){
        this.compoRoot = dir;
        await this.scanRoot();
        return await this.getRoot()
    }


    // to be in the interface
    async setSelected(selection){
        return new Promise((resolve, reject) => {
            this.getCompos()
                .then(composArray => {
                    if(selection -1 >= composArray.length){
                        reject('Selection does not exists');
                        //****TODO**** add this in event doc
                        this.emit('compo-error', new Error(`ODCResolumeProcessService.setSelected() : Selection ${selection} does not exists`))
                    }
                    else{
                        resolve(composArray[selection -1]);
                    }
                })
                .catch(err => {
                    
                })
        })
    }

    async getCompos(){
        await this.scanRoot();
        return new Promise(resolve => resolve(this.availableCompos));
    }

    // to be in the interface
    async getSelected(){
        return new Promise(resolve => 
                    {
                        if (this.compoRoot === undefined)
                            reject(`this.compoRoot = ${this.compoRoot}`);
                        if (this.availableCompos == [])
                            reject(`no files resolume files avialable`)
                        resolve( path.resolve( this.compoRoot, this.availableCompos[this.selectedCompo]));
                    }).then(() => console.log("*******************GETSELECTED"));
    }
    // to be in the interface
   async scanRoot(){
        return new Promise( async (resolve, reject) => {
            await fs.promises.readdir(path.resolve(this.compoRoot),)
                        .then( async files => {
                            this.availableCompos = []
                            //filter only .avc extensions
                            files.forEach(file => {
                                if(path.extname(file) === '.avc')
                                    this.availableCompos.push(file);
                            });
                            resolve();
                        })
                        .catch(err => {
                            this.emit('error', 
                                `enable to scan the folder ${path.resolve(this.compoRoot)}`);
                            reject();
                        });
        });
    }

   async weHaveCompos(){
        return new Promise(async (resolve, reject) => {
                    await this.scanRoot()
                        .then(compos => resolve(compos.length > 0))
                        .catch(err => {
                            this.emit('error', 'ODCResolumeProcessService.weHaveCompos() unable to guess if we have');
                            reject(false);
                        });
                    }
                );       
    }

    getServiceType(){
        return new Promise(resolve => resolve(this.serviceType));
    }

    getState(){
        return new Promise((resolve, reject) => {
            resolve(this.state)
        });
    }

    async sendCommand(cmd){
        return new Promise((resolve, reject) => {
            // TODO for now just emulate ping
            resolve(cmd);
        })
    }

    async connectWebAPI(){
        return new Promise((resolve, reject) => {
            // TODO for now just return true
            resolve(false);
        })
    }

    async connect(){
        return new Promise((resolveConnect, rejectConnect) => {
                    var arena = 
                    new Promise( async (resolve, reject) => {
                        let proc = spawn(this.resolumePath, 
                                        [this.selectedCompo], {detached: true});
                        // reject the promise if err
                        proc.on('error', err =>reject(err))
                        await sleep(10);
                        resolve(proc);
                    })
                    .then(proc => {
                        this.pid = pid;
                        this.state.status = PLAYBACK_STATUS.IDLE;
                        return proc;
                    })
                    .then(proc => proc.unref())
                    .catch(err => {
                        this.emit('error', err);
                        this.state.status = PLAYBACK_STATUS.NOT_READY;
                        rejectConnect(err);
                    });
                this.connected = false;
                //pause to wait start up and then connect to the API
                if (this.connectWebAPI()){
                    this.state.status = PLAYBACK_STATUS.READY;
                    this.connectWebAPI()
                        .then(connected => {this.connected = connected; return connected;})
                        .then(connected => this.emit('connected', this.state))
                        .catch(err => {
                            this.emit('error', "connection to the resolume WebAPI has failed" + err);
                            rejectConnect(err);
                        });
                }
                resolveConnect(this);
        });
    }

    async disconnect(){
        process.kill(this.pid);
        find('pid', this.pid).then((list) => {
            if(list.length === 0){
                this.connected = false;
                this.pid = -1;
                this.emit('disconnected', this.state);
            }else{
                this.emit('error', `could not close resolume process with pid ${this.pid}`);
            }
        }, (err) => {
            // console.log(err);
        });
        await sleep(1000);
 
    }
    restart(){
        this.emit(this.restart);
    }
    async isConnected(){
        return new Promise(resolve => resolve(this.connected));
    }

    async configure(key, config){
        let selected = config--;
        if(key === "selectedCompo" ){
            if(typeof config === 'number' & selected <= 0 | selected >= this.availableCompos.length - 1){
                // console.log(`new selected compo ${this.availableCompos[config]}`);
                this.selectedCompo = config;
                this.sendCommand('restart');
            }
        }
    }
    help(){
        
    }
    update(){
        
    }
    run(){
        
    }
}

class ODCResolumeProcessServiceFactory extends ODCServiceFactoryInterface{
    constructor(){
        super();
    }
    create(){
        return new ODCResolumeProcessService();
    }
}

export {ODCResolumeProcessService, ODCResolumeProcessServiceFactory, ResolumeState};