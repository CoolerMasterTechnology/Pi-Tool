// Overclocking models

export enum OverclockLevel {
    BaseClock,
    Level1,
    Level2,
    Level3,
};

export interface OverclockParameters {
    arm_freq: number,
    gpu_freq: number,
    over_voltage: number
};

export interface OverclockState {
    level: OverclockLevel
    enabled: boolean,
    rebootRequired: boolean
};

// Monitoring models

export interface MonitoringState {
    activeMetrics: {
        [K in MonitoringMetric]: {
            active: boolean
        }
    }
}

export enum MonitoringMetric {
    CpuTemperature = 'CpuTemp',
    CpuFrequency = 'CpuFreq',
    RamUsage = 'RamUsage',
    SystemLoad = 'SysLoad'
}

// Button mapping models

export enum ButtonPress {
    Short,
    Long
}


export class ButtonAction {
    identifier: ButtonActionIdentifier;
    url?: string;
    scriptPath: string;

    constructor(identifier: ButtonActionIdentifier) {
        this.identifier = identifier;
    }
}



export enum ButtonSystemAction {
    Shutdown,
    Reboot,
}

// export interface ButtonScriptAction {
//     script: string
// }

// export interface ButtonBrowserAction {
//     url: string
// }

export enum ButtonActionIdentifier {
    SystemShutdown,
    SystemReboot,
    Script,
    Browser
}

// export type ButtonAction = ButtonSystemAction | ButtonScriptAction | ButtonBrowserAction;

export interface ButtonMapping {
    buttonPresses: ButtonPress[],
    buttonAction: ButtonAction,
    active: boolean
}

export interface ButtonMappingState {
    mappings: {
        [key: string]: ButtonMapping
    }
}

// Communication models

export enum Command {
    Overclock = 'Overclock',
    Reboot = 'Reboot',
    SubscribeMetric = 'SubscribeMetric',
    UnsubscribeMetric = 'UnsubscribeMetric',
    SyncMappings = 'SyncMappings'
}

export interface CommandMessage {
    command: Command,
    params?: OverclockParameters,
    metric?: MonitoringMetric,
    mappings?: ButtonMapping[]
}


export enum EventType {
    Measurement = 'Measurement',
    ButtonAction = 'ButtonAction'
}

export interface Measurement {
    metric: MonitoringMetric,
    value: number,
    timestamp: number
}

export interface EventMessage {
    event: EventType
    measurement?: Measurement
}
