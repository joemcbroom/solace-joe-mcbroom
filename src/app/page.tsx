import fetchAdvocates from "@/app/api/fetchAdvocates";
import AdvocateList from "@/app/_components/advocate-list";

export default async function Home() {
  const { advocates, total } = await fetchAdvocates({
    searchTerm: "",
    minExperience: 0,
  });

  return (
    <main className=''>
      <AdvocateList initialAdvocates={advocates} initialTotal={total} />
    </main>
  );
}
