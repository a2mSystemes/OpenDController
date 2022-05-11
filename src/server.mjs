import express from 'express';
import loginRouter from "./routes/login.mjs";
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
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
/******************************************************************************************* */

// const app = express();
// app.set('view engine', 'ejs');
// app.set('views', path.join(__dirname, './views'))
// app.use('/', loginRouter);

// const PORT = process.env.PORT || 4111;

// app.listen(PORT, console.log("Server don start for port: " + PORT))

import { ODCResolumeProcessServiceFactory, ODCResolumeProcessService } from './services/ResolumeService/ODCResolumeProcessService.mjs';
import { delayedCallGranular, delayedCall} from './core/utils/ODCUtils.mjs';
import {createProxyMiddleware } from 'http-proxy-middleware'
import cors from 'cors';
import expressWs from 'express-ws';
import Projector from './services/pjlink-service.mjs';


const resolumeFactory = new ODCResolumeProcessServiceFactory();
const resolumeService = resolumeFactory.create();



resolumeService.on('err', (err) =>{
    console.log(`error_event IN SERVER.JS ${err}`);
});
resolumeService.on('connected', (state) => {
    console.log(`connected_event IN SERVER.JS ${state}`)
})
resolumeService.on('disconnected', (state) => {
    console.log(`disconnected_event IN SERVER.JS ${state}`)
})

const projectors = {
    p101: new Projector('192.168.200.101', ''), 
    p102: new Projector('192.168.200.102', ''), 
    p103: new Projector('192.168.200.103', ''), 
    p104: new Projector('192.168.200.104', ''), 
    p105: new Projector('192.168.200.105', ''), 
    p106: new Projector('192.168.200.106', ''), 
};

const options = {
    target: 'http://localhost:6001', // target host
    //changeOrigin: true, // needed for virtual hosted sites
    // ws: true, // proxy websockets
    pathRewrite: {
      '^/resolume/': '/api/v1/', // rewrite path
    },

  };

  // create the proxy (without context)
const exampleProxy = createProxyMiddleware(options);

// mount `exampleProxy` in web server
const app = express();
expressWs(app);


app.use('/api', exampleProxy);

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
                        console.log(compos);
                        ret.files = compos;
                        console.log('resolume started sending back ->' + JSON.stringify(ret));            
                        ws.status = 200;
                        ws.send(JSON.stringify(ret));
                        return;
                    } ).then(
                       Object.keys(projectors).forEach(key => {
                            console.log('powering on ', key,);
                            projectors[key].power('on');
                        })
                    );


                }
            );
            break;

            case 'shutdown':
                resolumeService.disconnect().then(
                    Object.keys(projectors).forEach(key => {
                        console.log('powering off ', key,);
                        projectors[key].power('off');
                    })
                );

            break;

        }
    });
});

app.use('/process-ws', cors(), router);


app.listen(3000);
