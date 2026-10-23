[简体中文](README.md) · [English](README.en.md) · [日本語](README.ja.md)

# fateclear-calendar-data

**1900–2100 年の二十四節気、干支、旧暦日付を、CSV と JSON でカレンダーツールに組み込む。**

カレンダーアプリ、暦の表示、データ分析に取り組む開発者向けのデータセットです。ファイルをダウンロードすれば、グレゴリオ暦の日付から年柱・月柱・日柱と中国暦の旧暦日付を参照したり、年ごとの二十四節気の時刻を取得したりできます。中国で 1986–1991 年に実施された夏時間の表も付属しています。公開データを使うだけなら、生成スクリプトを実行する必要はありません。

[拨云 FateClear](https://fateclear.com) が整理・公開しています。生年月日時から直接四柱を確認したい方は、別の Web サービスである [FateClear 八字命式](https://fateclear.com/bazi) をご利用ください。作者の更新情報は [X](https://x.com/liu_xiaoyu27334) で公開しています。

[![Verify data](https://github.com/xiaoyu312/fateclear-calendar-data/actions/workflows/verify.yml/badge.svg)](https://github.com/xiaoyu312/fateclear-calendar-data/actions/workflows/verify.yml)
[![Data: CC BY 4.0](https://img.shields.io/badge/Data-CC%20BY%204.0-lightgrey.svg)](LICENSE)

## 公開済みの例を見る

[v1.0.0 のリリースノート](RELEASE_NOTES.md) には、次の日付の照合例が記録されています。

| グレゴリオ暦の日付 | 年柱 | 月柱 | 日柱 | 中国暦の旧暦日付 |
| --- | --- | --- | --- | --- |
| `1990-03-12` | 庚午 | 己卯 | 丙子 | 二月十六日（二月十六） |

日付単位の暦データであり、時柱は含みません。節入り当日の年柱・月柱と日付の切り替え規則については、後述の「対象範囲と制限」を参照してください。

## ダウンロードして使う

[v1.0.0 Release](https://github.com/xiaoyu312/fateclear-calendar-data/releases/tag/v1.0.0) から次のファイルをダウンロードします。

- [fateclear-calendar-data-v1.0.0.zip](https://github.com/xiaoyu312/fateclear-calendar-data/releases/download/v1.0.0/fateclear-calendar-data-v1.0.0.zip)：3 種類のデータを CSV と JSON で収録した、合計 6 ファイル。
- [SHA256SUMS.txt](https://github.com/xiaoyu312/fateclear-calendar-data/releases/download/v1.0.0/SHA256SUMS.txt)：6 個のデータファイルそれぞれの SHA-256 チェックサム。

展開後、CSV を表計算ソフトで開くか、JSON をプログラムで読み込んでください。大きな `days` と `solar_terms` のファイルは Git リポジトリには含まれていません。6 行の夏時間表は、リポジトリ内にも [CSV](data/china_dst_1986_1991.csv) と [JSON](data/china_dst_1986_1991.json) として収録されています。

## データとフィールド

以下はローカル生成時のパスです。リリースの圧縮ファイルには、同名の CSV と JSON が収録されています。

| ファイル | 行数 | 内容 |
| --- | --- | --- |
| `data/solar_terms.csv` / `data/solar_terms.json` | 4,824 | 1900–2100 年の各年について、小寒から冬至までの 24 節気 |
| `data/days.csv` / `data/days.json` | 73,414 | 1900-01-01 から 2100-12-31 まで、両端を含む各日付 |
| `data/china_dst_1986_1991.csv` / `data/china_dst_1986_1991.json` | 6 | 中国の 1986–1991 年の夏時間開始・終了時刻と UTC オフセット |

### `solar_terms`

| フィールド | 意味 |
| --- | --- |
| `year` | グレゴリオ暦の年 |
| `index` | 0–23。0 = 小寒、2 = 立春、23 = 冬至 |
| `name_zh` / `name_zh_hant` / `name_en` | 簡体字中国語、繁体字中国語、英語の名称 |
| `solar_longitude` | 太陽の視黄経。単位は度 |
| `utc` | 節気の時刻。UTC の ISO 8601 形式で、最も近い秒に丸める |
| `beijing_time` | 同じ時刻を固定 UTC+8 で表記。夏時間は適用しない |

### `days`

| フィールド | 意味 |
| --- | --- |
| `date` | グレゴリオ暦の日付。`YYYY-MM-DD` 形式 |
| `weekday` | 0 = 日曜日、…、6 = 土曜日 |
| `year_pillar` | 年柱。立春の北京日付で切り替わる |
| `month_pillar` | 月柱。各「節」（小寒、立春、惊蛰……大雪）の北京日付で切り替わる |
| `day_pillar` | 日柱。グレゴリオ暦の日付の 00:00 で切り替わる |
| `lunar_year` | 中国暦の旧暦年 |
| `lunar_month` | 旧暦の月を表す正の整数。閏月かどうかは `lunar_leap_month` で示す |
| `lunar_leap_month` | 1 = 閏月、0 = 通常の月 |
| `lunar_day` | 旧暦の日 |
| `lunar_text` | 中国語の旧暦日付文字列。例：`庚午年二月十六` |
| `solar_term` | 固定 UTC+8 の当日に該当する節気の簡体字中国語名。該当しない場合は空文字列 |

### `china_dst_1986_1991`

| フィールド | 意味 |
| --- | --- |
| `year` | グレゴリオ暦の年。1986–1991 |
| `start_local` | 夏時間の開始時刻を、切り替え前の標準時（UTC+8）で表記 |
| `end_local` | 夏時間の終了時刻を、切り替え前の夏時間（UTC+9）で表記 |
| `start_utc` | 夏時間開始の UTC 時刻。ISO 8601 形式 |
| `end_utc` | 夏時間終了の UTC 時刻。ISO 8601 形式 |
| `offset_standard` | 標準時のオフセット。`+08:00` |
| `offset_dst` | 夏時間のオフセット。`+09:00` |

## 生成と照合

### ソースから生成する

Git、Node.js、npm が必要です。リポジトリの CI は Node.js 22 を使用しているため、再現には同じ環境を利用できます。他のバージョンとの互換性範囲は宣言されていません。ターミナルで次を実行します。

```sh
git clone https://github.com/xiaoyu312/fateclear-calendar-data.git
cd fateclear-calendar-data
npm ci
npm run build
npm run verify
```

すでにリポジトリがある場合は、そのルートで 3 つの npm コマンドを実行してください。`npm ci` はロックファイルの依存関係をインストールします。`npm run build` は [scripts/generate.mjs](scripts/generate.mjs) を実行し、`data/` 内の 6 個の CSV/JSON ファイルを生成または上書きします。生成スクリプトの想定出力は次のとおりです。

```text
solar_terms: 4824 rows, days: 73414 rows, dst: 6 rows
```

生成方法と固定された依存バージョンは以下のとおりです。出典は [第三者に関する表示](THIRD_PARTY_NOTICES.md) を参照してください。

- `astronomy-engine 2.1.19`：太陽の視黄経が 15° の整数倍に達する時刻を計算します。
- 年柱と月柱は、その節気時刻に対応する北京日付から求めます。
- `tyme4ts 1.5.3`：日柱と旧暦日付を生成し、節気時刻の比較先としても使用します。
- `lunar-javascript 1.7.7`：日付ごとの照合に使用します。

### Release のチェックサムと照合する

同じ v1.0.0 Release から取得した `SHA256SUMS.txt` を、展開した 6 個のデータファイルと同じディレクトリに置きます。チェックサムにはディレクトリを含まないファイル名が記載されているため、そのディレクトリで次のコマンドを実行してください。

Linux：

```sh
sha256sum -c SHA256SUMS.txt
```

macOS：

```sh
shasum -a 256 -c SHA256SUMS.txt
```

自分で生成したデータを照合する場合は、チェックサムファイルをリポジトリの `data/` に置き、`cd data` の後に対応するコマンドを実行します。6 ファイルすべてに `OK` と表示された場合に、公開チェックサムとの一致を確認できます。対象は個々のデータファイルであり、ZIP 自体ではありません。依存バージョンの固定は再現のための条件ですが、Release とバイト単位で一致するかは実際の照合結果で判断してください。

## 対象範囲と制限

- `days` の年柱は立春のみ、月柱は十二の「節」のみで、それぞれの北京日付全体に切り替えを適用します。該当する切替日の節入り時刻より前なら、影響を受ける年柱または月柱をその日付の行からそのまま採用せず、`solar_terms` の時刻で判断してください。
- 日柱は 00:00 に切り替わります。「23:00 の子初から翌日とする」という別の慣例は適用しません。時柱は含まれず、完全な四柱の命式作成や解釈を提供するデータではありません。
- `beijing_time` は常に固定 UTC+8 で、過去の現地時刻への変換ではありません。1986–1991 年の夏時間は別表で提供し、節気時刻には自動適用しません。
- 時刻は秒単位に丸めて出力します。これは出力の粒度であり、天文学的な誤差が 1 秒以内と検証されたことを意味しません。ライブラリ間の比較は、独立した天文観測による検証の代わりにはなりません。
- 暦と節気の対象は 1900–2100 年です。夏時間表は記載された 6 年のみで、世界全体や中国の全時代を網羅するタイムゾーンデータベースではありません。

## 記録された結果と検証範囲

[v1.0.0 のリリースノート](RELEASE_NOTES.md) には、73,414 日分の干支・旧暦日付を `lunar-javascript` と比較して不一致が 0 件、節気時刻を `tyme4ts` と比較した最大差が 1.03 分と記録されています。これは当該リリースの比較結果であり、あらゆる環境での精度を保証するものではありません。

今回の文書更新では静的な確認のみを行いました。生成スクリプトと `npm run verify` は実行しておらず、データ ZIP のダウンロード・展開や、公開データのチェックサム照合も行っていません。

現在の [scripts/verify.mjs](scripts/verify.mjs) は、三柱、旧暦の年・月・日、閏月フラグの計 7 フィールドを照合します。すべての節気時刻も比較し、最大差が 2 分を超えると失敗します。上記の `1990-03-12` の三柱も確認します。`weekday`、`lunar_text`、`solar_term` を個別に検証する処理や、夏時間表を IANA と自動比較する処理は含まれていません。

[第三者に関する表示](THIRD_PARTY_NOTICES.md) には、夏時間表が IANA の `Asia/Shanghai` と一致すると記載されています。[CI 設定](.github/workflows/verify.yml) では別途、再生成によってリポジトリ内の夏時間 CSV が変化しないかを確認します。リリース時の記録、スクリプトの検証範囲、実際の実行結果は区別してください。

## 詳細資料と関連ライブラリ

- [リリースノート](RELEASE_NOTES.md)：v1.0.0 の内容と記録された照合結果。
- [生成スクリプト](scripts/generate.mjs) / [検証スクリプト](scripts/verify.mjs)：フィールドの構成、日付境界、比較規則。
- [コマンドと依存関係](package.json) / [依存関係のロックファイル](package-lock.json)：再現に使用するバージョン。
- [fateclear-solar-time](https://github.com/xiaoyu312/fateclear-solar-time)：真太陽時、節気、夏時間を扱う関連ライブラリ。MCP サーバーも含みます。

## ライセンス、帰属表示、作者

**データのライセンスは [CC BY 4.0](LICENSE) です。** ライセンスに従って複製、変更、商用利用ができます。共有時には帰属表示と関連する告知を保持し、ライセンスへのリンクを付け、変更があれば明示してください。帰属表示の例：

> データ提供：[拨云 FateClear](https://fateclear.com)、[CC BY 4.0](https://creativecommons.org/licenses/by/4.0/)。

Web ページでは「拨云 FateClear」から `https://fateclear.com` にリンクしてください。データを変更した場合は、その内容も明記してください。

**`scripts/` のコードは [MIT](scripts/LICENSE) ライセンス**であり、データとは異なります。コードの配布時には著作権表示と許諾文を保持してください。生成・照合に使う 3 つの依存パッケージも MIT です。出典と用途は [THIRD_PARTY_NOTICES.md](THIRD_PARTY_NOTICES.md) に記載されています。同文書では、第三者のデータファイルを `data/` にコピーしていないこと、および夏時間表の参照元が IANA のタイムゾーンデータ（パブリックドメイン）であることを示しています。

[FateClear](https://fateclear.com) · [オンライン八字命式](https://fateclear.com/bazi) · [X のプロジェクト更新](https://x.com/liu_xiaoyu27334)
