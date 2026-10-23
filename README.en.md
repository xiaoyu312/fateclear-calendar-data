[简体中文](README.md) · [English](README.en.md) · [日本語](README.ja.md)

# fateclear-calendar-data

**Add solar terms, sexagenary pillars, and Chinese lunar dates for 1900–2100 to your calendar tools with CSV and JSON.**

For developers building calendar apps, calendar displays, or data analyses. Download the files to look up year, month, and day pillars and lunar dates by Gregorian date, or read the 24 solar-term moments for a year. A separate table covers China's daylight saving time (DST) in 1986–1991. You can use the published files without running the generator.

Compiled and published by [拨云 FateClear](https://fateclear.com). To view a birth-time chart directly, use the separate [FateClear BaZi chart](https://fateclear.com/bazi) website. Follow the author's updates on [X](https://x.com/liu_xiaoyu27334).

[![Verify data](https://github.com/xiaoyu312/fateclear-calendar-data/actions/workflows/verify.yml/badge.svg)](https://github.com/xiaoyu312/fateclear-calendar-data/actions/workflows/verify.yml)
[![Data: CC BY 4.0](https://img.shields.io/badge/Data-CC%20BY%204.0-lightgrey.svg)](LICENSE)

## Start with a published example

The [v1.0.0 release notes](RELEASE_NOTES.md) record this date check:

| Gregorian date | Year pillar | Month pillar | Day pillar | Chinese lunar date |
| --- | --- | --- | --- | --- |
| `1990-03-12` | 庚午 | 己卯 | 丙子 | Month 2, day 16 (二月十六) |

This is calendar data at day granularity, without an hour pillar. See “Scope and limitations” below for solar-term boundaries and the day-boundary convention.

## Download and read

Download these assets from the [v1.0.0 Release](https://github.com/xiaoyu312/fateclear-calendar-data/releases/tag/v1.0.0):

- [fateclear-calendar-data-v1.0.0.zip](https://github.com/xiaoyu312/fateclear-calendar-data/releases/download/v1.0.0/fateclear-calendar-data-v1.0.0.zip): three datasets in CSV and JSON, six files in total.
- [SHA256SUMS.txt](https://github.com/xiaoyu312/fateclear-calendar-data/releases/download/v1.0.0/SHA256SUMS.txt): a SHA-256 checksum for each of the six data files.

After extraction, open a CSV in a spreadsheet or load the JSON in your own program. The large `days` and `solar_terms` files are not stored in Git. The six-row DST table is already included as [CSV](data/china_dst_1986_1991.csv) and [JSON](data/china_dst_1986_1991.json).

## Datasets and fields

The table lists locally generated paths. The release archive supplies CSV and JSON files with the same names.

| Files | Rows | Contents |
| --- | --- | --- |
| `data/solar_terms.csv` / `data/solar_terms.json` | 4,824 | 24 terms per year for 1900–2100, from Minor Cold to Winter Solstice |
| `data/days.csv` / `data/days.json` | 73,414 | One row per date from 1900-01-01 through 2100-12-31, inclusive |
| `data/china_dst_1986_1991.csv` / `data/china_dst_1986_1991.json` | 6 | China's DST start/end moments and UTC offsets for 1986–1991 |

### `solar_terms`

| Field | Meaning |
| --- | --- |
| `year` | Gregorian year |
| `index` | 0–23; 0 = Minor Cold (小寒), 2 = Start of Spring (立春), 23 = Winter Solstice (冬至) |
| `name_zh` / `name_zh_hant` / `name_en` | Simplified Chinese, Traditional Chinese, and English names |
| `solar_longitude` | The Sun's apparent ecliptic longitude, in degrees |
| `utc` | Solar-term moment in UTC, ISO 8601 format, rounded to the nearest second |
| `beijing_time` | The same moment expressed at a fixed UTC+8 offset; no DST adjustment |

### `days`

| Field | Meaning |
| --- | --- |
| `date` | Gregorian date, `YYYY-MM-DD` |
| `weekday` | 0 = Sunday, …, 6 = Saturday |
| `year_pillar` | Year pillar, changing on the Beijing calendar date of Start of Spring (立春) |
| `month_pillar` | Month pillar, changing on the Beijing calendar date of each 节 (小寒, 立春, 惊蛰, …, 大雪) |
| `day_pillar` | Day pillar, with the Gregorian date changing at 00:00 |
| `lunar_year` | Chinese lunar year |
| `lunar_month` | Positive lunar month number; leap-month status is in `lunar_leap_month` |
| `lunar_leap_month` | 1 = leap month, 0 = ordinary month |
| `lunar_day` | Day of the lunar month |
| `lunar_text` | Chinese lunar-date text, such as `庚午年二月十六` |
| `solar_term` | Simplified Chinese name of the term occurring on this fixed-UTC+8 date, or an empty string |

### `china_dst_1986_1991`

| Field | Meaning |
| --- | --- |
| `year` | Gregorian year, 1986–1991 |
| `start_local` | DST start time expressed using the pre-transition standard-time offset (UTC+8) |
| `end_local` | DST end time expressed using the pre-transition daylight-time offset (UTC+9) |
| `start_utc` | DST start moment in UTC, ISO 8601 format |
| `end_utc` | DST end moment in UTC, ISO 8601 format |
| `offset_standard` | Standard-time offset, `+08:00` |
| `offset_dst` | Daylight-time offset, `+09:00` |

## Generate and verify

### Generate from source

You need Git, Node.js, and npm. The repository's CI uses Node.js 22; use that environment for reproduction. The repository does not declare compatibility with other versions. Run:

```sh
git clone https://github.com/xiaoyu312/fateclear-calendar-data.git
cd fateclear-calendar-data
npm ci
npm run build
npm run verify
```

If you already have a checkout, run the three npm commands from its root. `npm ci` installs the locked dependencies. `npm run build` runs [scripts/generate.mjs](scripts/generate.mjs), creating or overwriting the six CSV/JSON files in `data/`. Expected generator output:

```text
solar_terms: 4824 rows, days: 73414 rows, dst: 6 rows
```

The generation method and pinned dependency versions are listed below. See the [third-party notices](THIRD_PARTY_NOTICES.md) for their sources.

- `astronomy-engine 2.1.19` calculates when the Sun's apparent ecliptic longitude reaches each multiple of 15°.
- Year and month pillars are derived from the Beijing calendar dates of those solar-term moments.
- `tyme4ts 1.5.3` provides day pillars and lunar dates, and serves as the comparison source for solar-term moments.
- `lunar-javascript 1.7.7` is used for the daily cross-check.

### Compare files with the Release checksums

Place `SHA256SUMS.txt` from the same v1.0.0 Release in the directory containing the six extracted data files. The checksum list uses bare filenames, so run the appropriate command from that directory.

Linux:

```sh
sha256sum -c SHA256SUMS.txt
```

macOS:

```sh
shasum -a 256 -c SHA256SUMS.txt
```

To check locally generated data, put the checksum file in the repository's `data/` directory, run `cd data`, and then run the appropriate command. All six files must report `OK` to match the published checksums. These checksums cover the data files, not the ZIP itself. Pinned dependencies support reproduction; an actual checksum check is still needed to establish byte-for-byte agreement with the Release.

## Scope and limitations

- In `days`, the year pillar changes only on the Beijing calendar date of Start of Spring (立春), and the month pillar only on the dates of the twelve 节, in each case for the whole date. Before the term's moment on a relevant changeover date, determine the affected year or month pillar using `solar_terms` instead of directly using the daily row.
- Day pillars change at 00:00. The alternative convention that starts the next day at 23:00 is not applied. There is no hour pillar, and this dataset is not a complete four-pillar charting or interpretation service.
- `beijing_time` always uses fixed UTC+8, rather than converting historical civil time. The 1986–1991 DST data is a separate table and is not automatically applied to solar-term timestamps.
- Times are rounded to seconds. This is output resolution, not a verified one-second astronomical accuracy claim. Agreement between libraries does not replace validation against independent astronomical observations.
- Calendar and solar-term data covers only 1900–2100. The DST table covers only the six listed years; it is not a complete global or historical Chinese time-zone database.

## Recorded results and verification coverage

The [v1.0.0 release notes](RELEASE_NOTES.md) report zero pillar/lunar-date mismatches against `lunar-javascript` over 73,414 dates, and a maximum solar-term difference of 1.03 minutes against `tyme4ts`. These are the recorded comparisons for that release, not an accuracy guarantee for every environment.

This documentation update involved static review only. The generator and `npm run verify` were not run, the data ZIP was not downloaded or extracted, and the published data was not actually checksum-verified.

The current [scripts/verify.mjs](scripts/verify.mjs) compares seven daily fields: three pillars, lunar year/month/day, and the leap-month flag. It compares all solar-term moments, fails if the maximum difference exceeds two minutes, and checks the three pillars for `1990-03-12` shown above. It does not individually validate `weekday`, `lunar_text`, or `solar_term`, and it does not automatically compare the DST table with IANA.

The [third-party notices](THIRD_PARTY_NOTICES.md) state that the DST table matches IANA `Asia/Shanghai`. The [CI configuration](.github/workflows/verify.yml) separately checks whether regeneration changes the tracked DST CSV. Distinguish release records, script coverage, and actual run results.

## Further documentation and companion library

- [Release notes](RELEASE_NOTES.md): v1.0.0 contents and recorded checks.
- [Generator](scripts/generate.mjs) / [verification script](scripts/verify.mjs): field construction, date boundaries, and comparison rules.
- [Commands and dependencies](package.json) / [dependency lockfile](package-lock.json): versions used for reproduction.
- [fateclear-solar-time](https://github.com/xiaoyu312/fateclear-solar-time): companion library for true solar time, solar terms, and DST, with an MCP server.

## License, attribution, and author

**The data is licensed under [CC BY 4.0](LICENSE).** You may copy, modify, and use it commercially under that license. When sharing it, retain attribution and applicable notices, provide a license link, and indicate modifications. Example attribution:

> Data: [拨云 FateClear](https://fateclear.com), [CC BY 4.0](https://creativecommons.org/licenses/by/4.0/).

On websites, make “拨云 FateClear” link to `https://fateclear.com`. If you modify the data, also describe the changes.

**Code in `scripts/` is licensed under [MIT](scripts/LICENSE)**, separately from the data. Retain its copyright and permission notices when distributing the code. The three generation/verification dependencies are also MIT-licensed; their sources and roles are listed in [THIRD_PARTY_NOTICES.md](THIRD_PARTY_NOTICES.md). That notice states that no third-party data files were copied into `data/` and identifies IANA time-zone data (public domain) as the DST reference.

[FateClear](https://fateclear.com) · [Online BaZi chart](https://fateclear.com/bazi) · [Project updates on X](https://x.com/liu_xiaoyu27334)
