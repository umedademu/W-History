// 全体の生成・検査用。教材画面では章専用の本文を読み込む。
import {sourceEdition} from './source-edition.js';
import {chapterEdition as edition2} from './chapter-02-edition.js';
import {chapterEdition as edition3} from './chapter-03-edition.js';
import {chapterEdition as edition4} from './chapter-04-edition.js';
import {chapterEdition as edition5} from './chapter-05-edition.js';
import {chapterEdition as edition7} from './chapter-07-edition.js';
export const allEditions={...Object.fromEntries(Object.entries(sourceEdition).filter(([,s])=>s[0].sourceText.chapter===1)),...edition2,...edition3,...edition4,...edition5,...Object.fromEntries(Object.entries(sourceEdition).filter(([,s])=>s[0].sourceText.chapter!==1)),...edition7};
