import FetchWalletInfo from "./components/GetWalletInfo";
import CreateGreet from "./components/CreateGreet";
import GreetingCard from "./components/GreetingCard";

export default function Home() {
  return (
    <main className="flex flex-col items-center justify-center min-h-screen p-8 space-y-8">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl w-full">
        <div className="border border-gray-700 rounded-lg hover:border-teal-500 transition-colors min-h-[300px] flex flex-col">
          <FetchWalletInfo />
        </div>
        <div className="border border-gray-700 rounded-lg hover:border-teal-500 transition-colors min-h-[300px] flex flex-col">
          <CreateGreet />
        </div>
        <div className="border border-gray-700 rounded-lg hover:border-teal-500 transition-colors min-h-[300px] flex flex-col">
          <GreetingCard />
        </div>
      </div>
    </main>
  );
}