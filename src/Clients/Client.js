const Logger = require("disnode-logger");
const ClientManager = require("./ClientManager");
const Consts = require("../Consts")
const Util = require("../Util")
const MessageReciver = require("../MessageReciver")
const Config = require("../config")
class Client{
    constructor(id, name){
        this.connections  = {};
        this.sockets      = {};
        this.active       = false;
        this.id           = id;
        this.name         = name;
        this.sendQueue    = [];
        this.tickRate     = 50;
        this.tickInterval = null;

        Logger.Success(`Client-${this.id}`, "constructor", "New Client Made!")

        ClientManager.AddClient(this);
        var self = this;

        Logger.Info(`Client-${this.id}`, "constructor", "Sending Client Info ID Packet")

        this.SetTickLoop();

    }

    AddSocket(connection, socketID){
        Logger.Info(`Client-${this.id}`, "AddSocket", `Adding new socket with type ${connection.type} and socket id ${socketID}`)
        this.connections[connection.type] = true;
        this.sockets[connection.type]     = socketID;
    }

    SetTickLoop(){
        var self = this;
        this.tickInterval = setInterval(()=>{self.OnSendTick(self)}, (1000/self.tickRate));
        Logger.Info(`Client-${this.id}`, "Init", "Started tick rate with delay: " + (1000/self.tickRate));
    }

    OnError(err){
        Logger.Error(`Client-${this.id}`, "Socket Error", err)
    }
    OnPacket(packet){
        
    }

    OnSendTick(ref){
        if(!ref.sendQueue.length > 0){
            return;
        }
      
        let sentCount = 0;
        let sendString = "";
        for (let i = 0; i < ref.sendQueue.length; i++) {
            const _toSend = ref.sendQueue[i];
            sendString += _toSend + "~";
            ref.sendQueue.splice(i,1);
            sentCount++;
        }
        if(Config.verbose){
            Logger.Info(`Client-${ref.id}`, `OnSendTick`, `Sent "${sendString}" from client ${ref.id}!`);
        }
        ref.connection.SendSocket(ref.socket, sendString);
        if(Config.verbose){
            Logger.Success(`Client-${ref.id}`, "OnSendTick", `Sent ${sentCount} packets!`);
        }
        
    }

    SendPacket(msgType, topic, data, method){
        var packetString = Util.buildPacket(msgType,topic,data);
        this.sendQueue.push({connection: method, data: packetString});
        if(Config.verbose){
            Logger.Info(`Client-${this.id}`, "SendPacket", `Added packet for ${topic} to queue. Current Queue: ${this.sendQueue.lenght}`);
        }
    }

    SetTickRate(tickRateRaw){
        let tickRate = parseInt(tickRateRaw);
        if(tickRate < 1 || tickRate == NaN || !tickRate){
            Logger.Warning(`Client-${this.id}`, "SetTickRate", "Invalid tickrate provided: " + tickRateRaw)
            this.SendPacket(Consts.types.ERROR, "client_tickrate", ["Non-valid tick rate provided!"]);
            return;
        }
        this.tickRate = tickRate;
        clearInterval(this.tickInterval);
        this.SetTickLoop();
    }
    
    StartHeartbeat(){
        
    }

    SendHeartbeat(){

    }

    RecvHeartbeat(){

    }
    
}

module.exports = Client;