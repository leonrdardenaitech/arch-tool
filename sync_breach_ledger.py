"""
Syncs Anergi 2026 Master Breach & Fine Ledger from Excel to JSON.
Maps image assets from C:\\Users\\Leonr\\projects\\arch-tool\\public.
"""
import os
import json
import zipfile
import xml.etree.ElementTree as ET

EXCEL_PATH = r"C:\Users\Leonr\Downloads\anergi-2026-breach-ledger.xlsx"
OUTPUT_JSON = r"C:\Users\Leonr\projects\arch-tool\breach_ledger.json"

IMAGE_MAP = {
    "Change Healthcare": "seqscan3.png",
    "FBI Recruitment": "4in1overlay88.png",
    "Defense Manpower Data Center": "secritygrfff88.jpg",
    "Free Mobile": "seqscan2.png",
    "Free (Iliad)": "seqscan188.png",
    "France Travail": "weekly2.jpg",
    "Kaiser Permanente": "cybergirlheadfix88.jpg",
    "Reddit": "3d_cloud88.png",
    "The Walt Disney Co.": "weekly3.jpg",
    "PlayOn Sports (GoFan)": "nebulagazer1.jpg",
    "Instructure Canvas": "3d-brain88.jpg",
    "IQVIA Operations": "chart_floating88.jpg",
    "South Staffordshire Water": "seqscan2.png",
    "Amadeus IT Group": "cybergirl.jpg",
    "General Motors": "weekly3.jpg",
    "Arizona Court System": "secritygrfff88.jpg",
    "SolarWinds & CISO": "chart_floating88.jpg",
    "Anergi Operations": "4in1overlay88.png"
}

def parse_breach_ledger():
    if not os.path.exists(EXCEL_PATH):
        raise FileNotFoundError(f"Workbook not found at {EXCEL_PATH}")

    with zipfile.ZipFile(EXCEL_PATH) as z:
        sheet1_xml = z.read('xl/worksheets/sheet1.xml')
        root = ET.fromstring(sheet1_xml)
        ns = {'ns': 'http://schemas.openxmlformats.org/spreadsheetml/2006/main'}
        
        rows = root.findall('.//ns:row', ns)
        records = []
        
        for r in rows[4:]:
            cells = []
            for c in r.findall('ns:c', ns):
                t_node = c.find('.//ns:t', ns)
                if t_node is not None and t_node.text is not None:
                    cells.append(t_node.text.strip())
                else:
                    v_node = c.find('ns:v', ns)
                    if v_node is not None and v_node.text is not None:
                        cells.append(v_node.text.strip())
                    else:
                        cells.append('')
            
            if not cells or not cells[0] or "TOTAL" in cells[0].upper():
                continue
            
            quarter = cells[0] if len(cells) > 0 else ""
            date_month = cells[1] if len(cells) > 1 else ""
            target = cells[2] if len(cells) > 2 else ""
            industry = cells[3] if len(cells) > 3 else ""
            vector = cells[4] if len(cells) > 4 else ""
            impact = cells[5] if len(cells) > 5 else ""
            penalty_raw = cells[6] if len(cells) > 6 else "0"
            try:
                penalty_usd = float(penalty_raw)
            except ValueError:
                penalty_usd = 0.0
            
            # Fix France Travail if 540000 -> 5400000
            if "France Travail" in target and penalty_usd == 540000.0:
                penalty_usd = 5400000.0
                
            service_cta = cells[7] if len(cells) > 7 else "Mini S.P.A. Perimeter Scan"
            cta_target = cells[8] if len(cells) > 8 else "mini_spa.html"

            if penalty_usd >= 100000000 or "ransomware" in vector.lower() or "exfiltrat" in vector.lower() or "zero-day" in vector.lower():
                severity = "Critical Attack"
                badge_color = "red"
            elif penalty_usd > 0 or "fine" in impact.lower() or "settlement" in impact.lower():
                severity = "Regulatory Fine"
                badge_color = "amber"
            else:
                severity = "Surface Exposure"
                badge_color = "cyan"
            
            record_id = f"breach-{quarter.lower().replace(' ', '-')}-{target.lower().replace(' ', '-').replace('(', '').replace(')', '')[:15]}"

            # Match image
            matched_image = "public/4in1overlay88.png"
            for k, img in IMAGE_MAP.items():
                if k.lower() in target.lower():
                    matched_image = img
                    break

            media_video = ""
            if "2026" in quarter and ("Q3" in quarter or "Sept" in date_month or "Change Healthcare" in target or "FBI" in target):
                media_video = "https://www.youtube.com/shorts/F7q4wGMr0MY"

            record = {
                "id": record_id,
                "quarter": quarter,
                "date": date_month,
                "target": target,
                "industry": industry,
                "vector": vector,
                "impact": impact,
                "penalty_usd": penalty_usd,
                "service_cta": service_cta,
                "cta_target": cta_target,
                "severity": severity,
                "badge_color": badge_color,
                "media_video": media_video,
                "image": matched_image
            }
            records.append(record)
            
        print(f"Extracted {len(records)} breach records.")
        with open(OUTPUT_JSON, "w", encoding="utf-8") as f:
            json.dump(records, f, indent=2)
        print(f"Saved to {OUTPUT_JSON}")

if __name__ == "__main__":
    parse_breach_ledger()
