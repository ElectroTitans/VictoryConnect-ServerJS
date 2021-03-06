const Logger = require('disnode-logger');
const Config = require("../config");
const TopicList = require("./TopicList")
const Subscriptions = require('../Subscriptions')
class Topic{
    constructor(newTopicInfo){
        this.name = newTopicInfo.name;
        this.path = newTopicInfo.path;
        this.protocol = newTopicInfo.protocol;
        this.data = newTopicInfo.data || [];
        this.lastUpdate = new Date();

        Logger.Success(`Topic-${this.id}`, "constructor", `Created topic "${this.name}" at ${this.path} using ${this.protocol}.`);
        TopicList.AddTopic(this);
    }

    GetValue(){
        return this.value;
    }

    SetValue(newData){
        this.data = newData;
        this.lastUpdate = new Date();
        
        if(Config.verbose){
            Logger.Info(`Topic-${this.name}`, "SetValue", `Set data: ${newData}`);
        }

        Subscriptions.OnTopicUpdate(this);

    }
    
}

module.exports = Topic;