import cors from 'cors';
import express from 'express';
import ODCSerialService from '../services/VideoSwitcherService/ODCSerialService.mjs';
const router = express.Router();
import { catchError, retry, timeout, take } from 'rxjs';

let config = null;
let service = null;


router.use((req, res, next) => {
    config = req.app.get('config');
    service = req.app.get('ServiceManager').getService('SwitcherService');
    next();
});


router.get('/input/select/:in', (req, res) => {
    const inpt = Number(req.params.in);
    let r = { from: 'VideoSwitcherRoute', command: 'switch/video', 
        value: req.params.in, device:'purelink HDMI UHDS-41R Switcher', done: false };
    if (inpt !== NaN && inpt >= 1 && inpt < 5) {
        service.selectVideoInput(inpt)
            .pipe(take(1), timeout(5000), catchError((err) => {
                throw new Error(err.message);
            }))
            .subscribe({
                next: (resp) => {
                    if (resp === 'OK') {
                        r.response = resp;
                        r.done = true;
                        res.status(200).json(r)
                    }
                    else {
                        r.response = resp;
                        res.status(501).json(r);
                    }
                },
                error: (err) => {
                    if (err.message.includes('Timeout'))
                        err = 'Serial Timeout error';
                    r.response = err;
                    res.status(501).json(r);
                }
            });
    } else {
        r.response = `invalid input ${inpt}`;
        res.status(501).json(r);
    }
});

router.get('/edid/select/:edid', (req, res) => {
    const inpt = Number(req.params.edid);
    let r = { from: 'VideoSwitcherRoute', command: 'autoswitch/on', 
        value: req.params.edid, device:'purelink HDMI UHDS-41R Switcher', done: false };
    if (inpt !== NaN && inpt >= 1 && inpt < 5) {
        service.selectAudioInput(inpt)
            .pipe(take(1), timeout(5000), catchError((err) => {
                throw new Error(err.message);
            }))
            .subscribe({
                next: (resp) => {
                    if (resp === 'OK') {
                        r.response = resp;
                        r.done = true;
                        res.status(200).json(r)
                    }
                    else {
                        r.response = resp;
                        res.status(501).json(r);
                    }
                },
                error: (err) => {
                    if (err.message.includes('Timeout'))
                        err = 'Serial Timeout error';
                    r.response = err;
                    res.status(501).json(r);
                }
            });
    } else {
        r.response = `mode ${inpt} is an invalid EDID mode. Available mode are [1-4]. `;
        res.status(501).json(r);
    }
});

router.get('/autoswitch/on', (req, res) => {
    let r = { from: 'VideoSwitcherRoute', command: 'autoswitch/on', 
        value: true, device:'purelink HDMI UHDS-41R Switcher', done: false };
    service.setAutoSwitch(true)
        .pipe(take(1), timeout(5000), catchError((err) => {
            throw new Error(err.message);
        }))
        .subscribe({
            next: (resp) => {
                if (resp === 'OK') {
                    r.response = resp;
                    r.done = true;
                    res.status(200).json(r)
                } else {
                    r.response = resp;
                    res.status(501).json(r);
                }
            },
            error: (err) => {
                if (err.message.includes('Timeout'))
                    err = 'Serial Timeout error';
                r.response = err;
                res.status(501).json(r);
            }
        });

});

router.get('/autoswitch/off', (req, res) => {
    let r = { from: 'VideoSwitcherRoute', command: 'autoswitch/off', 
        value: false, device:'purelink HDMI UHDS-41R Switcher', done: false };
    service.setAutoSwitch(false)
        .pipe(take(1), timeout(5000), catchError((err) => {
            throw new Error(err.message);
        }))
        .subscribe({
            next: (resp) => {
                if (resp === 'OK') {
                    r.response = resp;
                    r.done = true;
                    res.status(200).json(r)
                } else {
                    r.response = resp;
                    res.status(501).json(r);
                }
            },
            error: (err) => {
                if (err.message.includes('Timeout'))
                    err = 'Serial Timeout error';
                r.response = err;
                res.status(501).json(r);
            }
        });
});
router.get('/arc/off', (req, res) => {
    let r = { from: 'VideoSwitcherRoute', command: 'arc/off', 
        value: false, device:'purelink HDMI UHDS-41R Switcher', done: false };
    service.setArc(false)
        .pipe(take(1), timeout(5000), catchError((err) => {
            throw new Error(err.message);
        }))
        .subscribe({
            next: (resp) => {
                if (resp === 'OK') {
                    r.response = resp;
                    r.done = true;
                    res.status(200).json(r)
                } else {
                    r.response = resp;
                    res.status(501).json(r);
                }
            },
            error: (err) => {
                if (err.message.includes('Timeout'))
                    err = 'Serial Timeout error';
                r.response = err;
                res.status(501).json(r);
            }
        });
});

router.get('/arc/on', (req, res) => {
    let r = { from: 'VideoSwitcherRoute', command: 'arc/on', 
        value: true, device:'purelink HDMI UHDS-41R Switcher', done: false };
    service.setArc(true)
        .pipe(take(1), timeout(5000), catchError((err) => {
            throw new Error(err.message);
        }))
        .subscribe({
            next: (resp) => {
                if (resp === 'OK') {
                    r.response = resp;
                    r.done = true;
                    res.status(200).json(r)
                } else {
                    r.response = resp;
                    res.status(501).json(r);
                }
            },
            error: (err) => {
                if (err.message.includes('Timeout'))
                    err = 'Serial Timeout error';
                r.response = err;
                res.status(501).json(r);
            }
        });
});

router.get('/query/in/:in', (req, res) => {
    const inpt = Number(req.params.in);
    let r = { from: 'VideoSwitcherRoute', command: 'query/in', 
        value: req.params.in, device:'purelink HDMI UHDS-41R Switcher', done: false };
    if (inpt !== NaN && inpt >= 0 && inpt < 5) {
        service.queryVideoInput(inpt)
            .pipe(take(1), timeout(5000), catchError((err) => {
                throw new Error(err.message);
            }))
            .subscribe({
                next: (resp) => {
                    r.response = resp;
                    r.done = true;
                    res.status(200).json(r)
                },
                error: (err) => {
                    if (err.message.includes('Timeout'))
                        err = 'Serial Timeout error';
                    r.response = err;
                    res.status(501).json(r);
                }
            });
    } else {
        r.response = `invalid input ${inpt}`
        res.status(501).json(r);
    }
});

router.get('/query/out', (req, res) => {
    let r = { from: 'VideoSwitcherRoute', command: 'query/out', 
        value: '?', device:'purelink HDMI UHDS-41R Switcher', done: false };
    service.queryVideoOutput()
        .pipe(take(1), timeout(5000), catchError((err) => {
            throw new Error(err.message);
        }))
        .subscribe({
            next: (resp) => {
                r.response = resp;
                r.done = true;
                res.status(200).json(r)
            },
            error: (err) => {
                if (err.message.includes('Timeout'))
                    err = 'Serial Timeout error';
                r.response = err;
                r.device = 'purelink HDMI Switcher';
                res.status(501).json(r);
            }
        });
});

router.get('/query/tmds', (req, res) => {
    let r = { from: 'VideoSwitcherRoute', command: 'query/tmds', 
        value: '?', device:'purelink HDMI UHDS-41R Switcher', done: false };
    service.queryTMDS()
        .pipe(take(1), timeout(5000), catchError((err) => {
            throw new Error(err.message);
        }))
        .subscribe({
            next: (resp) => {
                r.response = resp;
                r.done = true;
                res.status(200).json(r)
            },
            error: (err) => {
                if (err.message.includes('Timeout'))
                    err = 'Serial Timeout error';
                r.response = err;
                res.status(501).json(r);
            }
        });
});

router.get('/query/help', (req, res) => {
    let r = { from: 'VideoSwitcherRoute', command: 'query/help', 
        value: '?', device:'purelink HDMI UHDS-41R Switcher', done: false };
    service.queryHelp()
        .pipe(take(1), timeout(5000), catchError((err) => {
            throw new Error(err.message);
        }))
        .subscribe({
            next: (resp) => {
                r.response = resp;
                r.done = true;
                return res.status(200).json(r);
            },
            error: (err) => {
                console.log(err);
                if (err.name === 'TimeoutError')
                    err = 'Serial Timeout error';
                r.response = err;
                res.status(501).json(r);
            },
            complete: () =>{
            }
        });
});

export default router;
