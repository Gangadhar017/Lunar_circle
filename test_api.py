import httpx
import sys

base_url = 'http://127.0.0.1:8000'

def test(name, query, num_images):
    print(f'\\n--- {name} ---')
    try:
        files = []
        for i in range(num_images):
            # Create a simple valid dummy file object
            files.append(('images', (f'dummy{i}.png', b'not a real image', 'image/png')))
        
        response = httpx.post(f'{base_url}/analyze', data={'query': query, 'benchmark_mode': 'false'}, files=files, timeout=10)
        print('Status:', response.status_code)
        try:
            print('Result:', response.json())
        except Exception:
            print('Text:', response.text)
    except Exception as e:
        print('Error:', e)

print('Health Check:')
try:
    print(httpx.get(f'{base_url}/health').json())
except Exception as e:
    print('Health error:', e)

test('A. Single Image VQA', 'what is the building?', 1)
test('B. Single Image Caption/Grounding', 'describe this scene', 1)
test('C. Bi-temporal Change', 'what changed between these dates?', 2)
test('D. Optical + SAR', 'combine optical and sar', 2)

