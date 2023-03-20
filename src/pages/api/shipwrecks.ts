import { ObjectId } from 'mongodb';
import type { NextApiRequest, NextApiResponse } from 'next';
import clientPromise from '../../../lib/mongodb';
import { shipwreck } from '@/types';

export default async function handler( req: NextApiRequest, res: NextApiResponse) {
    let response: shipwreck[] = [];
    if (req.method === "GET") {
        switch(Object.keys(req.query)[0]) {
            case undefined:
                response = await getAllShips();
                break;
            case "getBySinkYear":
                if(typeof req.query.getBySinkYear === "string") {
                    const yearRange = req.query.getBySinkYear.split(",");
                    const fromYear = yearRange[0];
                    const toYear = yearRange[1];
                    response = await getShipsBySinkYear(fromYear, toYear);
                }
                break;
            case "getByLocation":
                const location = req.query.getByLocation;
                if(typeof(location) === "string") {
                    response = await getShipsByLocation(location);
                }
                break;
            default:
                console.warn("unexpected shipwrecks API state")
                break;
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
        return res as shipwreck[];
     } catch (e) {
        console.warn("error: ", e)
        throw new Error(e as string).message;
    }
}

const getShipsByLocation = async function(location: string) {
    try {
        const client = await clientPromise;
        const db = client.db("main");
        const res = await db.collection("shipwrecks").find({location: location}).toArray();
        return res as shipwreck[];
     } catch (e) {
        console.warn("error: ", e)
        throw new Error(e as string).message;
    }
}

const getShipsBySinkYear = async function(fromYear: string, toYear: string) {
    //Dates are stored as year/month/day ex.20230310
    //Years must be converted to this format to query database
    const fromDate = Number(fromYear + "0101"); //start of year
    const toDate = Number(toYear + "1231"); //end of year
    try {
        const client = await clientPromise;
        const db = client.db("main");
        console.log(fromDate, " - ", toDate)
        const res = await db.collection("shipwrecks").find({dateSunk: {$gte: fromDate, $lte: toDate}}).toArray();
        return res as shipwreck[];
     } catch (e) {
        console.warn("error: ", e)
        throw new Error(e as string).message;
    }
}