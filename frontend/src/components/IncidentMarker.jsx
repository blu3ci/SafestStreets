import api from "../api";
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

function IncidentMarker({ markerData }) {
  const [rating, setRating] = useState(markerData.likes - markerData.dislikes);
  const [currentUserRating, setCurrentUserRating] = useState(
    markerData.user_rating
  );
  const [deleted, setDeleted] = useState(false);

  const updateRating = () => {
    api
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
    api.delete(`/api/marker/delete/${markerData.id}/`).catch((err) => {
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
                  <Badge>pothole</Badge>
                  <Badge>streetlight</Badge>
                  <Badge>crime</Badge>
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
                  api
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
                  api
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
