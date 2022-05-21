import path, { resolve } from "path";
import { PLAYBACK_STATUS, SERVICE_TYPE } from "../../core/constants/ODCConstants.mjs";
import ODCServiceFactoryInterface from "../../core/types/ODCServiceFactoryInterface.mjs";
import ODCServiceInterface from "../../core/types/ODCServiceInterface.mjs";
import fs from 'fs';
import { spawn } from "child_process";
import { sleep } from "../../core/utils/ODCUtils.mjs";
import { tasklist } from 'tasklist';

class ResolumeState {
    constructor() {
        this.started = false;
        this.currentProject = "";
        this.status = 500;
        this.state = PLAYBACK_STATUS.NOT_READY;
        this.projects = []
    }
}


class ODCResolumeProcessService extends ODCServiceInterface {
    constructor(config = {}) {
        super();
        this.serviceType = SERVICE_TYPE.PLAYBACK_SERVICE;
        this.resolumePath = path.join("c:", "Program Files", "Resolume Arena", "Arena.exe");
        this.projectRoot = path.join("c:", "Users", "a-mma", "OneDrive", "Dokumente", "Resolume Arena", "Compositions");
        this.state = new ResolumeState();
        this.projects = [];
        this.project = 0;
        this.connected = false;
        this.pid = -1;
        this.init();
    }


    async init() {
        await this.scanRoot();
    }


    // to be in the interface
    async getRoot() {
        return new Promise(resolve => resolve(this.projectRoot));
    }

    // to be in the interface
    async setRoot(dir) {
        this.projectRoot = dir;
        await this.scanRoot();
        return await this.getRoot()
    }


    // to be in the interface
    async setSelected(selection) {
        return new Promise((resolve, reject) => {
            this.getCompos()
                .then(composArray => {
                    if (selection - 1 >= composArray.length) {
                        reject('Selection does not exists');
                        //****TODO**** add this in event doc
                        this.emit('compo-error', new Error(`ODCResolumeProcessService.setSelected() : Selection ${selection} does not exists`))
                    } else {
                        resolve(composArray[selection - 1]);
                    }
                })
                .catch(err => {

                })
        })
    }

    async getProjects() {
        await this.scanRoot();
        console.log('getProjects', this.project);
        return new Promise(resolve => resolve(this.projects));
    }

    // to be in the interface
    async getSelected() {
            return new Promise(resolve => {
                if (this.projectRoot === undefined)
                    reject(`this.projectRoot = ${this.projectRoot}`);
                if (this.projects == [])
                    reject(`no files resolume files avialable`)
                resolve(path.resolve(this.projectRoot, this.projects[this.project]));
            }).then(() => console.log("*******************GETSELECTED"));
        }
        // to be in the interface
    async scanRoot() {
        return new Promise(async(resolve, reject) => {
            await fs.promises.readdir(path.resolve(this.projectRoot), )
                .then(async files => {
                    this.projects = []
                        //filter only .avc extensions
                    files.forEach(file => {
                        if (path.extname(file) === '.avc')
                            this.projects.push(file);
                    });
                    resolve();
                })
                .catch(err => {
                    this.emit('error',
                        `not able to scan the folder ${path.resolve(this.projectRoot)}`);
                    reject();
                });
        });
    }

    async weHaveCompos() {
        return new Promise(async(resolve, reject) => {
            await this.scanRoot()
                .then(compos => resolve(compos.length > 0))
                .catch(err => {
                    this.emit('error', 'ODCResolumeProcessService.weHaveCompos() unable to guess if we have');
                    reject(false);
                });
        });
    }

    getServiceType() {
        return new Promise(resolve => resolve(this.serviceType));
    }

    getState() {
        return new Promise((resolve, reject) => {
            resolve(this.state)
        });
    }

    async isStarted() {
        return new Promise(async(resolve, reject) => {
            //check if a resolume process is launched
            await tasklist({ 'filter': ['imagename eq Arena.exe'] }).then(r => {
                console.log('r', r)
                if (r.length === 0) {
                    console.log('NOK');
                    resolve(false);
                } else {
                    console.log('OK');
                    resolve(true);
                }
            }).catch(err => console.log(err));
        })
    }

    async start(file = '') {
        if (file !== '') {
            file = path.resolve(this.projectRoot, file);
        }
        console.log('file', file);
        return new Promise(async(resolveConnect, rejectConnect) => {
            new Promise(async(resolve, reject) => {
                    let proc = spawn(this.resolumePath, [file], { detached: true });
                    // reject the promise if err
                    proc.on('error', err => reject(err))
                    await sleep(10);
                    resolve(proc);
                })
                .then(proc => {
                    this.pid = proc.pid;
                    this.state.status = PLAYBACK_STATUS.IDLE;
                    return proc;
                })
                .then(proc => proc.unref())
                .catch(err => {
                    this.emit('error', err);
                    this.state.status = PLAYBACK_STATUS.NOT_READY;
                    rejectConnect(err);
                    return;
                });
            this.state.status = PLAYBACK_STATUS.READY;
            resolveConnect(this);
        });
    }

    async stop(pid = undefined) {
        let resolumePid;
        if (pid === undefined) {
            resolumePid = this.pid
        } else {
            resolumePid = pid;
        }
        process.kill(resolumePid);
        await sleep(1000);
    }

    async restart() {
        await this.stop().then(async(stopped) => {
            await this.start().then(started => {}).catch((err) => {
                this.emit('error', err);
            })
        }).catch((err) => {
            this.emit('error', err);
        });
    }

    async isConnected() {
        return new Promise(resolve => resolve(this.connected));
    }

}

class ODCResolumeProcessServiceFactory extends ODCServiceFactoryInterface {
    constructor() {
        super();
    }
    create() {
        return new ODCResolumeProcessService();
    }
}

export { ODCResolumeProcessService, ODCResolumeProcessServiceFactory, ResolumeState };