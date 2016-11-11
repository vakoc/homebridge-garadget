**Garadget device plugin for Homebridge**
-------------------------------------
Homekit Integration for Garadget using Homebridge.

#Updates:

Currently this plugin is in working condition.

#ToDo:

* Get it on NPM

* Get it on platforms

Like homebridge-particle.

* Bypass Homekit's "Do you want {Homekit} to run "EnterTrigger" now?"

I'll bypass it by allowing another adding another accessory with the same deviceID and access_token. This accessory will act as a light switch by changing the value "bypass": "yes/no". Then hide it by not adding it to favorites. Add it to the scene. Tutorial will be made.

* Instructions/Wiki

#Thanks

http://community.garadget.com/

https://github.com/nfarina/homebridge

https://github.com/EricConnerApps/homebridge-httpdoor

https://github.com/krvarma/homebridge-particle

#A sample configuration file:
```JSON
{
  "bridge": {
    "name": "Homebridge",
    "username": "CC:22:3D:E3:CE:39",
    "port": 51826,
    "pin": "031-45-154"
  },

  "description": "Garadget as an accessory.",
  "accessories": [{
    "accessory": "Garadget",
    "name": "Garage Door",
    "cloudURL": "https://api.particle.io/v1/devices/",
    "deviceID": "<<Device ID>>",
    "access_token": "<<Access Token>>"
  }],
  "platforms": [

  ]
}
```
