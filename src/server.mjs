import express, { application } from 'express';
import path, { resolve } from 'path';
//hack from https://github.com/nodejs/help/issues/2907 ************************************
/*
 dcjayasuriya2020 commented on 10 Jan 2021
this way it works:
        import path from 'path';
        import { fileURLToPath } from 'url';
        const __filename = fileURLToPath(import.meta.url);
        const __dirname = path.dirname(__filename);
1st get the __filename and then __dirname
both these CommonJs variables are not in ES modules, as per Node.org
we have to replicate with import.meta.url
Source:https://nodejs.org/api/esm.html#esm_no_require_exports_module_exports_filename_dirname
*/
import { fileURLToPath } from 'url';
const __filename = fileURLToPath(
    import.meta.url);
const __dirname = path.dirname(__filename);
/******************************************************************************************* */

import { ODCResolumeProcessServiceFactory, ODCResolumeProcessService } from './services/ResolumeService/ODCResolumeProcessService.mjs';
import { delayedCallGranular, delayedCall } from './core/utils/ODCUtils.mjs';
import cors from 'cors';
// import expressWs from 'express-ws';
// import Projector from './services/ProjectorService/ODCPjlinkService.mjs';
import { parse } from 'js-ini';
import { promises as fs } from 'fs';
import ProjectorRoute from './routes/ProjectorRoute.mjs'
import SoundMixerRoute from './routes/SoundMixerRoute.mjs'
import LightsRoute from './routes/LightsRoute.mjs'
import ODCServiceManager from './core/ODCServiceManager.mjs';
import Projectors from './services/ProjectorService/ODCProjectors.mjs';
import SSP200 from './services/SoundService/ODCExtronSSPService.mjs';
import ArtnetLight from './services/LightService/ODCArtnetService.mjs';


const serviceManager = new ODCServiceManager();


const app = express();
let config = {};
await fs.readFile('config/OpenDController.server.ini', 'utf-8').then((cfgTxt) => {
    config = parse(cfgTxt, { dataSections: ['MappingProjectors'] });
    
});


serviceManager.addService('ProjectorsService', new Projectors(config.MappingProjectors));
serviceManager.addService('SoundMixerService', new SSP200(config.SoundMixer.pass, config.SoundMixer.ip, config.SoundMixer.port, config.SoundMixer.heartbeat));
serviceManager.addService('LightService', new ArtnetLight(config.ArtNetDevice.ip, config.ArtNetDevice.port));


app.use( (req, res, next) =>{
        app.set('config', config);
        app.set('ServiceManager', serviceManager);
        next();
    }
);

// console.log(config);
app.use('/projector/:projector', 
    (req, res, next) => {
        req.app.set('projector', req.params.projector); 
        next();
    }, 
    cors(), 
    ProjectorRoute);

app.use('/sound-mixer', cors(), SoundMixerRoute);
app.use('/light', cors(),LightsRoute);

// const resolumeFactory = new ODCResolumeProcessServiceFactory();
// const resolumeService = resolumeFactory.create();





// resolumeService.on('err', (err) => {
//     console.log(`error_event IN SERVER.JS ${err}`);
// });
// resolumeService.on('connected', (state) => {
//     console.log(`connected_event IN SERVER.JS ${state}`)
// })
// resolumeService.on('disconnected', (state) => {
//     console.log(`disconnected_event IN SERVER.JS ${state}`)
// })



// console.log('config.ResolumeServiceDetachedFromDeviceCtrl ', config.ResolumeServiceDetachedFromDeviceCtrl);
// console.log('config.ResolumeArena.ProcessBasePath + :action -> ', config.ResolumeArena.ProcessBasePath + ':action');
// //To be put in another server
// if (config.ResolumeServiceDetachedFromDeviceCtrl) {
//     app.get(config.ResolumeArena.ProcessBasePath + ':action', cors(), (req, res) => {
//         console.log('req', );
//         res.type('application/json');
//         switch (req.params.action) {
//             case 'start':
//                 resolumeService.start(req.query.file);
//                 res.status(200).type('application/json').send({ message: 'OK' });
//                 break;
//             case 'stop':
//                 resolumeService.stop();
//                 res.status(200).type('application/json').send({ message: 'OK' });
//                 break;
//             case 'ls':
//                 resolumeService.getProjects().then((projects) => {
//                     res.status(200).type('application/json').send({ message: 'OK', ls: projects });
//                 })
//                 break;
//             case 'started':
//                 resolumeService.isStarted().then(started => {
//                     res.status(200).type('application/json').send({ message: 'OK' });
//                 });
//                 break;
//             case 'open':
//                 let file = (req.query.file !== undefined) ? req.query.file : '';
//                 console.log(file);
//                 resolumeService.start(file);
//                 res.status(200).send({ message: 'OK' });
//                 break;
//         }
//     });
// }





// app.get('/light/:id/:action', cors(), (req, res) => {
//     console.log('light');
//     res.type('application/json');
//     switch (req.params.action) {
//         case 'on':
//             light.set(1, 1, 255);
//             console.log('light on');
//             res.status(200).send({ message: 'OK' });
//             break;
//         case 'off':
//             light.set(1, 1, 0);
//             console.log('light off');
//             res.status(200).send({ message: 'OK' });
//             break;
//         default:
//             res.status(404).send({ message: 'no action', requested: req.params.action });
//             break;
//     }

// });

app.listen(config.DevicesService.port, config.DevicesService.ip, () => {
    console.log('listening on ' + config.DevicesService.ip + ':' + config.DevicesService.port);
});