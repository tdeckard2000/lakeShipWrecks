import { ObjectId } from "mongodb"

export interface Shipwreck {
    _id: ObjectId;
    name: string;
    location: string;
    boatType?: string;
    dateSunk?: number;
    notes?: string;
    coordinates: {
        latitude?: number;
        longitude?: number;
    };
    linkWiki?: string;
    linkImage?: string;
    stats: {
        grossTons?: number;
        length?: number;
        beam?: number;
        height?: number;
        waterDepth?: number;
    }
    isMissing?: boolean;
};

export interface ShipwreckFilters {
    hideOffscreen: boolean;
    wreckDepthMin: number;
    wreckDepthMax: number;
    sinkYearMin: number;
    sinkYearMax: number;
    weightMin: number;
    weightMax: number;
    shipLengthMin: number;
    shipLengthMax: number;
    listMissingShips: boolean;
    sortBy: string;
}

export interface MapProperties {
    lng: number,
    lat: number,
    zoom: number
}