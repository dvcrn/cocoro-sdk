# Cocoro Air SDK

This is a work in progress attempt to reverse the cocoro air API from Sharp, used to control smart appliances through the internet

## Authentication

Currently to retrieve an API key, you'll have to use a reverse proxy like charles, mitmproxy or Proxyman to capture traffic sent from your device to the Cocoro air server

Lookout for the login call and extract the `appSecret` (url) and `terminalAppId` (body):

```
https://hms.cloudlabs.sharp.co.jp/hems/pfApi/ta/setting/login/?appSecret=xxxx&serviceName=iClub
```

The app is using SSL pinning so I wasn't able to figure out how the authentication works (yet).

## Usage

```ts
const appSecret = 'xxxx';
const appKey = 'xxxx';

const cocoro = new Cocoro(appSecret, appKey);
await cocoro.login();

const devices = await cocoro.queryDevices();
const device = devices[0];
console.log(device);
console.log(device.queryProperty(StatusCode.OPERATION_MODE));

device.queuePowerOn();
await cocoro.executeQueuedUpdates(device);
```

## API Details

Each device as multiple properties attached. Upon updating, the client sends either `valueRange`, `valueSingle` or `valueBinary` to the server together with a list of all properties needing to be updated.

Each device has a list of properties it supports, and each property has an optional flag if it can be set or get:

```ts
export interface BinaryProperty {
	statusName: string;
	statusCode: StatusCode;

	get: boolean;
	set: boolean;
	inf: boolean;

	valueType: ValueType.BINARY;
}
```

All property updates are getting batched and sent at once to the server to update the device state
