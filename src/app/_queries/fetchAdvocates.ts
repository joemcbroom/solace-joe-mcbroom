import { Advocate } from "@/db/schema";
import { infiniteQueryOptions, useInfiniteQuery } from "@tanstack/react-query";

type AdvocateFetchParams = {
  searchTerm: string;
  minExperience: number;
  page: number;
  limit: number;
};

const fetchAdvocates = async ({
  searchTerm,
  minExperience,
  page,
  limit,
}: AdvocateFetchParams): Promise<{ advocates: Advocate[]; total: number }> => {
  const queryParams = new URLSearchParams();
  queryParams.set("searchTerm", searchTerm);
  queryParams.set("minExperience", minExperience.toString());
  queryParams.set("page", page.toString());
  queryParams.set("limit", limit.toString());

  const url = `http://localhost:3000/api/advocates?${queryParams.toString()}`;

  const response = await fetch(url);
  const { data: advocates, total } = await response.json();
  return { advocates, total };
};

export const getAdvocatesInfiniteQueryOptions = (
  params: AdvocateFetchParams
) => {
  return infiniteQueryOptions({
    queryKey: ["advocates", params.searchTerm, params.minExperience],
    queryFn: async ({ pageParam = 1 }) => {
      return fetchAdvocates({
        searchTerm: params.searchTerm,
        minExperience: params.minExperience,
        page: pageParam,
        limit: params.limit,
      });
    },
    initialPageParam: 1,
    getNextPageParam: (lastPage, pages) => {
      return lastPage.total > pages.length ? pages.length + 1 : undefined;
    },
  });
};

export const useAdvocatesInfiniteQuery = (params: AdvocateFetchParams) => {
  return useInfiniteQuery({
    ...getAdvocatesInfiniteQueryOptions(params),
    placeholderData: previousData => previousData,
  });
};
