import React, { useState, useEffect } from "react";
import L from "leaflet";
import { Map, TileLayer, Marker, Popup } from "react-leaflet";
import pin from "../assets/pin.png";
import axios from "axios";
import { useDebounce } from "./useDebounce";
import Photos from "./Photos";

const customMarker = L.icon({
  iconUrl: pin,
  iconSize: [25, 41],
  iconAnchor: [12.5, 41],
  popupAnchor: [0, -41],
});

const MapView = () => {
  const [region, setRegion] = useState({
    lng: 2.3752,
    lat: 48.845,
    zoom: 13,
  });
  const [data, setData] = useState([]);
  const [min, setMin] = useState(0);
  const [max, setMax] = useState(3000000);
  const [radius, setRadius] = useState(1000);
  const [query, setQuery] = useState("paris");
  const [addresses, setAddresses] = useState([]);
  const debouncedQuery = useDebounce(query);

  useEffect(() => {
    if (query && addresses.length) {
      axios
        .post("http://localhost:3000/search", {
          lng: addresses[0],
          lat: addresses[1],
          radius,
          minPrice: min,
          maxPrice: max,
        })
        .then(({ data }) => {
          setData(data);
        });
    }
  }, [addresses, min, max, radius, query]);

  useEffect(() => {
    axios
      .get(
        `https://api-adresse.data.gouv.fr/search/?q=${debouncedQuery}&limit=1`
      )
      .then(({ data }) => {
        if (!data.features.length) {
          return setAddresses([]);
        }
        setAddresses(data.features[0].geometry.coordinates);
      });
  }, [debouncedQuery]);

  function handleClick([lat, lng]) {
    setRegion({
      lat,
      lng,
      zoom: 13,
    });
  }

  return (
    <>
      <Map className="map" center={[region.lat, region.lng]} zoom={region.zoom}>
        <TileLayer
          attribution='&amp;copy <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        {data.map(({ id, title, location: { lat, lng } }) => (
          <Marker
            key={id}
            position={[lat, lng]}
            icon={customMarker}
            onclick={console.log}
          >
            <Popup>{title}</Popup>
          </Marker>
        ))}
      </Map>

      <div className="filters">
        <div>
          <input
            placeholder="Address"
            value={query}
            onChange={(e) => setQuery(e.currentTarget.value || 0)}
          />
        </div>

        <div>
          <input
            placeholder="Min price"
            type="number"
            value={min}
            onChange={(e) => setMin(e.currentTarget.value || 0)}
          />
        </div>
        <div>
          <input
            placeholder="Max price"
            type="number"
            value={max}
            onChange={(e) => setMax(e.currentTarget.value || 0)}
          />
        </div>
        <div>
          <input
            placeholder="Radius"
            type="number"
            value={radius}
            onChange={(e) => setRadius(e.currentTarget.value || 0)}
          />
        </div>
      </div>
      <Photos photos={data} handleClick={handleClick} />
    </>
  );
};

export default MapView;
