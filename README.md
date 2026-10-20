# fateclear-calendar-data

[![Verify data](https://github.com/a18565517703-ctrl/fateclear-calendar-data/actions/workflows/verify.yml/badge.svg)](https://github.com/a18565517703-ctrl/fateclear-calendar-data/actions/workflows/verify.yml)
[![License: CC BY 4.0](https://img.shields.io/badge/License-CC%20BY%204.0-lightgrey.svg)](https://creativecommons.org/licenses/by/4.0/)

**中文** | [English](#english)

1900–2100 年的历法数据：二十四节气交节时刻、每天的干支（年柱、月柱、日柱）、农历日期，以及中国 1986–1991 年夏令时表。CSV 和 JSON 两种格式。由 [拨云 FateClear](https://fateclear.com) 整理发布。

想直接看某个生日的四柱？用 [拨云 FateClear 八字排盘](https://fateclear.com/bazi)。

## 文件

数据文件不放在仓库里，请到 [Releases](https://github.com/a18565517703-ctrl/fateclear-calendar-data/releases) 下载 `fateclear-calendar-data-v1.0.0.zip`，或运行 `npm run build` 自己生成。

| 文件 | 行数 | 内容 |
|---|---|---|
| `data/solar_terms.csv` / `.json` | 4,824 | 每年 24 个节气（从小寒到冬至）的交节时刻 |
| `data/days.csv` / `.json` | 73,414 | 1900-01-01 到 2100-12-31 每一天 |
| `data/china_dst_1986_1991.csv` / `.json` | 6 | 中国夏令时起止 |

### solar_terms 字段

| 字段 | 说明 |
|---|---|
| `year` | 公历年 |
| `index` | 0–23，0 = 小寒，2 = 立春，23 = 冬至 |
| `name_zh` / `name_zh_hant` / `name_en` | 简体 / 繁体 / 英文名 |
| `solar_longitude` | 太阳视黄经（度） |
| `utc` | 交节时刻，UTC，ISO 8601，精确到秒 |
| `beijing_time` | 交节时刻，北京时间（UTC+8，不含夏令时） |

### days 字段

| 字段 | 说明 |
|---|---|
| `date` | 公历日期 |
| `weekday` | 0 = 星期日 … 6 = 星期六 |
| `year_pillar` | 年柱，以立春为界 |
| `month_pillar` | 月柱，以“节”（小寒、立春、惊蛰……大雪）为界 |
| `day_pillar` | 日柱，按公历日期，从 00:00 起算 |
| `lunar_year` / `lunar_month` / `lunar_day` | 农历年、月、日 |
| `lunar_leap_month` | 1 = 闰月 |
| `lunar_text` | 如 `庚午年二月十六` |
| `solar_term` | 当天交的节气，没有则为空 |

**注意：** 年柱和月柱按“交节那天的北京时间日期”整天切换。交节当天在交节时刻之前出生的，要用 `solar_terms` 里的精确时刻自己判断。日柱按 00:00 换日；子时（23:00 后）算不算第二天，各家做法不同，本数据不做处理。

## 怎么生成、怎么复现

```bash
npm ci
npm run build    # 运行 scripts/generate.mjs，重写 data/
npm run verify   # 运行 scripts/verify.mjs，和 lunar-javascript、tyme4ts 交叉核对
sha256sum -c ../release/SHA256SUMS.txt  # 在 data/ 里运行，和 Release 逐字节相同
```

- 节气：用 astronomy-engine 求太阳视黄经到达 15° 整数倍的时刻。
- 干支：年柱、月柱由上面的节气时刻推出；日柱和农历用 tyme4ts。
- 核对：全部 73,414 天与 lunar-javascript 逐日比对，0 处不一致；节气时刻和 tyme4ts 最大差 1.03 分钟。
- 夏令时：与 IANA 时区库 Asia/Shanghai 一致。

## 引用和协议

数据采用 [CC BY 4.0](LICENSE)：可以自由使用、修改、商用，**但必须注明出处**：

> 数据来源：拨云 FateClear（https://fateclear.com）

网页上请让“拨云 FateClear”可以点击到 https://fateclear.com 。`scripts/` 下的代码按 MIT 协议（见 scripts/LICENSE）。依赖见 [THIRD_PARTY_NOTICES.md](THIRD_PARTY_NOTICES.md)。

配套代码库：[fateclear-solar-time](https://github.com/a18565517703-ctrl/fateclear-solar-time)（真太阳时、节气、夏令时，带 MCP 服务）。

---

<a id="english"></a>
## English

Chinese calendar data for **1900–2100**: exact moments of the 24 solar terms, the daily sexagenary pillars (year, month, day), the Chinese lunar date, and China's 1986–1991 DST table. CSV and JSON. Published by [拨云 FateClear](https://fateclear.com). For a full BaZi chart of any birth time, try the [FateClear BaZi chart](https://fateclear.com/bazi).

Data files are not stored in git: download the zip from [Releases](https://github.com/a18565517703-ctrl/fateclear-calendar-data/releases) or run `npm run build`.

| File | Rows | Contents |
|---|---|---|
| `data/solar_terms.*` | 4,824 | 24 solar terms per year, UTC and Beijing time, to the second |
| `data/days.*` | 73,414 | one row per day: pillars, lunar date, solar term of the day |
| `data/china_dst_1986_1991.*` | 6 | DST start/end |

Year pillars switch at 立春 (Start of Spring) and month pillars at each 节, by Beijing calendar date; for births on a term day before the exact moment, use `solar_terms`. Day pillars change at 00:00.

**Reproduce:** `npm ci && npm run build && npm run verify`. Output is byte-identical for the pinned dependency versions. All 73,414 days match lunar-javascript; solar terms are within 1.03 min of tyme4ts.

**License & attribution:** [CC BY 4.0](LICENSE). Credit **"拨云 FateClear"** with a link to **https://fateclear.com**, e.g. *Data: 拨云 FateClear (https://fateclear.com), CC BY 4.0.* Scripts in `scripts/` are MIT (see scripts/LICENSE).
