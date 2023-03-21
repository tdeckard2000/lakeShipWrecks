import { ObjectId } from "mongodb"

export interface shipwreck {
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
};

export interface shipwreckFilters {
    hideOffscreen: boolean;
    wreckDepthMin: number;
    wreckDepthMax: number;
    sinkYearMin: number;
    sinkYearMax: number;
    weightMin: number;
    weightMax: number;
    shipLengthMin: number;
    shipLengthMax: number;
    shipIsMissing: boolean;
}