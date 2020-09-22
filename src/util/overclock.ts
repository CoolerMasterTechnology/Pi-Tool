import { OverclockLevel, OverclockParameters } from '../models/index';

export const lookupOverclockLevel = (level: OverclockLevel): OverclockParameters => {
    switch (level) {
	case OverclockLevel.BaseClock:
	    return {
		arm_freq: 1500,
		gpu_freq: 500,
		over_voltage: 0
	    };
	case OverclockLevel.Level1:
	    return {
		arm_freq: 1650,
		gpu_freq: 550,
		over_voltage: 2
	    };
	case OverclockLevel.Level2:
	    return {
		arm_freq: 1800,
		gpu_freq: 600,
		over_voltage: 4
	    };
	case OverclockLevel.Level3:
	    return {
		arm_freq: 1950,
		gpu_freq: 650,
		over_voltage: 5
	    };
	default:
	    return {
		arm_freq: 1500,
		gpu_freq: 500,
		over_voltage: 0
	    };
    }
};

export const levelToString = (level: OverclockLevel): string => {
    switch (level) {
	case OverclockLevel.BaseClock:
	    return "Base level";
	case OverclockLevel.Level1:
	    return "+10%";
	case OverclockLevel.Level2:
	    return "+20%"
	case OverclockLevel.Level3:
	    return "+30%"
	default:
	    return "unknown"
    }
};

export const formatLevelValues = (level: OverclockLevel): string[] => {
    const params = lookupOverclockLevel(level);
    return [
	`arm_freq=${params.arm_freq}`,
	`gpu_freq=${params.gpu_freq}`,
	`over_voltage=${params.over_voltage}`
    ];
}
