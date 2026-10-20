// Regenerates everything in data/. Deterministic: same versions → identical files.
import * as Astronomy from "astronomy-engine";
import { SolarDay } from "tyme4ts";
import { writeFileSync, mkdirSync } from "node:fs";

const FIRST = 1900, LAST = 2100;
const OUT = new URL("../data/", import.meta.url);
mkdirSync(OUT, { recursive: true });

const TERMS = [
  ["小寒","小寒","Minor Cold",285],["大寒","大寒","Major Cold",300],["立春","立春","Start of Spring",315],["雨水","雨水","Rain Water",330],
  ["惊蛰","驚蟄","Awakening of Insects",345],["春分","春分","Spring Equinox",0],["清明","清明","Pure Brightness",15],["谷雨","穀雨","Grain Rain",30],
  ["立夏","立夏","Start of Summer",45],["小满","小滿","Grain Buds",60],["芒种","芒種","Grain in Ear",75],["夏至","夏至","Summer Solstice",90],
  ["小暑","小暑","Minor Heat",105],["大暑","大暑","Major Heat",120],["立秋","立秋","Start of Autumn",135],["处暑","處暑","End of Heat",150],
  ["白露","白露","White Dew",165],["秋分","秋分","Autumn Equinox",180],["寒露","寒露","Cold Dew",195],["霜降","霜降","Frost's Descent",210],
  ["立冬","立冬","Start of Winter",225],["小雪","小雪","Minor Snow",240],["大雪","大雪","Major Snow",255],["冬至","冬至","Winter Solstice",270],
];
const iso = (ms) => new Date(Math.round(ms / 1000) * 1000).toISOString().replace(".000Z", "Z");
const bj = (ms) => new Date(Math.round(ms / 1000) * 1000 + 8 * 3600e3).toISOString().slice(0, 19).replace("T", " ");
const csvCell = (v) => (/[",\n]/.test(String(v)) ? `"${String(v).replace(/"/g, '""')}"` : String(v));
const toCsv = (rows) => [Object.keys(rows[0]).join(","), ...rows.map((r) => Object.values(r).map(csvCell).join(","))].join("\n") + "\n";
const write = (name, rows) => {
  writeFileSync(new URL(name + ".csv", OUT), toCsv(rows));
  writeFileSync(new URL(name + ".json", OUT), JSON.stringify(rows) + "\n");
};

// 1. Solar terms
const terms = [];
for (let y = FIRST; y <= LAST; y++) {
  TERMS.forEach(([zh, zhHant, en, lon], i) => {
    const start = Astronomy.MakeTime(new Date(Date.UTC(y, 0, 1) + (i * 15.2 - 8) * 864e5));
    const hit = Astronomy.SearchSunLongitude(lon, start, 20);
    const ms = hit.date.getTime();
    terms.push({ year: y, index: i, name_zh: zh, name_zh_hant: zhHant, name_en: en, solar_longitude: lon, utc: iso(ms), beijing_time: bj(ms) });
  });
}
write("solar_terms", terms);

// 2. Daily calendar
// Year and month pillars switch on the Beijing-time date of each 节 (小寒, 立春, 惊蛰 …),
// taken from the solar-term moments above so both files always agree.
const GAN = "甲乙丙丁戊己庚辛壬癸", ZHI = "子丑寅卯辰巳午未申酉戌亥";
const gz = (i) => GAN[((i % 60) + 60) % 60 % 10] + ZHI[((i % 60) + 60) % 60 % 12];
const termByDate = new Map(terms.map((t) => [t.beijing_time.slice(0, 10), t]));
const jie = terms.filter((t) => t.index % 2 === 0); // 小寒, 立春, 惊蛰 … 大雪
let jieIdx = -1, monthNo = FIRST * 12 - 1; // before 1900 小寒: 1899 大雪 month
let lichunYear = FIRST - 1;
const days = [];
let d = SolarDay.fromYmd(FIRST, 1, 1);
const last = SolarDay.fromYmd(LAST, 12, 31);
for (;;) {
  const sc = d.getSixtyCycleDay(); // day pillar only
  const dateStr = `${d.getYear()}-${String(d.getMonth()).padStart(2, "0")}-${String(d.getDay()).padStart(2, "0")}`;
  while (jieIdx + 1 < jie.length && jie[jieIdx + 1].beijing_time.slice(0, 10) <= dateStr) {
    jieIdx++;
    const j = jie[jieIdx];
    monthNo = j.year * 12 + j.index / 2;
    if (j.index === 2) lichunYear = j.year;
  }
  const t = termByDate.get(dateStr);
  const ld = d.getLunarDay();
  const lm = ld.getLunarMonth();
  days.push({
    date: dateStr,
    weekday: d.getWeek().getIndex(),
    year_pillar: gz(lichunYear - 4),
    month_pillar: gz(14 + monthNo - (1990 * 12 + 1)),
    day_pillar: sc.getSixtyCycle().getName(),
    lunar_year: lm.getLunarYear().getYear(),
    lunar_month: Math.abs(lm.getMonthWithLeap()),
    lunar_leap_month: lm.isLeap() ? 1 : 0,
    lunar_day: ld.getDay(),
    lunar_text: ld.toString().replace(/^农历/, ""),
    solar_term: t ? t.name_zh : "",
  });
  if (d.equals(last)) break;
  d = d.next(1);
}
write("days", days);

// 3. China DST
const dst = [
  [1986, "1986-05-04 02:00", "1986-09-14 02:00", "1986-05-03T18:00:00Z", "1986-09-13T17:00:00Z"],
  [1987, "1987-04-12 02:00", "1987-09-13 02:00", "1987-04-11T18:00:00Z", "1987-09-12T17:00:00Z"],
  [1988, "1988-04-17 02:00", "1988-09-11 02:00", "1988-04-16T18:00:00Z", "1988-09-10T17:00:00Z"],
  [1989, "1989-04-16 02:00", "1989-09-17 02:00", "1989-04-15T18:00:00Z", "1989-09-16T17:00:00Z"],
  [1990, "1990-04-15 02:00", "1990-09-16 02:00", "1990-04-14T18:00:00Z", "1990-09-15T17:00:00Z"],
  [1991, "1991-04-14 02:00", "1991-09-15 02:00", "1991-04-13T18:00:00Z", "1991-09-14T17:00:00Z"],
].map(([year, start_local, end_local, start_utc, end_utc]) => ({ year, start_local, end_local, start_utc, end_utc, offset_standard: "+08:00", offset_dst: "+09:00" }));
write("china_dst_1986_1991", dst);

console.log(`solar_terms: ${terms.length} rows, days: ${days.length} rows, dst: ${dst.length} rows`);
