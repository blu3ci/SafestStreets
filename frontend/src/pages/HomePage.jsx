import api, { apiPrivate } from "../api";
import NavBar from "../components/NavBar";
import IncidentMarker from "../components/IncidentMarker";
import { Textarea } from "@/components/ui/textarea";
import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
  DialogClose,
} from "@/components/ui/dialog";
import { MapPinIcon } from "@heroicons/react/24/solid";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { MultiSelect } from "../components/ui/multi-select";
import {
  Map,
  NavigationControl,
  GeolocateControl,
  Marker,
} from "react-map-gl/maplibre";
import "maplibre-gl/dist/maplibre-gl.css";
import { useEffect, useState, useRef } from "react";
import { MapPinPlus, X, MessageCircleWarning, Plus } from "lucide-react";
import { prioritizePrivateAPI } from "../utils";

function HomePage() {
  const geoControlRef = useRef();
  const descriptionTextarea = useRef();
  const tagNameInput = useRef();
  const [markers, setMarkers] = useState([]);
  const [reportIncidentCollpased, setReportIncidentCollpased] = useState(true);
  const [geolocationDisabled, setGeolocationDisabled] = useState(false);
  const [isSelectingLocation, setIsSelectingLocation] = useState(false);
  const [disableSelectingPin, setDisableSelectingPin] = useState(true);
  const [lng, setLng] = useState(0);
  const [lat, setLat] = useState(0);
  const [tags, setTags] = useState([]);
  const [selectedTags, setSelectedTags] = useState([]);

  const fetchMarkers = async () => {
    prioritizePrivateAPI()
      .get("/api/markers")
      .then((res) => {
        setMarkers(res.data);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const fetchTags = async () => {
    api
      .get("/api/marker/tags/")
      .then((res) => {
        let data = [];
        res.data.map((val) => {
          data.push({ value: val.name, label: val.name });
        });
        setTags(data);
      })
      .catch((err) => console.log(err));
  };

  useEffect(() => {
    fetchMarkers();
    fetchTags();
  }, []);

  useEffect(() => {
    geoControlRef.current?.trigger();
  }, [geoControlRef.current]);

  const reportIncident = async () => {
    if (disableSelectingPin) return;

    apiPrivate
      .post("/api/marker/create/", {
        longitude: lng,
        latitude: lat,
        tags: selectedTags,
        description: descriptionTextarea.current?.value,
      })
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
      {!reportIncidentCollpased ? (
        <div className="h-3/4 w-full max-w-md fixed top-23 left-0 bottom-0 z-20 flex items-start justify-start m-5">
          <Card className="h-full w-full">
            <CardHeader>
              <CardAction>
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={() => setReportIncidentCollpased(true)}
                >
                  <X />
                </Button>
              </CardAction>
              <CardTitle>Report Incident</CardTitle>
              <CardDescription>Report an unsafe location</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex flex-col gap-6">
                <div className="flex flex-col gap-2">
                  <Button
                    disabled={isSelectingLocation || geolocationDisabled}
                    onClick={() =>
                      navigator.geolocation.getCurrentPosition(
                        (e) => {
                          setLat(e.coords.latitude);
                          setLng(e.coords.longitude);
                          setDisableSelectingPin(false);
                          setGeolocationDisabled(false);
                        },
                        (err) => {
                          setGeolocationDisabled(true);
                        }
                      )
                    }
                  >
                    <MapPinPlus />
                    Pick Current Location
                  </Button>
                  <Button
                    variant="secondary"
                    disabled={isSelectingLocation}
                    onClick={() => setIsSelectingLocation(true)}
                  >
                    <MapPinPlus />
                    Pick Location
                  </Button>
                </div>
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
                <div className="grid gap-2">
                  <Label htmlFor="desc">Description</Label>
                  <Textarea
                    id="desc"
                    maxLength={300}
                    placeholder="Type a description (optional)"
                    ref={descriptionTextarea}
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="long">Select Incident Tags</Label>
                  <MultiSelect
                    options={tags}
                    onValueChange={setSelectedTags}
                    placeholder="Select tags (optional)"
                    maxCount={3}
                  />
                </div>
              </div>
            </CardContent>
            <CardFooter className="flex flex-col gap-2">
              <Dialog>
                <DialogTrigger asChild>
                  <Button variant="secondary" className="w-full">
                    <Plus />
                    Create Tag
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Create Tag</DialogTitle>
                    <DialogDescription>
                      Create a tag that is no more than 50 characters
                    </DialogDescription>
                  </DialogHeader>
                  <Label htmlFor="tag-name">Tag Name</Label>
                  <Input ref={tagNameInput} id="tag-name" maxLength={50} />

                  <DialogFooter>
                    <DialogClose asChild>
                      <Button
                        onClick={() => {
                          apiPrivate
                            .post("/api/marker/tag/create/", {
                              name: tagNameInput.current.value,
                            })
                            .then((res) => fetchTags())
                            .catch((err) => console.log(err));
                        }}
                      >
                        Add Tag
                      </Button>
                    </DialogClose>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
              <Button className="w-full" onClick={reportIncident}>
                <MessageCircleWarning />
                Report
              </Button>
            </CardFooter>
          </Card>
        </div>
      ) : (
        <Button
          className="fixed z-20 top-23 m-5"
          onClick={() => setReportIncidentCollpased(false)}
          size="lg"
        >
          <MessageCircleWarning />
          Report Incident
        </Button>
      )}

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
          <GeolocateControl position="bottom-right" ref={geoControlRef} />
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
