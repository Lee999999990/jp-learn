export interface KanaItem {
  hiragana: string;
  katakana: string;
  romaji: string;
  note: string;
}

export interface ChapterDef {
  id: string;
  sort: number;
  title: string;
  description: string;
}

export interface LessonDef {
  id: string;
  chapterId: string;
  sort: number;
  title: string;
  items: KanaItem[];
}

export const chapters: ChapterDef[] = [
  {
    id: "ch-gyouon",
    sort: 1,
    title: "五十音（清音）",
    description: "日语入门第一步：46 个清音假名，每个音有平假名、片假名两种写法。",
  },
  {
    id: "ch-dakuon",
    sort: 2,
    title: "浊音・半浊音",
    description: "在清音上加浊点（゛）或半浊点（゜）：が・ざ・だ・ば 与 ぱ 行。",
  },
  {
    id: "ch-youon",
    sort: 3,
    title: "拗音",
    description: "い段假名 + 小写 ゃ・ゅ・ょ 连读成的音，如 き＋ゃ＝きゃ。",
  },
];

export const lessons: LessonDef[] = [
  {
    id: "l-a", chapterId: "ch-gyouon", sort: 1, title: "あ行", items: [
      { hiragana: "あ", katakana: "ア", romaji: "a", note: "像「啊」，口自然张开" },
      { hiragana: "い", katakana: "イ", romaji: "i", note: "像「衣」" },
      { hiragana: "う", katakana: "ウ", romaji: "u", note: "像「乌」，嘴唇不突出" },
      { hiragana: "え", katakana: "エ", romaji: "e", note: "像「诶」" },
      { hiragana: "お", katakana: "オ", romaji: "o", note: "像「哦」" },
    ],
  },
  {
    id: "l-ka", chapterId: "ch-gyouon", sort: 2, title: "か行", items: [
      { hiragana: "か", katakana: "カ", romaji: "ka", note: "「卡」的 k + 啊" },
      { hiragana: "き", katakana: "キ", romaji: "ki", note: "像「key」" },
      { hiragana: "く", katakana: "ク", romaji: "ku", note: "「哭」的 k + 乌" },
      { hiragana: "け", katakana: "ケ", romaji: "ke", note: "「开」的 k + 诶" },
      { hiragana: "こ", katakana: "コ", romaji: "ko", note: "「抠」的 k + 哦" },
    ],
  },
  {
    id: "l-sa", chapterId: "ch-gyouon", sort: 3, title: "さ行", items: [
      { hiragana: "さ", katakana: "サ", romaji: "sa", note: "像「撒」" },
      { hiragana: "し", katakana: "シ", romaji: "shi", note: "像「西」但嘴形更平" },
      { hiragana: "す", katakana: "ス", romaji: "su", note: "像「苏」" },
      { hiragana: "せ", katakana: "セ", romaji: "se", note: "像「塞」" },
      { hiragana: "そ", katakana: "ソ", romaji: "so", note: "像「搜」" },
    ],
  },
  {
    id: "l-ta", chapterId: "ch-gyouon", sort: 4, title: "た行", items: [
      { hiragana: "た", katakana: "タ", romaji: "ta", note: "像「他」" },
      { hiragana: "ち", katakana: "チ", romaji: "chi", note: "像「七」" },
      { hiragana: "つ", katakana: "ツ", romaji: "tsu", note: "像「呲」，介于 cu/tsu" },
      { hiragana: "て", katakana: "テ", romaji: "te", note: "像「贴」" },
      { hiragana: "と", katakana: "ト", romaji: "to", note: "像「偷」" },
    ],
  },
  {
    id: "l-na", chapterId: "ch-gyouon", sort: 5, title: "な行", items: [
      { hiragana: "な", katakana: "ナ", romaji: "na", note: "像「拿」" },
      { hiragana: "に", katakana: "ニ", romaji: "ni", note: "像「你」" },
      { hiragana: "ぬ", katakana: "ヌ", romaji: "nu", note: "像「奴」" },
      { hiragana: "ね", katakana: "ネ", romaji: "ne", note: "「内」的 n" },
      { hiragana: "の", katakana: "ノ", romaji: "no", note: "「诺」的 n" },
    ],
  },
  {
    id: "l-ha", chapterId: "ch-gyouon", sort: 6, title: "は行", items: [
      { hiragana: "は", katakana: "ハ", romaji: "ha", note: "像「哈」" },
      { hiragana: "ひ", katakana: "ヒ", romaji: "hi", note: "「嘿」的 h" },
      { hiragana: "ふ", katakana: "フ", romaji: "fu", note: "像「夫」，介于 hu/fu" },
      { hiragana: "へ", katakana: "ヘ", romaji: "he", note: "「嘿」的 h + 诶" },
      { hiragana: "ほ", katakana: "ホ", romaji: "ho", note: "「猴」的 h" },
    ],
  },
  {
    id: "l-ma", chapterId: "ch-gyouon", sort: 7, title: "ま行", items: [
      { hiragana: "ま", katakana: "マ", romaji: "ma", note: "像「妈」" },
      { hiragana: "み", katakana: "ミ", romaji: "mi", note: "像「米」" },
      { hiragana: "む", katakana: "ム", romaji: "mu", note: "像「木」" },
      { hiragana: "め", katakana: "メ", romaji: "me", note: "「妹」的 m" },
      { hiragana: "も", katakana: "モ", romaji: "mo", note: "像「摸」" },
    ],
  },
  {
    id: "l-ya", chapterId: "ch-gyouon", sort: 8, title: "や行", items: [
      { hiragana: "や", katakana: "ヤ", romaji: "ya", note: "像「呀」" },
      { hiragana: "ゆ", katakana: "ユ", romaji: "yu", note: "像「优」" },
      { hiragana: "よ", katakana: "ヨ", romaji: "yo", note: "像「哟」" },
    ],
  },
  {
    id: "l-ra", chapterId: "ch-gyouon", sort: 9, title: "ら行", items: [
      { hiragana: "ら", katakana: "ラ", romaji: "ra", note: "像「拉」，舌尖轻弹" },
      { hiragana: "り", katakana: "リ", romaji: "ri", note: "像「里」" },
      { hiragana: "る", katakana: "ル", romaji: "ru", note: "像「路」" },
      { hiragana: "れ", katakana: "レ", romaji: "re", note: "「类」的 r" },
      { hiragana: "ろ", katakana: "ロ", romaji: "ro", note: "「楼」的 r" },
    ],
  },
  {
    id: "l-wa", chapterId: "ch-gyouon", sort: 10, title: "わ行・ん", items: [
      { hiragana: "わ", katakana: "ワ", romaji: "wa", note: "像「哇」" },
      { hiragana: "を", katakana: "ヲ", romaji: "wo", note: "作助词读「哦」，不单用" },
      { hiragana: "ん", katakana: "ン", romaji: "n", note: "鼻音「嗯」" },
    ],
  },
  {
    id: "l-ga", chapterId: "ch-dakuon", sort: 1, title: "が行", items: [
      { hiragana: "が", katakana: "ガ", romaji: "ga", note: "か行＋浊点゛" },
      { hiragana: "ぎ", katakana: "ギ", romaji: "gi", note: "か行＋浊点゛" },
      { hiragana: "ぐ", katakana: "グ", romaji: "gu", note: "か行＋浊点゛" },
      { hiragana: "げ", katakana: "ゲ", romaji: "ge", note: "か行＋浊点゛" },
      { hiragana: "ご", katakana: "ゴ", romaji: "go", note: "か行＋浊点゛" },
    ],
  },
  {
    id: "l-za", chapterId: "ch-dakuon", sort: 2, title: "ざ行", items: [
      { hiragana: "ざ", katakana: "ザ", romaji: "za", note: "さ行＋浊点゛" },
      { hiragana: "じ", katakana: "ジ", romaji: "ji", note: "さ行＋浊点゛" },
      { hiragana: "ず", katakana: "ズ", romaji: "zu", note: "さ行＋浊点゛" },
      { hiragana: "ぜ", katakana: "ゼ", romaji: "ze", note: "さ行＋浊点゛" },
      { hiragana: "ぞ", katakana: "ゾ", romaji: "zo", note: "さ行＋浊点゛" },
    ],
  },
  {
    id: "l-da", chapterId: "ch-dakuon", sort: 3, title: "だ行", items: [
      { hiragana: "だ", katakana: "ダ", romaji: "da", note: "た行＋浊点゛" },
      { hiragana: "ぢ", katakana: "ヂ", romaji: "ji", note: "た行＋浊点゛（与じ同音）" },
      { hiragana: "づ", katakana: "ヅ", romaji: "zu", note: "た行＋浊点゛（与ず同音）" },
      { hiragana: "で", katakana: "デ", romaji: "de", note: "た行＋浊点゛" },
      { hiragana: "ど", katakana: "ド", romaji: "do", note: "た行＋浊点゛" },
    ],
  },
  {
    id: "l-ba", chapterId: "ch-dakuon", sort: 4, title: "ば行", items: [
      { hiragana: "ば", katakana: "バ", romaji: "ba", note: "は行＋浊点゛" },
      { hiragana: "び", katakana: "ビ", romaji: "bi", note: "は行＋浊点゛" },
      { hiragana: "ぶ", katakana: "ブ", romaji: "bu", note: "は行＋浊点゛" },
      { hiragana: "べ", katakana: "ベ", romaji: "be", note: "は行＋浊点゛" },
      { hiragana: "ぼ", katakana: "ボ", romaji: "bo", note: "は行＋浊点゛" },
    ],
  },
  {
    id: "l-pa", chapterId: "ch-dakuon", sort: 5, title: "ぱ行（半浊音）", items: [
      { hiragana: "ぱ", katakana: "パ", romaji: "pa", note: "は行＋半浊点゜" },
      { hiragana: "ぴ", katakana: "ピ", romaji: "pi", note: "は行＋半浊点゜" },
      { hiragana: "ぷ", katakana: "プ", romaji: "pu", note: "は行＋半浊点゜" },
      { hiragana: "ぺ", katakana: "ペ", romaji: "pe", note: "は行＋半浊点゜" },
      { hiragana: "ぽ", katakana: "ポ", romaji: "po", note: "は行＋半浊点゜" },
    ],
  },
  {
    id: "l-y1", chapterId: "ch-youon", sort: 1, title: "拗音①（きゃ〜ちょ）", items: [
      { hiragana: "きゃ", katakana: "キャ", romaji: "kya", note: "き＋小ゃ" },
      { hiragana: "きゅ", katakana: "キュ", romaji: "kyu", note: "き＋小ゅ" },
      { hiragana: "きょ", katakana: "キョ", romaji: "kyo", note: "き＋小ょ" },
      { hiragana: "しゃ", katakana: "シャ", romaji: "sha", note: "し＋小ゃ" },
      { hiragana: "しゅ", katakana: "シュ", romaji: "shu", note: "し＋小ゅ" },
      { hiragana: "しょ", katakana: "ショ", romaji: "sho", note: "し＋小ょ" },
      { hiragana: "ちゃ", katakana: "チャ", romaji: "cha", note: "ち＋小ゃ" },
      { hiragana: "ちゅ", katakana: "チュ", romaji: "chu", note: "ち＋小ゅ" },
      { hiragana: "ちょ", katakana: "チョ", romaji: "cho", note: "ち＋小ょ" },
    ],
  },
  {
    id: "l-y2", chapterId: "ch-youon", sort: 2, title: "拗音②（にゃ〜りょ）", items: [
      { hiragana: "にゃ", katakana: "ニャ", romaji: "nya", note: "に＋小ゃ" },
      { hiragana: "にゅ", katakana: "ニュ", romaji: "nyu", note: "に＋小ゅ" },
      { hiragana: "にょ", katakana: "ニョ", romaji: "nyo", note: "に＋小ょ" },
      { hiragana: "ひゃ", katakana: "ヒャ", romaji: "hya", note: "ひ＋小ゃ" },
      { hiragana: "ひゅ", katakana: "ヒュ", romaji: "hyu", note: "ひ＋小ゅ" },
      { hiragana: "ひょ", katakana: "ヒョ", romaji: "hyo", note: "ひ＋小ょ" },
      { hiragana: "みゃ", katakana: "ミャ", romaji: "mya", note: "み＋小ゃ" },
      { hiragana: "みゅ", katakana: "ミュ", romaji: "myu", note: "み＋小ゅ" },
      { hiragana: "みょ", katakana: "ミョ", romaji: "myo", note: "み＋小ょ" },
      { hiragana: "りゃ", katakana: "リャ", romaji: "rya", note: "り＋小ゃ" },
      { hiragana: "りゅ", katakana: "リュ", romaji: "ryu", note: "り＋小ゅ" },
      { hiragana: "りょ", katakana: "リョ", romaji: "ryo", note: "り＋小ょ" },
    ],
  },
  {
    id: "l-y3", chapterId: "ch-youon", sort: 3, title: "拗音③（ぎゃ〜ぴょ）", items: [
      { hiragana: "ぎゃ", katakana: "ギャ", romaji: "gya", note: "ぎ＋小ゃ" },
      { hiragana: "ぎゅ", katakana: "ギュ", romaji: "gyu", note: "ぎ＋小ゅ" },
      { hiragana: "ぎょ", katakana: "ギョ", romaji: "gyo", note: "ぎ＋小ょ" },
      { hiragana: "じゃ", katakana: "ジャ", romaji: "ja", note: "じ＋小ゃ" },
      { hiragana: "じゅ", katakana: "ジュ", romaji: "ju", note: "じ＋小ゅ" },
      { hiragana: "じょ", katakana: "ジョ", romaji: "jo", note: "じ＋小ょ" },
      { hiragana: "びゃ", katakana: "ビャ", romaji: "bya", note: "び＋小ゃ" },
      { hiragana: "びゅ", katakana: "ビュ", romaji: "byu", note: "び＋小ゅ" },
      { hiragana: "びょ", katakana: "ビョ", romaji: "byo", note: "び＋小ょ" },
      { hiragana: "ぴゃ", katakana: "ピャ", romaji: "pya", note: "ぴ＋小ゃ" },
      { hiragana: "ぴゅ", katakana: "ピュ", romaji: "pyu", note: "ぴ＋小ゅ" },
      { hiragana: "ぴょ", katakana: "ピョ", romaji: "pyo", note: "ぴ＋小ょ" },
    ],
  },
];
