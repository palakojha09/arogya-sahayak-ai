import json
import os
from io import BytesIO

import google.generativeai as genai
from groq import Groq
from dotenv import load_dotenv
from PIL import Image

load_dotenv()

GROQ_API_KEY = os.getenv("GROQ_API_KEY", "")
GEMINI_API_KEY = os.getenv("GEMINI_API_KEY", "")


def get_client():

    if not GROQ_API_KEY:
        raise ValueError("GROQ_API_KEY is not set.")

    return Groq(api_key=GROQ_API_KEY)


def get_model():

    if not GEMINI_API_KEY:
        raise ValueError("GEMINI_API_KEY is not set.")

    genai.configure(api_key=GEMINI_API_KEY)

    return genai.GenerativeModel("gemini-2.5-flash")


def text_prompt(prompt: str) -> str:

    client = get_client()

    response = client.chat.completions.create(
        model="llama-3.3-70b-versatile",
        messages=[
            {
                "role": "user",
                "content": prompt,
            }
        ],
        temperature=0.2,
    )

    return response.choices[0].message.content


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

    reply = text_prompt("Say hello")

    return {"status": "ok", "reply": reply}
