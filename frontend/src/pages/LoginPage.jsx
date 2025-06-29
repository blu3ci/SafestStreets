import ErrorAlert from "../components/ErrorAlert.jsx";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Alert, AlertTitle } from "@/components/ui/alert";
import { useState } from "react";
import { AlertCircleIcon, LoaderCircle } from "lucide-react";
import { useNavigate } from "react-router-dom";
import api from "../api.js";
import { ACCESS_TOKEN, REFRESH_TOKEN } from "../constants";

function LoginPage() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [errorData, setErrorData] = useState({});
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    setLoading(true);
    e.preventDefault();

    try {
      const res = await api.post("/api/token/", { username, password });
      localStorage.setItem(ACCESS_TOKEN, res.data.access);
      localStorage.setItem(REFRESH_TOKEN, res.data.refresh);
      navigate("/");
    } catch (error) {
      setErrorData(error.response.data);
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <div className="absolute w-screen p-5">
        <ErrorAlert errorData={errorData} />
      </div>
      <div className="h-svh flex flex-col items-center justify-center">
        <form className="aspect-square space-y-5" onSubmit={handleSubmit}>
          <Card>
            <CardHeader className="gap-2">
              <CardTitle>Login</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex flex-col gap-6">
                <div className="grid gap-2">
                  <Label htmlFor="username">Username</Label>
                  <Input
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    placeholder="Enter your username"
                    required
                  />
                </div>

                <div className="grid gap-2">
                  <Label htmlFor="username">Password</Label>
                  <Input
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    type="password"
                    placeholder="Enter your password"
                    required
                  />
                </div>
              </div>
            </CardContent>
            <CardFooter className="flex-col gap-2">
              <Button type="submit" className="w-full">
                Login {loading ? <LoaderCircle className="animate-spin" /> : ""}
              </Button>
              <Button
                onClick={() => {
                  navigate("/sign-up");
                }}
                type="button"
                variant="outline"
                className="w-full"
              >
                Sign Up
              </Button>
            </CardFooter>
          </Card>
        </form>
      </div>
    </div>
  );
}

export default LoginPage;
