import express from 'express';
import path, { resolve } from 'path';
import Artnet from 'artnet';
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
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
/******************************************************************************************* */


import { ODCResolumeProcessServiceFactory, ODCResolumeProcessService } from './services/ResolumeService/ODCResolumeProcessService.mjs';
import { delayedCallGranular, delayedCall} from './core/utils/ODCUtils.mjs';
import {createProxyMiddleware } from 'http-proxy-middleware'
import cors from 'cors';
import expressWs from 'express-ws';
import Projector from './services/ProjectorService/ODCPjlinkService.mjs';
// import res from 'express/lib/response';


const resolumeFactory = new ODCResolumeProcessServiceFactory();
const resolumeService = resolumeFactory.create();

const light = Artnet({host: '192.168.200.133'});




resolumeService.on('err', (err) =>{
    console.log(`error_event IN SERVER.JS ${err}`);
});
resolumeService.on('connected', (state) => {
    console.log(`connected_event IN SERVER.JS ${state}`)
})
resolumeService.on('disconnected', (state) => {
    console.log(`disconnected_event IN SERVER.JS ${state}`)
})

const resolumeProxy = createProxyMiddleware({
    target: 'http://localhost:6001',
    pathRewrite: {
      '^/resolume/': '/api/v1/',
    },
  });

const app = express();
expressWs(app);



const router = express.Router();
router.ws('/compo', (ws, req) => {
    console.log('Someone is connecting');
    ws.on('message', data => {
        console.log(data);
        let msg = JSON.parse(data);
        switch(msg.command) {
            case 'start':
                resolumeService.connect().then(
                service => {
                    let ret = {   
                        running: true,
                        files: [],
                        command: '',
                        compo: -1
                    };
                    resolumeService.getCompos().then( compos => {
                        ret.files = compos;
                        ws.status = 200;
                        ws.send(JSON.stringify(ret));
                        return;
                    } );
                }
            );
            break;
            case 'shutdown':
                resolumeService.disconnect();
            break;
            case 'open':
                if(msg.project !== undefined) {
                    resolumeService.getCompos().then( compos => {
                        let index = compos.indexOf(msg.project)
                        if(index <=0) {
                            resolumeService.setSelected(index).then( (r) => {
                                let ret = {   
                                    running: true,
                                    files: [],
                                    command: '',
                                    compo: index
                                };
                                ws.status = 200;
                                ws.send(JSON.stringify(ret));
                                return;
                            });

                        }
                    })
                    
                }
                
        }
    });
});

app.get('/projectors/:action',  cors(), (req, res) => {
    console.log('projectorAPI');
    const projectors = {
        p101: new Projector('192.168.200.101', ''), 
        p102: new Projector('192.168.200.102', ''), 
        p103: new Projector('192.168.200.103', ''), 
        p104: new Projector('192.168.200.104', ''), 
        p105: new Projector('192.168.200.105', ''), 
        p106: new Projector('192.168.200.106', ''), 
    };
    res.type('application/json');
    switch (req.params.action){
        case 'on':
            Object.keys(projectors)
                    .forEach(key => {
                     console.log('powering on ');
                     projectors[key].power('on');
            });
            res.status(200).send({message: 'OK', requested: req.params.action});
            break;
        case 'off':
            Object.keys(projectors)
                    .forEach(key => {
                    console.log('powering off ');
                    projectors[key].power('off');
            });
            res.status(200).send({message: 'OK', requested: req.params.action});
            break;
        default:
            res.status(404).send({message: 'no action', requested: req.params.action});
            break;
    }
});


app.get('/light/:id/:action', cors(), (req, res) => {
    
    res.type('application/json');
    switch(req.params.action){
        case 'on':
            light.set(1, 1, 255);
            console.log('light on');
            res.status(200).send({message: 'OK'});
            break;
        case 'off':
            light.set(1, 1, 0);
        console.log('light off');
            res.status(200).send({message: 'OK'});
            break;
        default:
            res.status(404).send({message: 'no action', requested: req.params.action});
            break;
    }

});


app.use('/process-ws', cors(), router);
app.use('/api', resolumeProxy);

app.listen(3000);
