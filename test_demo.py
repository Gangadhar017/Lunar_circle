import httpx
import json

base_url = 'http://127.0.0.1:8000'

aoi_data = {
    "geometry": {
        "type": "Polygon",
        "coordinates": [[[0,0],[1,0],[1,1],[0,1],[0,0]]]
    },
    "bounds": {"north": 1, "south": 0, "east": 1, "west": 0},
    "center": {"lat": 0.5, "lng": 0.5},
    "source": "auto",
    "createdAt": 123456789
}

data = {
    'query': 'Find newly developed regions',
    'benchmark_mode': 'true',
    'demo_mode': 'true',
    'aoi': json.dumps(aoi_data)
}

files = [('images', ('dummy.png', b'not a real image', 'image/png'))]

try:
    response = httpx.post(f'{base_url}/analyze', data=data, files=files, timeout=10)
    print('Status:', response.status_code)
    try:
        print('Result:', response.json())
    except Exception:
        print('Text:', response.text)
except Exception as e:
    print('Error:', e)
