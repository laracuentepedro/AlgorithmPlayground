import { Route, Switch } from "wouter";
import { AnagramsPlayground } from "./pages/anagrams";
import { MostFrequentCharPlayground } from "./pages/most-frequent-char";
import { TooltipProvider } from "@/components/ui/tooltip";
import NotFound from "./pages/not-found";

function App() {
  return (
    <TooltipProvider>
      <Switch>
        <Route path="/anagrams" component={AnagramsPlayground} />
        <Route path="/most-frequent-char" component={MostFrequentCharPlayground} />
        <Route path="/" component={AnagramsPlayground} />
        <Route component={NotFound} />
      </Switch>
    </TooltipProvider>
  );
}

export default App;
