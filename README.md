# OpenDController
Lightweight audiovisual control system

# Installation

## From source

As for now, this project was not published to npm. So you need to install it after having cloned it.

```bash
$ git clone https://github.com/a2msystemes/OpenDController
$ cd OpenDController
$ npm install
```
Then to run it, just do :

```bash
$ npm start
```

## From installer

No installer for now. But planned to be done.

# API

### ROUTES

```
▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬
OpenDController Server |
▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬


└───+ /config
│            │ 
│            └  = {config}
│            │    /* :action => void
│            │    /* @returns the global config object
│            │ 
│            └  /alive = {...config, alive: true} 
│                        /* :action => void
│                        /* @returns the config object + marker alive to warn UI.
│                           
└───+ /projector/:projId /* @param :projId: the selected projector
│                       │
│                       + /power 
│                       │       │
│                       │       └ /state = {projIdPowerState}
│                       │       │          /* :action => void       
│                       │       │          /* @returns the power state of the selected projector
│                       │       │
│                       │       └ /on = {projIdPowerState}
│                       │       │       /* :action => switch on the projector       
│                       │       │       /* @returns the power state of the selected projector
│                       │       │
│                       │       └ /off = {projIdPowerState}
│                       │               /* :action => switch on the projector       
│                       │               /* @returns the power state of the selected projector
│                       │ 
│                       └ /input
│                               │
│                               └ = {inputState}
│                               │   /* :action => void
│                               │   /* @returns selected input of the selected projector
│                               │
│                               └ /select/:input
│                                              │
│                                              └ = {inputConfig} 
│                                                  /* @param :input: 'HDMI1' | 'HDMI2' | 'VGA' | 'VIDEO' case insensitive
│                                                  /* :action => change the input of the selected projector
│                                                  /* @returns the input selected
│                                                   
└───+ /light
│           │
│           └ /channel/:channel/on
│           │                     │
│           │                     └ = {commandExecuted}
│           │                         /* @param :channel: DMX channel
│           │                         /* :action => set power to 255 (full light)
│           │                         /* @returns just indicates that the command has been send. No real feedback
│           │
│           └ /channel/:channel/off
│           │                     │
│           │                     └ = {commandExecuted}
│           │                         /* @param :channel: DMX channel
│           │                         /* :action => set power to 255 (full light)
│           │                         /* @returns just indicates that the command has been send. No real feedback
│           │
│           └ //universe/:universe/channel/:channel/value/:value
│                                                               │
│                                                               └ = {commandExecuted}
│                                                                   /* @param :univers: DMX universe
│                                                                   /* @param :channel: DMX channel
│                                                                   /* @param :value: DMX value [0-255]
│                                                                   /* :action => set power to :value: in the DMX selected :channel: 
│                                                                   /*              of the DMX selected :universe:
│                                                                   /* @returns just indicates that the command has been send. No real feedback
│ 
└───+ /sound-mixer
│                 │ 
│                 └ /state
│                 │      │
│                 │      └ = {soundMixerState}
│                 │          /* :action => void
│                 │          /* @returns the current global state of the switcher
│                 │
│                 └ /input/select/:input
│                 │                     │
│                 │                     └ = {soundMixerState}
│                 │                         /* @param :input: audio input
│                 │                         /* :action => select the audio input
│                 │                   /* @returns the current global state of the switcher
│                 │                    
│                 └ /volume
│                          │                       
│                          └ /mute                       
│                          │     │                 
│                          │     └ = {soundMixerState}                 
│                          │         /* :action => global mute                
│                          │                       
│                          └ /unmute
│                          │       │                 
│                          │       └ = {soundMixerState}                 
│                          │           /* :action => global mute                  
│                          │           /* @returns the current global state of the switcher       
│                          │                        
│                          └ /up 
│                          │   │                     
│                          │   └ = {soundMixerState}                    
│                          │       /* :action => increase output volume      
│                          │       /* @returns the current global state of the switcher    
│                          │                
│                          └ /down 
│                          │     │                     
│                          │     └ = {soundMixerState}                    
│                          │         /* :action => decrease output volume      
│                          │         /* @returns the current global state of the switcher    
│                          │                
│                          └ /:volume 
│                                   │                     
│                                   └ = {soundMixerState}                    
│                                       /* @param => :volume: amount [0-100]      
│                                       /* :action => set the output global volume       
│                                       /* @returns the current global state of the switcher 
│                                       
└───+ /video-switcher
                   │ 
                   └ /input/select/:in
                   │                 │
                   │                 └ = {videoSwitcherState}
                   │                     /* @param => :in: HDMI input [1-4]   
                   │                     /* :action => switch HDMI input :in:  
                   │                     /* @returns => object that confirm or not that  
                   │                     /*         the command has been executed correctly
                   │                     
                   └ /edid/select/:edid
                   │                 │
                   │                 └ = {videoSwitcherState}
                   │                     /* @param => :edid: audio EDID mode [1-4]   
                   │                     /* :action => switch selected :edid: EDID. [mode 1 : auto]  
                   │                     /*    [ edid1 : 'auto', edid2 : 'Stereo Audio 2.0' 
                   │                     /*      edid3 : 'Dolby/DTS 5.1', edid4 : 'HD Audio 7.1' ]  
                   │                     /* @returns => object that confirm or not that  
                   │                     /*         the command has been executed correctly
                   │                     
                   └ /query
                   │      │ 
                   │      └ /input/:in
                   │      │          │
                   │      │          └ = {videoSwitcherState}
                   │      │                 /* @param => :in: HDMI input [1-4]   
                   │      │                 /* :action => void  
                   │      │                 /* @returns => object containing the connection status  
                   │      │                 /*        of the selected input (Connected || Disconnected)
                   │      │              
                   │      └ /output              
                   │      │       │
                   │      │       └ = {videoSwitcherState}
                   │      │                 /* :action => void  
                   │      │                 /* @returns => object containing the connection status 
                   │      │                 /*         of the output (Connected || Disconnected)
                   │      │              
                   │      └ /tmds
                   │      │    │
                   │      │    └ = {videoSwitcherState}
                   │      │              /* :action => void  
                   │      │              /* @returns => object containing TMDS status  
                   │      │              
                   │      └ /help              
                   │           │
                   │           └ = {videoSwitcherState}
                   │                     /* :action => void  
                   │                     /* @returns => list of available commands  
                   │ 
                   └ /autoswitch
                   │           │
                   │           └ /on 
                   │           │   │
                   │           │   └ = {videoSwitcherState}
                   │           │       /* :action => set autoswitching video mode  
                   │           │       /* @returns => object that confirm or not that  
                   │           │       /*         the command has been executed correctly
                   │           │
                   │           └ /off 
                   │                │
                   │                └ = {videoSwitcherState}
                   │                    /* :action => unset autoswitching video mode 
                   │                    /* @returns => object that confirm or not that  
                   │                    /*         the command has been executed correctly
                   │               
                   └ /arc     
                        │
                        └ /on 
                        │   │
                        │   └ = {videoSwitcherState}
                        │       /* :action => set AudioReturnChannel (ARC)  
                        │       /* @returns => object that confirm or not that  
                        │       /*         the command has been executed correctly
                        │
                        └ /off 
                             │
                             └ = {videoSwitcherState}
                                 /* :action => unset AudioReturnChannel (ARC) 
                                 /* @returns => object that confirm or not that  
                                 /*         the command has been executed correctly
                                   
```                                      
                                      
                                         
            

# License

OpenDController is licensed under the GNU General Public License v3 (GPL-3) (http://www.gnu.org/copyleft/gpl.html).

Interested in a sublicense agreement for use of OpenDController in a non-free/restrictive environment? 
Contact me at [<a-m.maurin@a2mSystemes.fr>](mailto://a-m.maurin@a2mSystemes.fr)

