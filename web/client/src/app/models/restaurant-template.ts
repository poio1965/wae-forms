import { Media } from './media';

export class RestaurantTemplate {
    _id: string;
    name: string;
    address: string;
    googlePlaceId: string;
    lat: number;
    lng: number;
    tags: string[];
    media: Media[];


    constructor(){
        this._id = undefined;
        this.name = '';
        this.address = '';
        this.googlePlaceId = undefined;        
        this.lat = 0;
        this.lng = 0;
        this.tags = [];
        this.media = [];
    }
}
