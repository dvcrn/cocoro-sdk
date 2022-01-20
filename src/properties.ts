export enum DeviceType {
	AIR_CLEANER = 'AIR_CLEANER',
}

export enum StatusCode {
	STATE_DETAIL = 'FA',
	WINDSPEED = 'A0',
	POWER = '80',
	NANOE_MODE = 'CF',
	OPERATION_MODE = 'B0',
	HEAT_TEMPERATURE = 'B3',
	ROOM_TEMPERATURE = 'BB',
}

export enum ValueSingle {
	POWER_ON = '30',
	POWER_OFF = '31',

	NANOE_ON = '41',
	NANOE_OFF = '42',

	OPERATION_OTHER = '40',
	OPERATION_AUTO = '41',
	OPERATION_COOL = '42',
	OPERATION_HEAT = '43',
	OPERATION_DEHUMIDIFY = '44',
	OPERATION_VENTILATION = '45',

	WINDSPEED_LEVEL_1 = '31',
	WINDSPEED_LEVEL_2 = '32',
	WINDSPEED_LEVEL_3 = '33',
	WINDSPEED_LEVEL_4 = '34',
	WINDSPEED_LEVEL_5 = '35',
	WINDSPEED_LEVEL_6 = '36',
	WINDSPEED_LEVEL_7 = '37',
	WINDSPEED_LEVEL_8 = '38',
	WINDSPEED_LEVEL_AUTO = '41',
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
