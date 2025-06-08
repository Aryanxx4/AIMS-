import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";

interface SearchBarProps {
  onSearch: (searchParams: SearchParams) => void;
}

export interface SearchParams {
  courseCode: string;
  branch: string;
  batch: string;
  degree: string;
}

export function SearchBar({ onSearch }: SearchBarProps) {
  const [searchParams, setSearchParams] = useState<SearchParams>({
    courseCode: "",
    branch: "",
    batch: "",
    degree: "",
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setSearchParams((prev) => ({ ...prev, [name]: value }));
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    onSearch(searchParams);
  };

  return (
    <form onSubmit={handleSearch} className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="space-y-2">
          <Label htmlFor="courseCode">Course Code</Label>
          <Input
            id="courseCode"
            name="courseCode"
            value={searchParams.courseCode}
            onChange={handleInputChange}
            placeholder="Enter course code"
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="branch">Branch</Label>
          <Input
            id="branch"
            name="branch"
            value={searchParams.branch}
            onChange={handleInputChange}
            placeholder="Enter branch"
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="batch">Batch</Label>
          <Input
            id="batch"
            name="batch"
            value={searchParams.batch}
            onChange={handleInputChange}
            placeholder="Enter batch"
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="degree">Degree</Label>
          <Input
            id="degree"
            name="degree"
            value={searchParams.degree}
            onChange={handleInputChange}
            placeholder="Enter degree"
          />
        </div>
      </div>
      <Button type="submit" className="w-full">
        Search Courses
      </Button>
    </form>
  );
}
