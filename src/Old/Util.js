var logger = require("disnode-logger")
exports.parse = function (data) {
  data = data.toString();
  
  var parts = data.split(" ");
  var commandType = parts[0];
  var commandTopic = parts[1];
  var valuesString = data.substring(data.indexOf("{") + 1, data.indexOf("}"));
  var values = [valuesString];
  if(valuesString.indexOf(";") != -1){
    values = valuesString.split(";");
  }
  //logger.Info("VC Server", "", `Packet from \nSubject: ${subject} \nType: ${commandType} \nTopic: ${commandTopic} \nData: ${values}`)
  return{
    raw: data,
    type: parseInt(commandType),
    topic: commandTopic,
    dataString: valuesString,
    data: values
  }

 
};

exports.buildPacket = function (subject, type, topic, data) {
  return type + " " + topic + " " + "{"+data+"}"

//  logger.Info("VC Server", "", `Packet from ${info.address}:${info.port} \nSubject: ${subject} \nType: ${commandType} \nTopic: ${commandTopic} \nData: ${values}`)
};