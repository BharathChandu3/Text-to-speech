// Handle file upload and text extraction
document.getElementById('image-input').addEventListener('change', function () {
    const file = this.files[0];
    if (file) {
        const formData = new FormData();
        formData.append('file', file);

        fetch('/upload', {
            method: 'POST',
            body: formData
        }).then(response => response.json())
          .then(data => {
              if (data.text) {
                  document.getElementById('text-input').value = data.text;
              } else {
                  alert('Error processing the image.');
              }
          }).catch(error => {
              console.error('Error:', error);
              alert('Error processing the image.');
          });
    }
});

// Speak the text
document.getElementById('speak-btn').addEventListener('click', function () {
    const text = document.getElementById('text-input').value;

    if (text.trim() === '') {
        alert('Please enter text or upload an image.');
        return;
    }

    const selectedVoice = document.getElementById('voice-select').value;

    fetch('/text-to-speech', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ text: text, voice: selectedVoice })
    }).then(response => {
        if (response.ok) {
            return response.blob();
        } else {
            throw new Error('Network response was not ok.');
        }
    }).then(blob => {
        const audio = new Audio(URL.createObjectURL(blob));
        audio.play().catch(error => {
            console.error('Error playing audio:', error);
            alert('Audio playback failed.');
        });
    }).catch(error => {
        console.error('Error:', error);
        alert('Failed to generate speech. Please check the API or internet connection.');
    });
});

// Download the speech as MP3
document.getElementById('download-btn').addEventListener('click', function () {
    const text = document.getElementById('text-input').value;

    if (text.trim() === '') {
        alert('Please enter text or upload an image.');
        return;
    }

    const selectedVoice = document.getElementById('voice-select').value;

    fetch('/text-to-speech', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ text: text, voice: selectedVoice })
    }).then(response => {
        if (response.ok) {
            return response.blob();
        } else {
            throw new Error('Network response was not ok.');
        }
    }).then(blob => {
        const url = window.URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = 'speech.mp3';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        window.URL.revokeObjectURL(url);
    }).catch(error => {
        console.error('Error:', error);
        alert('Failed to download speech. Please try again.');
    });
});
