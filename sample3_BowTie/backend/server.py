from fastapi import FastAPI
from fastapi.responses import FileResponse
import requests
import uuid
import os
import tempfile
import uvicorn
from fastapi.middleware.cors import CORSMiddleware

VOICEVOX_URL = "http://127.0.0.1:50021"

app = FastAPI()

# Set CORS :  Allow All
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/health")
def health():
    return {"status": "ok"}

@app.get("/tts")
def tts(text: str):
    speaker = 3

    # Create Voice Query
    q = requests.post(
        f"{VOICEVOX_URL}/audio_query",
        params={"text": text, "speaker": speaker}
    ).json()

    # Text-to-speech
    wav = requests.post(
        f"{VOICEVOX_URL}/synthesis",
        params={"speaker": speaker},
        json=q
    ).content

    # Save Temporary file
    fname = os.path.join(tempfile.gettempdir(), f"{uuid.uuid4()}.wav")
    with open(fname, "wb") as f:
        f.write(wav)

    return FileResponse(fname, media_type="audio/wav")

if __name__ == "__main__":
    uvicorn.run("server:app", host="0.0.0.0", port=8000, reload=False)
