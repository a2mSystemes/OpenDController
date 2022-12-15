import express from 'express';
import path, { resolve } from 'path';
import cors from 'cors';
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
import { parse } from 'js-ini';
import { promises as fs } from 'fs';


let config = {};
await fs.readFile('config/OpenDController.server.ini', 'utf-8').then((cfgTxt) => {
    config = parse(cfgTxt, { dataSections: ['MappingProjectors'] });

});



const resolumeFactory = new ODCResolumeProcessServiceFactory();
const resolumeService = resolumeFactory.create();


resolumeService.on('err', (err) => {
    console.log(`error_event IN SERVER.JS ${err}`);
});
resolumeService.on('connected', (state) => {
    console.log(`connected_event IN SERVER.JS ${state}`)
})
resolumeService.on('disconnected', (state) => {
    console.log(`disconnected_event IN SERVER.JS ${state}`)
})


const app = express();

//To be put in another server

app.get(config.ResolumeArena.ProcessBasePath + ':action', cors(), (req, res) => {
    console.log('req', );
    switch (req.params.action) {
        case 'start':
            resolumeService.start(req.query.file);
            res.status(200).send({ message: 'OK' });
            break;
        case 'stop':
            resolumeService.stop();
            res.status(200).send({ message: 'OK' });
            break;
        case 'ls':
            resolumeService.getProjects().then((selected) => {
                res.status(200).send({ message: 'OK', ls: selected });
            })
            break;
        case 'started':
            resolumeService.isStarted().then(started => {
                res.status(200).send({ message: 'OK', started: started });
            });
            break;
        case 'open':
            let file = (req.query.file !== undefined) ? req.query.file : '';
            console.log(file);
            resolumeService.start(file);
            res.status(200).send({ message: 'OK' });
            break;
    }
})

app.listen(config.ResolumeArena.ProcessPort, config.ResolumeArena.ProcessIP);