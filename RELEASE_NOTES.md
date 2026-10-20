# v1.0.0 — 1900–2100 历法数据 / Calendar data 1900–2100

首个版本。First release.

**包含 / Contents**
- `solar_terms.csv/.json` — 4,824 行：1900–2100 年每年 24 节气交节时刻（UTC 与北京时间，精确到秒） / 24 solar-term moments per year, UTC and Beijing time, to the second.
- `days.csv/.json` — 73,414 行：每天的年柱、月柱、日柱，农历年月日（含闰月），当天节气 / one row per day with year, month and day pillars, lunar date (with leap months) and the solar term of that day.
- `china_dst_1986_1991.csv/.json` — 6 行：中国 1986–1991 年夏令时起止 / China DST start and end, 1986–1991.

**核对 / Checks**
- 73,414 天的干支和农历与 lunar-javascript 逐日比对，0 处不一致 / 0 mismatches against lunar-javascript over all days.
- 节气时刻与 tyme4ts 对比，最大差 1.03 分钟 / max 1.03 min difference vs tyme4ts.
- 示例 / spot check: 1990-03-12 → 庚午年 己卯月 丙子日，农历二月十六.

**协议 / License:** CC BY 4.0。使用时请注明「拨云 FateClear」并附 https://fateclear.com 。Please credit "拨云 FateClear" with a link to https://fateclear.com.

**附件 / Assets:** `fateclear-calendar-data-v1.0.0.zip`（全部 CSV 和 JSON / all CSV and JSON files）, `SHA256SUMS.txt`.
