import os
import sys
import json
import hashlib
from PIL import Image, ImageDraw, ImageFont

BASE_DIR = r"C:\Users\USER\AppData\Local\Temp\w-history-modern-lesson21-20261005"
TARGET_DIR = r"C:\Users\USER\Desktop\W-History\public\images\modern-c05-l21"
INPUT_JSON_PATH = os.path.join(BASE_DIR, "generated-inputs.json")
REPORT_JSON_PATH = os.path.join(BASE_DIR, "normalization-report.json")
CONTACT_SHEET_PATH = os.path.join(BASE_DIR, "contact-sheet.png")

def compute_sha256(filepath):
    hasher = hashlib.sha256()
    with open(filepath, "rb") as f:
        while chunk := f.read(65536):
            hasher.update(chunk)
    return hasher.hexdigest()

def validate_target_path(target_path, base_target_dir):
    norm_base = os.path.normcase(os.path.abspath(base_target_dir))
    norm_path = os.path.normcase(os.path.abspath(target_path))
    if os.path.dirname(norm_path) != norm_base:
        raise ValueError(f"Target path {target_path} is not directly inside target directory {base_target_dir}")
    if not norm_path.endswith(".png"):
        raise ValueError(f"Target path {target_path} is not a .png file")
    return True

def generate_contact_sheet(images_list, output_path, cols=5):
    """
    5列のグリッドで各192x192スプライトを淡い灰色のセルに配置し、
    セル下部にASCII keyを描画した確認用一覧画像を生成する。
    """
    if not images_list:
        return

    cell_w = 208
    cell_h = 232
    cell_bg = (240, 242, 245, 255)
    cell_border = (205, 210, 215, 255)
    text_color = (25, 25, 25, 255)
    sheet_bg = (230, 232, 235, 255)

    margin = 16
    gap = 12

    actual_rows = (len(images_list) + cols - 1) // cols

    sheet_w = margin * 2 + cols * cell_w + (cols - 1) * gap
    sheet_h = margin * 2 + actual_rows * cell_h + (actual_rows - 1) * gap

    sheet = Image.new("RGBA", (sheet_w, sheet_h), sheet_bg)
    font = ImageFont.load_default()

    for r in range(actual_rows):
        for c in range(cols):
            idx = r * cols + c
            cx = margin + c * (cell_w + gap)
            cy = margin + r * (cell_h + gap)

            cell = Image.new("RGBA", (cell_w, cell_h), cell_bg)
            draw_cell = ImageDraw.Draw(cell)
            draw_cell.rectangle([(0, 0), (cell_w - 1, cell_h - 1)], outline=cell_border, width=1)

            if idx < len(images_list):
                k, sprite_img = images_list[idx]
                sprite_x = (cell_w - 192) // 2
                sprite_y = 6
                cell.alpha_composite(sprite_img, (sprite_x, sprite_y))

                try:
                    bbox_text = font.getbbox(k)
                    tw = bbox_text[2] - bbox_text[0]
                    th = bbox_text[3] - bbox_text[1]
                except Exception:
                    tw, th = 8 * len(k), 10

                tx = max(2, (cell_w - tw) // 2)
                ty = 192 + sprite_y + (cell_h - (192 + sprite_y) - th) // 2
                draw_cell.text((tx, ty), k, fill=text_color, font=font)

            sheet.paste(cell, (cx, cy))

    os.makedirs(os.path.dirname(os.path.abspath(output_path)), exist_ok=True)
    sheet.save(output_path, "PNG")
    print(f"Contact sheet saved to: {output_path}")

def normalize_sprites():
    # 画像が未生成なら処理は実行せず、入力待ちで正常終了する
    if not os.path.exists(INPUT_JSON_PATH):
        print(f"Input JSON not found: {INPUT_JSON_PATH}. Skipping normalization since images are not generated yet.")
        return 0, 0

    with open(INPUT_JSON_PATH, "r", encoding="utf-8") as f:
        try:
            data = json.load(f)
        except json.JSONDecodeError as e:
            print(f"Error: Failed to parse input JSON: {e}", file=sys.stderr)
            sys.exit(1)

    if isinstance(data, list):
        assets = data
    elif isinstance(data, dict):
        assets = data.get("assets", data.get("inputs", []))
    else:
        print("Error: Input JSON format unrecognized", file=sys.stderr)
        sys.exit(1)

    total_count = len(assets)
    if total_count == 0:
        print("No assets found in input JSON. Skipping normalization.")
        return 0, 0

    completed_count = 0
    failed_count = 0
    failures = []
    results = []
    processed_images = []
    output_hashes = {}

    print(f"Starting sprite normalization for {total_count} assets...")

    for idx, item in enumerate(assets):
        key = item.get("key")
        # generated-inputs.json にある assets の key と rawImage を入力
        raw_image = item.get("rawImage") or item.get("input") or item.get("inputPath")
        if raw_image and not os.path.isabs(raw_image):
            input_path = os.path.normpath(os.path.join(BASE_DIR, raw_image))
        else:
            input_path = os.path.normpath(raw_image) if raw_image else None

        output_path = os.path.normpath(os.path.join(TARGET_DIR, f"{key}.png"))

        res_entry = {
            "key": key,
            "inputPath": input_path,
            "outputPath": output_path,
            "inputSha256": None,
            "outputSha256": None,
            "originalDimensions": None,
            "croppedDimensions": None,
            "resizedDimensions": None,
            "canvasDimensions": [192, 192],
            "originalBbox": None,
            "cleanedBbox": None,
            "savedBbox": None,
            "originalAlphaCounts": None,
            "transparentPixelCount": None,
            "removedFaintAlphaPixels": None,
            "opaquePixelCount": None,
            "translucentPixelCount": None,
            "backgroundOperation": None,
            "error": None,
            "errors": [],
            "status": "failed"
        }

        # 1. 入力値の不足確認
        if not key or not input_path:
            err_msg = "Asset definition is missing key or rawImage"
            print(f"[{idx+1}/{total_count}] FAILED: {key} - {err_msg}", file=sys.stderr)
            failures.append({"key": key, "error": err_msg})
            res_entry["error"] = err_msg
            res_entry["errors"].append(err_msg)
            results.append(res_entry)
            failed_count += 1
            continue

        # 出力パストラバーサル防止検証（対象ディレクトリ直下かつ.pngであること）
        try:
            validate_target_path(output_path, TARGET_DIR)
        except Exception as ve:
            err_msg = f"Path validation failed: {ve}"
            print(f"[{idx+1}/{total_count}] FAILED: {key} - {err_msg}", file=sys.stderr)
            failures.append({"key": key, "error": err_msg})
            res_entry["error"] = err_msg
            res_entry["errors"].append(err_msg)
            results.append(res_entry)
            failed_count += 1
            continue

        # 2. 入力ファイルの存在確認
        if not os.path.exists(input_path):
            err_msg = f"Input file not found: {input_path}"
            print(f"[{idx+1}/{total_count}] FAILED: {key} - {err_msg}", file=sys.stderr)
            failures.append({"key": key, "error": err_msg})
            res_entry["error"] = err_msg
            res_entry["errors"].append(err_msg)
            results.append(res_entry)
            failed_count += 1
            continue

        try:
            input_sha256 = compute_sha256(input_path)
            res_entry["inputSha256"] = input_sha256
        except Exception as e:
            err_msg = f"Failed to compute SHA256 for input file: {e}"
            print(f"[{idx+1}/{total_count}] FAILED: {key} - {err_msg}", file=sys.stderr)
            failures.append({"key": key, "error": err_msg})
            res_entry["error"] = err_msg
            res_entry["errors"].append(err_msg)
            results.append(res_entry)
            failed_count += 1
            continue

        try:
            # 3. 元画像を開いて透過の有無を確認（原画像は参照専用、RGB・絵柄は変更しない）
            with Image.open(input_path) as orig_img:
                has_transparency = False
                if orig_img.mode in ("RGBA", "LA"):
                    alpha_channel = orig_img.getchannel("A")
                    min_a, max_a = alpha_channel.getextrema()
                    if min_a < 255:
                        has_transparency = True
                elif "transparency" in orig_img.info:
                    test_rgba = orig_img.convert("RGBA")
                    min_a, max_a = test_rgba.getchannel("A").getextrema()
                    if min_a < 255:
                        has_transparency = True

                # 元画像に透過がない場合は失敗として報告、背景色の除去を勝手に行わない
                if not has_transparency:
                    err_msg = "Image has no transparency (opaque image). Automated background removal is strictly prohibited."
                    print(f"[{idx+1}/{total_count}] FAILED: {key} - {err_msg}", file=sys.stderr)
                    failures.append({"key": key, "error": err_msg})
                    res_entry["error"] = err_msg
                    res_entry["errors"].append(err_msg)
                    results.append(res_entry)
                    failed_count += 1
                    continue

                img = orig_img.convert("RGBA")

            orig_w, orig_h = img.size
            res_entry["originalDimensions"] = {"width": orig_w, "height": orig_h}

            orig_bbox = img.getbbox()
            res_entry["originalBbox"] = list(orig_bbox) if orig_bbox else None

            # 元画像のアルファカウント集計
            orig_alpha = img.getchannel("A")
            orig_hist = orig_alpha.histogram()
            res_entry["originalAlphaCounts"] = {
                "transparent": orig_hist[0],
                "faint": sum(orig_hist[1:16]),
                "translucent": sum(orig_hist[1:255]),
                "opaque": orig_hist[255]
            }

            # 4. アルファ1〜15のごく薄い雑音だけ0にし、16〜255はそのまま（RGBは描き替えない）
            removed_faint_pixels = sum(orig_hist[1:16])
            res_entry["removedFaintAlphaPixels"] = removed_faint_pixels

            # LUTで 1..15 を 0 にマッピング
            lut = [0 if 1 <= v <= 15 else v for v in range(256)]
            cleaned_alpha = orig_alpha.point(lut)

            cleaned_img = img.copy()
            cleaned_img.putalpha(cleaned_alpha)

            cleaned_bbox = cleaned_alpha.getbbox()
            if cleaned_bbox is None:
                err_msg = "Image is completely transparent after removing faint alpha noise (empty image)"
                print(f"[{idx+1}/{total_count}] FAILED: {key} - {err_msg}", file=sys.stderr)
                failures.append({"key": key, "error": err_msg})
                res_entry["error"] = err_msg
                res_entry["errors"].append(err_msg)
                results.append(res_entry)
                failed_count += 1
                continue

            res_entry["cleanedBbox"] = list(cleaned_bbox)

            # 5. 透過範囲bboxを切り出し
            crop_w = cleaned_bbox[2] - cleaned_bbox[0]
            crop_h = cleaned_bbox[3] - cleaned_bbox[1]
            if crop_w <= 0 or crop_h <= 0:
                err_msg = f"Invalid bounding box size: width={crop_w}, height={crop_h}"
                print(f"[{idx+1}/{total_count}] FAILED: {key} - {err_msg}", file=sys.stderr)
                failures.append({"key": key, "error": err_msg})
                res_entry["error"] = err_msg
                res_entry["errors"].append(err_msg)
                results.append(res_entry)
                failed_count += 1
                continue

            res_entry["croppedDimensions"] = {"width": crop_w, "height": crop_h}
            cropped = cleaned_img.crop(cleaned_bbox)

            # 6. 比率を保持して最大176×176へ最近傍で縮小
            scale = min(176.0 / crop_w, 176.0 / crop_h)
            new_w = max(1, min(176, int(round(crop_w * scale))))
            new_h = max(1, min(176, int(round(crop_h * scale))))
            res_entry["resizedDimensions"] = {"width": new_w, "height": new_h}

            resized = cropped.resize((new_w, new_h), Image.Resampling.NEAREST)

            # 7. 192×192透明面の横中央96/足元184に配置
            paste_x = 96 - (new_w // 2)
            paste_y = 184 - new_h

            left_margin = paste_x
            right_margin = 192 - (paste_x + new_w)
            top_margin = paste_y
            bottom_margin = 192 - 184

            if left_margin < 8 or right_margin < 8 or top_margin < 8 or bottom_margin < 8:
                err_msg = f"Transparent margin insufficient (<8px): left={left_margin}, right={right_margin}, top={top_margin}, bottom={bottom_margin}"
                print(f"[{idx+1}/{total_count}] FAILED: {key} - {err_msg}", file=sys.stderr)
                failures.append({"key": key, "error": err_msg})
                res_entry["error"] = err_msg
                res_entry["errors"].append(err_msg)
                results.append(res_entry)
                failed_count += 1
                continue

            canvas = Image.new("RGBA", (192, 192), (0, 0, 0, 0))
            canvas.paste(resized, (paste_x, paste_y))

            # 8. 寸法192・透明余白・空図でないを確認
            if canvas.size != (192, 192):
                err_msg = f"Canvas size is not 192x192: {canvas.size}"
                print(f"[{idx+1}/{total_count}] FAILED: {key} - {err_msg}", file=sys.stderr)
                failures.append({"key": key, "error": err_msg})
                res_entry["error"] = err_msg
                res_entry["errors"].append(err_msg)
                results.append(res_entry)
                failed_count += 1
                continue

            saved_bbox = canvas.getchannel("A").getbbox()
            if saved_bbox is None:
                err_msg = "Resulting canvas is completely transparent (empty image)"
                print(f"[{idx+1}/{total_count}] FAILED: {key} - {err_msg}", file=sys.stderr)
                failures.append({"key": key, "error": err_msg})
                res_entry["error"] = err_msg
                res_entry["errors"].append(err_msg)
                results.append(res_entry)
                failed_count += 1
                continue

            res_entry["savedBbox"] = list(saved_bbox)

            if saved_bbox[0] < 8 or saved_bbox[1] < 8 or saved_bbox[2] > 184 or saved_bbox[3] > 184:
                err_msg = f"Saved bounding box violates 8px margin: {saved_bbox}"
                print(f"[{idx+1}/{total_count}] FAILED: {key} - {err_msg}", file=sys.stderr)
                failures.append({"key": key, "error": err_msg})
                res_entry["error"] = err_msg
                res_entry["errors"].append(err_msg)
                results.append(res_entry)
                failed_count += 1
                continue

            # ピクセル数カウント
            alpha_data = list(canvas.getchannel("A").getdata())
            trans_count = sum(1 for a in alpha_data if a == 0)
            translucent_count = sum(1 for a in alpha_data if 0 < a < 255)
            opaque_count = sum(1 for a in alpha_data if a == 255)

            res_entry["transparentPixelCount"] = trans_count
            res_entry["translucentPixelCount"] = translucent_count
            res_entry["opaquePixelCount"] = opaque_count

            # backgroundOperation 情報
            res_entry["backgroundOperation"] = {
                "operation": "faint_alpha_cleanup",
                "method": "alpha_threshold_clamp",
                "threshold": 16,
                "removedPixelCount": removed_faint_pixels,
                "description": "Preserved original transparent alpha and RGB; clamped faint alpha noise (1-15) to 0 without background color removal."
            }

            # 9. 新規outputPathへPNGを保存
            os.makedirs(os.path.dirname(os.path.abspath(output_path)), exist_ok=True)
            canvas.save(output_path, format="PNG")

            output_sha256 = compute_sha256(output_path)
            res_entry["outputSha256"] = output_sha256
            res_entry["status"] = "completed"

            if output_sha256 in output_hashes:
                print(f"Warning: Hash collision detected between {key} and {output_hashes[output_sha256]}", file=sys.stderr)
            output_hashes[output_sha256] = key

            completed_count += 1
            results.append(res_entry)
            processed_images.append((key, canvas))
            print(f"[{idx+1}/{total_count}] SUCCESS: {key} (bbox {crop_w}x{crop_h} -> {new_w}x{new_h}, saved at ({paste_x},{paste_y}))")

        except Exception as e:
            err_msg = f"Unexpected processing error: {str(e)}"
            print(f"[{idx+1}/{total_count}] FAILED: {key} - {err_msg}", file=sys.stderr)
            failures.append({"key": key, "error": err_msg})
            res_entry["error"] = err_msg
            res_entry["errors"].append(err_msg)
            results.append(res_entry)
            failed_count += 1

    # ハッシュのユニーク性検証
    unique_hash_count = len(output_hashes)
    is_unique_hashes = (unique_hash_count == completed_count == total_count)

    # 10. 報告JSON出力
    report = {
        "summary": {
            "total": total_count,
            "completed": completed_count,
            "failed": failed_count,
            "unique_output_hashes": unique_hash_count,
            "all_hashes_unique": is_unique_hashes,
            "targetDirectory": TARGET_DIR
        },
        "failures": failures,
        "results": results
    }

    os.makedirs(os.path.dirname(os.path.abspath(REPORT_JSON_PATH)), exist_ok=True)
    with open(REPORT_JSON_PATH, "w", encoding="utf-8") as f:
        json.dump(report, f, indent=2, ensure_ascii=False)
    print(f"Report saved to: {REPORT_JSON_PATH}")

    # 11. 5列の確認一覧画像 contact-sheet.png を作成
    if processed_images:
        generate_contact_sheet(processed_images, CONTACT_SHEET_PATH, cols=5)

    print(f"Summary: total={total_count}, completed={completed_count}, failed={failed_count}, unique_hashes={unique_hash_count}")

    if not is_unique_hashes:
        print("ERROR: Not all outputs completed or hashes are not unique!", file=sys.stderr)
        sys.exit(1)

    return completed_count, failed_count

if __name__ == "__main__":
    normalize_sprites()
