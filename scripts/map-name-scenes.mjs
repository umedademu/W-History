import { entityNameForNarrative } from "../public/map-name-coverage.js";
import fs from "node:fs/promises";
import { runInNewContext } from "node:vm";
import { characterScenes } from "../public/timur-characters.js";
import { pages } from "../public/ottoman-pages.js";
import { entities, positionFor } from "../public/ottoman-storyboard.js";
export async function loadMapNameScenes() {
  const chapters = [];
  for (const name of ["islam-origin", "umayyad-abbasid", "regional-dynasties", "timur-after", "safavid", "mughal", "islamic-culture"]) {
    const m = await import(`../public/${name}-scenes.js`);
    const places = m.places ?? m.locations;
    chapters.push({name, scenes: m.scenes.map(scene => ({...scene,
      mapItems: [...(scene.pins ?? []).map(key => ({text:places[key].name, at:places[key].point,kind:"place"})), ...(scene.tags ?? []).map(tag=>({...tag,kind:"label"})), ...[...(scene.actors ?? []), ...(scene.props ?? [])].map(item=>({text:item.name, at:typeof item.at === "string" ? places[item.at].point : item.at,kind:"figure"}))]
    }))});
  }
  const text = await fs.readFile(new URL("../public/timur-story.js", import.meta.url), "utf8");
  const data = runInNewContext(text.slice(text.indexOf("const scenes ="), text.indexOf("const elements =")) + ";({ scenes, places, labels, seaLabels });");
  chapters.push({name:"timur", scenes: data.scenes.map(scene => ({...scene,mapItems:[
    ...[...(scene.showCapital === false ? [] : ["samarkand"]), ...scene.places].map(k=>({text:data.places[k].label,at:data.places[k].point,kind:"place"})),
    ...scene.labels.map(k=>({text:data.labels[k].text,at:data.labels[k].point,kind:"label"})),
    ...scene.seas.map(k=>({text:data.seaLabels[k].text,at:data.seaLabels[k].point,kind:"place"})),
    ...characterScenes[scene.characters].cast.map(a=>({text:a.name,at:a.point,kind:"figure"}))
  ]}))});
  chapters.push({name:"ottoman", scenes:pages.map(scene=>({...scene,mapItems:scene.animation.flatMap(part=>part.ids.map(id=>({text:entityNameForNarrative(entities[id],part.labels?.[id],scene),at:positionFor(id,part),kind:entities[id].kind}))) }))});
  return chapters;
}
