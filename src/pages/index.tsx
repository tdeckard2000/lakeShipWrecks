// @ts-ignore
import mapboxgl from "!mapbox-gl";
import Head from "next/head";
import { Inter } from "next/font/google";
import styles from "@/styles/Home.module.scss";
import { useEffect, useRef, useState } from "react";
import { shipwreck } from "@/types";

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
		// @ts-ignore
		map.current.on('load', () => {
			// @ts-ignore
			map.current.addSource('places', {
				type: 'geojson',
				data: {
					type: 'FeatureCollection',
					features: [
						{
							type: 'Feature',
							properties: {
								description: `<strong>Example Description</strong><p>Text goes here.<p>`,
								icon: 'theatre'
							},
							geometry: {
								type: 'Point',
								coordinates: [-86.6545, 48.6981]
							}
						}
					]
				}
			});
			// @ts-ignore
			map.current.addLayer({
				id: 'places',
				type: 'symbol',
				source: 'places',
				layout: {
					'icon-image': ['get', 'icon'],
					'icon-allow-overlap': true
				}
			})
		})
		populateMapMarkers();
	});

	const populateMapMarkers = async (shipwrecks?: shipwreck[]) => {
		if(!map.current) return
		const shipwrecksArray = shipwrecks || (await getAllShipwrecks());
		// map.current.a
	};

	const getAllShipwrecks = async () => {
		try {
			const res = await fetch("/api/shipwrecks", { method: "GET" });
			const data = await res.json();
			console.log("returnedData: ", data);
		} catch (err) {
			console.warn(err);
		}
	};

	const getShipwrecksBySinkYearRange = async (
		fromYear: number,
		toYear: number
	) => {
		try {
			const res = await fetch(
				`/api/shipwrecks?getBySinkYear=${fromYear},${toYear}`,
				{ method: "GET" }
			);
			const data = await res.json();
			console.log(data);
		} catch (err) {
			console.warn(err);
		}
	};

	const getShipwrecksByLocation = async () => {
		try {
			const res = await fetch("/api/shipwrecks?getByLocation=Lake Superior", {
				method: "GET",
			});
			const data = await res.json();
			console.log(data);
		} catch (err) {
			console.warn(err);
		}
	};

	return (
		<>
			<Head>
				<title>Lake Shipwrecks</title>
				<meta name="description" content="Interactive Shipwreck Map" />
				<meta name="viewport" content="width=device-width, initial-scale=1" />
				<link rel="icon" href="/favicon.ico" />
			</Head>
			<main>
				<div className={styles.navigationPanel}>
					<div className={styles.titleHeader}>Lake Shipwrecks</div>
					<div className={styles.navigationBody}>
						<div className={styles.toolsContainer}>
							<div className={styles.button}>
								<img src="search-icon.svg" alt="" />
								<div>Search</div>
							</div>
							<div className={styles.button}>
								<img src="filter-icon.svg" alt="" />
								<div>Filter</div>
							</div>
							<div className={styles.button}>
								<img src="reset-icon.svg" alt="" />
								<div>Reset</div>
							</div>
						</div>
						<div className={styles.listContainer}>
							<div className={styles.listItem}>Ship One</div>
							<div className={styles.listItem}>Ship Two</div>
							<div className={styles.listItem}>Ship Three</div>
							<div className={styles.listItem}>Ship Four</div>
							<div className={styles.listItem}>Ship Five</div>
						</div>

						<div style={{ paddingTop: "100px", textAlign: "center" }}>
							<div>Dev Tools</div>
							<button onClick={getAllShipwrecks}>Get All Shipwrecks</button>
							<button onClick={getShipwrecksByLocation}>
								Get Shipwrecks By Location
							</button>
							<button onClick={() => getShipwrecksBySinkYearRange(1885, 1897)}>
								Get Shipwrecks By Sink Date
							</button>
						</div>
					</div>
				</div>
				<div>
					<div ref={mapContainer} className={styles.mapContainer}></div>
				</div>
			</main>
		</>
	);
}
