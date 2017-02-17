var request = require("request");

var Service, Characteristic;
module.exports = function(homebridge) {
  Service = homebridge.hap.Service;
  Characteristic = homebridge.hap.Characteristic;

  homebridge.registerAccessory("homebridge-garadget", "Garadget", DoorAccessory);
}

function DoorAccessory(log, config) {
  this.log = log;
  this.name = config["name"];
  this.cloudURL = config["cloudURL"];
  this.access_token = config["access_token"];
  this.deviceID = config["deviceID"];
  this.garageservice = new Service.GarageDoorOpener(this.name);
  this.garageservice
    .getCharacteristic(Characteristic.CurrentDoorState)
    .on('get', this.getState.bind(this));
  this.garageservice
    .getCharacteristic(Characteristic.TargetDoorState)
    .on('get', this.getState.bind(this))
    .on('set', this.setState.bind(this));
  this.garageservice
    .getCharacteristic(Characteristic.ObstructionDetected)
    .on('get', this.getOD.bind(this));
  this.informationService = new Service.AccessoryInformation();
  this.informationService
    .setCharacteristic(Characteristic.Manufacturer, "Garadget")
    .setCharacteristic(Characteristic.Model, "Photon")
    .setCharacteristic(Characteristic.SerialNumber, "AABBCCDD1");
}

DoorAccessory.prototype.getState = function(callback) {
  this.log("Getting current state...");

  request.get({
    url: this.cloudURL + this.deviceID + '/doorStatus?access_token=' + this.access_token
  }, function(err, response, body) {
    if (!err && response.statusCode == 200) {
      var json = JSON.parse(body);
      var state = DoorAccessory.prototype.parseStatus(json.result);
      this.log("Door state is %s", state);
      var closed = state == "closed"
      callback(null, closed); // success
    } else {
      this.log("Error getting state: %s", err);
      callback(err);
    }
  }.bind(this));
}

DoorAccessory.prototype.setState = function(state, callback) {
    this.log("state = ", state);
    switch (state) {
      case 0:
        var doorState = 'open';
        break;
      case 1:
        var doorState = 'closed';
        break;
      case 2:
        var doorState = 'stop';
        break;
      case 3:
        var doorState = 'stop';
        break;
      case 4:
        var doorState = 'open';
        break;
    };

    this.log("Set state to %s", doorState);
    request.post({
      url: this.cloudURL + this.deviceID + '/setState',
      form: {
        access_token: this.access_token,
        args: doorState
      }
    }, function(err, response, body) {

      if (!err && response.statusCode == 200) {

        this.log("State change complete.");

        var currentState = (state == Characteristic.TargetDoorState.CLOSED) ? Characteristic.CurrentDoorState.CLOSED : Characteristic.CurrentDoorState.OPEN;

        this.garageservice
          .setCharacteristic(Characteristic.CurrentDoorState, currentState);
        callback(null); // success

      } else {

        this.log("Error '%s' setting door state. Response: %s", err, body);
        callback(err || new Error("Error setting door state."));
      }
    }.bind(this));
  },

  DoorAccessory.prototype.getOD = function(callback) {
    this.log("Get ObstructionDetected...");
    request.get({
      url: this.cloudURL + this.deviceID + '/doorStatus?access_token=' + this.access_token
    }, function(err, response, body) {
      if (!err && response.statusCode == 200) {
        callback(null, 0); // success
      } else {
        this.log("Error getting state: %s", err);
        this.log("This means your access token expired. Replace in config.json");
        callback(null, 1); // failed
      }
    }.bind(this));
  }

DoorAccessory.prototype.getServices = function() {
  return [this.garageservice];
}

DoorAccessory.prototype.parseStatus = function(p_status) {
  var split1 = p_status.split("|")
  var split2 = split1[0].split("=")
  var a_result = split2[1]
  return a_result;
}
