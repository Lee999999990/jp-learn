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
];
