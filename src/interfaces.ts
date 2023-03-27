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

export interface MapFeature {
        id: number,
        layer: {
            id: string
            layout: {
                'icon-image': string,
                'icon-size': number
            },
            source: string,
            type: string
        },
        properties: {
            description: string
        },
        source: string,
        type: string,
        geometry: {
            type: string,
            coordinates: number[]   
        }
}

export interface MapSelection {
    features: [
        MapFeature
    ],
    lngLat: {
        lat: number,
        lng: number
    },
    originalEvent: {
        altKey: boolean,
        ctrlKey: boolean,
        shiftKey: boolean,
        type: string
    },
    point: {
        x: number,
        y: number
    },
    type: string
}