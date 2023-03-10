// @ts-ignore
import mapboxgl from "!mapbox-gl";
import Head from "next/head";
import { Inter } from "next/font/google";
import styles from "@/styles/Home.module.scss";
import { useEffect, useRef, useState } from "react";

const inter = Inter({ subsets: ["latin"] });

export default function Home() {
	mapboxgl.accessToken = process.env.NEXT_PUBLIC_MAP_TOKEN;
	const mapContainer = useRef(null);
	const map = useRef(null);
	const [lng, setLng] = useState(-85.15);
	const [lat, setLat] = useState(44.5);
	const [zoom, setZoom] = useState(5.5);

	useEffect(() => {
		if (map.current) return;
		map.current = new mapboxgl.Map({
			container: mapContainer.current,
			style: "mapbox://styles/mapbox/streets-v12",
			center: [lng, lat],
			zoom: zoom,
		});
	});

	const getAllShipwrecks = async () => {
		try {
			const res = await fetch('/api/shipwrecks', {method: "GET"});
			const data = await res.json();
			console.log("response: ", data);
		} catch (err) {
			console.warn(err)
		}
	}

	const getShipwrecksBySinkYearRange = async (fromYear: number, toYear: number) => {
		try {
			const res = await fetch(`/api/shipwrecks?getBySinkDate=${fromYear},${toYear}`, {method: "GET"});
			const data = await res.json();
			console.log("response: ", data);
		} catch (err) {
			console.warn(err)
		}
	}

	const getShipwrecksByLocation = async () => {
		try {
			const res = await fetch('/api/shipwrecks?getByLocation=Lake Erie', {method: "GET"});
			const data = await res.json();
			console.log("response: ", data);
		} catch (err) {
			console.warn(err)
		}
	}

	return (
		<>
			<Head>
				<title>Lake Shipwrecks</title>
				<meta name="description" content="Interactive Shipwreck Map" />
				<meta name="viewport" content="width=device-width, initial-scale=1" />
				<link rel="icon" href="/favicon.ico" />
				<link
					href="https://api.mapbox.com/mapbox-gl-js/v2.8.1/mapbox-gl.css"
					rel="stylesheet"
				/>
			</Head>
			<main>
				<div className={styles.navigationPanel}>
          <div className={styles.titleHeader}>Lake Shipwrecks</div>
          <div className={styles.navigationBody}>
            <div>Example Tool</div>
            <div>Example List</div>
          </div>
		  <button onClick={getAllShipwrecks}>Get All Shipwrecks</button>
		  <button onClick={getShipwrecksByLocation}>Get Shipwrecks By Location</button>
		  <button onClick={() => getShipwrecksBySinkYearRange(1990, 2015)}>Get Shipwrecks By Sink Date</button>
        </div>
				<div>
					<div ref={mapContainer} className={styles.mapContainer}></div>
				</div>
			</main>
		</>
	);
}
