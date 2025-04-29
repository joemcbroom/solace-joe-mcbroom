"use client";

import { useMemo, useState } from "react";
import { useAdvocatesInfiniteQuery } from "../_queries/fetchAdvocates";
import { useDebounce } from "react-use";
import { Loader } from "lucide-react";

import AdvocateListItem from "@/app/_components/advocate-list-items";
import IntersectionTrigger from "./intersection-trigger";

export default function AdvocateList() {
  const [searchTerm, setSearchTerm] = useState("");
  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState("");
  const [minExperience, setMinExperience] = useState(0);
  const [debouncedMinExperience, setDebouncedMinExperience] = useState(0);

  useDebounce(() => setDebouncedSearchTerm(searchTerm), 500, [searchTerm]);
  useDebounce(() => setDebouncedMinExperience(minExperience), 500, [
    minExperience,
  ]);

  const { data, isFetchingNextPage, fetchNextPage, hasNextPage } =
    useAdvocatesInfiniteQuery({
      searchTerm: debouncedSearchTerm,
      minExperience: debouncedMinExperience,
      page: 1,
      limit: 20,
    });

  const advocates = useMemo(
    () => data?.pages.flatMap(page => page.advocates) || [],
    [data]
  );
  const total = useMemo(() => data?.pages[0]?.total || 0, [data]);

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
        {isFetchingNextPage && (
          <Loader className='size-10 fixed bottom-10 left-10 animate-spin' />
        )}
      </div>
      <div className='grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 container mx-auto mb-12'>
        {advocates.map(advocate => (
          <AdvocateListItem key={advocate.id} advocate={advocate} />
        ))}
        {hasNextPage && (
          <IntersectionTrigger onIntersect={() => fetchNextPage()} />
        )}
      </div>
    </div>
  );
}
