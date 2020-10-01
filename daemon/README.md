# pi-tool-daemon

The daemon listens for websocket connections on port `9002`. It communicates via JSON messages. Make sure to run the daemon as root user, as it needs access to the following:

- the file `/boot/config.txt`, for the overclocking functionality
- GPIO sysfs interface, for the button remapping functionaliy
- `reboot`/`shutdown`, for overclocking and as button actions

This document provides notes regarding the implementation and websocket API.

## Implementation

More metrics can easily be added to the daemon, by implementing them in `src/metrics.rs`. Similarly, further button actions can be implemented in `src/mapping.rs`.

## API: Overclocking

You can send a command of the following format to the daemon in order to set up the configuration for overclocking:

```json
{
  "command": "Overclock",
  "params": {
    "arm_freq": [int],
    "gpu_freq": [int],
    "over_voltage": [int]
  }
}
```

For more information about these values, take a look at the [Pi Foundation's documentation](https://www.raspberrypi.org/documentation/configuration/config-txt/overclocking.md). You can find the values for the overclocking presets offered by the Pi Tool in the general README of this repository.

### Example

To overclock the Pi with a _+20%_ overclock level, we can send the following message to the daemon:

```json
{
  "command": "Overclock",
  "params": {
    "arm_freq": 1800,
    "gpu_freq": 600,
    "over_voltage": 4
  }
}
```

The daemon will then update (or add, if not previously added) the values in `/boot/config.txt`. Note that the daemon will preserve a user's previous configuration as a comment in said file. Now, we can restart the Pi by sending a `Reboot` command.

```json
{
  "command": "Reboot",
}
```

## API: Monitoring

Metrics can be obtained from the daemon by subscribing to a metric identifier (basically a topic). For all subscribed metrics the `daemon` takes a measurement every second and publishes it on the websocket.

### Metrics

Currently, the following metric identifiers are supported:

- `CpuTemp` (_value_ field is current core temperature in deg C multiplied by 10)
- `CpuFreq` (_value_ field is current core frequency in Hz`)
- `RamUsage` (_value_ field is used memory in bytes)
- `SysLoad` (_value_ field is system load average of last minute multiplied by 10)

### Subscription

To receive metric updates via the websocket connection, we can simply send a JSON message of the following format:


```json
{
  "command": "SubscribeMetric",
  "metric": "[metric identifier]"
}
```

The `daemon` will then continously emit measurement objects, which are documented below. You can unsubscribe via the following message:

```json
{
  "command": "UnubscribeMetric",
  "metric": "[metric identifier]"
}
```

## Measurements

Measurement objects are of the following format:

```json
{
  "event": "Measurement",
  "measurement": {
    "metric": [metric identifier],
    "value": [measured value],
    "timestamp": [timestamp in ms]
  }
}
```

## API: Button remapping

Button mappings can be synced via the daemon via a message of the following form:

```json
{
  "command": "SyncMappings",
  "mappings" [mappings directory]
}
```

### Mappings

The mappings have to be sent in an object where each key specifies an unique ID and its corresponding value specifies the mapping. Here is an example for a button mapping directory with a single button mapping that maps the button press sequence _short-long-short-long_ to a reboot action.

```json
{
  "75442486-0878-440c-9db1-a7006c25a39f": {
    "buttonPresses": [0, 1, 0, 1],
    "buttonAction": {
      "identifier": 1
    },
    "active": true
  }
}
```

The `buttonPresses` are given as either `0` and `1`, _short_ and _long_ button presse, respectively. The button actions have the following identifiers:

- `0`: Shutdown
- `1`: Reboot
- `2`: Launch script (given in optional field `scriptPath` in `buttonAction` object)
- `3`: Open in browser (with URL given in optional field `url` in `buttonAction` object)

**Only button mappings with `"active": true` are used by the daemon.`**

The shutdown and reboot actions are handled by the daemon itself, for other events, it emits a message on the websocket:

```json
{
  "event": "ButtonAction",
  "id": [mapping UID]
}
```
