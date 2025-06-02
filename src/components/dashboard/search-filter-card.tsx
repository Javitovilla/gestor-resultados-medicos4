
"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { Search, Filter, CalendarDays, RotateCcw } from "lucide-react";
import type React from "react";
import { useState } from "react";
import type { DateRange } from "react-day-picker";
import { format } from "date-fns";

interface SearchFilterCardProps {
  onSearch: (searchTerm: string) => void;
  onFilterByTags: (tags: string[]) => void;
  onFilterByDateRange: (dateRange?: DateRange) => void;
  allTags: string[];
}

export function SearchFilterCard({ onSearch, onFilterByTags, onFilterByDateRange, allTags }: SearchFilterCardProps) {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [dateRange, setDateRange] = useState<DateRange | undefined>(undefined);

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
    onSearch(e.target.value);
  };

  const handleTagToggle = (tag: string) => {
    const newSelectedTags = selectedTags.includes(tag)
      ? selectedTags.filter(t => t !== tag)
      : [...selectedTags, tag];
    setSelectedTags(newSelectedTags);
    onFilterByTags(newSelectedTags);
  };
  
  const handleDateChange = (range?: DateRange) => {
    setDateRange(range);
    onFilterByDateRange(range);
  };

  const handleResetFilters = () => {
    setSearchTerm("");
    setSelectedTags([]);
    setDateRange(undefined);
    onSearch("");
    onFilterByTags([]);
    onFilterByDateRange(undefined);
  };

  return (
    <Card className="shadow-lg mb-8">
      <CardHeader>
        <CardTitle className="font-headline text-2xl flex items-center">
          <Filter className="mr-2 h-6 w-6 text-primary" /> Find Your Documents
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="space-y-2">
          <Label htmlFor="search">Search by Keyword</Label>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
            <Input
              id="search"
              type="search"
              placeholder="Search by name, content snippet..."
              value={searchTerm}
              onChange={handleSearchChange}
              className="pl-10"
            />
          </div>
        </div>

        <div className="space-y-2">
          <Label>Filter by Tags</Label>
          {allTags.length > 0 ? (
            <div className="flex flex-wrap gap-2">
              {allTags.map(tag => (
                <Button
                  key={tag}
                  variant={selectedTags.includes(tag) ? "default" : "outline"}
                  size="sm"
                  onClick={() => handleTagToggle(tag)}
                  className="rounded-full"
                >
                  {tag}
                </Button>
              ))}
            </div>
          ) : (
            <p className="text-sm text-muted-foreground">No tags available. Add documents with tags to filter.</p>
          )}
        </div>
        
        <div className="space-y-2">
          <Label>Filter by Date Range</Label>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant={"outline"}
                  className="w-full justify-start text-left font-normal"
                >
                  <CalendarDays className="mr-2 h-4 w-4" />
                  {dateRange?.from ? (
                    dateRange.to ? (
                      <>
                        {format(dateRange.from, "LLL dd, y")} -{" "}
                        {format(dateRange.to, "LLL dd, y")}
                      </>
                    ) : (
                      format(dateRange.from, "LLL dd, y")
                    )
                  ) : (
                    <span>Pick a date range</span>
                  )}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="start">
                <Calendar
                  initialFocus
                  mode="range"
                  defaultMonth={dateRange?.from}
                  selected={dateRange}
                  onSelect={handleDateChange}
                  numberOfMonths={2}
                />
              </PopoverContent>
            </Popover>
        </div>
        <Button variant="ghost" onClick={handleResetFilters} className="w-full text-primary hover:text-primary/80">
            <RotateCcw className="mr-2 h-4 w-4" /> Reset All Filters
        </Button>
      </CardContent>
    </Card>
  );
}
