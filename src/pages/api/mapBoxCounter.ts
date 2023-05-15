import { ObjectId } from 'mongodb';
import type { NextApiRequest, NextApiResponse } from 'next';
import clientPromise from '../../../lib/mongodb';

export default async function handler( req: NextApiRequest, res: NextApiResponse) {
    let response:number;
    if (req.method === "GET") {
        //get the current mapbox load count
        response = await getCurrentMapboxLoadCount();
    } else if(req.method === "POST") {
        console.log("POST Request")
    }
    res.status(200).send("finished")
}

const getCurrentMapboxLoadCount = async function() {
    try {
        const client = await clientPromise;
        const db = client.db("main");
        const res = await db.collection("stats").find().toArray();
        return res[0].mapboxLoadCount as number;
     } catch (e) {
        console.warn("error: ", e)
        throw new Error(e as string).message;
    }
}
