import pandas as pd
import json

import requests

# URL of the Wikipedia page containing the constituencies
url = "https://en.wikipedia.org/wiki/List_of_constituencies_of_the_Tamil_Nadu_Legislative_Assembly"

print("Fetching data from Wikipedia...")
headers = {'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)'}
response = requests.get(url, headers=headers)
tables = pd.read_html(response.text)

# Find the correct table (the one with 'Constituency', 'District' etc.)
# Usually it's the largest table on the page
target_table = None
for idx, table in enumerate(tables):
    # Check if headers match what we expect
    if any('District' in str(col) for col in table.columns) and any('Constituency' in str(col) or 'Name' in str(col) for col in table.columns):
        if len(table) > 200: # There are 234 constituencies
            target_table = table
            break

if target_table is not None:
    print(f"Found table with {len(target_table)} rows.")
    
    # Standardize column names
    col_dict = {col: str(col).lower() for col in target_table.columns}
    
    # Find district and constituency columns
    district_col = [c for c in target_table.columns if 'district' in str(c).lower()][0]
    
    # Constituency column is sometimes named "Name", "Constituency Name", etc.
    name_cols = [c for c in target_table.columns if 'name' in str(c).lower() or 'constituency' in str(c).lower()]
    # Typically the 2nd or 3rd column is the name
    name_col = target_table.columns[1] if 'Constituency' not in str(target_table.columns[1]) else target_table.columns[1]
    
    # Specifically for this wikipedia page:
    # Columns are typically: No., Name, Reserved for, District, Lok Sabha constituency
    for c in target_table.columns:
        if isinstance(c, tuple):
            if 'Name' in c:
                name_col = c
            if 'District' in c:
                district_col = c
        else:
            if 'Name' in str(c) and 'Lok Sabha' not in str(c):
                name_col = c
            if 'District' in str(c):
                district_col = c

    data_map = {}
    
    for _, row in target_table.iterrows():
        dist = str(row[district_col]).strip()
        const = str(row[name_col]).strip()
        
        # Clean up footnotes e.g. "Chennai[2]" -> "Chennai"
        if '[' in dist: dist = dist.split('[')[0]
        if '[' in const: const = const.split('[')[0]
        
        if pd.isna(dist) or dist == 'nan' or dist == 'None':
            continue
            
        if dist not in data_map:
            data_map[dist] = []
            
        if const not in data_map[dist] and pd.notna(const) and const != 'nan':
            data_map[dist].append(const)
            
    # Sort districts and constituencies alphabetically
    sorted_map = {k: sorted(v) for k, v in sorted(data_map.items())}
    
    with open('src/data/tnLocations.json', 'w', encoding='utf-8') as f:
        json.dump(sorted_map, f, indent=2, ensure_ascii=False)
        
    print(f"Successfully saved {len(sorted_map)} districts and their constituencies to src/data/tnLocations.json")
else:
    print("Could not find the constituencies table.")
