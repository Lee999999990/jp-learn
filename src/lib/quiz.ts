import { lessons } from "../data/kana";
import { vocab } from "../data/vocab";

export type QuestionType = "choice" | "jp2zh" | "listen";
export type QuizScope = "all" | "mistakes";

export interface QuizQuestion {
  id: string;
  type: QuestionType;
  prompt: string;
  audioText?: string;
  options: string[];
  answer: string;
  explanation: string;
}

function shuffle<T>(arr: T[]): T[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

function pickDistractors<T>(pool: T[], correct: T, n: number): T[] {
  const unique = shuffle([...new Set(pool)].filter((x) => x !== correct));
  return unique.slice(0, n);
}

export function buildQuestionPool(): QuizQuestion[] {
  const kana = lessons.flatMap((l) => l.items);
  const romajiCount = new Map<string, number>();
  for (const k of kana) {
    romajiCount.set(k.romaji, (romajiCount.get(k.romaji) ?? 0) + 1);
  }
  const q: QuizQuestion[] = [];

  for (const k of kana) {
    const wrongRomaji = pickDistractors(
      kana.map((x) => x.romaji),
      k.romaji,
      3
    );
    q.push({
      id: `kana-${k.hiragana}-to-romaji`,
      type: "choice",
      prompt: `「${k.hiragana}」的罗马音是？`,
      options: shuffle([k.romaji, ...wrongRomaji]),
      answer: k.romaji,
      explanation: `${k.hiragana}（${k.katakana}）= ${k.romaji}`,
    });

    if ((romajiCount.get(k.romaji) ?? 1) === 1) {
      const wrongHira = pickDistractors(
        kana.map((x) => x.hiragana),
        k.hiragana,
        3
      );
      q.push({
        id: `kana-${k.hiragana}-from-romaji`,
        type: "choice",
        prompt: `罗马音「${k.romaji}」对应的平假名是？`,
        options: shuffle([k.hiragana, ...wrongHira]),
        answer: k.hiragana,
        explanation: `${k.romaji} = ${k.hiragana}（${k.katakana}）`,
      });
    }

    if ((romajiCount.get(k.romaji) ?? 1) === 1) {
      q.push({
        id: `kana-${k.hiragana}-listen`,
        type: "listen",
        prompt: "听发音，选出你听到的假名",
        audioText: k.hiragana,
        options: shuffle([
          k.hiragana,
          ...pickDistractors(
            kana.map((x) => x.hiragana),
            k.hiragana,
            3
          ),
        ]),
        answer: k.hiragana,
        explanation: `你听到的是「${k.hiragana}」= ${k.romaji}`,
      });
    }
  }

  for (const v of vocab) {
    const wrongMean = pickDistractors(
      vocab.map((x) => x.meaning),
      v.meaning,
      3
    );
    q.push({
      id: `vocab-${v.word}-jp2zh`,
      type: "jp2zh",
      prompt: `「${v.word}」的中文意思是？`,
      options: shuffle([v.meaning, ...wrongMean]),
      answer: v.meaning,
      explanation: `${v.word}（${v.reading}）= ${v.meaning}`,
    });
  }

  return q;
}

export function sampleQuestions(count: number): QuizQuestion[] {
  return shuffle(buildQuestionPool()).slice(0, count);
}
