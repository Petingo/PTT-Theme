<p align="center">
    <img src="https://github.com/Petingo/ptt-theme/raw/master/main.png">
</p>

# PTT Theme
看膩黑底白字了嗎？PTT Theme 是一個 https://term.ptt.cc 的色彩編輯插件，讓你自訂 PTT 的顏色！

| <img src="https://github.com/Petingo/ptt-theme/raw/master/Solarized-Dark.png"> | <img src="https://github.com/Petingo/ptt-theme/raw/master/Solarized-Light.png"> |
| Solarized Dark | Solarized Light |
| <img src="https://github.com/Petingo/ptt-theme/raw/master/Argonaut.png"> | <img src="https://github.com/Petingo/ptt-theme/raw/master/Expresso.png"> |
| Argonaut | Expresso |

## Flow
![](https://github.com/Petingo/ptt-theme/raw/master/flow.jpg)

## Putty、PTT 色號對應表
| 顏色代碼  | 原始目標          | PTT 色彩 | PTT 色號 | term.ptt.cc | 原始色彩 | template      |
| --------- | ----------------- | -------- | -------- | ----------- | -------- | ------------- |
| Colour 0  | Foreground        | 白       | 37       | 7           | silver   | --white         |
| Colour 1  | Bold Foreground   | 亮白     | 1;37     | 15          | #FFF     | --white-light   |
| Colour 2  | Background        | 黑       | 30       | 0           | #000     | --black         |
| Colour 3  | Bold Background   | 深灰     | 1;30     | 8           | gray     | --black-light   |
| Colour 4  | Cursor Text       |          |          |             |          |               |
| Colour 5  | Cursor Colour     |          |          |             |          |               |
| Colour 6  | ANSI Black        |          |          |             |          |               |
| Colour 7  | ANSI Black Bold   |          |          |             |          |               |
| Colour 8  | ANSI Red          | 紅       | 31       | 1           | maroon   | --red           |
| Colour 9  | ANSI Red Bold     | 亮紅     | 1;31     | 9           | red      | --red-light     |
| Colour 10 | ANSI Green        | 綠       | 32       | 2           | green    | --green         |
| Colour 11 | ANSI Green Bold   | 亮綠     | 1;32     | 10          | \#0F0    | --green-light   |
| Colour 12 | ANSI Yellow       | 土棕     | 33       | 3           | olive    | --yellow        |
| Colour 13 | ANSI Yellow Bold  | 黃       | 1;33     | 11          | \#FF0    | --yellow-light  |
| Colour 14 | ANSI Blue         | 深藍     | 34       | 4           | navy     | --blue          |
| Colour 15 | ANSI Blue Bold    | 亮深藍   | 1;34     | 12          | \#00F    | --blue-light    |
| Colour 16 | ANSI Magenta      | 紫色     | 35       | 5           | purple   | --magenta       |
| Colour 17 | ANSI Magenta Bold | 亮紫色   | 1;35     | 13          | \#F0F    | --magenta-light |
| Colour 18 | ANSI Cyan         | 淺藍     | 36       | 6           | teal     | --cyan          |
| Colour 19 | ANSI Cyan Bold    | 亮淺藍   | 1;36     | 14          | \#0FF    | --cyan-light    |
| Colour 20 | ANSI White        |          |          |             |          |               |
| Colour 21 | ANSI White Bold   |          |          |             |          |               |

## TODO
目前肥肥我在在申請研究所，下個月就要進去當兵了，應該沒空繼續開發，如果你對這個專案有興趣、想一起開發的話歡迎聯絡我：）
- [ ] 白底背景優化
- [ ] 目前切換的時候 special case 會有轉不過來的問題，感覺應該是 async 沒寫好
- [ ] Theme Demo
    想做一個網頁，可以有一個主題 -> 效果的呈現，並讓大家可以上傳自己編輯的主題

## 程式結構
### chrome storage key
- --q1b2-color
- --q1b2-bg-color
- --q1b2-color-theme-def
