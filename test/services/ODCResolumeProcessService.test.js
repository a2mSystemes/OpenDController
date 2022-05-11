import test from "ava";
import { ChildProcess } from "child_process";
import { EventEmitter } from "events";
import fs from "fs";

import path from "path";
import { PLAYBACK_STATUS, SERVICE_TYPE } from "../../src/core/constants/ODCConstants.mjs";
import ODCServiceFactoryInterface from "../../src/core/types/ODCServiceFactoryInterface.mjs";
import ODCServiceInterface from "../../src/core/types/ODCServiceInterface.mjs";
import { scanIsRunning, sleep } from "../../src/core/utils/ODCUtils.mjs";
import { ODCResolumeProcessService, ODCResolumeProcessServiceFactory, ResolumeState } from "../../src/services/ResolumeService/ODCResolumeProcessService.mjs";



test.before('verifying running instances of resolume Arena', async t => {
    // suppose resolume is installed in the default location
    t.log("only working on WINDOWS for now");
    let arena = process.platform === 'win32' ? 'Arena.exe' :  (process.platform === 'darwin' ? 'unknown' : undefined );
    //TODO implement Arena service available only on Windows and linux
    t.context.canRun = arena !== undefined ? true : false;
    await scanIsRunning('Arena.exe').then((running) => {
        if(running){
            // close Arena for now just exit
        t.log("CLOSE ARENA BEFORE TESTING");
        t.fail("CLOSE ARENA BEFORE TESTING");
        }
    });
});

const factory = new ODCResolumeProcessServiceFactory();
let service = undefined
// ServiceFactories and Services are tested together
test.serial('ODCResolumeProcessServiceFactory() test instantiation:', t => {
    t.plan(2)
    t.true(factory instanceof ODCResolumeProcessServiceFactory);
    t.true(factory instanceof ODCServiceFactoryInterface);
});

test.serial('ODCResolumeProcessServiceFactory() service creation:', async t => {
    t.plan(3)
    service = factory.create();
    t.true(service instanceof ODCResolumeProcessService);
    t.true(service instanceof ODCServiceInterface);
    t.true(service instanceof EventEmitter);
});

test.serial('ODCResolumeProcessServiceType() init tests:', async t => {
    t.plan(5)
    service.getServiceType().then(type => {
        t.is(type, SERVICE_TYPE.PLAYBACK_SERVICE)
    });
    t.is(service.pid, -1);
    t.is(service.selectedCompo, 0);
    await service.getState()
        .then(state => {t.true(state instanceof ResolumeState); return state;})
        .then(state => { t.is(state.status, PLAYBACK_STATUS.NOT_READY); return state;})
        .catch(err => t.log(err));

});

test.serial('connect() test :', async t => {
    t.timeout(5100, "process is toot long to start");
    t.plan(2)
    await service.connect()
            .then( async service => {
                await service.isConnected()
                .then(connected => {t.is(connected, false); return connected;});
                t.is(service.state.status, PLAYBACK_STATUS.READY)
            })
            .catch(err => t.log(err));   
});

test.serial('check Composition handle test :', async t => {
    t.timeout(2500);
    t.plan(4)
    let folder = null;
    service.getRoot().then(r => folder = r);
    service.setRoot(path.resolve('./test/bin-test'));
    await service.getRoot().then(root => t.is( root, path.resolve('./test/bin-test')))
    await service.scanRoot().then(async r => {
        await service.getCompos().then(files => {
            t.deepEqual(files, ["test1.avc", "test2.avc", "test3.avc"]);
        }).catch(err => t.log(err));
    }).catch(err => t.log(err));

    await fs.promises.rename( path.resolve(service.compoRoot, "test1.avc"), 
                                path.resolve(service.compoRoot, '../test1.avc'))
                        .then(async r => {
                                await service.getCompos()
                                    .then( files => t.deepEqual(files, ["test2.avc", "test3.avc"]) );
                                return r;
                })
                .catch((err) => t.log(`ERROR in rename : ${err}`))
                .finally(async () => {
                await fs.promises
                .rename( path.resolve(service.compoRoot, '../test1.avc'), 
                            path.resolve(service.compoRoot, "test1.avc"))
                    .then(r => {t.log("cleaning up OK !!!")})
                    .catch(err => {
                    t.log("error while cleaning", err)
                });
        });
    await service.setRoot(folder).then( async r => {
        await service.getRoot().then(r => t.is(r, path.join("c:", "Users", "a-mma","OneDrive", "Dokumente", "Resolume Arena", "Compositions")));
    });
});




// test('changeSelectedCompo() should restart resolume', async t => {
//     let pid = service.pid;
//     t.timeout(7000);
//     await service.configure('selectedCompo', 5);
//     t.is(service.pid, pid);
// });

