import {
	StatusCode as PurifierStatusCode,
	ValueBinary as PurifierValueBinary,
	ValueSingle as PurifierValueSingle,
} from './devices/purifier/properties';

import {
	StatusCode as AirconStatusCode,
	ValueSingle as AirconValueSingle,
} from './devices/aircon/properties';

export type StatusCode = PurifierStatusCode | AirconStatusCode;
export type ValueSingle = PurifierValueSingle | AirconValueSingle;
export type ValueBinary = PurifierValueBinary;

export enum DeviceType {
	Unknown = 'UNKNOWN',
	AirCondition = 'AIR_CON',
	AirCleaner = 'AIR_CLEANER',
}

export enum ValueType {
	SINGLE = 'valueSingle',
	BINARY = 'valueBinary',
	RANGE = 'valueRange',
}

export interface BinaryPropertyStatus {
	valueBinary: {
		code: string;
	};
	statusCode: StatusCode;
	valueType: ValueType.BINARY;
}

export interface SinglePropertyStatus {
	valueSingle: {
		code: ValueSingle;
	};
	statusCode: StatusCode;
	valueType: ValueType.SINGLE;
}

export enum RangePropertyType {
	INT = 'int',
	FLOAT = 'float',
}

export interface RangePropertyStatus {
	valueRange: {
		code: string;
		type: RangePropertyType;
	};
	statusCode: StatusCode;
	valueType: ValueType.RANGE;
}

export type PropertyStatus =
	| SinglePropertyStatus
	| RangePropertyStatus
	| BinaryPropertyStatus;

export interface SingleProperty {
	statusName: string;
	statusCode: StatusCode;

	get: boolean;
	set: boolean;
	inf: boolean;

	valueType: ValueType.SINGLE;
	valueSingle: [
		{
			name: string;
			code: string;
		},
	];
}

export interface BinaryProperty {
	statusName: string;
	statusCode: StatusCode;

	get: boolean;
	set: boolean;
	inf: boolean;

	valueType: ValueType.BINARY;
}

export interface RangeProperty {
	statusName: string;
	statusCode: StatusCode;

	get: boolean;
	set: boolean;
	inf: boolean;

	valueType: ValueType.RANGE;
	valueRange: {
		type: RangePropertyType;
		min: string;
		max: string;
		step: string;
		unit: string;
	};
}

export type Property = SingleProperty | BinaryProperty | RangeProperty;
