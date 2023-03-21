import { ObjectId } from 'mongodb';
import type { NextApiRequest, NextApiResponse } from 'next';
import clientPromise from '../../../lib/mongodb';
import { Shipwreck, ShipwreckFilters } from '@/interfaces';

export default async function handler( req: NextApiRequest, res: NextApiResponse) {
    let response: Shipwreck[] = [];
    if (req.method === "GET") {
        if (Object.keys(req.query)[0] === undefined) {
            response = await getAllShips();
        } else if (Object.keys(req.query)[0].toLowerCase() === "filterparams") {
            if(req.query.filterParams && typeof req.query.filterParams === "string"){
                const filterParams = (JSON.parse(req.query.filterParams));
                response = await getFilteredShips(filterParams);
            } else {
                res.status(400).send("No Parameters Provided")
                return;
            }
        } else {
            console.warn("unexpected shipwrecks API parameter")
        }

    } else if(req.method === "POST") {
        console.log("POST Request")
    }
    res.status(200).send(response)
}

const getAllShips = async function() {
    try {
        const client = await clientPromise;
        const db = client.db("main");
        const res = await db.collection("shipwrecks").find().toArray();
        return res as Shipwreck[];
     } catch (e) {
        console.warn("error: ", e)
        throw new Error(e as string).message;
    }
}

const getFilteredShips = async function (filterParams: ShipwreckFilters) {
    const query = buildFilterQuery(filterParams)
    try {
        const client = await clientPromise;
        const db = client.db("main");
        console.log(query)
        const res = await db.collection("shipwrecks").find(query).toArray();
        return res as Shipwreck[];
     } catch (e) {
        console.warn("error: ", e)
        throw new Error(e as string).message;
    }
}

const buildFilterQuery = function (filterParams: ShipwreckFilters) {
    const p = filterParams;
    let query: any = {};
    query['$and'] = [];
    if (p.hideOffscreen) {
        //do something
    }
    if (p.wreckDepthMin != 0) {
        query['$and'].push({'stats.waterDepth': {$gte: Number(p.wreckDepthMin)}});
    }
    if (p.wreckDepthMax != 0) {
        query['$and'].push({'stats.waterDepth': {$lte: Number(p.wreckDepthMax)}});
    }
    if (p.sinkYearMin != 0) {
        //Dates are stored as year/month/day ex.20230310
        //min year must start at beginning of that year (Jan 01)
        const year = Number(p.sinkYearMin + '0101')
        query['$and'].push({'dateSunk': {$gte: year}});
    }
    if (p.sinkYearMax != 0) {
        //Dates are stored as year/month/day ex.20230310
        //max year must extend to end of that year (Dec 31)
        const year = Number(p.sinkYearMax + '1231')
        query['$and'].push({'dateSunk': {$lte: year}});
    }
    if (p.weightMin != 0) {
        query['$and'].push({'stats.grossTons': {$gte: Number(p.weightMin)}});
    }
    if (p.weightMax != 0) {
        query['$and'].push({'stats.grossTons': {$lte: Number(p.weightMax)}});
    }
    if (p.shipLengthMin != 0) {
        query['$and'].push({'stats.length': {$gte: Number(p.shipLengthMin)}});
    }
    if (p.shipLengthMax != 0) {
        query['$and'].push({'stats.length': {$lte: Number(p.shipLengthMax)}});
    }
    if (p.listMissingShips != false) {
        query['$and'].push({'isMissing': true});
    }

    if(query['$and'].length) {
        return query;
    } else {
        return {}
    }
}