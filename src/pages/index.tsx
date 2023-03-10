// @ts-ignore
import mapboxgl from "!mapbox-gl";
import Head from "next/head";
import { Inter } from "next/font/google";
import styles from "@/styles/Home.module.scss";
import { useEffect, useRef, useState } from "react";
import { shipwreck } from "@/types";
import * as clientAPI from "@/clientAPI";

const inter = Inter({ subsets: ["latin"] });

export default function Home() {
	mapboxgl.accessToken = process.env.NEXT_PUBLIC_MAP_TOKEN;
	let shipList: shipwreck[] = [];
	const mapContainer = useRef(null);
	const map = useRef(null);
	const [filtersActive, setFiltersActive] = useState<boolean>(false);
	const [filtersOpen, setFiltersOpen] = useState<boolean>(false);
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
		initializePage();
	});

	const initializePage = async () => {
		if(!map.current || map.current === null) return;
		//@ts-ignore
		map.current.loadImage('map-prettypurple-icon.png', (error, image) => {map.current.addImage('customIcon', image)});
		shipList = await clientAPI.getAllShipwrecks();
		updateMapMarkers();
	}

	const filterBySinkYearRange = async (fromYear: number, toYear: number) => {
		setFiltersActive(true);
		const response = await clientAPI.getShipwrecksBySinkYearRange(fromYear, toYear);
		shipList = response;
		updateMapMarkers();
	}

	const resetFilters = async () => {
		setFiltersActive(false);
		shipList = await clientAPI.getAllShipwrecks();
		updateMapMarkers();
	}

	const updateMapMarkers = () => {
		const features = [];
		for(let shipwreck of shipList) {
			features.push({
				type: 'Feature',
				properties: {
					description: 
					`<strong>${shipwreck.name}</strong>
					<p>Sank: ${shipwreck.dateSunk}</p>`,
				},
				geometry: {
					type: 'Point',
					coordinates: [shipwreck.coordinates.longitude || 0, shipwreck.coordinates.latitude || 0]
				}
			})
		}
		//@ts-ignore
		if(map.current.getLayer('places')) {
			//@ts-ignore
			map.current.removeLayer('places');
		}
		//@ts-ignore
		if(map.current.getSource('places')) {
			//@ts-ignore
			map.current.removeSource('places')
		}
		//@ts-ignore
		map.current.addSource('places', {
			type: 'geojson',
			data: {
				type: 'FeatureCollection',
				features: features
			}
		});
		// @ts-ignore
		map.current.addLayer({
			id: 'places',
			type: 'symbol',
			source: 'places',
			layout: {
				'icon-image': 'customIcon',
				'icon-size': 0.2,
				'icon-allow-overlap': true
			}
		})
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
						<div className={[styles.toolsContainer, filtersOpen ? styles.toolsContainerOpened : ""].join(" ")}>
							<div className={styles.button}>
								<img src="search-icon.svg" alt="" />
								<div>Search</div>
							</div>
							<div className={styles.button} onClick={() => setFiltersOpen(!filtersOpen)}>
								<img src="filter-icon.svg" alt="" />
								<div>Filter</div>
							</div>
							<div className={styles.button} style={{pointerEvents: filtersActive ? 'auto' : 'none', opacity: filtersActive ? '1' : '.5'}} onClick={resetFilters}>
								<img src="reset-icon.svg" alt="" />
								<div>Reset</div>
							</div>
						</div>
						<div style={{borderTop: '2px solid #e7e7e7', display: filtersOpen ? 'block' : 'none',margin: 'auto', width: '30px'}}></div>
						<div className={styles.listContainer}>
							<div className={styles.listItem}>Ship One</div>
							<div className={styles.listItem}>Ship Two</div>
							<div className={styles.listItem}>Ship Three</div>
							<div className={styles.listItem}>Ship Four</div>
							<div className={styles.listItem}>Ship Five</div>
						</div>
						<div style={{ paddingTop: "100px", textAlign: "center" }}>
							<div>Dev Tools</div>
							<button onClick={clientAPI.getShipwrecksByLocation}>
								Get Shipwrecks By Location
							</button>
							<button onClick={() => filterBySinkYearRange(1885, 1897)}>
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
