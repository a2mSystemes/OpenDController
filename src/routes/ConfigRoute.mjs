import cors from 'cors';
import express from 'express';
const router = express.Router();

let config = null;

router.use((req, res, next) => {
    config = req.app.get('config');
    next();
});

router.get('/', cors(), (req, res) => {
    let r = { from: 'ConfigRoute', command: 'config', value: '?', done: false, device: 'RaspberryPi3 ExpressJS Powered' };
    if (config !== null){
        config.SoundMixer.pass = '**********';
        r.done = true;
        r.response = config
        res.status(200).json(r)
    }
        else{
            r.response = 'ERROR: Could not get config.';
            res.status(501).json({'message':'error config is NULL'});
        }
});

router.get('/alive', cors(), (req, res) => {
    let r = { from: 'ConfigRoute', command: 'config', value: '?', done: false, device: 'RaspberryPi3 ExpressJS Powered' };
    if (config !== null){ 
        config.alive = true;
        config.SoundMixer.pass = '**********';
        r.done = true;
        r.response = config;
        res.status(200).json(r)
    }
        else
        res.status(501).json({'message':'error config is NULL'});
});

export default router;
