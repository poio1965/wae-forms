export class Media {
	_id: string;
	name: string;
	type: string;
	url: string;
	unattachedResource: boolean;

	constructor() {
		this._id = undefined;
		this.name = '';
		this.type = '';
		this.url = '';
		this.unattachedResource = false;
	}
}
