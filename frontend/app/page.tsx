import StockSearch from "@/components/StockSearch";

export default function Home() {
  return (
    <div className="min-h-screen bg-zinc-50 dark:bg-black py-8">
      <div className="container mx-auto px-4">
        <div className="mb-8 text-center">
          <h1 className="text-4xl font-bold mb-2">Stock Data Viewer</h1>
          <p className="text-gray-600 dark:text-gray-400">
            Search for 1-minute stock data from Alpaca Markets
          </p>
        </div>
        <StockSearch />
      </div>
    </div>
  );
}
