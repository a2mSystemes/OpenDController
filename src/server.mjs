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

import cors from 'cors';
// import expressWs from 'express-ws';
// import Projector from './services/ProjectorService/ODCPjlinkService.mjs';
import { parse } from 'js-ini';
import { promises as fs } from 'fs';
import ConfigRoute from './routes/ConfigRoute.mjs';
import ProjectorRoute from './routes/ProjectorRoute.mjs'
import SoundMixerRoute from './routes/SoundMixerRoute.mjs'
import LightsRoute from './routes/LightsRoute.mjs'
import VideoSwitcherRoute from './routes/VideoSwitcherRoute.mjs'
import ODCServiceManager from './core/ODCServiceManager.mjs';
import Projectors from './services/ProjectorService/ODCProjectors.mjs';
import SSP200 from './services/SoundService/ODCExtronSSPService.mjs';
import ArtnetLight from './services/LightService/ODCArtnetService.mjs';
import ODCSerialService from './services/VideoSwitcherService/ODCSerialService.mjs'
import { Bonjour } from 'bonjour-service'




const app = express();
const setup = () => {
    console.time('setup started in ');
    // console.log('Starting setup');
    return new Promise(async(resolve, reject) => {

    const serviceManager = new ODCServiceManager();
    let config = await fs.readFile('config/OpenDController.server.ini', 'utf-8').then((cfgTxt) => {
        return parse(cfgTxt, { dataSections: ['MappingProjectors'] });
    });
    //*** NOT USED
    // const mdns = new Bonjour()
    // mdns.publish({ name: 'opendDControllerServer', subtypes: ['config', 'api'], txt: 'config avialable at /config', type: 'http', port: 3000, host: config.DevicesService.ip })
    //*** */
    if(config.HdmiMatrix.activate){
        serviceManager.addService('SwitcherService', new ODCSerialService(config.HdmiMatrix.baudRate, config.HdmiMatrix.path));
    }

        const projectorService = new Projectors(config.MappingProjectors);
        const soundMixerService = new SSP200(config.SoundMixer.pass, config.SoundMixer.ip, config.SoundMixer.port, config.SoundMixer.heartbeat)
        console.log(config.ArtNetDevice.ip);
        const lightService = new ArtnetLight(config.ArtNetDevice.ip, 
            config.ArtNetDevice.port);
        serviceManager.addService('ProjectorsService', projectorService);
        serviceManager.addService('SoundMixerService', soundMixerService);
        serviceManager.addService('LightService', lightService);


    
    app.set('config', config);
    app.set('ServiceManager', serviceManager);

    app.use('/config', cors(), ConfigRoute);
    app.use('/projector/:projector',
        (req, res, next) => {
            req.app.set('projector', req.params.projector);
            next();
    },cors(),ProjectorRoute);
    app.use('/audio-mixer', cors(), SoundMixerRoute);
    app.use('/video-switcher',(req, res, next) => {
        if(config.HdmiMatrix.activate){
            next();
        }else{
            let r = { from: 'VideoSwitcherRoute', 
                        command: 'switch/video', 
                        value: config.HdmiMatrix.activate, 
                        device:'purelink HDMI UHDS-41R Switcher', 
                        done: false,
                        response: 'Desactivated by your administrator' };
            res.status(200).json(r);
        }
    }, cors(), VideoSwitcherRoute);
    app.use('/light', cors(), LightsRoute);
    if(!config.misc.prod){
        console.log(path.join(__dirname, "../node_modules/bootstrap/dist/css/bootstrap-grid.min.css"));
        console.log(path.join(__dirname, "../node_modules/bootstrap/dist/css/bootstrap-reboot.min.css"));

        // app.use("/styles/css/bootstrap-grid", express.static(path.join(__dirname, "../node_modules/bootstrap/dist/css/bootstrap-grid.css")));
        // app.use("/styles/css/bootstrap-grid.css.map", express.static(path.join(__dirname, "../node_modules/bootstrap/dist/css/bootstrap-grid.css.map")));
        // app.use("/styles/css/bootstrap-reboot.css.map", express.static(path.join(__dirname, "../node_modules/bootstrap/dist/css/bootstrap-reboot.css.map")));
        // app.use("/styles/css/bootstrap-reboot", express.static(path.join(__dirname, "../node_modules/bootstrap/dist/css/bootstrap-reboot.css")));
        app.use("/styles/css/bootstrap/", express.static(path.join(__dirname, "../node_modules/bootstrap/dist/css/")));
        app.use("/js/bootstrap/", express.static(path.join(__dirname, "../node_modules/bootstrap/dist/js/")));
        app.get('/', (req, res, next) => {
            return res.sendFile(path.join(__dirname, 'static', 'dev.html'))
        });
    }
    // console.log('leaving setup');
    resolve(config);
});
} 

setup().then( ((config) => {
    console.timeEnd('setup started in ');
    app.listen(config.DevicesService.port, config.DevicesService.ip, () => {
        console.log('listening on http://' + config.DevicesService.ip + ':' + config.DevicesService.port);
    });
}))
