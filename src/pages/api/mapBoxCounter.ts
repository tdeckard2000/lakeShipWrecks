import { ObjectId } from 'mongodb';
import type { NextApiRequest, NextApiResponse } from 'next';
import clientPromise from '../../../lib/mongodb';

export default async function handler( req: NextApiRequest, res: NextApiResponse) {
    let response:number;
    if (req.method === "GET") {
        //get the current mapbox load count
        response = await getCurrentMapboxLoadCount();
        res.send(response);
    } else if(req.method === "POST") {
        const body = JSON.parse(req.body);
        const currentMapboxLoadCount = body.currentMapboxLoadCount;
        await incrementMapboxLoadCount(currentMapboxLoadCount);
        res.status(200).send("updated");
    }
}

const getCurrentMapboxLoadCount = async function() {
    try {
        const client = await clientPromise;
        const db = client.db("main");
        const res = await db.collection("stats").find({name: "mapboxLoadCount"}).toArray();
        console.log("found == ", res[0].count)
        return res[0].count as number;
     } catch (e) {
        console.warn("error: ", e)
        throw new Error(e as string).message;
    }
}

const incrementMapboxLoadCount = async function(currentCount: number) {
    try {
        const client = await clientPromise;
        const db = client.db("main");
        const res = await db.collection("stats").findOneAndUpdate({name: "mapboxLoadCount"}, {$set: {"count": currentCount + 2}})
        return res;
     } catch (e) {
        console.warn("error: ", e)
        throw new Error(e as string).message;
    }
}