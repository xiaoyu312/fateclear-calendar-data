// Independent checks of data/ against lunar-javascript and tyme4ts.
import { readFileSync } from "node:fs";
import lunar from "lunar-javascript";
import { SolarTerm } from "tyme4ts";
const { Solar } = lunar;
const load = (n) => JSON.parse(readFileSync(new URL(`../data/${n}.json`, import.meta.url)));
let fail = 0;
const days = load("days");
for (const r of days) {
  const [y, m, d] = r.date.split("-").map(Number);
  const l = Solar.fromYmd(y, m, d).getLunar();
  const want = [l.getYearInGanZhiByLiChun(), l.getMonthInGanZhi(), l.getDayInGanZhi(), l.getYear(), Math.abs(l.getMonth()), l.getMonth() < 0 ? 1 : 0, l.getDay()];
  const got = [r.year_pillar, r.month_pillar, r.day_pillar, r.lunar_year, r.lunar_month, r.lunar_leap_month, r.lunar_day];
  if (want.join() !== got.join()) { if (fail++ < 10) console.log("day mismatch", r.date, got.join(), "vs", want.join()); }
}
let worst = 0;
for (const t of load("solar_terms")) {
  const ref = SolarTerm.fromIndex(t.year, t.index + 1).getJulianDay().getSolarTime();
  const refMs = Date.UTC(ref.getYear(), ref.getMonth() - 1, ref.getDay(), ref.getHour() - 8, ref.getMinute(), ref.getSecond());
  worst = Math.max(worst, Math.abs(Date.parse(t.utc) - refMs) / 60e3);
}
const spot = days.find((r) => r.date === "1990-03-12");
console.log(`days ${days.length}, mismatches ${fail}; solar terms max diff vs tyme4ts ${worst.toFixed(2)} min; 1990-03-12 = ${spot.year_pillar} ${spot.month_pillar} ${spot.day_pillar}`);
if (fail || worst > 2 || spot.day_pillar !== "丙子" || spot.month_pillar !== "己卯" || spot.year_pillar !== "庚午") process.exit(1);
