import pandas as pd
import json
import requests

url = "https://en.wikipedia.org/wiki/List_of_taluks_of_Tamil_Nadu"
print("Fetching taluks from Wikipedia...")
headers = {'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)'}
response = requests.get(url, headers=headers)
tables = pd.read_html(response.text)

target_table = None
for table in tables:
    if any('District' in str(c) for c in table.columns) and any('Taluks' in str(c) for c in table.columns):
        target_table = table
        break

if target_table is not None:
    data_map = {}
    
    district_col = [c for c in target_table.columns if 'District' in str(c)][0]
    taluk_col = [c for c in target_table.columns if 'Taluks' in str(c)][0]
    
    for _, row in target_table.iterrows():
        dist = str(row[district_col]).strip()
        taluks_raw = str(row[taluk_col]).strip()
        
        if pd.isna(dist) or dist == 'nan':
            continue
            
        # Clean footnotes
        if '[' in dist: dist = dist.split('[')[0]
        
        # Taluks are usually comma-separated or newline-separated
        taluks = [t.strip().split('[')[0] for t in taluks_raw.replace('\n', ',').split(',') if t.strip()]
        
        if dist not in data_map:
            data_map[dist] = []
        data_map[dist].extend(taluks)
        
    sorted_map = {k: sorted(list(set(v))) for k, v in sorted(data_map.items())}
    
    with open('src/data/tnTaluks.json', 'w', encoding='utf-8') as f:
        json.dump(sorted_map, f, indent=2, ensure_ascii=False)
        
    print(f"Saved {sum(len(v) for v in sorted_map.values())} taluks across {len(sorted_map)} districts.")
else:
    print("Could not find taluks table.")
