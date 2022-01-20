import { default as fetchCookie } from 'fetch-cookie';
import nodeFetch from 'node-fetch';
import {
	BinaryProperty,
	BinaryPropertyStatus,
	DeviceType,
	Property,
	PropertyStatus,
	RangeProperty,
	RangePropertyStatus,
	SingleProperty,
	SinglePropertyStatus,
	StatusCode,
	ValueType,
} from './properties';
import { Box } from './responseTypes';
const fetch = fetchCookie(nodeFetch);

interface DeviceInit {
	name: string;
	kind: DeviceType;
	deviceId: number;
	echonetNode: string;
	echonetObject: string;

	properties: Property[];
	status: PropertyStatus[];

	maker: string;
	model: string;
	serialNumber: string;

	box: Box;
}
/**
 * This class describes a device as represented by the Cocoro API
 * Each device has numerous properties that can or can not be queried, set or updated
 * Each device also contains the status of those properties
 *
 * @class      Device (name)
 */
export abstract class Device {
	name: string;
	kind: DeviceType;
	deviceId: number;
	echonetNode: string;
	echonetObject: string;

	readonly properties: Property[];
	status: PropertyStatus[];

	propertyUpdates: any;
	maker: string;
	model: string;
	serialNumber: string;

	box: Box;

	constructor({
		name,
		kind,
		deviceId,
		echonetNode,
		echonetObject,
		properties,
		status,
		maker,
		model,
		serialNumber,
		box,
	}: DeviceInit) {
		this.name = name;
		this.kind = kind;
		this.deviceId = deviceId;
		this.echonetNode = echonetNode;
		this.echonetObject = echonetObject;
		this.properties = properties;
		this.status = status;

		this.propertyUpdates = {};

		this.maker = maker;
		this.model = model;
		this.serialNumber = serialNumber;
		this.box = box;
	}

	// common methods each device has to implement
	abstract queuePowerOn(): void;
	abstract queuePowerOff(): void;

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
	 * Returns a property from the device if it exists, null otherwise
	 *
	 * @param      {(StatusCode|string)}  statusCode  The status code to query
	 * @return     {Property|null}        The property.
	 */
	getProperty(statusCode: StatusCode | string): Property | null {
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

	/**
	 * Returns a property status from the device if it exists, null otherwise
	 *
	 * @param      {(StatusCode|string)}  statusCode  The status code
	 * @return     {PropertyStatus|null}  The property status.
	 */
	getPropertyStatus(statusCode: StatusCode | string): PropertyStatus | null {
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
}
