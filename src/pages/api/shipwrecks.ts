import { ObjectId } from 'mongodb';
import type { NextApiRequest, NextApiResponse } from 'next';
import clientPromise from '../../../lib/mongodb';

type shipwreck = {
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
}

export default async function handler( req: NextApiRequest, res: NextApiResponse) {

    try {
        const client = await clientPromise;
        const db = client.db("posts");
        console.log("client.db: ", client.db)
        const { title, content } = req.body;
    
        const post = await db.collection("posts").insertOne({
          name: 'test',
          location: 'test'
        });
    
        res.json(post);
      } catch (e) {
        console.error(e);
        throw new Error(e as string).message;
      }

    let response: shipwreck[];
    if (req.method === "GET") {
        console.log(req.query)
        switch(Object.keys(req.query)[0]) {
            case undefined:
                console.log("return all");
                break;
            case "getBySinkDate":
                console.log("return by date");
                break;
            case "getByLocation":
                console.log("return by location");
                break;
            default:
                console.log("default switch catch")
                break;
        }
    } else if(req.method === "POST") {
        console.log("post request")
    }
    res.status(200).send([])
}

const getAllShips = async function() {
    return []
}

const getShipsByLocation = function(location: string) {
    return {
        filtered: "ships"
    }
}