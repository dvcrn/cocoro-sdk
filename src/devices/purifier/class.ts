import { Device } from '../../device';
import {
	BinaryPropertyStatus,
	PropertyStatus,
	StatusCode,
	valueBinary,
	ValueSingle,
	ValueType,
	mode,
} from './properties';

export class Purifier extends Device {
	constructor(props) {
		super(props);
	}

	/**
	 * Queues a power on action
	 */
	queuePowerOn(): void {
		this.queuePropertyStatusUpdate({
			valueSingle: {
				code: ValueSingle.POWER_ON,
			},
			statusCode: StatusCode.POWER,
			valueType: ValueType.SINGLE,
		});
	}

	/**
	 * Queues a power off action
	 */
	queuePowerOff(): void {
		this.queuePropertyStatusUpdate({
			valueSingle: {
				code: ValueSingle.POWER_OFF,
			},
			statusCode: StatusCode.POWER,
			valueType: ValueType.SINGLE,
		});
	}

	/**
	 * Convert mode string to binary.
	 * @return     {string}  mode binary
	 */
	existMode = (mode: string): string => {
		switch (mode) {
			case 'pollen':
				return valueBinary.OPERATION_POLLEN;
			case 'realization':
				return valueBinary.OPERATION_REALIZE;
			case 'ai_auto':
				return valueBinary.OPERATION_AI_AUTO;
			case 'auto':
				return valueBinary.OPERATION_AUTO;
			case 'night':
				return valueBinary.OPERATION_NIGHT;
			case 'silent':
				return valueBinary.OPERATION_SILENT;
			case 'medium':
				return valueBinary.OPERATION_MEDIUM;
			case 'high':
				return valueBinary.OPERATION_HIGH;
			default:
				return '';
		}
	};

	/**
	 * Queues a specific propertyStatus for change
	 * This alone does not do anything, the changes need to get transmitted to the
	 * cocoro air api
	 *
	 * @param      {PropertyStatus}  propertyStatus  The property status
	 */
	queuePropertyStatusUpdate(propertyStatus: PropertyStatus): void {
		for (const property of this.properties) {
			if (property.statusCode !== propertyStatus.statusCode) {
				continue;
			}

			if (property.set !== true) {
				throw new Error(`property ${property.statusName} is not settable`);
			}

			this.propertyUpdates[property.statusCode] = propertyStatus;
			return;
		}

		throw new Error(
			`property ${propertyStatus.statusCode} does not exist on this device`,
		);
	}

	/**
	 * Change mode.
	 */
	setMode(mode: string, callback?): void {
		if (!mode || typeof mode !== 'string') throw new Error('invalid parameter');

		const _mode: string = this.existMode(mode);

		if (_mode) {
			this.queuePropertyStatusUpdate({
				valueBinary: {
					code: _mode,
				},
				statusCode: StatusCode.OPERATION_MODE,
				valueType: ValueType.BINARY,
			});

			if (callback) callback();
		}
	}

	/**
	 * Turn on humidification.
	 */
	startHumidity(callback?): void {
		this.queuePropertyStatusUpdate({
			valueBinary: {
				code: valueBinary.HUMIDITY_ON,
			},
			statusCode: StatusCode.OPERATION_MODE,
			valueType: ValueType.BINARY,
		});

		if (callback) callback();
	}

	/**
	 * Turn off humidification.
	 */
	stopHumidity(callback?): void {
		this.queuePropertyStatusUpdate({
			valueBinary: {
				code: valueBinary.HUMIDITY_OFF,
			},
			statusCode: StatusCode.OPERATION_MODE,
			valueType: ValueType.BINARY,
		});

		if (callback) callback();
	}

	/**
	 * Split the string and return it.
	 *
	 * @return     {Array<string>}  split state
	 */
	chunkState(state: string): Array<string> {
		return state.match(/.{2}/g) as Array<string>;
	}

	/**
	 * Gets the temperature.
	 *
	 * @return     {number}  The temperature.
	 */
	getTemperature(): number {
		const state = this.getPropertyStatus(
			StatusCode.STATE_DETAIL,
		) as BinaryPropertyStatus;

		const chunkCode = this.chunkState(state.valueBinary.code);
		return parseInt(chunkCode[3], 16);
	}

	/**
	 * Gets the humidity.
	 *
	 * @return     {number}  The humidity.
	 */
	getHumidity(): number {
		const state = this.getPropertyStatus(
			StatusCode.STATE_DETAIL,
		) as BinaryPropertyStatus;

		const chunkCode = this.chunkState(state.valueBinary.code);
		return parseInt(chunkCode[4], 16);
	}

	/**
	 * Gets the mode.
	 *
	 * @return     {string}  The mode.
	 */
	getMode(): string {
		const state = this.getPropertyStatus(
			StatusCode.OPERATION_MODE,
		) as BinaryPropertyStatus;

		const modeNum = this.chunkState(state.valueBinary.code)[4];

		switch (modeNum) {
			case mode.AI_AUTO:
				return 'ai_auto';
			case mode.AUTO:
				return 'auto';
			case mode.POLLEN:
				return 'pollen';
			case mode.NIGHT:
				return 'night';
			case mode.REALIZE:
				return 'realize';
			case mode.SILENT:
				return 'silent';
			case mode.MEDIUM:
				return 'medium';
			case mode.HIGH:
				return 'high';
			default:
				return '';
		}
	}
}
