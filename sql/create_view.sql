-- Run this script in SAP HANA Studio or HANA DB to create the view
-- Schema: ANURA_TEST_WMS

CREATE OR REPLACE VIEW "ANURA_TEST_WMS"."V_DOC_NUMBERING" AS
SELECT
  ONNM."ObjectCode",
  ONNM."ObjType",
  NNM1."Series",
  NNM1."SeriesName",
  NNM1."InitialNum",
  NNM1."NextNumber",
  NNM1."LastNumber",
  NNM1."BeginStr",
  NNM1."EndStr",
  NNM1."Remark",
  NNM1."GroupCode",
  NNM1."Indicator",
  NNM1."IsForCncl",
  NNM1."Locked",
  NNM1."IsDigSerie",
  NNM1."BPLId"
FROM "ANURA_TEST_WMS"."ONNM" ONNM
INNER JOIN "ANURA_TEST_WMS"."NNM1" NNM1
  ON ONNM."ObjectCode" = NNM1."ObjectCode"
ORDER BY ONNM."ObjectCode", NNM1."SeriesName";
