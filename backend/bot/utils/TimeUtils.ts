export enum milisTime {
	second = 1000,
	minute = 60000,
	hour = 3600000,
	day = 86400000,
	week = 604800000
};

/**
 * Checks if the unit supplied is a valid unit of time.
 *
 * @param {any} unit Time unit to query
 * @returns {boolean} Whether the unit is valid or not
 */
export const isTimeUnit = (unit: any) => {
	if (!unit) return false;
    return unit in milisTime;
};

/**
 * Converts the time to miliseconds. Applies other time units if specified.
 * Default is 1 for time and seconds, so if you call it without parameters you will get 1 second in miliseconds.
 *
 * @param {number} time Amount of time to convert
 * @param {milisTime} unit Time unit
 *
 * @returns {number} Converted time to miliseconds, if -1 then invalid unit
 */
export const toMilis = (time = 1, unit: milisTime | string = milisTime.second) => {
	if (isTimeUnit(unit) === true) {
		return time * milisTime[unit as keyof typeof milisTime];
	} else {
		return -1;
	}
};
