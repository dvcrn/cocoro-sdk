import { DeviceType, Property, PropertyStatus } from './properties';

export interface Box {
	boxId: string;
	maxFlag: boolean;
	pairingFlag: boolean;
	pairedTerminalNum: number;
	timezone: string;

	terminalAppInfo: [
		{
			terminalAppId: string;
			appName: string;
			userNumber: number;
		},
	];

	echonetData: [
		{
			maker: string;
			series: string;
			model: string;
			serialNumber: string;
			echonetNode: string;
			echonetObject: string;
			echonetAttr: string;
			echonetProperty: string;
			deviceId: number;
			simulPerfModeFlag: boolean;
			propertyUpdatedAt: string;

			labelData: {
				id: number;
				place: string;
				name: string;
				deviceType: DeviceType;
				zipCd: string;
				yomi: string;
				lSubInfo: string;
			};
		},
	];
}

export interface QueryBoxesResponse {
	box: [Box];
}

export interface QueryDevicePropertiesResponse {
	deviceProperty: {
		deviceId: number;
		echonetNode: string;
		echonetObject: string;
		registerlevel: number;
		label: string;
		className: string;
		maker: string;
		series: string;
		model: string;
		place: string;
		propertyUpdatedAt: string;
		property: [Property];
		status: [PropertyStatus];
	};
}

export interface ControlListResponse {
	controlList: { id: null | string; errorCode: string }[];
}
