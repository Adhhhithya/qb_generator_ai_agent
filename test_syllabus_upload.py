"""
Quick test/demo of the syllabus extraction functionality.

To test the endpoint:
1. Ensure the backend is running: python -m uvicorn app.main:app --reload
2. Use curl or Postman to test:

   curl -X POST "http://127.0.0.1:8000/syllabus/upload" \
     -F "file=@/path/to/syllabus.pdf"

3. Or use Python:

   import requests
   with open("syllabus.pdf", "rb") as f:
       files = {"file": f}
       response = requests.post("http://127.0.0.1:8000/syllabus/upload", files=files)
       print(response.json())

Expected Response (200 OK):
{
  "raw_text": "Database Management Systems course covers normalization functional dependencies...",
  "file_name": "syllabus.pdf",
  "file_size_kb": 125.5,
  "extraction_method": "pdf"
}

Error Responses:
- 400: Invalid file type, empty file, or extraction failed
- 413: File size exceeds 10 MB
- 500: Extraction library not installed
"""

import requests
import os

def test_syllabus_upload(file_path: str):
    """Test the syllabus upload endpoint"""
    if not os.path.exists(file_path):
        print(f"File not found: {file_path}")
        return
    
    url = "http://127.0.0.1:8000/syllabus/upload"
    
    with open(file_path, "rb") as f:
        files = {"file": f}
        print(f"Uploading: {file_path}")
        
        try:
            response = requests.post(url, files=files)
            print(f"Status: {response.status_code}")
            
            if response.status_code == 200:
                data = response.json()
                print(f"\n✓ Extraction successful!")
                print(f"  File: {data['file_name']}")
                print(f"  Size: {data['file_size_kb']:.1f} KB")
                print(f"  Method: {data['extraction_method']}")
                print(f"  Extracted text length: {len(data['raw_text'])} chars")
                print(f"\n--- First 500 chars ---")
                print(data['raw_text'][:500])
                print("...")
            else:
                print(f"Error: {response.json()}")
                
        except Exception as e:
            print(f"Connection error: {e}")
            print("Make sure the backend is running on http://127.0.0.1:8000")

if __name__ == "__main__":
    # Example usage - uncomment to test
    # test_syllabus_upload("sample_syllabus.pdf")
    pass
