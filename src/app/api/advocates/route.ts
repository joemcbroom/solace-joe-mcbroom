import db from "@/db";
import { advocates } from "@/db/schema";
import { count, and, gte, sql, or } from "drizzle-orm";

export async function GET(request: Request) {
  const url = new URL(request.url);
  const searchTerm = url.searchParams.get("searchTerm");
  const minExperience = url.searchParams.get("minExperience");
  const page = url.searchParams.get("page");
  const limit = url.searchParams.get("limit");

  const search = `%${(searchTerm ?? "").toLowerCase()}%`;

  const whereClause = and(
    or(
      sql`${advocates.city} ILIKE ${search}`,
      sql`${advocates.specialties}::text ILIKE ${search}`,
      sql`concat(${advocates.firstName}, ' ', ${advocates.lastName}) ILIKE ${search}`
    ),
    gte(advocates.yearsOfExperience, Number(minExperience))
  );
  const data = await db
    .select({
      id: advocates.id,
      firstName: advocates.firstName,
      lastName: advocates.lastName,
      city: advocates.city,
      degree: advocates.degree,
      specialties: advocates.specialties,
      yearsOfExperience: advocates.yearsOfExperience,
      phoneNumber: advocates.phoneNumber,
      createdAt: advocates.createdAt,
      total: sql<number>`count(*) over()`,
    })
    .from(advocates)
    .where(whereClause)
    .limit(Number(limit))
    .offset((Number(page) - 1) * Number(limit));

  return Response.json({ data, total: data[0]?.total ?? 0 });
}
