import api from "../api";
import NavBar from "../components/NavBar";
import IncidentMarker from "../components/IncidentMarker";
import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { MapPinIcon } from "@heroicons/react/24/solid";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";

import {
  Map,
  NavigationControl,
  GeolocateControl,
  Marker,
} from "react-map-gl/maplibre";
import "maplibre-gl/dist/maplibre-gl.css";
import { useEffect, useState } from "react";
import { MapPinPlus } from "lucide-react";

function HomePage() {
  const [markers, setMarkers] = useState([]);
  const [isSelectingLocation, setIsSelectingLocation] = useState(false);
  const [disableSelectingPin, setDisableSelectingPin] = useState(true);
  const [lng, setLng] = useState(0);
  const [lat, setLat] = useState(0);

  const fetchMarkers = async () => {
    api
      .get("/api/markers")
      .then((res) => {
        setMarkers(res.data);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  useEffect(() => {
    fetchMarkers();
  }, []);

  const reportIncident = async () => {
    api
      .post("/api/marker/create/", { longitude: lng, latitude: lat })
      .then((res) => {
        fetchMarkers();
        setLat(0);
        setLng(0);
        setDisableSelectingPin(true);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  return (
    <div>
      <NavBar />
      <div className="h-full aspect-[1/3] fixed top-0 left-0 z-20 flex items-center mx-5">
        <Card className="w-full max-w-sm">
          <CardHeader>
            <CardTitle>Report Incident</CardTitle>
            <CardDescription>Report an unsafe location</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col gap-6">
              <Button
                variant="secondary"
                disabled={isSelectingLocation}
                onClick={() => setIsSelectingLocation(true)}
              >
                <MapPinPlus />
                Pick Location
              </Button>
              <div className="grid gap-2">
                <Label htmlFor="lat">Latitude</Label>
                <Input
                  id="lat"
                  value={lat}
                  placeholder="Enter latitude coordinates"
                  disabled
                  required
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="long">Longitude</Label>
                <Input
                  id="long"
                  value={lng}
                  placeholder="Enter longitude coordinates"
                  disabled
                  required
                />
              </div>
            </div>
          </CardContent>
          <CardFooter>
            <Button className="w-full" onClick={reportIncident}>
              Report
            </Button>
          </CardFooter>
        </Card>
      </div>

      <div className="h-screen w-screen">
        <Map
          onClick={(e) => {
            if (isSelectingLocation === true) {
              setLat(e.lngLat.lat);
              setLng(e.lngLat.lng);
              setIsSelectingLocation(false);
              setDisableSelectingPin(false);
            }
          }}
          initialViewState={{
            longitude: -100,
            latitude: 40,
            zoom: 3.5,
          }}
          mapStyle="https://api.maptiler.com/maps/streets-v2/style.json?key=XX7vhvED0CRvaAh17AoF"
        >
          <NavigationControl position="bottom-right" />
          <GeolocateControl position="bottom-right" />
          {markers.map((marker, i) => (
            <IncidentMarker key={i} markerData={marker} />
          ))}
          {disableSelectingPin ? (
            ""
          ) : (
            <Marker
              latitude={lat}
              longitude={lng}
              className="z-10"
              anchor="bottom"
              onDrag={(e) => {
                setLat(e.lngLat.lat);
                setLng(e.lngLat.lng);
              }}
              draggable
            >
              <MapPinIcon className="h-10 w-10 text-blue-500" />
            </Marker>
          )}
        </Map>
      </div>
    </div>
  );
}

export default HomePage;
