[简体中文](README.md) · [English](README.en.md) · [日本語](README.ja.md)

# fateclear-calendar-data

**用 CSV 和 JSON，把 1900–2100 年的节气、干支与农历日期接入你的日历工具。**

面向日历应用、历法展示与数据分析的开发者。下载数据后，按公历日期查询年柱、月柱、日柱和农历日期，或按年份读取二十四节气交节时刻；另附中国 1986–1991 年夏令时表。无需运行生成器即可使用发布的数据文件。

由 [拨云 FateClear](https://fateclear.com) 整理发布。想直接查看生日的四柱，可使用独立的网站产品 [FateClear 八字排盘](https://fateclear.com/bazi)；作者更新见 [X](https://x.com/liu_xiaoyu27334)。

[![Verify data](https://github.com/xiaoyu312/fateclear-calendar-data/actions/workflows/verify.yml/badge.svg)](https://github.com/xiaoyu312/fateclear-calendar-data/actions/workflows/verify.yml)
[![Data: CC BY 4.0](https://img.shields.io/badge/Data-CC%20BY%204.0-lightgrey.svg)](LICENSE)

## 先看一个已发布的例子

[v1.0.0 发布说明](RELEASE_NOTES.md) 记录了以下日期校验示例：

| 公历日期 | 年柱 | 月柱 | 日柱 | 农历 |
| --- | --- | --- | --- | --- |
| `1990-03-12` | 庚午 | 己卯 | 丙子 | 二月十六 |

这是日期级的历法数据，不含时柱。交节当天的年柱、月柱及日界规则，见下文“范围与限制”。

## 下载后即可读取

从 [v1.0.0 Release](https://github.com/xiaoyu312/fateclear-calendar-data/releases/tag/v1.0.0) 下载：

- [fateclear-calendar-data-v1.0.0.zip](https://github.com/xiaoyu312/fateclear-calendar-data/releases/download/v1.0.0/fateclear-calendar-data-v1.0.0.zip)：三组数据的 CSV 和 JSON，共六个文件。
- [SHA256SUMS.txt](https://github.com/xiaoyu312/fateclear-calendar-data/releases/download/v1.0.0/SHA256SUMS.txt)：六个数据文件各自的 SHA-256 校验值。

解压后，用表格软件读取 CSV，或在自己的程序中读取 JSON。大型 `days`、`solar_terms` 文件不随 Git 仓库提供；六行夏令时表已包含在仓库的 [CSV](data/china_dst_1986_1991.csv) 和 [JSON](data/china_dst_1986_1991.json) 中。

## 数据与字段

下表列出本地生成路径；发布压缩包提供同名 CSV 和 JSON 文件。

| 文件 | 行数 | 内容 |
| --- | --- | --- |
| `data/solar_terms.csv` / `data/solar_terms.json` | 4,824 | 1900–2100 年，每年从小寒到冬至的 24 个节气 |
| `data/days.csv` / `data/days.json` | 73,414 | 1900-01-01 至 2100-12-31，含首尾日期 |
| `data/china_dst_1986_1991.csv` / `data/china_dst_1986_1991.json` | 6 | 1986–1991 年中国夏令时起止及 UTC 偏移 |

### `solar_terms`

| 字段 | 说明 |
| --- | --- |
| `year` | 公历年 |
| `index` | 0–23；0 = 小寒，2 = 立春，23 = 冬至 |
| `name_zh` / `name_zh_hant` / `name_en` | 简体中文、繁体中文、英文名称 |
| `solar_longitude` | 太阳视黄经，单位为度 |
| `utc` | 交节时刻，UTC、ISO 8601 格式，四舍五入至秒 |
| `beijing_time` | 同一时刻的固定 UTC+8 表示；不应用夏令时 |

### `days`

| 字段 | 说明 |
| --- | --- |
| `date` | 公历日期，`YYYY-MM-DD` |
| `weekday` | 0 = 星期日，…，6 = 星期六 |
| `year_pillar` | 年柱，按立春的北京时间日期切换 |
| `month_pillar` | 月柱，按“节”（小寒、立春、惊蛰……大雪）的北京时间日期切换 |
| `day_pillar` | 日柱，按公历日期于 00:00 换日 |
| `lunar_year` | 农历年 |
| `lunar_month` | 农历月份，正整数；是否闰月另见 `lunar_leap_month` |
| `lunar_leap_month` | 1 = 闰月，0 = 非闰月 |
| `lunar_day` | 农历日 |
| `lunar_text` | 农历日期文字，如 `庚午年二月十六` |
| `solar_term` | 按固定 UTC+8 日期落在当天的节气简体中文名；没有则为空字符串 |

### `china_dst_1986_1991`

| 字段 | 说明 |
| --- | --- |
| `year` | 公历年，1986–1991 |
| `start_local` | 夏令时开始时刻，按切换前的标准时（UTC+8）表示 |
| `end_local` | 夏令时结束时刻，按切换前的夏令时（UTC+9）表示 |
| `start_utc` | 夏令时开始的 UTC 时刻，ISO 8601 格式 |
| `end_utc` | 夏令时结束的 UTC 时刻，ISO 8601 格式 |
| `offset_standard` | 标准时偏移，`+08:00` |
| `offset_dst` | 夏令时偏移，`+09:00` |

## 自行生成与校验

### 从源码生成

需要 Git、Node.js 和 npm。仓库 CI 使用 Node.js 22；复现时可采用这一环境，仓库未声明其他版本的兼容范围。在终端运行：

```sh
git clone https://github.com/xiaoyu312/fateclear-calendar-data.git
cd fateclear-calendar-data
npm ci
npm run build
npm run verify
```

已有仓库副本时，从仓库根目录执行三个 npm 命令即可。`npm ci` 安装锁定的依赖；`npm run build` 执行 [scripts/generate.mjs](scripts/generate.mjs)，生成或覆盖 `data/` 中的六个 CSV/JSON 文件。生成器预期输出：

```text
solar_terms: 4824 rows, days: 73414 rows, dst: 6 rows
```

生成逻辑和固定依赖版本如下，完整来源见 [第三方声明](THIRD_PARTY_NOTICES.md)：

- `astronomy-engine 2.1.19`：计算太阳视黄经达到 15° 整数倍的交节时刻。
- 年柱、月柱由上述交节时刻对应的北京时间日期推出。
- `tyme4ts 1.5.3`：生成日柱和农历日期，并作为节气时刻的比较来源。
- `lunar-javascript 1.7.7`：用于逐日交叉核对。

### 与 Release 数据文件比对

把从同一 v1.0.0 Release 下载的 `SHA256SUMS.txt` 放到解压后六个数据文件所在的目录。校验文件列出的是裸文件名，因此必须在该目录内运行以下命令。

Linux：

```sh
sha256sum -c SHA256SUMS.txt
```

macOS：

```sh
shasum -a 256 -c SHA256SUMS.txt
```

若校验自己生成的数据，则把该校验文件放入仓库的 `data/`，先执行 `cd data`，再运行对应命令。六个文件均显示 `OK` 才说明它们与发布的校验值一致；这里校验的是数据文件，不是 ZIP 本身。固定依赖版本用于支持复现，是否与 Release 逐字节一致仍以实际校验结果为准。

## 范围与限制

- `days` 的年柱仅在立春、月柱仅在十二个“节”的北京时间日期整天切换。在相应切换日的交节时刻之前，应结合 `solar_terms` 另行判断对应年柱或月柱，不能直接按整日行取值。
- 日柱在 00:00 换日，不处理“23:00 子初换日”的不同约定。本数据不含时柱，也不构成完整的四柱排盘或解读服务。
- `beijing_time` 始终为固定 UTC+8，不是历史民用时间转换。1986–1991 年夏令时另表提供，不会自动应用到节气表。
- 时间输出四舍五入至秒，表示格式粒度，不代表已验证到一秒的天文精度。不同库的比较结果不能替代独立天文观测验证。
- 日历与节气数据限定在 1900–2100 年；夏令时表只覆盖所列六年，不是完整的全球或中国历史时区数据库。

## 已记录的验证与脚本覆盖

[v1.0.0 发布说明](RELEASE_NOTES.md) 报告：73,414 天的干支及农历与 `lunar-javascript` 比较，零处不一致；节气时刻与 `tyme4ts` 的最大差为 1.03 分钟。这些是该版本记录的比较结果，不是任意环境下的精度保证。

本次文档整理仅做静态核对，未运行生成器或 `npm run verify`，未下载或解压数据 ZIP，也未实际执行发布数据的校验。

当前 [scripts/verify.mjs](scripts/verify.mjs) 会比较三柱、农历年/月/日和闰月标记这七个日期字段；比较全部节气时刻，并在最大差超过两分钟时失败；同时检查上面的 `1990-03-12` 三柱示例。它不会逐项校验 `weekday`、`lunar_text`、`solar_term`，也不会自动与 IANA 比对夏令时表。

[第三方声明](THIRD_PARTY_NOTICES.md) 记录夏令时表与 IANA `Asia/Shanghai` 一致。[CI 配置](.github/workflows/verify.yml) 另检查重新生成后夏令时 CSV 是否改变。发布记录、脚本检查范围和实际运行结果应分别判断。

## 详细文档与配套工具

- [发布说明](RELEASE_NOTES.md)：v1.0.0 内容与已记录的校验结果。
- [生成器](scripts/generate.mjs) / [校验脚本](scripts/verify.mjs)：字段构造、日期边界与比较规则。
- [命令与依赖](package.json) / [依赖锁文件](package-lock.json)：复现所用版本。
- [fateclear-solar-time](https://github.com/xiaoyu312/fateclear-solar-time)：配套的真太阳时、节气、夏令时代码库，带 MCP 服务。

## 许可、署名与作者

**数据采用 [CC BY 4.0](LICENSE)。** 可以复制、修改和商业使用；共享时需遵守该许可，保留署名和相关声明、附许可链接，并说明是否作过修改。署名示例：

> 数据来源：[拨云 FateClear](https://fateclear.com)，[CC BY 4.0](https://creativecommons.org/licenses/by/4.0/)。

网页上请让“拨云 FateClear”链接到 `https://fateclear.com`；若修改数据，另注明修改情况。

**`scripts/` 中的代码采用 [MIT](scripts/LICENSE)**，与数据许可不同；分发代码时保留其版权和许可声明。三个生成/校验依赖也采用 MIT，来源与用途见 [THIRD_PARTY_NOTICES.md](THIRD_PARTY_NOTICES.md)。该声明注明没有把第三方数据文件复制到 `data/`，并列出 IANA 时区数据（公有领域）的来源。

[FateClear](https://fateclear.com) · [在线八字排盘](https://fateclear.com/bazi) · [X 项目更新](https://x.com/liu_xiaoyu27334)
