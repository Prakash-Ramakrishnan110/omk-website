import urllib.request
import urllib.parse
import json
import time

def translate_batch(texts, target_lang='ta'):
    # Join texts with a delimiter
    delimiter = " | "
    combined_text = delimiter.join(texts)
    
    url = f"https://translate.googleapis.com/translate_a/single?client=gtx&sl=en&tl={target_lang}&dt=t&q={urllib.parse.quote(combined_text)}"
    
    try:
        req = urllib.request.Request(url, headers={'User-Agent': 'Mozilla/5.0'})
        with urllib.request.urlopen(req) as response:
            result = json.loads(response.read().decode())
            # result[0] contains the translated text blocks
            translated_combined = "".join([segment[0] for segment in result[0]])
            
            # Split back by delimiter
            translated_texts = [t.strip() for t in translated_combined.split("|")]
            
            # Ensure the count matches
            if len(translated_texts) == len(texts):
                return translated_texts
            else:
                print("Mismatch in translated batch size. Retrying individually...")
                return [translate_single(t, target_lang) for t in texts]
    except Exception as e:
        print(f"Batch translation failed: {e}")
        return [translate_single(t, target_lang) for t in texts]

def translate_single(text, target_lang='ta'):
    url = f"https://translate.googleapis.com/translate_a/single?client=gtx&sl=en&tl={target_lang}&dt=t&q={urllib.parse.quote(text)}"
    try:
        req = urllib.request.Request(url, headers={'User-Agent': 'Mozilla/5.0'})
        with urllib.request.urlopen(req) as response:
            result = json.loads(response.read().decode())
            return "".join([segment[0] for segment in result[0]]).strip()
    except Exception as e:
        print(f"Failed to translate {text}: {e}")
        return text

def main():
    print("Loading datasets...")
    with open('./src/data/tnLocations.json', 'r', encoding='utf-8') as f:
        locations = json.load(f)
        
    with open('./src/data/tnTaluks.json', 'r', encoding='utf-8') as f:
        taluks = json.load(f)

    # Collect all unique strings
    words_to_translate = set()
    
    for district, constituencies in locations.items():
        words_to_translate.add(district)
        for c in constituencies:
            words_to_translate.add(c)
            
    for district, t_list in taluks.items():
        for t in t_list:
            words_to_translate.add(t)
            
    words_list = list(words_to_translate)
    print(f"Found {len(words_list)} unique locations to translate.")
    
    translations = {}
    batch_size = 50
    
    for i in range(0, len(words_list), batch_size):
        batch = words_list[i:i+batch_size]
        print(f"Translating batch {i} to {i+len(batch)}...")
        trans_batch = translate_batch(batch)
        for j, word in enumerate(batch):
            translations[word] = trans_batch[j]
        time.sleep(1) # Prevent rate limit
        
    # Save the translations
    with open('./src/data/tnTranslations.json', 'w', encoding='utf-8') as f:
        json.dump(translations, f, ensure_ascii=False, indent=2)
        
    print("Saved translations to tnTranslations.json")

if __name__ == '__main__':
    main()
