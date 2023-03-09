// @ts-ignore
import mapboxgl from "!mapbox-gl";
import Head from "next/head";
import { Inter } from "next/font/google";
import styles from "@/styles/Home.module.scss";
import { useEffect, useRef, useState } from "react";

const inter = Inter({ subsets: ["latin"] });

export default function Home() {
	mapboxgl.accessToken =
		"pk.eyJ1IjoidGRlY2thcmQyMDAwIiwiYSI6ImNsZjFldjhsNzA3bXozem14NDV6Nng4amYifQ.PvmNM-RCjjUyWuNZPLHjOg";
	const mapContainer = useRef(null);
	const map = useRef(null);
	const [lng, setLng] = useState(-82.15);
	const [lat, setLat] = useState(43.5);
	const [zoom, setZoom] = useState(6);

	useEffect(() => {
		if (map.current) return;
		map.current = new mapboxgl.Map({
			container: mapContainer.current,
			style: "mapbox://styles/mapbox/streets-v12",
			center: [lng, lat],
			zoom: zoom,
		});
	});

	return (
		<>
			<Head>
				<title>Lake Ship Wrecks</title>
				<meta name="description" content="Interactive Ship Wreck Map" />
				<meta name="viewport" content="width=device-width, initial-scale=1" />
				<link rel="icon" href="/favicon.ico" />
				<link
					href="https://api.mapbox.com/mapbox-gl-js/v2.8.1/mapbox-gl.css"
					rel="stylesheet"
				/>
			</Head>
			<main>
				<div className={styles.navigationPanel}>
          <div> Example Header</div>
          <div>
            <div>Example Tool</div>
            <div>Example List</div>
          </div>
        </div>
				<div>
					<div ref={mapContainer} className={styles.mapContainer}></div>
				</div>
			</main>
		</>
	);
}
