# Cocoro Air SDK

This is a work in progress attempt to reverse-engineer the cocoro air API from Sharp, used to control smart appliances through the internet

## Authentication

Currently to retrieve an API key, you'll have to use a reverse proxy like charles, mitmproxy or Proxyman to capture traffic sent from your device to the Cocoro air server. Set the proxy on your device, open the app an lookout for the login API call. Extract the `appSecret` from the URL, and the `terminalAppId` from the body:

```
https://hms.cloudlabs.sharp.co.jp/hems/pfApi/ta/setting/login/?appSecret=xxxx&serviceName=iClub
```

For the `terminalAppId`, you only need the part after `/key/`

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

### Annoyances & caveats

Sometimes the API is very specific about what you have to submit for stuff to work, for example to change the temperature it isn't enough to just change the temperature, you have to queue a power state as well:

```
this.device.queueTemperatureUpdate(26.5);
this.device.queuePowerOn();
```

If something doesn't work, check how the app is doing it and replicate that

### Decoding the state object

A lot of things are changeable just by their own properties, but some things aren't. There are a few big state objects like `FA` that look like this: 

```
55000020000000000000000000000000010000000000010000003500000000000000010000010042010000000000000000FF000000000000000038000000000000000000000000000000000000000000
```

Position 52,53 contain the hex-encoded temperature multiplied by 2 (since the app allows 0.5 degree steps). I started decoding this in `state.ts`, but temperature is the only thing that's being available in this SDK yet. 

Swing is also encoded in this state object.

`F4` towards `FF` are labeled `運転状態詳細1` ~ `1運転状態詳細13` by the API (`FA` is `8`), most of them aren't used for the aircon I own but for yours they might :D 

## License

AGPL
