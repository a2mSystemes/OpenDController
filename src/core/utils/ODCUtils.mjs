
import { exec } from "child_process";

// hacks found at https://www.codegrepper.com/code-examples/javascript/is+there+a+synchronous+wait+in+javascript
// and https://stackoverflow.com/questions/6921895/synchronous-delay-in-code-execution
function sleep(ms) { return new Promise(done => setTimeout(() => done(), ms));} 

function delayedCall(array, ms) {
    array.forEach((func, index) => setTimeout(func, index * ms))
};

function delayedCallGranular(toDelay) {
    let t = 0;
    toDelay.forEach((funcAndDelay, index) => {
        t += funcAndDelay['duration'];
        setTimeout(funcAndDelay['func'], t);
    });
};

// hack found https://stackoverflow.com/questions/38033127/node-js-how-to-check-a-process-is-running-by-the-process-name
function scanIsRunning(executable){
    return new Promise(function(resolve, reject){
        const plat = process.platform
        const cmd = plat == 'win32' ? 'tasklist' : (plat == 'darwin' ? 'ps -ax | grep ' + mac : (plat == 'linux' ? 'ps -A' : ''))
        if(cmd === '' || executable === ''){
            resolve(false)
        }
        exec(cmd, function(err, stdout, stderr) {
            resolve(stdout.toLowerCase().indexOf(executable.toLowerCase()) > -1)
        })
    })
}

export {sleep, delayedCall, delayedCallGranular, scanIsRunning};