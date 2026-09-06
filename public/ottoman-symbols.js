// 専用画像のない人物・制度には、肖像と誤認しない共通の記号を使う。
export const symbolPaths = {
  person: '<circle cx="40" cy="24" r="13" fill="#edcda4"/><path d="M21 70V51Q40 32 59 51V70Z" fill="#5b8180"/><path d="M27 14Q40 1 53 14V19H27Z" fill="#ad6141"/>',
  child: '<circle cx="40" cy="32" r="11" fill="#edcda4"/><path d="M25 70V55Q40 42 55 55V70Z" fill="#688999"/>',
  army: '<path d="M28 66V40H52V66Z" fill="#678589"/><circle cx="40" cy="28" r="12" fill="#e5c89d"/><path d="M27 25Q40 4 53 25Z" fill="#78929a"/><path d="M13 67V13M9 18L13 7 17 18M62 37L72 43V58L62 68 53 58V43Z" fill="#b76e4c"/>',
  cavalry: '<path d="M12 48L20 40H53L61 28 70 35 62 51 54 56 53 71H47L43 57H26L23 71H17L18 53Z" fill="#ae8663"/><circle cx="36" cy="20" r="9" fill="#edcda4"/><path d="M29 30H43V48H30ZM48 36V8" fill="#557f85"/>',
  fleet: '<path d="M9 52H71L60 68H24Z" fill="#aa7951"/><path d="M39 12V53M42 16L64 43H42ZM35 20L16 44H35Z" fill="#fbf3dd"/><path d="M8 74Q16 69 24 74T40 74 56 74 72 74" fill="none"/>',
  town: '<path d="M10 68V38L25 25 40 38V68ZM40 68V33L56 19 72 33V68Z" fill="#d4b482"/><path d="M21 68V50H30V68M51 68V45H61V68" fill="#6e8985"/>',
  scroll: '<path d="M17 13H64V66H21Q10 66 14 56V21Q14 12 22 13" fill="#f6e6b9"/><path d="M27 27H54M27 37H54M27 47H49M21 56H64" fill="none"/>',
  coin: '<ellipse cx="40" cy="58" rx="25" ry="10" fill="#c69a45"/><path d="M15 42V58M65 42V58"/><ellipse cx="40" cy="42" rx="25" ry="10" fill="#e0ba64"/><ellipse cx="40" cy="26" rx="19" ry="8" fill="#e8c57b"/><path d="M21 26V37M59 26V37"/>',
  merchant: '<circle cx="31" cy="23" r="11" fill="#edcda4"/><path d="M14 68V47Q31 34 47 47V68Z" fill="#719081"/><path d="M45 44H71V69H45ZM51 44V36H64V44M45 53H71" fill="#c9a570"/>',
  wall: '<path d="M8 69V25H18V35H29V25H40V35H51V25H62V35H72V69Z" fill="#b6ad93"/><path d="M8 49H72M20 49V69M40 35V49M60 49V69" fill="none"/>',
  chain: '<g fill="none" stroke-width="5" transform="rotate(-25 40 40)"><rect x="5" y="31" width="30" height="18" rx="9"/><rect x="25" y="31" width="30" height="18" rx="9"/><rect x="45" y="31" width="30" height="18" rx="9"/></g>',
  cannon: '<path d="M13 39L65 23 70 36 20 53Z" fill="#698181"/><path d="M21 53H58L65 66H14Z" fill="#ad8258"/><circle cx="31" cy="63" r="9" fill="#cfb991"/>',
  palace: '<path d="M10 69V34H70V69Z" fill="#e0c69e"/><path d="M7 34L40 13 73 34ZM19 43H25V62H19ZM37 43H43V62H37ZM55 43H61V62H55Z" fill="#b77f5d"/>',
  church: '<path d="M14 69V39H66V69Z" fill="#d9bb8f"/><path d="M24 39Q24 10 40 10Q56 10 56 39Z" fill="#b46e54"/><path d="M40 10V1M35 5H45M34 69V52Q40 44 46 52V69" fill="#6b8689"/>',
  mosque: '<path d="M15 70V38H65V70Z" fill="#d9bb8f"/><path d="M23 38Q24 10 40 10Q56 10 57 38Z" fill="#78999a"/><path d="M8 70V16L12 6 16 16V70M64 70V16L68 6 72 16V70" fill="#e3cfaa"/>',
  flower: '<path d="M40 70V36M40 61Q15 64 19 43Q37 48 40 61M40 54Q64 57 63 37Q44 42 40 54" fill="#699267"/><path d="M25 12L34 20 40 9 47 20 56 12V29Q40 52 25 29Z" fill="#b75d4d"/>',
  press: '<path d="M14 70V12H23V70M57 70V12H66V70M14 15H66M23 57H57M28 39H52V47H28ZM40 15V39M27 27H53" fill="#caa171"/>',
  factory: '<path d="M9 70V40L29 29V40L50 29V40H71V70ZM56 39V10H65V39" fill="#8e9c96"/><path d="M18 51H26V60H18ZM35 51H43V60H35ZM52 51H60V60H52Z" fill="#ead8b5"/>'
};
export function symbolGraphic(icon) {
  return `<svg class="ottoman-symbol" viewBox="0 0 80 80" aria-hidden="true" fill="none" stroke="#425e60" stroke-width="2" stroke-linejoin="round" stroke-linecap="round">${symbolPaths[icon] ?? symbolPaths.person}</svg>`;
}
