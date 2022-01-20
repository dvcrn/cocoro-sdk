import { Device } from '../../device';
import { BinaryPropertyStatus, ValueType } from '../../properties';
import {
	ModeCode,
	ModeType,
	StatusCode,
	ValueBinary,
	ValueSingle,
} from './properties';

export class Purifier extends Device {
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
	 * @access     private
	 * @return     {string}  mode binary
	 */
	private valueBinaryForMode = (mode: ModeType): string => {
		switch (mode) {
			case 'pollen':
				return ValueBinary.OPERATION_POLLEN;
			case 'realize':
				return ValueBinary.OPERATION_REALIZE;
			case 'ai_auto':
				return ValueBinary.OPERATION_AI_AUTO;
			case 'auto':
				return ValueBinary.OPERATION_AUTO;
			case 'night':
				return ValueBinary.OPERATION_NIGHT;
			case 'silent':
				return ValueBinary.OPERATION_SILENT;
			case 'medium':
				return ValueBinary.OPERATION_MEDIUM;
			case 'high':
				return ValueBinary.OPERATION_HIGH;
			default:
				return '';
		}
	};

	/**
	 * Change mode.
	 * @param      {ModeType}  mode  The mode to string
	 */
	setMode(mode: ModeType): void {
		const _mode: string = this.valueBinaryForMode(mode);

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
			case ModeCode.AI_AUTO:
				return 'ai_auto';
			case ModeCode.AUTO:
				return 'auto';
			case ModeCode.POLLEN:
				return 'pollen';
			case ModeCode.NIGHT:
				return 'night';
			case ModeCode.REALIZE:
				return 'realize';
			case ModeCode.SILENT:
				return 'silent';
			case ModeCode.MEDIUM:
				return 'medium';
			case ModeCode.HIGH:
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
				code: ValueBinary.HUMIDITY_ON,
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
				code: ValueBinary.HUMIDITY_OFF,
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
