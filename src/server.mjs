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

import { ODCResolumeProcessServiceFactory, ODCResolumeProcessService } from './services/ODCResolumeServices/ODCResolumeProcessService.mjs';
import { delayedCallGranular, delayedCall} from './core/utils/ODCUtils.mjs';



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






