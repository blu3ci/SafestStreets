import api from "../api";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { useEffect, useState } from "react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { ACCESS_TOKEN, REFRESH_TOKEN } from "../constants";
import { redirect, useNavigate } from "react-router-dom";
import { TrafficCone } from "lucide-react";

function NavBar() {
  const [username, setUsername] = useState("");
  const navigate = useNavigate();

  const logout = () => {
    localStorage.removeItem(ACCESS_TOKEN);
    localStorage.removeItem(REFRESH_TOKEN);
    navigate("/login");
  };

  useEffect(() => {
    api
      .get("/api/user/")
      .then((res) => {
        setUsername(res.data.username);
      })
      .catch((err) => {
        console.log(err);
      });
  }, []);

  return (
    <nav className="w-screen fixed bg-background px-0 lg:px-20 shadow shadow-accent">
      <div className="h-full flex items-center justify-between p-5">
        <div className="flex flex-row items-center justify-center gap-5 text-2xl">
          <TrafficCone size={32} strokeWidth={1.5} className="text-yellow-500" />
          <h1 className="font-thin text-center">Safest<span className="font-semibold">Streets</span></h1>
        </div>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="lg">
              <Avatar className="">
                <AvatarFallback className="bg-amber-300 capitalize">
                  {username.substring(0, 2)}
                </AvatarFallback>
              </Avatar>
              Account
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent className="">
            <DropdownMenuLabel>Logged in as <span className="font-semibold">{username}</span></DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={logout}>Log Out</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </nav>
  );
}

export default NavBar;
