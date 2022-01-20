import { Device } from '../../device';
import {
	StatusCode,
	valueBinary,
	ValueSingle,
	modeCode,
	modeType,
} from './properties';

import {
	BinaryPropertyStatus,
	PropertyStatus,
	ValueType,
} from '../../properties';

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
	 * Queues a specific propertyStatus for change
	 * This alone does not do anything, the changes need to get transmitted to the
	 * cocoro air api
	 *
	 * @param      {PropertyStatus}  propertyStatus  The property status
	 */
	queuePropertyStatusUpdate(propertyStatus: any): void {
		super.queuePropertyStatusUpdate(propertyStatus);
	}

	/**
	 * Convert mode string to binary.
	 * @access     private
	 * @return     {string}  mode binary
	 */
	private stringToMode = (mode: string): string => {
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
	 * Change mode.
	 * @param      {modeType}  mode  The mode to string
	 */
	setMode(mode: modeType): void {
		if (!mode || typeof mode !== 'string') throw new Error('invalid parameter');

		const _mode: string = this.stringToMode(mode);

		if (_mode) {
			this.queuePropertyStatusUpdate({
				valueBinary: {
					code: _mode,
				},
				statusCode: StatusCode.OPERATION_MODE,
				valueType: ValueType.BINARY,
			});
		}
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
			case modeCode.AI_AUTO:
				return 'ai_auto';
			case modeCode.AUTO:
				return 'auto';
			case modeCode.POLLEN:
				return 'pollen';
			case modeCode.NIGHT:
				return 'night';
			case modeCode.REALIZE:
				return 'realize';
			case modeCode.SILENT:
				return 'silent';
			case modeCode.MEDIUM:
				return 'medium';
			case modeCode.HIGH:
				return 'high';
			default:
				return '';
		}
	}

	/**
	 * Turn on humidification.
	 */
	startHumidity(): void {
		this.queuePropertyStatusUpdate({
			valueBinary: {
				code: valueBinary.HUMIDITY_ON,
			},
			statusCode: StatusCode.OPERATION_MODE,
			valueType: ValueType.BINARY,
		});
	}

	/**
	 * Turn off humidification.
	 */
	stopHumidity(): void {
		this.queuePropertyStatusUpdate({
			valueBinary: {
				code: valueBinary.HUMIDITY_OFF,
			},
			statusCode: StatusCode.OPERATION_MODE,
			valueType: ValueType.BINARY,
		});
	}

	/**
	 * Split the string and return it.
	 *
	 * @access     private
	 * @return     {Array<string>}  split state
	 */
	private chunkState(state: string): Array<string> {
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
}
