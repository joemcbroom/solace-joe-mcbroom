type AdvocateFetchParams = {
  searchTerm: string;
  minExperience: number;
};

/**
 * Isomorphic function to fetch advocates from the database
 * can be used on the client or server
 */
export default async function fetchAdvocates({
  searchTerm,
  minExperience,
}: AdvocateFetchParams) {
  const queryParams = new URLSearchParams();
  queryParams.set("searchTerm", searchTerm);
  queryParams.set("minExperience", minExperience.toString());
  const url = `http://localhost:3000/api/advocates?${queryParams.toString()}`;

  const response = await fetch(url);
  const { data: advocates, total } = await response.json();
  return { advocates, total };
}
