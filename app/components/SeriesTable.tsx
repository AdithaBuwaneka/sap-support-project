"use client";

import { useState } from "react";
import { SeriesRow } from "@/app/api/series/route";
import { getDocName } from "@/lib/sapDocNames";

interface Props {
  data: SeriesRow[];
}

const COLUMNS: { key: keyof SeriesRow; label: string }[] = [
  { key: "Series", label: "Series" },
  { key: "SeriesName", label: "Series Name" },
  { key: "InitialNum", label: "Initial No." },
  { key: "NextNumber", label: "Next No." },
  { key: "LastNum", label: "Last No." },
  { key: "BeginStr", label: "Begin Str" },
  { key: "EndStr", label: "End Str" },
  { key: "Remark", label: "Remark" },
  { key: "GroupCode", label: "Group" },
  { key: "Indicator", label: "Indicator" },
  { key: "IsForCncl", label: "For Cancel" },
  { key: "Locked", label: "Locked" },
  { key: "IsDigSerie", label: "Digit Serie" },
  { key: "BPLId", label: "BPL ID" },
];

const PAGE_SIZE = 10;

function groupByObjectCode(rows: SeriesRow[]): [string, SeriesRow[]][] {
  const map = new Map<string, SeriesRow[]>();
  for (const row of rows) {
    if (!map.has(row.ObjectCode)) map.set(row.ObjectCode, []);
    map.get(row.ObjectCode)!.push(row);
  }
  return Array.from(map.entries());
}

export default function SeriesTable({ data }: Props) {
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");

  const filtered = search.trim()
    ? data.filter((row) =>
        getDocName(row.ObjectCode).toLowerCase().includes(search.toLowerCase()) ||
        row.ObjectCode.toLowerCase().includes(search.toLowerCase()) ||
        row.SeriesName.toLowerCase().includes(search.toLowerCase())
      )
    : data;

  const allGroups = groupByObjectCode(filtered);
  const totalPages = Math.ceil(allGroups.length / PAGE_SIZE);
  const currentPage = Math.min(page, totalPages || 1);
  const pageGroups = allGroups.slice((currentPage - 1) * PAGE_SIZE, currentPage * PAGE_SIZE);

  function handleSearch(val: string) {
    setSearch(val);
    setPage(1);
  }

  return (
    <div className="space-y-3">
      {/* Search bar */}
      <div className="flex items-center gap-2">
        <input
          type="text"
          value={search}
          onChange={(e) => handleSearch(e.target.value)}
          placeholder="Search by document name, code or series..."
          className="w-80 px-3 py-1.5 text-sm text-gray-900 bg-white border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent placeholder:text-gray-400"
        />
        {search && (
          <button
            onClick={() => handleSearch("")}
            className="px-3 py-1.5 text-xs rounded-lg border border-gray-300 bg-white text-gray-500 hover:bg-gray-50"
          >
            Clear
          </button>
        )}
        <span className="text-xs text-gray-400">
          {allGroups.length} document{allGroups.length !== 1 ? "s" : ""} found
        </span>
      </div>

      <div className="overflow-y-auto rounded-lg border border-gray-200 shadow-sm" style={{ maxHeight: "calc(100vh - 240px)" }}>
        <table className="w-full text-xs text-left text-gray-700 border-separate border-spacing-0">
          <thead>
            <tr>
              <th className="sticky top-0 z-20 bg-blue-700 text-white uppercase tracking-wider px-3 py-2 font-semibold w-36 border-b border-blue-600">
                Document
              </th>
              {COLUMNS.map((col) => (
                <th
                  key={col.key}
                  className="sticky top-0 z-20 bg-blue-700 text-white uppercase tracking-wider px-2 py-2 font-semibold border-b border-blue-600"
                >
                  {col.label}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {pageGroups.map(([objectCode, rows], groupIdx) => (
              rows.map((row, rowIdx) => (
                <tr
                  key={`${objectCode}-${rowIdx}`}
                  className={`${groupIdx % 2 === 0 ? "bg-white" : "bg-gray-50"} hover:bg-blue-50 transition-colors`}
                >
                  {rowIdx === 0 ? (
                    <td
                      rowSpan={rows.length}
                      className="px-3 py-2 bg-blue-50 border-r border-b border-gray-200 align-top w-36"
                    >
                      <div className="font-semibold text-blue-800 text-xs leading-tight">
                        {getDocName(objectCode)}
                      </div>
                      <div className="text-gray-400 mt-0.5 text-xs">
                        {objectCode}
                      </div>
                    </td>
                  ) : null}
                  {COLUMNS.map((col) => (
                    <td key={col.key} className="px-2 py-1.5 border-b border-gray-100">
                      {row[col.key] !== null && row[col.key] !== undefined
                        ? String(row[col.key])
                        : <span className="text-gray-300">—</span>}
                    </td>
                  ))}
                </tr>
              ))
            ))}
          </tbody>
        </table>
      </div>

      {/* Pagination bottom */}
      <Pagination page={currentPage} totalPages={totalPages} totalGroups={allGroups.length} totalRows={filtered.length} onChange={setPage} />
    </div>
  );
}

function Pagination({
  page,
  totalPages,
  totalGroups,
  totalRows,
  onChange,
}: {
  page: number;
  totalPages: number;
  totalGroups: number;
  totalRows: number;
  onChange: (p: number) => void;
}) {
  const pages = Array.from({ length: totalPages }, (_, i) => i + 1);

  return (
    <div className="flex items-center justify-between flex-wrap gap-2">
      <p className="text-xs text-gray-500">
        Showing page <span className="font-medium text-gray-700">{page}</span> of{" "}
        <span className="font-medium text-gray-700">{totalPages}</span> —{" "}
        {totalGroups} documents, {totalRows} series rows total
      </p>
      <div className="flex items-center gap-1">
        <button
          onClick={() => onChange(page - 1)}
          disabled={page === 1}
          className="px-3 py-1.5 text-xs rounded border border-gray-300 bg-white text-gray-600 hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed"
        >
          Previous
        </button>
        {pages.map((p) => (
          <button
            key={p}
            onClick={() => onChange(p)}
            className={`px-3 py-1.5 text-xs rounded border ${
              p === page
                ? "bg-blue-700 text-white border-blue-700 font-semibold"
                : "bg-white text-gray-600 border-gray-300 hover:bg-gray-50"
            }`}
          >
            {p}
          </button>
        ))}
        <button
          onClick={() => onChange(page + 1)}
          disabled={page === totalPages}
          className="px-3 py-1.5 text-xs rounded border border-gray-300 bg-white text-gray-600 hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed"
        >
          Next
        </button>
      </div>
    </div>
  );
}
