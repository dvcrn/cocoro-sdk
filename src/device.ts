import { default as fetchCookie } from 'fetch-cookie';
import nodeFetch from 'node-fetch';
import {
	BinaryPropertyStatus,
	Property,
	PropertyStatus,
	RangePropertyStatus,
	RangePropertyType,
	SinglePropertyStatus,
	SingleProperty,
	RangeProperty,
	BinaryProperty,
	StatusCode,
	ValueSingle,
	ValueType,
} from './properties';
import { State8 } from './state';
const fetch = fetchCookie(nodeFetch);

interface DeviceInit {
	name: string;
	deviceId: number;
	echonetNode: string;
	echonetObject: string;

	properties: [Property];
	status: [PropertyStatus];
}
/**
 * This class describes a device as represented by the Cocoro API
 * Each device has numerous properties that can or can not be queried, set or updated
 * Each device also contains the status of those properties
 *
 * @class      Device (name)
 */
export class Device {
	name: string;
	deviceId: number;
	echonetNode: string;
	echonetObject: string;

	readonly properties: [Property];
	status: [PropertyStatus];

	propertyUpdates: any;

	constructor({
		name,
		deviceId,
		echonetNode,
		echonetObject,
		properties,
		status,
	}: DeviceInit) {
		this.name = name;
		this.deviceId = deviceId;
		this.echonetNode = echonetNode;
		this.echonetObject = echonetObject;
		this.properties = properties;
		this.status = status;

		this.propertyUpdates = {};
	}

	queuePropertyUpdate(propertyStatus: PropertyStatus) {
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

	getProperty(statusCode: StatusCode | string) {
		for (const property of this.properties) {
			if (property.statusCode === statusCode) {
				switch (property.valueType) {
					case ValueType.SINGLE:
						return property as SingleProperty;
					case ValueType.RANGE:
						return property as RangeProperty;
					case ValueType.BINARY:
						return property as BinaryProperty;
				}
			}
		}

		return null;
	}

	getPropertyStatus(statusCode: StatusCode | string) {
		for (const status of this.status) {
			if (status.statusCode === statusCode) {
				switch (status.valueType) {
					case ValueType.SINGLE:
						return status as SinglePropertyStatus;
					case ValueType.RANGE:
						return status as RangePropertyStatus;
					case ValueType.BINARY:
						return status as BinaryPropertyStatus;
				}
			}
		}

		return null;
	}

	getState8(): State8 {
		const state8Bin = this.getPropertyStatus(
			StatusCode.STATE_DETAIL,
		) as BinaryPropertyStatus;

		return new State8(state8Bin.valueBinary.code);
	}

	getTemperature(): number {
		return this.getState8().temperature;
	}

	queueTemperatureUpdate(temp: number) {
		const s8 = this.getState8();
		s8.temperature = temp;

		this.queuePropertyUpdate({
			valueBinary: {
				code: s8.state,
			},
			statusCode: StatusCode.STATE_DETAIL,
			valueType: ValueType.BINARY,
		});
	}

	queuePowerOn() {
		this.queuePropertyUpdate({
			valueSingle: {
				code: ValueSingle.POWER_ON,
			},
			statusCode: StatusCode.POWER,
			valueType: ValueType.SINGLE,
		});
	}

	queuePowerOff() {
		this.queuePropertyUpdate({
			valueSingle: {
				code: ValueSingle.POWER_OFF,
			},
			statusCode: StatusCode.POWER,
			valueType: ValueType.SINGLE,
		});
	}
}
