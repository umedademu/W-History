// 元画像の透明な余白を表示寸法に含めず、人物・建物の本体を枠へ収める。
// 画像ファイルは変更せず、通常の画像要素で描画する。
const boundsCache = new Map();

export function alphaBounds(data, width, height) {
  let left = width, top = height, right = -1, bottom = -1;
  for (let y = 0; y < height; y++) for (let x = 0; x < width; x++) {
    if (data[(y * width + x) * 4 + 3] === 0) continue;
    left = Math.min(left, x); top = Math.min(top, y);
    right = Math.max(right, x); bottom = Math.max(bottom, y);
  }
  return right < left ? null : { left, top, width: right - left + 1, height: bottom - top + 1 };
}

export function spritePlacement(bounds, frameWidth, frameHeight) {
  const scale = Math.min(frameWidth / bounds.width, frameHeight / bounds.height, 1);
  return {
    scale,
    left: (frameWidth - bounds.width * scale) / 2 - bounds.left * scale,
    top: frameHeight - (bounds.top + bounds.height) * scale
  };
}

export function fitMapSprite(image) {
  if (!image || image.closest('.map-sprite-art')) return;
  const frame = document.createElement('span');
  frame.className = 'map-sprite-art';
  // 自動の高さを持つ第04章も、画像を位置指定する前に元の表示枠を保つ。
  frame.style.height = `${image.offsetHeight}px`;
  image.before(frame); frame.append(image);

  const fit = () => {
    if (!image.naturalWidth || !image.isConnected) return;
    const key = image.currentSrc || image.src;
    if (!boundsCache.has(key)) {
      try {
        const canvas = document.createElement('canvas');
        canvas.width = image.naturalWidth; canvas.height = image.naturalHeight;
        const context = canvas.getContext('2d', { willReadFrequently: true });
        context.drawImage(image, 0, 0);
        boundsCache.set(key, alphaBounds(context.getImageData(0, 0, canvas.width, canvas.height).data, canvas.width, canvas.height));
      } catch {
        // 読み取れない画像でも、従来の表示を維持する。
        boundsCache.set(key, null);
      }
    }
    const bounds = boundsCache.get(key);
    if (!bounds) {
      image.removeAttribute('data-sprite-fitted');
      for (const property of ['--sprite-width', '--sprite-height', '--sprite-left', '--sprite-top']) image.style.removeProperty(property);
      return;
    }
    const width = frame.offsetWidth, height = frame.offsetHeight;
    if (!width || !height) return;
    const placement = spritePlacement(bounds, width, height);
    image.dataset.spriteFitted = 'true';
    image.style.setProperty('--sprite-width', `${image.naturalWidth * placement.scale}px`);
    image.style.setProperty('--sprite-height', `${image.naturalHeight * placement.scale}px`);
    image.style.setProperty('--sprite-left', `${placement.left}px`);
    image.style.setProperty('--sprite-top', `${placement.top}px`);
  };
  image.addEventListener('load', fit);
  if (image.complete) fit();
  // 遅れて登場する人物は、表示枠が確定した時点でも寸法を合わせる。
  const observer = new ResizeObserver(() => {
    if (!image.isConnected) { observer.disconnect(); return; }
    fit();
  });
  observer.observe(frame);
}
