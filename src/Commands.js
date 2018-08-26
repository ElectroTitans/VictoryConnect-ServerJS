const Logger = require('disnode-logger');
const Config = require('./config')
const Consts = require('./Consts')
const ClientManager = require("./Clients/ClientManager")
var commandRegisters = [];

module.exports.RegisterCommand = (client, path, cb = null) => {
    
    if(!this.GetRegister(client, path)){
        commandRegisters.push({
            client: client,
            callback: cb,
            path: path
        });
        Logger.Success("Commands", "RegisterCommand", `${client} Subscribed to command ${path}!`)
    }
   

  
}

module.exports.OnCommand = (packet) => {

    for (let i = 0; i < commandRegisters.length; i++) {
        const register = commandRegisters[i];

        if (packet.path.startsWith(register.path)) {
            if (register.client == "server") {
                if (Config.verbose) {
                    Logger.Info("Commands", "OnCommand", `${packet.path} calling callback function.`)
                }
                register.callback(packet);
            } else {
                var client = ClientManager.GetClient(register.client);
                Logger.Info("Commands", "OnCommand", `${packet.path} updating to client ${client.id}`)

                client.SendPacket(Consts.types.COMMAND, packet.path, packet.data, "TCP");
            }
        }
    }
}

module.exports.GetRegister = (client, path)=>{
    let found = null;

    for (let i = 0; i < commandRegisters.length; i++) {
        const register = commandRegisters[i];

        if (path.startsWith(register.path) && register.client == client) {
            found = register;
        }
    }

    return found;
}
