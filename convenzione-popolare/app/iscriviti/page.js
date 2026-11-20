import { getCount } from "@/lib/sheets";
import TopBar from "../components/TopBar";
import SignupForm from "../components/SignupForm";

export const revalidate = 60;
export const metadata = { title: "Aderisci in 5 secondi | Convenzione Popolare" };

export default async function Page() {
  const goal = Number(process.env.NEXT_PUBLIC_GOAL || 10000);
  const count = await getCount();
  return (
    <div className="formpage">
      <TopBar count={count} goal={goal} />
      <main className="formwrap">
        <SignupForm />
      </main>
    </div>
  );
}