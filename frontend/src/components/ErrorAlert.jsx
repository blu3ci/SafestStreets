import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert";
import { AlertCircleIcon } from "lucide-react";

function ErrorAlert({ errorData }) {
  return (
    <>
      {Object.entries(errorData).map(([key, val]) => (
        <Alert variant="destructive">
          <AlertCircleIcon />
          <AlertTitle className="capitalize">{key}</AlertTitle>
          <AlertDescription>
            {Array.isArray(val) ? val.join("\n") : val}
          </AlertDescription>
        </Alert>
      ))}
    </>
  );
}

export default ErrorAlert;
