import json
import os
from io import BytesIO

import google.generativeai as genai
from dotenv import load_dotenv
from PIL import Image

load_dotenv()

GEMINI_API_KEY = os.getenv("GEMINI_API_KEY", "")


def get_model():

    if not GEMINI_API_KEY:
        raise ValueError("GEMINI_API_KEY is not set. Please add it to backend/.env")

    genai.configure(api_key=GEMINI_API_KEY)

    return genai.GenerativeModel("gemini-2.5-flash")


def text_prompt(prompt: str) -> str:
    """Send text prompt."""

    model = get_model()

    response = model.generate_content(prompt)

    return response.text


def image_prompt(image_bytes: bytes, prompt: str) -> str:
    """Send image + prompt to Gemini."""

    model = get_model()

    try:
        image = Image.open(BytesIO(image_bytes)).convert("RGB")

        response = model.generate_content([prompt, image])

        return response.text

    except Exception as exc:
        raise RuntimeError(f"Unable to analyze image with Gemini: {str(exc)}") from exc


def parse_json_response(raw_text: str):
    """
    Parse Gemini JSON safely.
    Handles ```json wrappers automatically.
    """

    try:
        cleaned = raw_text.strip()

        # Remove markdown wrappers
        if cleaned.startswith("```json"):
            cleaned = cleaned.replace("```json", "", 1)

        if cleaned.startswith("```"):
            cleaned = cleaned.replace("```", "", 1)

        if cleaned.endswith("```"):
            cleaned = cleaned[:-3]

        cleaned = cleaned.strip()

        return json.loads(cleaned)

    except Exception as e:
        print("\n==============================")
        print("GEMINI RAW RESPONSE")
        print("==============================")
        print(raw_text)
        print("==============================\n")

        return {"raw_response": raw_text, "parse_error": str(e)}


def ai_test():

    model = get_model()

    response = model.generate_content("Say hello")

    return {"status": "ok", "reply": response.text}
