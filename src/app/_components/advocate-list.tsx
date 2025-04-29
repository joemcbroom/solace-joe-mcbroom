"use client";

import { type Advocate } from "@/db/schema";
import AdvocateListItem from "@/app/_components/advocate-list-item";
import { Loader } from "lucide-react";
import { useCallback, useEffect, useState, useRef } from "react";
import fetchAdvocates from "../api/fetchAdvocates";

type AdvocateListProps = {
  initialAdvocates: Advocate[];
  initialTotal: number;
};

export default function AdvocateList({
  initialAdvocates,
  initialTotal,
}: AdvocateListProps) {
  const [searchTerm, setSearchTerm] = useState("");
  const [minExperience, setMinExperience] = useState(0);
  const [advocates, setAdvocates] = useState(initialAdvocates);
  const [total, setTotal] = useState(initialTotal);
  const [isLoading, setIsLoading] = useState(false);
  const isInitialMount = useRef(true);

  const handleSearch = useCallback(async () => {
    setIsLoading(true);
    const { advocates, total } = await fetchAdvocates({
      searchTerm,
      minExperience,
    });
    setAdvocates(advocates);
    setTotal(total);
    setIsLoading(false);
  }, [searchTerm, minExperience]);

  useEffect(() => {
    if (isInitialMount.current) {
      isInitialMount.current = false;
      return;
    }
    handleSearch();
  }, [handleSearch]);

  return (
    <div className='flex flex-col gap-6'>
      <div className='flex items-center justify-between gap-2 sticky top-0 bg-neutral-50 border-b border-neutral-200 p-8 w-full z-50'>
        <input
          className='border-2 border-gray-300 rounded-md p-2 w-1/4'
          type='text'
          onChange={e => setSearchTerm(e.target.value)}
          value={searchTerm}
          placeholder='Search advocates...'
        />
        <label htmlFor='minExperience'>
          Minimum experience (years): {minExperience}
          <input
            type='range'
            min={0}
            max={15}
            onChange={e => setMinExperience(parseInt(e.target.value))}
            value={minExperience}
            placeholder='Minimum experience'
            className='w-1/2'
            id='minExperience'
          />
        </label>
        <span>
          Results: {advocates.length} of {total}
        </span>
        {isLoading && (
          <Loader className='w-4 h-4 fixed bottom-10 right-10 animate-spin' />
        )}
      </div>
      <div className='grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 container mx-auto mb-12'>
        {advocates.map(advocate => (
          <AdvocateListItem key={advocate.id} advocate={advocate} />
        ))}
      </div>
    </div>
  );
}
