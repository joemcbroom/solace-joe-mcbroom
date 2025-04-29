import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";

const setup = () => {
  const queryClient = postgres(process.env.DATABASE_URL!);
  const db = drizzle(queryClient);
  return db;
};

export default setup();
