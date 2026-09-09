import { sourceEdition } from "./source-edition.js?v=0.050";
import { places, zones } from "./islamic-culture-scenes.js?v=0.031";
import { mountStory } from "./history-story.js?v=0.050";

const scenes=sourceEdition["islamic-culture"];
mountStory({ places, zones, scenes, imageDirectory: "islamic-culture" });
