import AdvocateList from "@/app/_components/advocate-list";
import { getQueryClient } from "@/app/_lib/get-query-client";
import { getAdvocatesInfiniteQueryOptions } from "./_queries/fetch-advocates";
import { dehydrate, HydrationBoundary } from "@tanstack/react-query";

export default async function Home() {
  const queryClient = getQueryClient();

  await queryClient.prefetchInfiniteQuery(
    getAdvocatesInfiniteQueryOptions({
      searchTerm: "",
      minExperience: 0,
      page: 1,
      limit: 20,
    })
  );

  const dehydratedState = dehydrate(queryClient);

  return (
    <HydrationBoundary state={dehydratedState}>
      <main className=''>
        <AdvocateList />
      </main>
    </HydrationBoundary>
  );
}
