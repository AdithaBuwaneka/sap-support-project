import { NextResponse } from "next/server";
import { queryHana } from "@/lib/hana";

export interface SeriesRow {
  ObjectCode: string;
  DocAlias: string | null;
  Series: number;
  SeriesName: string;
  InitialNum: number;
  NextNumber: number;
  LastNum: number | null;
  BeginStr: string | null;
  EndStr: string | null;
  Remark: string | null;
  GroupCode: number;
  Indicator: string;
  IsForCncl: string;
  Locked: string;
  IsDigSerie: string;
  BPLId: number | null;
}

export async function GET() {
  try {
    const schema = process.env.HANA_SCHEMA;
    const rows = await queryHana<SeriesRow>(
      `SELECT * FROM "${schema}"."V_DOC_NUMBERING" ORDER BY "ObjectCode", "SeriesName"`
    );
    return NextResponse.json({ data: rows });
  } catch (error) {
    console.error("HANA query error:", error);
    return NextResponse.json(
      { error: "Failed to fetch data from HANA" },
      { status: 500 }
    );
  }
}
