import cors from 'cors';
import express from 'express';
const router = express.Router();

let config = null;
let service = null;

router.use((req, res, next) => {
    config = req.app.get('config');
    // console.log(config)
    service = req.app.get('ServiceManager').getService('SoundMixerService');
    next();
});



router.get('/state', cors(), (req, res) => {
    let r = { from: 'SoundMixerRoute', command: 'state', value: true, device: 'Extron® SSP 200', done: false };
    // TODO: handle disconnected
    service.state().then((state) => {
        r.done = true;
        r.response = state;
        res.status(200).json(r);
    });
});

router.get('/input/select/:input', cors(), (req, res) => {
    // TODO: protect input data and convert to number
    let input = req.params.input;
    let r = { from: 'SoundMixerRoute', command: 'mute', value: `${input}`, device: 'Extron® SSP 200', done: false };
    service.setInput(input).then((state) => {
        r.response = state;
        res.done = true;
        res.status(200).json(r);
    }).catch(err =>{
        r.response = err;
        res.status(500).json(r);
    });
 
});



router.get('/volume/mute', cors(), (req, res) => {
    let r = { from: 'SoundMixerRoute', command: 'mute', value: true, device: 'Extron® SSP 200', done: false };
    service.mute().then((state) => {
        r.response = state;
        r.done = true;
        res.status(200).json(r);
    }).catch(err => {
        console.log(err);
        r.response = err;
        res.status(500).json(r);
    });
});

router.get('/volume/unmute', cors(), (req, res) => {
    let r = { from: 'SoundMixerRoute', command: 'mute', value: true, device: 'Extron® SSP 200', done: false };
    service.unmute().then((state) => {
        r.response = state;
        r.done = true;
        res.status(200).json(r);
    }).catch(err => {
        r.response = err
        res.status(501).json(r);
    });
});

router.get('/volume/up', cors(), (req, res) => {
    let r = { from: 'SoundMixerRoute', command: 'mute', value: true, device: 'Extron® SSP 200', done: false };
    service.volumeUp().then((state) => {
        r.done = true;
        r.response = state
        res.status(200).json(r);
    }).catch(err => {
        r.response = err;
        res.status(501).json(r);
    });
});

router.get('/volume/down', cors(), (req, res) => {
    let r = { from: 'SoundMixerRoute', command: 'mute', value: true, device: 'Extron® SSP 200', done: false };

    service.volumeDown().then((state) => {
        r.done = true;
        r.response = state;
        res.status(200).json(r);
    }).catch(err => {
        r.response = err;
        res.status(501).json(r);
    });
});

router.get('/volume/:volume', cors(), (req, res) => {
    let r = { from: 'SoundMixerRoute', command: 'mute', value: true, device: 'Extron® SSP 200', done: false };
    const volume = Number(req.params.volume);
    service.setVolume(volume).then((state) => {
        r.done = true;
        r.response = state;
        res.status(200).json(r);
    }).catch(err => {
        r.response = err
        res.status(501).json(r);
    });
});


export default router;