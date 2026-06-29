import requests
import json
import csv
from io import StringIO

def download_villages():
    print("Downloading All India Pincode/Post Office dataset (this may take a moment)...")
    url = "https://raw.githubusercontent.com/mithunsasidharan/India-Pincode-Lookup/master/pincodes.json"
    
    try:
        response = requests.get(url)
        response.raise_for_status()
        
        data = response.json()
        tn_data = {}
        
        print("Processing data for Tamil Nadu...")
        for row in data:
            state = row.get('stateName', '')
            if state.upper() == 'TAMIL NADU':
                district = row.get('districtName', '').strip().title()
                taluk = row.get('taluk', '').strip().title()
                village = row.get('officeName', '').strip().title()
                
                # Clean up post office abbreviations
                if village.endswith(' B.O'): village = village[:-4]
                if village.endswith(' S.O'): village = village[:-4]
                if village.endswith(' H.O'): village = village[:-4]
                
                if not district or not taluk or not village:
                    continue
                    
                if district not in tn_data:
                    tn_data[district] = {}
                    
                if taluk not in tn_data[district]:
                    tn_data[district][taluk] = []
                    
                if village not in tn_data[district][taluk]:
                    tn_data[district][taluk].append(village)
                    
        # Sort everything alphabetically
        sorted_data = {
            d: {t: sorted(v) for t, v in t_dict.items()}
            for d, t_dict in sorted(tn_data.items())
        }
        
        with open('src/data/tnVillages.json', 'w', encoding='utf-8') as f:
            json.dump(sorted_data, f, indent=2)
            
        total_villages = sum(len(v) for t_dict in sorted_data.values() for v in t_dict.values())
        print(f"Successfully saved {total_villages} villages/towns to src/data/tnVillages.json!")
        
    except Exception as e:
        print(f"Failed to fetch or process data: {e}")

if __name__ == "__main__":
    download_villages()
