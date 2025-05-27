import { Route, Switch } from "wouter";
import { AnagramsPlayground } from "./pages/anagrams";
import { MostFrequentCharPlayground } from "./pages/most-frequent-char";
import { PairSumPlayground } from "./pages/pair-sum";
import { PairProductPlayground } from "./pages/pair-product";
import { IntersectionPlayground } from "./pages/intersection";
import { TooltipProvider } from "@/components/ui/tooltip";
import NotFound from "./pages/not-found";

function App() {
  return (
    <TooltipProvider>
      <Switch>
        <Route path="/anagrams" component={AnagramsPlayground} />
        <Route path="/most-frequent-char" component={MostFrequentCharPlayground} />
        <Route path="/pair-sum" component={PairSumPlayground} />
        <Route path="/pair-product" component={PairProductPlayground} />
        <Route path="/intersection" component={IntersectionPlayground} />
        <Route path="/" component={AnagramsPlayground} />
        <Route component={NotFound} />
      </Switch>
    </TooltipProvider>
  );
}

export default App;
