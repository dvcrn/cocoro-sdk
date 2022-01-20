import { Device } from '../../device';
import {
	BinaryPropertyStatus,
	RangePropertyStatus,
	SinglePropertyStatus,
	ValueType,
} from '../../properties';
import { State8 } from '../../state';
import { StatusCode, ValueSingle } from './properties';

export class Aircon extends Device {
	/**
	 * Helper method to fetch the state-object 8 from the device
	 * This wraps getPropertyStatus, parsing and instantiating State8
	 *
	 * @return     {State8}  The state 8.
	 */
	getState8(): State8 {
		const state8Bin = this.getPropertyStatus(
			StatusCode.STATE_DETAIL,
		) as BinaryPropertyStatus;

		return new State8(state8Bin.valueBinary.code);
	}

	/**
	 * Gets the temperature.
	 *
	 * @return     {number}  The temperature.
	 */
	getTemperature(): number {
		return this.getState8().temperature;
	}

	/**
	 * Gets the room temperature.
	 *
	 * @return     {number}  The temperature.
	 */
	getRoomTemperature(): number {
		return parseInt(
			(
				this.getPropertyStatus(
					StatusCode.ROOM_TEMPERATURE,
				) as RangePropertyStatus
			).valueRange.code,
		);
	}

	/**
	 * Gets the windspeed.
	 *
	 * @return     {ValueSingle}  The windspeed.
	 */
	getWindspeed() {
		const ws = this.getPropertyStatus(
			StatusCode.WINDSPEED,
		) as SinglePropertyStatus;
		return ws.valueSingle.code;
	}

	/**
	 * Queues a temperature update
	 *
	 * @param      {number}  temp    The new temperature
	 */
	queueTemperatureUpdate(temp: number): void {
		const s8 = new State8();
		s8.temperature = temp;

		this.queuePropertyStatusUpdate({
			valueBinary: {
				code: s8.state,
			},
			statusCode: StatusCode.STATE_DETAIL,
			valueType: ValueType.BINARY,
		});
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
	 * Queues operation mode update
	 */
	queueOperationModeUpdate(
		mode:
			| ValueSingle.OPERATION_OTHER
			| ValueSingle.OPERATION_AUTO
			| ValueSingle.OPERATION_COOL
			| ValueSingle.OPERATION_HEAT
			| ValueSingle.OPERATION_DEHUMIDIFY
			| ValueSingle.OPERATION_VENTILATION,
	) {
		this.queuePropertyStatusUpdate({
			valueSingle: {
				code: mode,
			},
			statusCode: StatusCode.OPERATION_MODE,
			valueType: ValueType.SINGLE,
		});
	}

	/**
	 * Queues windspeed  update
	 */
	queueWindspeedUpdate(
		mode:
			| ValueSingle.WINDSPEED_LEVEL_1
			| ValueSingle.WINDSPEED_LEVEL_2
			| ValueSingle.WINDSPEED_LEVEL_3
			| ValueSingle.WINDSPEED_LEVEL_4
			| ValueSingle.WINDSPEED_LEVEL_5
			| ValueSingle.WINDSPEED_LEVEL_6
			| ValueSingle.WINDSPEED_LEVEL_7
			| ValueSingle.WINDSPEED_LEVEL_8
			| ValueSingle.WINDSPEED_LEVEL_AUTO,
	) {
		this.queuePropertyStatusUpdate({
			valueSingle: {
				code: mode,
			},
			statusCode: StatusCode.WINDSPEED,
			valueType: ValueType.SINGLE,
		});
	}
}
