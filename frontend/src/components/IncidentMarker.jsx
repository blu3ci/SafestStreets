import api, { apiPrivate } from "../api";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Marker } from "react-map-gl/maplibre";
import { Button } from "@/components/ui/button";
import { getUsername } from "../utils";
import { useState } from "react";
import {
  MapPinIcon,
  HandThumbDownIcon,
  HandThumbUpIcon,
} from "@heroicons/react/24/solid";
import { Badge } from "@/components/ui/badge";
import { prioritizePrivateAPI } from "../utils";

function IncidentMarker({ markerData }) {
  const [rating, setRating] = useState(markerData.likes - markerData.dislikes);
  const [currentUserRating, setCurrentUserRating] = useState(
    markerData.user_rating
  );
  const [deleted, setDeleted] = useState(false);

  const updateRating = () => {
    prioritizePrivateAPI()
      .get(`/api/marker/${markerData.id}/`)
      .then((res) => {
        setRating(res.data.likes - res.data.dislikes);
        setCurrentUserRating(res.data.user_rating);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const deleteMarker = () => {
    apiPrivate.delete(`/api/marker/delete/${markerData.id}/`).catch((err) => {
      console.error(err);
    });
    setDeleted(true);
  };

  return !deleted ? (
    <Marker
      className="z-10"
      longitude={markerData.longitude}
      latitude={markerData.latitude}
      anchor="bottom"
    >
      <Popover>
        <PopoverTrigger>
          <MapPinIcon className="h-10 w-10 text-red-500" />
        </PopoverTrigger>
        <PopoverContent className="space-y-4">
          <div className="flex flex-row justify-between items-center space-x-2">
            <div className="flex justify-start space-x-5">
              <Avatar>
                <AvatarFallback className="capitalize bg-amber-300">
                  {markerData.reporter.substring(0, 2)}
                </AvatarFallback>
              </Avatar>
              <div className="space-y-1">
                <h4 className="text-sm font-semibold">{markerData.reporter}</h4>

                <div className="flex w-full flex-wrap gap-2">
                  {markerData.tags.map((val, i) => (
                    <Badge key={i}>{val}</Badge>
                  ))}
                </div>

                <div className="text-muted-foreground text-xs">
                  {markerData.created_at}
                </div>
              </div>
            </div>
            <div className="flex flex-col items-center">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => {
                  apiPrivate
                    .post(`/api/marker/rating/like/${markerData.id}/`)
                    .then((res) => {
                      updateRating();
                    })
                    .catch((err) => {
                      console.log(err);
                    });
                }}
              >
                <HandThumbUpIcon
                  className={`h-6 w-6 ${
                    currentUserRating === "like"
                      ? "text-green-500"
                      : "text-gray-500"
                  }`}
                />
              </Button>
              <h1 className={rating > 0 ? "text-green-300" : "text-red-300"}>
                {rating}
              </h1>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => {
                  apiPrivate
                    .post(`/api/marker/rating/dislike/${markerData.id}/`)
                    .then((res) => {
                      updateRating();
                    })
                    .catch((err) => {
                      console.log(err);
                    });
                }}
              >
                <HandThumbDownIcon
                  className={`h-6 w-6 ${
                    currentUserRating === "dislike"
                      ? "text-red-500"
                      : "text-gray-500"
                  }`}
                />
              </Button>
            </div>
          </div>
          {markerData.description.length > 0 ? (
            <div className="flex flex-col gap-2">
              <h1>Description</h1>
              <p className="text-sm">{markerData.description}</p>
            </div>
          ) : (
            ""
          )}
          {getUsername() === markerData.reporter ? (
            <Button className="w-full" onClick={deleteMarker}>
              Delete
            </Button>
          ) : (
            ""
          )}
        </PopoverContent>
      </Popover>
    </Marker>
  ) : (
    ""
  );
}

export default IncidentMarker;
