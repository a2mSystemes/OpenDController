import express, { request } from "express";
import cors from 'cors';
const router = express.Router();

// Projector API

let config = null;
let service = null;
let projector = null;





router.use((req, res, next) => {
    projector = req.app.get('projector');
    console.log('projector selected ', projector);
    config = req.app.get('config');
    let manager = req.app.get('ServiceManager');
    // manager.listServices();
    service = manager.getService('ProjectorsService');
    // console.log('service Manager ', req.app.get('serviceManager'));
    // console.log('ProjectorService ', service);
    next();
});

router.get('/power/state', cors(), (req, res) => {
    service.getPower(projector).then((power) => {
        res.status(200).json({ message: 'TEST ROUTING OK', powerState: power });
    }).catch(err => {
        console.log(err);
        res.status(501).type('application/json').json({ message: 'POWER STATE', error : err });
    });
});

router.get('/power/on', cors(), (req, res) => {
    service.powerOn(projector).then((power) => {
        console.log(power);
        res.type("application/json");
        res.status(200).type('application/json').send({ message: 'POWER ON OK', powerState: power });
    }).catch(err => {
        console.log(err);
        res.status(501).type('application/json').json({ message: 'POWER ON ERROR', error: err });
    });
});

router.get('/power/off', cors(), (req, res) => {
    res.type("application/json");
    service.powerOff(projector).then((power) => {
        console.log(power);
        res.status(200).type('application/json').send({ message: 'POWER OFF OK', powerState: power });
    }).catch(err => {
        console.log(err);
        res.status(501).json({ message: 'POWER OFF ERROR', error: err });
    });
});


router.get('/input', cors(), (req, res) => {
    res.type("application/json");
    service.getInput(projector).then((inputState) => {
        console.log(inputState);
        res.status(200).type('application/json').send({ message: 'INPUT RESPONSE', inputState: inputState });
    }).catch(err => {
        console.log(err);
        res.status(501).json({ message: 'INPUT STATE ERROR', error: err });
    });
});


router.get('/input/select/:input', cors(), (req, res) => {
    let inpt = req.params.input;

    service.setInput(projector, inpt).then(() => {
        console.log('success');
        res.status(200).json({ message: 'SUCCESS', inputState: inpt })
    })
    .catch(err => {
        console.log(err);
        res.status(501).json({ message: 'INPUT SWITCH ERROR', error: err });
    });
});

export default router;