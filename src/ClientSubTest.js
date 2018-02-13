

const message = "1 3 gyro x=10;y=20;z=10";

var net = require('net');

var HOST = 'pi3-01.local';
var PORT = 9000;
var Util = require("./Util")
var Consts = require("./Consts")
var client = new net.Socket();
function Connect(){
    client.connect(PORT, HOST, function() {

        console.log('CONNECTED TO: ' + HOST + ':' + PORT);
        // Write a message to the socket as soon as the client is connected, the server will receive it as message from the client
    
        client.write("0 0 id mock_sub ")
        setTimeout(function () {
          client.write("0 0 subscribe all ")
        }, 3000);
    });
}
Connect();
// Add a 'data' event handler for the client socket
// data is what the server sent to this socket
client.on("error" , function(err){
    console.log("SoketError: " + err);
    console.log("Attempting Reconnect in 5s");
    setTimeout(function(){
        Connect();
    }, 5000);
})
// Add a 'data' event handler for the client socket
// data is what the server sent to this socket
client.on('data', function(data) {




    var packet = Util.parse(data.toString());
    if(packet.topic == "heartbeat" && packet.type == 1){
      client.write("2 0 heartbeat no_data ")
    }else{
        console.log('DATA: ' + data);
    }

    // Close the client socket completely


});

// Add a 'close' event handler for the client socket
client.on('close', function() {
    console.log('Connection closed');
});
