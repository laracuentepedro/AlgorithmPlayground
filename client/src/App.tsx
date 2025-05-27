import { Route, Switch } from "wouter";
import { AnagramsPlayground } from "./pages/anagrams";
import { MostFrequentCharPlayground } from "./pages/most-frequent-char";
import { PairSumPlayground } from "./pages/pair-sum";
import { PairProductPlayground } from "./pages/pair-product";
import { IntersectionPlayground } from "./pages/intersection";
import { ExclusiveItemsPlayground } from "./pages/exclusive-items";
import { AllUniquePlayground } from "./pages/all-unique";
import { IntersectionWithDupesPlayground } from "./pages/intersection-with-dupes";
import { LinkedListValuesPlayground } from "./pages/linked-list-values";
import { SumListPlayground } from "./pages/sum-list";
import { LinkedListFindPlayground } from "./pages/linked-list-find";
import { GetNodeValuePlayground } from "./pages/get-node-value";
import { ReverseListPlayground } from "./pages/reverse-list";
import { ZipperListsPlayground } from "./pages/zipper-lists";
import { MergeListsPlayground } from "./pages/merge-lists";
import { IsUnivalueListPlayground } from "./pages/is-univalue-list";
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
        <Route path="/exclusive-items" component={ExclusiveItemsPlayground} />
        <Route path="/all-unique" component={AllUniquePlayground} />
        <Route path="/intersection-with-dupes" component={IntersectionWithDupesPlayground} />
        <Route path="/linked-list-values" component={LinkedListValuesPlayground} />
        <Route path="/sum-list" component={SumListPlayground} />
        <Route path="/linked-list-find" component={LinkedListFindPlayground} />
        <Route path="/get-node-value" component={GetNodeValuePlayground} />
        <Route path="/reverse-list" component={ReverseListPlayground} />
        <Route path="/zipper-lists" component={ZipperListsPlayground} />
        <Route path="/merge-lists" component={MergeListsPlayground} />
        <Route path="/is-univalue-list" component={IsUnivalueListPlayground} />
        <Route path="/" component={AnagramsPlayground} />
        <Route component={NotFound} />
      </Switch>
    </TooltipProvider>
  );
}

export default App;
