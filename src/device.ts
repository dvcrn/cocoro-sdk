import { default as fetchCookie } from 'fetch-cookie';
import nodeFetch from 'node-fetch';
import {
	Property,
	PropertyStatus,
	RangePropertyType,
	StatusCode,
	ValueSingle,
	ValueType,
} from './properties';
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

	queryProperty(statusCode: StatusCode | string) {
		for (const property of this.properties) {
			if (property.statusCode === statusCode) {
				return property;
			}
		}

		return null;
	}

	queryPropertyStatus(statusCode: StatusCode | string) {
		for (const status of this.status) {
			if (status.statusCode === statusCode) {
				return status;
			}
		}

		return null;
	}
}
