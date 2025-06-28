import { useState } from "react"
import { Button } from "@/components/ui/button"

function App() {
  const [counter, setCounter] = useState(0);

  return (
    <div className="flex min-h-svh flex-col items-center justify-center gap-2">
      <h1>Counter: {counter}</h1>
      <Button onClick={() =>  {setCounter(counter + 1)}}>Test</Button>
    </div>
  )
}

export default App