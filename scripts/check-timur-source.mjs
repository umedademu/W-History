import fs from "node:fs/promises";
import { createHash } from "node:crypto";
import path from "node:path";
import { fileURLToPath } from "node:url";

const scriptDirectory = path.dirname(fileURLToPath(import.meta.url));
const repository = path.resolve(scriptDirectory, "..");
const manifest = JSON.parse(await fs.readFile(path.join(scriptDirectory, "timur-source-names.json"), "utf8"));
const published = process.argv.includes("--published");
const sourceArgument = process.argv.slice(2).find(argument => !argument.startsWith("--"));
const sourcePath = sourceArgument ? path.resolve(sourceArgument) : path.join(repository, manifest.source);
const [source, story, characters] = await Promise.all([
  published ? null : fs.readFile(sourcePath, "utf8"),
  fs.readFile(path.join(repository, "public", "timur-story.js"), "utf8"),
  fs.readFile(path.join(repository, "public", "timur-characters.js"), "utf8"),
]);

let sourceSection = null;
if (!published) {
const hash = createHash("sha256").update(source).digest("hex").toUpperCase();
if (hash !== manifest.sourceSha256) throw new Error(`04章の原資料のハッシュ値が記録と異なります: ${hash}`);
sourceSection = source.match(/### p\.334（[\s\S]*?(?=### p\.335)/)?.[0];
if (!sourceSection) throw new Error("04章が参照するp.334の範囲を原資料から取り出せませんでした。");
} else {
  console.log("公開用検査：原文ファイル自体の照合は手元の npm run check で行います。");
}

const plain = value => String(value ?? "").replace(/<[^>]*>/g, "");
const escape = value => value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
const sceneMatches = [...story.matchAll(/^\s{2}\{\r?\n\s{4}id: "([^"]+)",/gm)];
const storyEnd = story.indexOf("\n];", sceneMatches.at(-1)?.index ?? 0);
const sceneBlocks = new Map(sceneMatches.map((match, index) => [
  match[1],
  story.slice(match.index, sceneMatches[index + 1]?.index ?? storyEnd),
]));

function characterBlock(key) {
  const startPattern = new RegExp(`^  ${escape(key)}:`, "m");
  const start = characters.search(startPattern);
  if (start < 0) return "";
  const remainder = characters.slice(start + 1);
  const next = remainder.search(/^  [a-z][A-Za-z]+:/m);
  const end = next < 0 ? characters.indexOf("\n};", start) : start + 1 + next;
  return characters.slice(start, end);
}

function keys(block, property) {
  const match = block.match(new RegExp(`${property}: \\[([^\\]]*)\\]`));
  return match ? [...match[1].matchAll(/"([^"]+)"/g)].map(item => item[1]) : [];
}

function definition(key) {
  const match = story.match(new RegExp(`^  ${escape(key)}: \\{[^\\n]+`, "m"));
  return match?.[0] ?? "";
}

for (const group of manifest.scenes) {
  const block = sceneBlocks.get(group.scene);
  if (!block) throw new Error(`04章の照合先がありません: ${group.scene}`);
  const [narrativePart, mapPart = ""] = block.split(/\n\s*mapHeading:/);
  const narrative = plain(narrativePart);
  const characterKey = block.match(/characters: "([^"]+)"/)?.[1];
  const referencedDefinitions = ["places", "labels", "seas", "regions", "routes"]
    .flatMap(property => keys(block, property))
    .map(definition)
    .join("\n");
  const map = plain([mapPart, characterBlock(characterKey), referencedDefinitions].join("\n"));

  for (const term of group.sourceTerms) {
    if (!published && !sourceSection.includes(term)) throw new Error(`04章の原資料範囲に「${term}」がありません。`);
  }
  for (const term of group.terms) {
    if (!narrative.includes(term)) throw new Error(`04章 ${group.scene}: 本文に「${term}」がありません。`);
    if (!map.includes(term)) throw new Error(`04章 ${group.scene}: 地図表現に「${term}」がありません。`);
  }
}

const sourceOrder = manifest.scenes.map(group => group.scene);
const actualOrder = sceneMatches.map(match => match[1]);
if (JSON.stringify(sourceOrder) !== JSON.stringify(actualOrder)) throw new Error("04章の場面順が原資料との対応表に一致しません。");

const excluded = ["トクタミシュ", "サライ付近", "イスファハーン", "インドの戦象"];
const application = `${story}\n${characters}`;
for (const term of excluded) if (application.includes(term)) throw new Error(`04章に原資料の本筋から外した「${term}」が残っています。`);

const count = manifest.scenes.reduce((sum, group) => sum + group.terms.length, 0);
console.log(`04章の${manifest.scenes.length}場面・原資料由来${count}項目について、本文と地図表現の掲載順を確認しました。`);
