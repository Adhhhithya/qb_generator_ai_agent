import urllib.request
import json

url = "http://localhost:8000/generate"
payload = {
    "code": "CS102",
    "topic": "Polymorphism in Java",
    "bloom_level": "Analyze",
    "keywords": ["inheritance", "method overriding", "dynamic dispatch"],
    "marks": 10,
    "difficulty": "Medium"
}
data = json.dumps(payload).encode('utf-8')

req = urllib.request.Request(url, data=data, headers={'Content-Type': 'application/json'})

print(f"POST {url}")
try:
    with urllib.request.urlopen(req) as response:
        print(f"STATUS: {response.getcode()}")
        body = response.read().decode('utf-8')
        try:
            parsed = json.loads(body)
            with open("verify_result.json", "w", encoding="utf-8") as f:
                json.dump(parsed, f, indent=2)
            print("Successfully wrote response to verify_result.json")
        except:
            print("RESPONSE TEXT (Not JSON):")
            print(body)
except urllib.error.HTTPError as e:
    print(f"HTTP ERROR: {e.code}")
    print(e.read().decode('utf-8'))
except Exception as e:
    print(f"ERROR: {e}")
