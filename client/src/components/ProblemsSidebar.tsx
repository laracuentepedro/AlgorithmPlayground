import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { Badge } from "@/components/ui/badge";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { useLocation } from "wouter";

interface Problem {
  name: string;
  difficulty: "Easy" | "Medium" | "Hard";
  completed: boolean;
  active: boolean;
  description?: string;
  route?: string;
}

interface ProblemTopic {
  name: string;
  icon: string;
  problems: Problem[];
  expanded: boolean;
}

export function ProblemsSidebar() {
  const [location, setLocation] = useLocation();
  const [topics, setTopics] = useState<ProblemTopic[]>([
    {
      name: "Hash Tables & Arrays",
      icon: "fa-hashtag",
      expanded: true,
      problems: [
        { name: "Anagrams", difficulty: "Easy", completed: false, active: false, description: "Check if two strings are anagrams", route: "/anagrams" },
        { name: "Most Frequent Character", difficulty: "Easy", completed: false, active: false, description: "Find the most frequent character in a string", route: "/most-frequent-char" },
        { name: "Pair Sum", difficulty: "Easy", completed: false, active: false, description: "Find two numbers that add to target", route: "/pair-sum" },
        { name: "Pair Product", difficulty: "Easy", completed: false, active: false, description: "Find two numbers that multiply to target", route: "/pair-product" },
        { name: "Intersection", difficulty: "Easy", completed: false, active: false, description: "Find common elements between two arrays", route: "/intersection" },
        { name: "Exclusive Items", difficulty: "Easy", completed: false, active: false, description: "Find elements in either array but not both", route: "/exclusive-items" },
        { name: "All Unique", difficulty: "Easy", completed: false, active: false, description: "Check if all array elements are unique", route: "/all-unique" },
        { name: "Intersection with Dupes", difficulty: "Easy", completed: false, active: false, description: "Find common elements preserving frequencies", route: "/intersection-with-dupes" },
      ]
    },
    {
      name: "Linked Lists",
      icon: "fa-link",
      expanded: true,
      problems: [
        { name: "Linked List Values", difficulty: "Easy", completed: false, active: false, description: "Extract all values from a linked list", route: "/linked-list-values" },
        { name: "Sum List", difficulty: "Easy", completed: false, active: false, description: "Calculate sum of all values in linked list", route: "/sum-list" },
        { name: "Linked List Find", difficulty: "Easy", completed: false, active: false, description: "Search for a target value in linked list", route: "/linked-list-find" },
        { name: "Get Node Value", difficulty: "Easy", completed: false, active: false, description: "Get value at specific index in linked list", route: "/get-node-value" },
        { name: "Reverse List", difficulty: "Medium", completed: false, active: false, description: "Reverse a linked list in-place", route: "/reverse-list" },
        { name: "Zipper Lists", difficulty: "Medium", completed: false, active: false, description: "Merge two lists by alternating nodes", route: "/zipper-lists" },
        { name: "Merge Lists", difficulty: "Medium", completed: false, active: false, description: "Merge two sorted lists into one", route: "/merge-lists" },
        { name: "Is Univalue List", difficulty: "Easy", completed: false, active: false, description: "Check if all nodes have same value", route: "/is-univalue-list" },
        { name: "Longest Streak", difficulty: "Easy", completed: false, active: false, description: "Find longest consecutive sequence", route: "/longest-streak" },
        { name: "Remove Node", difficulty: "Easy", completed: false, active: false, description: "Delete first occurrence of target value", route: "/remove-node" },
        { name: "Insert Node", difficulty: "Easy", completed: false, active: false, description: "Add new node at specified index", route: "/insert-node" },
      ]
    },
    {
      name: "Trees & Recursion",
      icon: "fa-sitemap",
      expanded: true,
      problems: [
        { name: "Depth First Values", difficulty: "Easy", completed: false, active: false, description: "Traverse tree using depth-first search", route: "/depth-first-values" },
        { name: "Breadth First Values", difficulty: "Easy", completed: false, active: false, description: "Traverse tree level by level using BFS", route: "/breadth-first-values" },
        { name: "Tree Sum", difficulty: "Easy", completed: false, active: false, description: "Calculate sum of all values in tree", route: "/tree-sum" },
        { name: "Tree Includes", difficulty: "Easy", completed: false, active: false, description: "Search for a value in binary tree", route: "/tree-includes" },
        { name: "Tree Min Value", difficulty: "Easy", completed: false, active: false, description: "Find minimum value in binary tree", route: "/tree-min-value" },
        { name: "Max Path Sum", difficulty: "Medium", completed: false, active: false, description: "Find maximum root-to-leaf path sum", route: "/max-path-sum" },
        { name: "Tree Path Finder", difficulty: "Medium", completed: false, active: false, description: "Find path from root to target value", route: "/tree-path-finder" },
        { name: "Tree Value Count", difficulty: "Easy", completed: false, active: true, description: "Count occurrences of a value in tree", route: "/tree-value-count" },
      ]
    },
    {
      name: "Dynamic Programming",
      icon: "fa-chart-line",
      expanded: false,
      problems: [
        { name: "Climbing Stairs", difficulty: "Easy", completed: false, active: false },
        { name: "House Robber", difficulty: "Medium", completed: false, active: false },
        { name: "Coin Change", difficulty: "Medium", completed: false, active: false },
        { name: "Longest Common Subsequence", difficulty: "Medium", completed: false, active: false },
      ]
    },
    {
      name: "Graphs",
      icon: "fa-project-diagram",
      expanded: false,
      problems: [
        { name: "Number of Islands", difficulty: "Medium", completed: false, active: false },
        { name: "Course Schedule", difficulty: "Medium", completed: false, active: false },
        { name: "Clone Graph", difficulty: "Medium", completed: false, active: false },
        { name: "Pacific Atlantic Water Flow", difficulty: "Medium", completed: false, active: false },
      ]
    },
    {
      name: "Sorting & Searching",
      icon: "fa-sort",
      expanded: false,
      problems: [
        { name: "Binary Search", difficulty: "Easy", completed: false, active: false },
        { name: "Find First and Last Position", difficulty: "Medium", completed: false, active: false },
        { name: "Search in Rotated Array", difficulty: "Medium", completed: false, active: false },
        { name: "Merge Sort", difficulty: "Medium", completed: false, active: false },
      ]
    }
  ]);

  const toggleTopic = (topicIndex: number) => {
    setTopics(prev => prev.map((topic, index) => 
      index === topicIndex 
        ? { ...topic, expanded: !topic.expanded }
        : topic
    ));
  };

  const getDifficultyColor = (difficulty: Problem["difficulty"]) => {
    switch (difficulty) {
      case "Easy": return "bg-emerald-100 text-emerald-800";
      case "Medium": return "bg-amber-100 text-amber-800";
      case "Hard": return "bg-red-100 text-red-800";
    }
  };

  const getTotalProgress = () => {
    const allProblems = topics.flatMap(topic => topic.problems);
    const completed = allProblems.filter(p => p.completed).length;
    return { completed, total: allProblems.length };
  };

  const progress = getTotalProgress();

  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button variant="outline" size="sm" className="flex items-center space-x-2">
          <i className="fas fa-bars"></i>
          <span className="hidden sm:inline">Problems</span>
        </Button>
      </SheetTrigger>
      <SheetContent side="left" className="w-72 sm:w-96">
        <SheetHeader>
          <SheetTitle className="flex items-center space-x-3">
            <div className="w-8 h-8 bg-gradient-to-br from-blue-600 to-violet-600 rounded-lg flex items-center justify-center">
              <i className="fas fa-code text-white text-sm"></i>
            </div>
            <span>DSA Problems</span>
          </SheetTitle>
        </SheetHeader>

        {/* Progress Overview */}
        <div className="mt-6 p-4 bg-slate-50 rounded-lg">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium text-slate-700">Progress</span>
            <span className="text-sm text-slate-600">{progress.completed}/{progress.total}</span>
          </div>
          <div className="w-full bg-slate-200 rounded-full h-2">
            <div 
              className="bg-blue-600 h-2 rounded-full transition-all duration-300"
              style={{ width: `${(progress.completed / progress.total) * 100}%` }}
            ></div>
          </div>
        </div>

        {/* Topics List */}
        <div className="mt-6 space-y-4 max-h-[calc(100vh-200px)] overflow-y-auto">
          {topics.map((topic, topicIndex) => (
            <div key={topicIndex} className="border border-slate-200 rounded-lg">
              <Collapsible 
                open={topic.expanded} 
                onOpenChange={() => toggleTopic(topicIndex)}
              >
                <CollapsibleTrigger className="w-full p-3 sm:p-4 flex items-center justify-between hover:bg-slate-50 transition-colors">
                  <div className="flex items-center space-x-2 sm:space-x-3 min-w-0 flex-1">
                    <div className="w-7 h-7 sm:w-8 sm:h-8 bg-slate-100 rounded-lg flex items-center justify-center flex-shrink-0">
                      <i className={`fas ${topic.icon} text-slate-600 text-xs sm:text-sm`}></i>
                    </div>
                    <div className="text-left min-w-0 flex-1">
                      <div className="font-medium text-slate-900 text-sm sm:text-base truncate">{topic.name}</div>
                      <div className="text-xs text-slate-500">{topic.problems.length} problems</div>
                    </div>
                  </div>
                  <i className={`fas fa-chevron-${topic.expanded ? 'up' : 'down'} text-slate-400 flex-shrink-0 ml-2`}></i>
                </CollapsibleTrigger>
                
                <CollapsibleContent>
                  <div className="px-4 pb-4 space-y-2">
                    {topic.problems.map((problem, problemIndex) => (
                      <div
                        key={problemIndex}
                        onClick={() => {
                          if (problem.route) {
                            setLocation(problem.route);
                          }
                        }}
                        className={`flex items-center justify-between p-3 rounded-lg cursor-pointer transition-colors ${
                          location === problem.route
                            ? 'bg-blue-100 border border-blue-200'
                            : 'hover:bg-slate-50'
                        }`}
                      >
                        <div className="flex items-center space-x-2 sm:space-x-3 flex-1 min-w-0">
                          <div className={`w-5 h-5 sm:w-6 sm:h-6 rounded-full flex items-center justify-center flex-shrink-0 ${
                            problem.completed 
                              ? 'bg-emerald-100 text-emerald-600' 
                              : problem.active
                                ? 'bg-blue-100 text-blue-600'
                                : 'bg-slate-100 text-slate-400'
                          }`}>
                            <i className={`fas ${
                              problem.completed 
                                ? 'fa-check' 
                                : problem.active
                                  ? 'fa-play'
                                  : 'fa-circle'
                            } text-xs`}></i>
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className={`font-medium text-xs sm:text-sm truncate ${
                              problem.active ? 'text-blue-900' : 'text-slate-900'
                            }`}>
                              {problem.name}
                            </div>
                            {problem.description && (
                              <div className="text-xs text-slate-600 truncate hidden sm:block">
                                {problem.description}
                              </div>
                            )}
                          </div>
                        </div>
                        <Badge 
                          variant="secondary" 
                          className={`text-xs flex-shrink-0 ml-2 ${getDifficultyColor(problem.difficulty)}`}
                        >
                          <span className="hidden sm:inline">{problem.difficulty}</span>
                          <span className="sm:hidden">{problem.difficulty.charAt(0)}</span>
                        </Badge>
                      </div>
                    ))}
                  </div>
                </CollapsibleContent>
              </Collapsible>
            </div>
          ))}
        </div>

        {/* Footer */}
        <div className="mt-6 pt-4 border-t border-slate-200">
          <div className="text-xs text-slate-500 text-center">
            Keep practicing to master data structures & algorithms!
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
}