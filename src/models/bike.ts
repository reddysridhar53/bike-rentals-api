type BikeT = {
    model: string;
    colors: string[];
    location: { 
        latitude: string;
        longitude: string;
        name: string;
    };
    rating: number;
    ratingNum?: number;
    isAvailableForRent: boolean;
    photo?: string;
    locationString?: string
}

export { BikeT };
