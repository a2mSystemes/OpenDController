import test from 'ava';
import { delayedCall, delayedCallGranular, sleep, scanIsRunning } from '../../src/core/utils/ODCUtils.mjs';

console.log("*****ODCUtils Tests****");
console.log('NOTE: accuracy of func sleep() is 4 ms if test succeed');
console.log('NOTE: accuracy of func delayedCall() is 4 ms if test succeed');
console.log('NOTE: accuracy of func delayedCallGranular() is 4 ms if test succeed');
console.log();
test.serial('sleep() test: should sleep for 1 sec', async t => {
    t.timeout(1100, 'sleep() should have finnished !!!');
    const start = Date.now();
    await sleep(1000);
    t.true((Date.now() - start) >= 998 || (Date.now() - start) <= 1002 );
});

test.serial('delayedCall() test: should sleep for 200 ms then 200 ms', 
    async t => {
        t.timeout(610, 'delayedCall() should have finnished !!!')
        t.plan(2);
        let start = undefined;
        delayedCall([
            () => {
                start = Date.now();
            },
            () => {
                t.true((Date.now() - start) >= 198 || (Date.now() - start) <= 202 );
                start = Date.now();
            },
            () => {
                t.true((Date.now() - start) >= 198 || (Date.now() - start) <= 202 );
            },
        ], 200);
        await sleep(605);
});

test.serial('delayedCallGranular() test: should sleep for 200 ms then 1sec then 250 ms', 
    async t => {
        t.timeout(1470, 'delayedCallGranular() should have finnished !!!')
        t.plan(3);
        let start = Date.now();
        delayedCallGranular([
            {"func" : () => {
                t.true((Date.now() - start) >= 198 || (Date.now() - start) <= 202 );
                start = Date.now();
            }, "duration": 200 },
            {"func" : () => {
                t.true((Date.now() - start) >= 998 || (Date.now() - start) <= 1002 );
                start = Date.now();        
            }, "duration": 1000 },
            {"func" : () => {
                t.true((Date.now() - start) >= 248 || (Date.now() - start) <= 252 );
                start = Date.now();
            }, "duration": 250 }
        ]);
        await sleep(1460);
});

test('scanIsRunning() test should be true::', async t => {
    await scanIsRunning("svchost.exe").then(result => {
        t.true(result);
    });
});

test('scanIsRunning() test should be false:', async t => {
    await scanIsRunning("foobar").then(result => {
        t.false(result);
    });
});