import { ObjectId } from "mongodb"
import { type } from "os"

export type shipwreck = {
    _id?: ObjectId,
    name: string,
    location: string,
    boatType?: string,
    dateSunk?: number,
    notes?: string,
    coordinates: [
        latitude?: number,
        longitude?: number
    ],
    linkWiki?: string,
    linkImage?: string,
    stats: {
        grossTons?: number,
        length?: number,
        beam?: number,
        height?: number,
        waterDepth?: number,
    }
};