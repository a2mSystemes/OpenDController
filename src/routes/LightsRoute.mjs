import cors from 'cors';
import express from 'express';
const router = express.Router();

let config = null;
let service = null;

router.use((req, res, next) => {
    config = req.app.get('config');
    service = req.app.get('ServiceManager').getService('LightService');
    next();
});




router.get('/channel/:channel/on', cors(), (req, res) => {
    let channel =   Number(req.params.channel);
    if(isNaN(Number(req.params.channel)))
        return res.status(500).json({error: req.params.channel + ' is not a number'});
    service.on(channel)
        .then((r) => {
                res.status(200).json(r)
            })
        .catch((err) => 
                res.status(500).json(err));
});

router.get('/channel/:channel/off', cors(), (req, res) => {
    let channel =   Number(req.params.channel);
    if(isNaN(Number(req.params.channel)))
        return res.status(500).json({error: req.params.channel + ' is not a number'});
    service.off(channel)
        .then((r) => {
                res.status(200).json(r)
            })
        .catch((err) => 
                res.status(500).json(err));
});

router.get('/universe/:universe/channel/:channel/value/:value', cors(), (req, res) => {
    let universe = req.params.universe;
    let value = req.params.value;
    let channel = req.params.channel;
    service.send(universe, channel, value)
        .then((r) => {
            res.status(200).json(r)})
        .catch((err) => 
            res.status(500).json(err));
});



export default router;