![Pi Tool Logo](https://i.imgur.com/Mjtqx6w.png)

> Overclocking, monitoring, and button remapping utility for Raspberry Pi 4, designed for systems housed in the Cooler Master Pi Case 40.

The utility allows users access to a basic set of overclocking profiles, tested and validated based on the thermal performance of Cooler Master's Pi Case 40 enclosure, monitoring of system metrics, and assignment of multiple functions to the built-in button.

# Getting Started

The Pi Tool can be installed on Raspberry Pi OS on a Raspberry Pi 4. Installing it is very simply: Just open a terminal, paste the following line into it and hit return. The installer will then guide you through the installation. 

```sh
curl https://raw.githubusercontent.com/CoolerMasterTechnology/pi-tool/master/install.sh | sh
```

# Features

## Overclocking

The overclocking feature included in Pi Tool modifies the following values in `/boot/config.txt`: `over_voltage, arm_freq, gpu_freq`. Users can further modify the overclocking, by editing the values themselves. (`sudo nano /boot/config.txt`)

> :warning: *For this operation, a 3A 5V power supply is highly recommended.*

Overclocking may cause system instabilities, most show up immediately with a failure to boot. If this occurs, hold down the shift key during the next boot. This will temporarily disable all overclocking, allowing you to boot successfully and then edit your settings.

**Included overclocking presets**:

| Overclocking preset | Values |
|------------|----------|
| **Base** | Restores stock values |
| **10%** | <ul><li><code>arm_freq=1650</code></li><li><code>gpu_freq=550</code></li><li><code>over_voltage=2</code></li></ul> |
| **20%** | <ul><li><code>arm_freq=1800</code></li><li><code>gpu_freq=600</code></li><li><code>over_voltage=4</code></li></ul> |
| **20%** | <ul><li><code>arm_freq=1950</code></li><li><code>gpu_freq=650</code></li><li><code>over_voltage=5</code></li></ul> |

## System Monitoring

Pi Tool offers a section dedicated to monitoring the system's status and performance, useful to track thermal output and clock speed when adjusting overclocking settings and to have a quick visual representation of the system's status.

**Included metrics**:
- **Core Temperature**
- **Core Frequency**
- **RAM Usage**
- **System Load**

## Button Remapping

Pi Case 40 includes a button that shortens pin 5 and 6 when pressed (GPIO3 and GND). Out of the box, this allows us to wake up a Raspberry Pi from its halt state. Pi Tool builds upon this function by allowing users to not only assign a function to the button to be triggered when the system is running but also to set up sequences of short and long button presses, allowing additional functions to be triggered by the same button.

**Included button actions**:
- **System Shutdown**
- **System Restart**
- **Run Custom Script**
- **Open in Browser**

# Contributing

If you have any feature ideas, want to extend the tool with a button action or metric or found a bug, feel free to open an issue! *Make it yours.*

The daemon that collects metrics and listens for button presses is located under `daemon/`. Metrics or button actions can be added there in a straightforward way, but make sure to also adjust the Redux reducer in the frontend and add e.g. types and formatters for axis labels in the React application. 

For development, just run the daemon with `cargo run` and spin up a development server for the frontend with `yarn run start`. If you happen to use NixOS, there's also a `shell.nix` file which contains all the development dependencies. To build a package for testing, you can use `yarn run build` and `yarn run dist`.

# Pi Case 40

![Pi Case 40](https://ksr-ugc.imgix.net/assets/029/816/736/669da923362c4a113ce24401f08e11e6_original.png?ixlib=rb-2.1.0&crop=faces&w=1024&h=576&fit=crop&v=1594745435&auto=format&frame=1&q=92&s=b9f5d6055d6a3c2f8c1ea377f06bf08c)

> :sparkles: We recommend using the Pi Tool in conjuction with Cooler Master's Pi Case 40!

Pi Tool is designed to be used in conjunction with Pi Case 40. The overclocking profiles are defined based on the thermal performance of the enclosure, and the button remapping features is based on the physical implementation of the switch in Pi Case 40. Any user is free to install Pi Tool, although we strongly recommend to avoid overclocking on an un-cooled system via Pi Tool.

## Why is Cooler Master on GitHub?

Cooler Master recently entered the Raspberry Pi ecosystem with the Pi Case 40, a premium cooling enclosure for on-the-go Raspberry Pi users.

The project was fully funded in under an hour on Kickstarter and the goal behind the campaign was simple: develop everything based on the community's feedback and deliver what the community needs. All CAD files for the enclosure are publicly available on Cooler Master's website as well as some additional alternative designs for the users to play with.

Following the same "Make It Yours" philosophy we developed the Pi Tool utility, a simple platform that allows users to explore overclocking safely and customize how they interact with their Raspberry Pi based systems. We host this project on GitHub to allow downloading and remixing of the files to further improve the users' experience and enable them to share their work with others in the community!

[Pi Case 40 Kickstarter](https://www.kickstarter.com/projects/coolermaster/pi-case-40) • [Product Page](http://www.coolermaster.com/catalog/cases/raspberry-pi/pi-case-40/) • [Contact Us](https://account.coolermaster.com/IntroSupport.aspx)

## History of Cooler Master

Cooler Master Co., Ltd. is a computer hardware manufacturer based in Taiwan. Founded in 1992, the company produces computer cases, power supplies, air/liquid CPU coolers, laptop cooling pads, peripherals, and more.

Our components represent so many different personalities because our community does not fit into just one mold. It doesn’t matter if you’re a student on a tight budget, a graphic designer that’s brand new to building, or a veteran modder of high-end gaming PCs; we offer components to inspire creative freedom in everyone. **We believe that personal preference and individual expression leads to innovation.**

**Cooler Master's community is never short on feedback and strong opinions—we love that.** Hearing your thoughts and ideas allow us to be a part of your building journey, it helps us perfect the DIY experience, and it encourages us to adapt our product development process. After all, it is the community of builders, creators, and gamers who are an integral part of Cooler Master, helping bring our ideas to life. Together, we have been able to heighten the standards of how PCs are configured, transform the way they look and feel, and surpass the technological expectations of today. That’s where our passion stems from and that’s what it means to truly Make It Yours.

# Join our community!

[Reddit](https://www.reddit.com/r/coolermaster/) • [Facebook](https://www.facebook.com/coolermaster/) • [Instagram](https://www.instagram.com/coolermaster/) • [Youtube](https://www.youtube.com/channel/UCojNjp-K3t9NyTTlsFXQkGA) • [Twitter](https://twitter.com/CoolerMaster)
