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

  const allGroups = groupByObjectCode(data);
  const totalPages = Math.ceil(allGroups.length / PAGE_SIZE);
  const pageGroups = allGroups.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  return (
    <div className="space-y-4">
      {/* Pagination top */}
      <Pagination page={page} totalPages={totalPages} totalGroups={allGroups.length} totalRows={data.length} onChange={setPage} />

      <div className="overflow-x-auto rounded-lg border border-gray-200 shadow-sm">
        <table className="min-w-full text-sm text-left text-gray-700">
          <thead className="bg-blue-700 text-white text-xs uppercase tracking-wider sticky top-0">
            <tr>
              <th className="px-4 py-3 font-semibold w-56">Document</th>
              {COLUMNS.map((col) => (
                <th key={col.key} className="px-4 py-3 font-semibold whitespace-nowrap">
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
                  className={`border-t border-gray-100 ${groupIdx % 2 === 0 ? "bg-white" : "bg-gray-50"} hover:bg-blue-50 transition-colors`}
                >
                  {rowIdx === 0 ? (
                    <td
                      rowSpan={rows.length}
                      className="px-4 py-3 bg-blue-50 border-r border-gray-200 align-top whitespace-nowrap"
                    >
                      <div className="font-semibold text-blue-800 text-sm">
                        {getDocName(objectCode)}
                      </div>
                      <div className="text-xs text-gray-400 mt-0.5">
                        Code: {objectCode}
                      </div>
                    </td>
                  ) : null}
                  {COLUMNS.map((col) => (
                    <td key={col.key} className="px-4 py-2 whitespace-nowrap">
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
      <Pagination page={page} totalPages={totalPages} totalGroups={allGroups.length} totalRows={data.length} onChange={setPage} />
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
