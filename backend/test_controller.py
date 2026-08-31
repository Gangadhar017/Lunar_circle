import json
from src.satquery import controller

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

try:
    ex = controller.run('Find newly developed regions', ['dummy.png'], benchmark_mode=True, demo_mode=True, aoi=aoi_data)
    print('OK:', ex.ok)
    print('Answer:', ex.answer)
except Exception as e:
    import traceback
    traceback.print_exc()
