import { AnagramsPlayground } from "./pages/anagrams";
import { TooltipProvider } from "@/components/ui/tooltip";

function App() {
  return (
    <TooltipProvider>
      <AnagramsPlayground />
    </TooltipProvider>
  );
}

export default App;
