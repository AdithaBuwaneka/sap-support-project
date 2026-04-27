"use client";

import { SeriesRow } from "@/app/api/series/route";

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

function groupByObjectCode(rows: SeriesRow[]): Map<string, SeriesRow[]> {
  const map = new Map<string, SeriesRow[]>();
  for (const row of rows) {
    const key = row.ObjectCode;
    if (!map.has(key)) map.set(key, []);
    map.get(key)!.push(row);
  }
  return map;
}

export default function SeriesTable({ data }: Props) {
  const grouped = groupByObjectCode(data);

  return (
    <div className="overflow-x-auto rounded-lg border border-gray-200 shadow-sm">
      <table className="min-w-full text-sm text-left text-gray-700">
        <thead className="bg-blue-700 text-white text-xs uppercase tracking-wider">
          <tr>
            <th className="px-4 py-3 font-semibold w-48">Object Code</th>
            {COLUMNS.map((col) => (
              <th key={col.key} className="px-4 py-3 font-semibold whitespace-nowrap">
                {col.label}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {Array.from(grouped.entries()).map(([objectCode, rows], groupIdx) => (
            rows.map((row, rowIdx) => (
              <tr
                key={`${objectCode}-${rowIdx}`}
                className={`border-t border-gray-100 ${groupIdx % 2 === 0 ? "bg-white" : "bg-gray-50"} hover:bg-blue-50 transition-colors`}
              >
                {rowIdx === 0 ? (
                  <td
                    rowSpan={rows.length}
                    className="px-4 py-3 font-semibold text-blue-800 bg-blue-50 border-r border-gray-200 align-top whitespace-nowrap"
                  >
                    <div>{objectCode}</div>
                    {rows[0].DocAlias && (
                      <div className="text-xs text-gray-500 font-normal mt-0.5">{rows[0].DocAlias}</div>
                    )}
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
  );
}
