// @ts-ignore
import mapboxgl from "!mapbox-gl";
import Head from "next/head";
import { Inter } from "next/font/google";
import styles from "@/styles/Home.module.scss";
import { useEffect, useRef, useState } from "react";
import { Shipwreck, ShipwreckFilters } from "@/interfaces";
import * as clientAPI from "@/clientAPI";
import MobileInterface from "./mobileInterface";
import FiltersComponent from "./components/filters";
import ShipListComponent from "./components/shipList";

const inter = Inter({ subsets: ["latin"] });

export default function Home() {
	mapboxgl.accessToken = process.env.NEXT_PUBLIC_MAP_TOKEN;
	const mapContainer = useRef(null);
	const map = useRef(null);
	const [filtersActive, setFiltersActive] = useState<boolean>(false);
	const [filtersOpen, setFiltersOpen] = useState<boolean>(false);
	const [searchOpen, setSearchOpen] = useState<boolean>(false);
	const [settingsOpen, setSettingsOpen] = useState<boolean>(false);
	const [lng, setLng] = useState(-85.15);
	const [lat, setLat] = useState(44.5);
	const [zoom, setZoom] = useState(5.5);
	const [shipList, setShipList] = useState<Shipwreck[]>([]);
	const popup = new mapboxgl.Popup({
		closeButton: false,
		closeOnClick: false
	})

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

	const initializePage = async () => {;
		const newShipList = await clientAPI.getAllShipwrecks();
		setShipList(newShipList);
		initializeMap(newShipList);
	}

	const initializeMap = (shipList: Shipwreck[]) => {
		if(!map.current || map.current === null) return;
		//@ts-ignore
		map.current.loadImage('map-prettypurple-icon.png', (error, image) => {map.current.addImage('iconPurple', image)});
		//@ts-ignore
		map.current.loadImage('map-green-icon.png', (error, image) => {map.current.addImage('iconGreen', image)});
		updateMapMarkers(shipList);
		initializeMarkerPopup();
	}

	const initializeMarkerPopup = () => {
		//@ts-ignore
		map.current.on('mouseenter', 'places', (e) => {
			popup.remove();
			//@ts-ignore
			map.current.getCanvas().style.cursor = 'pointer';
			console.log(e.features)
			const coordinates = e.features[0].geometry.coordinates.slice();
			const description = e.features[0].properties.description;
			while (Math.abs(e.lngLat.lng - coordinates[0]) > 180) {
				coordinates[0] += e.lngLat.lng > coordinates[0] ? 360 : -360;
			}
			//@ts-ignore
			popup.setLngLat(coordinates).setHTML(description).addTo(map.current);
		})
		//@ts-ignore
		map.current.on('mouseleave', 'places', () => {
			//@ts-ignore
			map.current.getCanvas().style.cursor = '';
			popup.remove();
		});
	}

	const handleFilterChange = async (filterParams: ShipwreckFilters) => {
		const newShipList = await clientAPI.getFilteredShipwrecks(filterParams);
		setShipList(newShipList);
		updateMapMarkers(newShipList);
	}

	const resetFilters = async () => {
		setFiltersActive(false);
		const newShipList = await clientAPI.getAllShipwrecks();
		setShipList(newShipList);
		updateMapMarkers(newShipList);
	}

	const updateMapMarkers = (listOfShips: Shipwreck[]) => {
		const features = [];
		for(let shipwreck of listOfShips) {
			console.log(shipwreck._id)
			features.push({
				id: shipwreck._id,
				type: 'Feature',
				properties: {
					description: 
					`<div style="font-size: 14px; font-weight: 600; margin: 0 0 5px 0;">${shipwreck.name}</div>
					<div style="width: 200px">
						<img style="border-radius: 6px;	width: 200px;" src="${shipwreck.linkImage !== undefined ? shipwreck.linkImage : ''}" alt="" />
					</div>
					<div>
						<div><span style="font-weight: 600">Sank:</span> ${shipwreck.dateSunk?.toString().slice(4, 6)}/${shipwreck.dateSunk?.toString().slice(6, 8)}/${shipwreck.dateSunk?.toString().slice(0, 4)}</div>
						<div><span style="font-weight: 600">Shallowest Depth:</span> ${shipwreck.stats.waterDepth !== undefined ? shipwreck.stats.waterDepth : '?'} ft</div>
						<div><span style="font-weight: 600">Ship Length:</span> ${shipwreck.stats.length !== undefined ? shipwreck.stats.length : '?'} ft</div>
					</div>
					`,
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
				'icon-image': 'iconPurple',
				'icon-size': 0.2,
				'icon-allow-overlap': true
			}
		})
	};

	return (
		<>
			<Head>
				<title>Shipwrecks.pro</title>
				<meta name="description" content="Interactive Shipwreck Map" />
				<meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1" />
				<link rel="icon" href="/favicon.ico" />
			</Head>
			<main>
				<div className={styles.navigationPanel}>
					<div className={styles.titleHeader}>Shipwrecks<span style={{fontSize: '12px'}}>.pro</span></div>
					<div className={styles.navigationBody}>
						<div className={[styles.toolsContainer, filtersOpen ? styles.toolsContainerOpened : ""].join(" ")}>
							<div className={styles.toolsButtons}>
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
							<div className={[styles.filtersContainer, filtersOpen ? styles.filtersContainerOpened : ""].join(" ")} >
								<FiltersComponent
									formCallback={handleFilterChange}
									resetButtonCallback={resetFilters}
									setFiltersActive={setFiltersActive}
									filtersActive={filtersActive}
								></FiltersComponent>
							</div>
						</div>
						<ShipListComponent shipList={shipList} listHeight="calc(100% - 60px)"></ShipListComponent>
					</div>
				</div>
				<div className={styles.mobileInterface}>
					<MobileInterface 
						setFiltersOpen={setFiltersOpen}
						setSearchOpen={setSearchOpen}
						setSettingsOpen={setSettingsOpen}
						resetFilters={resetFilters}
						filtersActive={filtersActive}
						filtersOpen={filtersOpen}
						searchOpen={searchOpen}
						settingsOpen={settingsOpen}
						shipList={shipList}
						handleFilterChange={handleFilterChange}
						setFiltersActive={setFiltersActive}
					></MobileInterface>
				</div>
				<div>
					<div ref={mapContainer} className={styles.mapContainer}></div>
				</div>
			</main>
		</>
	);
}
