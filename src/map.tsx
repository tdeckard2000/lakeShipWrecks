// @ts-ignore
import mapboxgl from "!mapbox-gl";
import { MapFeature, MapSelection, MapProperties, Shipwreck } from "@/interfaces";
import { MutableRefObject } from "react";
mapboxgl.accessToken = process.env.NEXT_PUBLIC_MAP_TOKEN;

// const [lng, setLng] = useState(-85.15);
// const [lat, setLat] = useState(44.5);
// const [zoom, setZoom] = useState(5.5);

interface Props {
    markerClickCallback(mapFeature: MapFeature): Function;
}

const popup = new mapboxgl.Popup({
    closeButton: false,
    closeOnClick: false
})

export const initializeMap = async (map: MutableRefObject<null>, mapProperties:MapProperties, mapContainer: MutableRefObject<null>, shipList: Shipwreck[], markerClickCallback: Function) => {
    if (map.current) return;
    map.current = await new mapboxgl.Map({
        container: mapContainer.current,
        style: "mapbox://styles/mapbox/streets-v12",
        center: [mapProperties.lng, mapProperties.lat],
        zoom: mapProperties.zoom,
    });
    //@ts-ignore
    map.current.on('load', () => {
        //@ts-ignore
        map.current.loadImage('map-prettypurple-icon.png', (error, image) => {map.current.addImage('iconPurple', image)});
        //@ts-ignore
        map.current.loadImage('map-green-icon.png', (error, image) => {map.current.addImage('iconGreen', image)});
        updateMapMarkers(map, shipList);
        defineMarkerInteractions(map, markerClickCallback);
        return;
    })
}

const defineMarkerInteractions = (map: MutableRefObject<null>, markerClickCallback: Function) => {
    //@ts-ignore
    map.current.on('mouseenter', 'places', (MapSelection: MapSelection) => {
        handleMarkerHover(map, MapSelection);
    });
    //@ts-ignore
    map.current.on('click', 'places', (clickEvent: any) => {
        handleMarkerClick(map, clickEvent, markerClickCallback);
    })
    //@ts-ignore
    map.current.on('mouseleave', 'places', () => {
        //@ts-ignore
        map.current.getCanvas().style.cursor = '';
        popup.remove();
    });
}

const handleMarkerClick = (map: MutableRefObject<null>, clickEvent: any, markerClickCallback: Function) => {
    if(!map.current) return
    //@ts-ignore
    const mapFeature:MapFeature = map.current.queryRenderedFeatures(clickEvent.point, { layers: ['places'] })[0];
    markerClickCallback(mapFeature);
}

const handleMarkerHover = (map: MutableRefObject<null>, mapSelection: MapSelection) => {
    //@ts-ignore
    map.current.getCanvas().style.cursor = 'pointer';
    const coordinates = mapSelection.features[0].geometry.coordinates.slice();
    const description = mapSelection.features[0].properties.description;
    while (Math.abs(mapSelection.lngLat.lng - coordinates[0]) > 180) {
        coordinates[0] += mapSelection.lngLat.lng > coordinates[0] ? 360 : -360;
    }
    //@ts-ignore
    popup.setLngLat(coordinates).setHTML(description).addTo(map.current);
}

export const updateMapMarkers = (map: MutableRefObject<null>, listOfShips: Shipwreck[]) => {
    if(!map.current || map.current === null) return
    const features = [];
    let index = 0;
    for(let shipwreck of listOfShips) {
        features.push({
            id: index,
            type: 'Feature',
            properties: {
                description: 
                `<div style="font-size: 14px; font-weight: 600; margin: 0 0 5px 0;">${shipwreck.name}</div>
                <div style="width: 200px">
                    <img style="border-radius: 6px;	max-height: 200px; width: 200px;" src="${shipwreck.linkImage !== undefined ? shipwreck.linkImage : ''}" alt="" />
                </div>
                <div>
                    <div><span style="font-weight: 600">Sank:</span> ${ shipwreck.dateSunk != 0 ? shipwreck.dateSunk?.toString().slice(4, 6) + '/' + shipwreck.dateSunk?.toString().slice(6, 8) + '/' + shipwreck.dateSunk?.toString().slice(0, 4) : '?'} </div>
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
        index++;
    }
    //@ts-ignore
    if(map.current.getLayer('places')) {
        //@ts-ignore
        map.current.removeLayer('places');
    }
    //@ts-ignore
    if(map.current.getSource('places')) {
        //@ts-ignore
        map.current.removeSource('places');
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