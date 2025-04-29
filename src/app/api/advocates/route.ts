import db from "@/db";
import { advocates } from "@/db/schema";
import { count, and, gte, sql, or } from "drizzle-orm";

export async function GET(request: Request) {
  const url = new URL(request.url);
  const searchTerm = url.searchParams.get("searchTerm");
  const minExperience = url.searchParams.get("minExperience");

  const search = `%${(searchTerm ?? "").toLowerCase()}%`;

  const whereClause = and(
    or(
      sql`${advocates.city} ILIKE ${search}`,
      sql`${advocates.specialties}::text ILIKE ${search}`,
      sql`concat(${advocates.firstName}, ' ', ${advocates.lastName}) ILIKE ${search}`
    ),
    gte(advocates.yearsOfExperience, Number(minExperience))
  );

  const data = await db.select().from(advocates).where(whereClause);

  const [totalResult] = await db
    .select({ total: count() })
    .from(advocates)
    .where(whereClause);

  return Response.json({ data, total: totalResult.total });
}
