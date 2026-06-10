import json
import os
from io import BytesIO

import google.generativeai as genai
from dotenv import load_dotenv
from PIL import Image

load_dotenv()

GEMINI_API_KEY = os.getenv("GEMINI_API_KEY", "")


def get_model():
    """Create a Gemini model instance using the API key from the environment."""
    if not GEMINI_API_KEY:
        raise ValueError("GEMINI_API_KEY is not set. Please add it to backend/.env")

    genai.configure(api_key=GEMINI_API_KEY)
    return genai.GenerativeModel("gemini-2.0-flash-lite")


def text_prompt(prompt: str) -> str:
    """Send a text-only prompt to Gemini and return the response text."""
    model = get_model()
    response = model.generate_content(prompt)
    return response.text


def image_prompt(image_bytes: bytes, prompt: str) -> str:
    """Send an image and prompt to Gemini Vision and return raw text."""
    model = get_model()

    try:
        image = Image.open(BytesIO(image_bytes)).convert("RGB")
        response = model.generate_content([prompt, image])
        return response.text
    except Exception as exc:
        raise RuntimeError(f"Unable to analyze image with Gemini: {str(exc)}") from exc


def parse_json_response(raw_text: str):
    """Try to decode Gemini JSON output safely."""
    try:
        return json.loads(raw_text)
    except json.JSONDecodeError:
        return {"raw_response": raw_text}


def ai_test():
    model = get_model()

    response = model.generate_content("Say hello")

    return {
        "status": "ok",
        "reply": response.text
    }