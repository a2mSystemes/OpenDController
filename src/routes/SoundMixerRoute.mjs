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



router.get('/', cors(), (req, res) => {
    service.state().then((state) => {
        res.status(200).json({ message: 'OK', state: state });
    });
});

router.get('/input/:input', cors(), (req, res) => {
    let input = req.params.input;
    service.setInput(input).then((state) => {
        res.status(200).json({ message: 'DONE', state: state });
    }).catch(err =>{
        res.status(501).json({ message: 'ERROR SWITCHING INPUT ', error : err });
    });
 
});



router.get('/volume/mute', cors(), (req, res) => {
    service.mute().then((state) => {
        res.status(200).json({ message: 'DONE', state: state });
    }).catch(err => {
        res.status(501).json({ message: 'ERROR MUTE ', error : err });
    });
});

router.get('/volume/unmute', cors(), (req, res) => {
    service.unmute().then((state) => {
        res.status(200).json({ message: 'DONE', state: state });
    }).catch(err => {
        res.status(501).json({ message: 'ERROR UN-MUTE ', error : err });
    });
});

router.get('/volume/up', cors(), (req, res) => {
    service.volumeUp().then((state) => {
        res.status(200).json({ message: 'DONE', state: state });
    }).catch(err => {
        res.status(501).json({ message: 'ERROR VOLUME UP ', error : err });
    });
});

router.get('/volume/down', cors(), (req, res) => {
    service.volumeDown().then((state) => {
        res.status(200).json({ message: 'DONE', state: state });
    }).catch(err => {
        res.status(501).json({ message: 'ERROR VOLUME DOWN ', error : err });
    });
});

router.get('/volume/:volume', cors(), (req, res) => {
    let volume = Number(req.params.volume);
    service.setVolume(volume).then((state) => {
        res.status(200).json({ message: 'DONE', state: state });
    }).catch(err => {
        res.status(501).json({ message: 'ERROR VOLUME SET ', error : err });
    });
});


export default router;