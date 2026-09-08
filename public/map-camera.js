// 地理図は都市だけに寄りすぎず、周辺の半島・海岸線まで見せる。
// 投影座標の単位が章ごとに違っても、地理上の表示範囲で上限を揃える。
export const minimumMapSpan = Object.freeze({ longitude: 32, latitude: 24 });

export function maximumMapScale(project, width, height) {
  const origin = project([0, 0]);
  const east = project([1, 0]), north = project([0, 1]);
  const longitudeUnit = Math.hypot(east[0] - origin[0], east[1] - origin[1]);
  const latitudeUnit = Math.hypot(north[0] - origin[0], north[1] - origin[1]);
  return Math.min(width / (minimumMapSpan.longitude * longitudeUnit), height / (minimumMapSpan.latitude * latitudeUnit));
}
