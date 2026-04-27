import SeriesTable from "@/app/components/SeriesTable";
import { SeriesRow } from "@/app/api/series/route";

async function getData(): Promise<SeriesRow[]> {
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000";
  const res = await fetch(`${baseUrl}/api/series`, { cache: "no-store" });
  if (!res.ok) throw new Error("Failed to fetch series data");
  const json = await res.json();
  return json.data;
}

export default async function Home() {
  let data: SeriesRow[] = [];
  let error: string | null = null;

  try {
    data = await getData();
  } catch {
    error = "Could not connect to HANA database. Please check your connection.";
  }

  return (
    <main className="min-h-screen bg-gray-100 px-4 py-4">
      <div className="w-full">
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-gray-800">
            Document Numbering Series
          </h1>
          <p className="text-sm text-gray-500 mt-1">
            SAP Business One — ONNM / NNM1 — Read Only View
          </p>
        </div>

        {error ? (
          <div className="bg-red-50 border border-red-200 text-red-700 rounded-lg px-5 py-4">
            {error}
          </div>
        ) : data.length === 0 ? (
          <div className="bg-yellow-50 border border-yellow-200 text-yellow-700 rounded-lg px-5 py-4">
            No data found.
          </div>
        ) : (
          <>
            <p className="text-xs text-gray-400 mb-3">{data.length} series rows loaded</p>
            <SeriesTable data={data} />
          </>
        )}
      </div>
    </main>
  );
}
