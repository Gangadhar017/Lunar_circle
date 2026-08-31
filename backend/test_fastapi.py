import json
from fastapi.testclient import TestClient
from src.api.main import app

client = TestClient(app)

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

response = client.post('/analyze', data=data, files=files)
print('Status:', response.status_code)
print('Response:', response.text)
