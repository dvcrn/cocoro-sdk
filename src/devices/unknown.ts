import { Device } from '../device';

export class UnknownDevice extends Device {
	queuePowerOff(): void {
		console.error('not implemented');
	}

	queuePowerOn(): void {
		console.error('not implemented');
	}
}
