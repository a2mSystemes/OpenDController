import ODCSerialService from "./services/VideoSwitcherService/ODCSerialService.mjs";
import { catchError, take, timeout } from "rxjs";
// prolific vendorId = '067B' productId = '2303'

async function Main(){
  let serial = new ODCSerialService(19200, 'COM9');
  // console.log(serial);
  let ob$ = serial.observe().subscribe({next : data => {
    console.log( data);
  }, error: err => console.log(err)});

  serial.sendCommand('A0!');


// console.log(String.fromCharCode(0x0a));
// console.log(String.fromCharCode(0x43));
// console.log(String.fromCharCode(0x6f));
// console.log(String.fromCharCode(0x6d));

  setInterval(() => {
    
  }, 100);

  // serial.close();

}

Main();