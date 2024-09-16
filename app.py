from flask import Flask, request, jsonify, send_file
import requests
import io
from werkzeug.utils import secure_filename

app = Flask(__name__)

@app.route('/upload', methods=['POST'])
def upload_image():
    if 'file' not in request.files:
        return jsonify({'error': 'No file part'}), 400

    file = request.files['file']
    if file.filename == '':
        return jsonify({'error': 'No selected file'}), 400

    if file:
        filename = secure_filename(file.filename)
        file_path = f'./uploads/{filename}'  
        file.save(file_path)
        text = extract_text_from_image(file_path)

        return jsonify({'text': text})

    return jsonify({'error': 'File upload failed'}), 500

@app.route('/text-to-speech', methods=['POST'])
def text_to_speech():
    data = request.json
    text = data.get('text')
    voice = data.get('voice')

    if not text or not voice:
        return jsonify({'error': 'Text and voice parameters are required'}), 400

    api_key = '6839c6fafb2b43fca0259b0cb84f38aa'
    api_url = f'https://api.voicerss.org/?key={api_key}&hl={voice}&src={text}&c=MP3'

    response = requests.get(api_url, stream=True)
    if response.status_code == 200:
        return send_file(io.BytesIO(response.content), as_attachment=True, download_name='speech.mp3', mimetype='audio/mpeg')

    return jsonify({'error': 'Failed to generate speech'}), 500

def extract_text_from_image(file_path):
    return "Sample extracted text from image."

if __name__ == '__main__':
    app.run(debug=True)
