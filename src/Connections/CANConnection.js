const Logger = require("disnode-logger");
const Util = require('../Util');

module.exports.Start = (settings) =>{
    this.settings = settings;
}

module.exports.Stop = (callback) =>{

}

module.exports.BindOnStart = (callback) =>{
    this.OnStartBind = callback;
}

module.exports.BindOnMessage = (callback) =>{
    this.OnMessageBind = callback;
}

module.exports.BindOnError = (callback) =>{
    this.OnErrorBind = callback;
}

module.exports.SendMessage = (callback) =>{

}
