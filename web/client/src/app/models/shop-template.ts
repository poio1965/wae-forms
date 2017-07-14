import { Media } from './media';

export class ShopTemplate {
    _v: number;
    _id: string;
    name: string;
    address: string;
    googlePlaceId: string;
    lat: number;
    lng: number;
    tags: string[];
    media: Media[];
    field1: string;
    field2: string;
    field3: string;


    constructor(){
        this._v = 0;
        this._id = undefined;
        this.name = '';
        this.address = '';
        this.googlePlaceId = undefined;        
        this.lat = 0;
        this.lng = 0;
        this.tags = [];
        this.media = [];
        this.field1 = '';
        this.field2 = '';
        this.field3 = '';
    }
}
