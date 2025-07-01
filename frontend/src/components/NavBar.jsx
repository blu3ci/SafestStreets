import { getUsername, isSignedIn } from "../utils";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useNavigate } from "react-router-dom";
import { TrafficCone } from "lucide-react";
import { ACCESS_TOKEN, REFRESH_TOKEN } from "../constants";
import { Link } from "react-router-dom";

function NavBar() {
  const navigate = useNavigate();

  const logout = () => {
    console.log("hi");
    localStorage.removeItem(ACCESS_TOKEN);
    localStorage.removeItem(REFRESH_TOKEN);
    navigate("/login");
  };

  return (
    <nav className="w-screen fixed bg-background px-0 lg:px-20 shadow z-20">
      <div className="h-full flex items-center justify-between p-5">
        <div className="flex flex-row items-center justify-center gap-5 text-2xl">
          <TrafficCone
            size={32}
            strokeWidth={1.5}
            className="text-yellow-500"
          />
          <div className="flex flex-col items-start">
            <h1 className="font-thin text-center">
              Safest<span className="font-semibold">Streets</span>
            </h1>
            <p className="text-sm text-gray-400">
              A united city is a safer city
            </p>
          </div>
        </div>
        {isSignedIn() ? (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="lg">
                <Avatar>
                  <AvatarFallback className="bg-amber-300 capitalize">
                    {getUsername().substring(0, 2)}
                  </AvatarFallback>
                </Avatar>
                Account
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="">
              <DropdownMenuLabel>
                Logged in as{" "}
                <span className="font-semibold">{getUsername()}</span>
              </DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={logout}>Log Out</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        ) : (
          <Link to="/login">
            <Button>Sign In</Button>
          </Link>
        )}
      </div>
    </nav>
  );
}

export default NavBar;
