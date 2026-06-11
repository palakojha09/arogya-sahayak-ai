from services.gemini_service import parse_json_response, text_prompt


def translate_text(text: str, target_language: str):
    """Translate and simplify text into the requested language."""
    prompt = f"""
You are ArogyaSahayak AI. Translate and simplify the following medical text into {target_language}.
Keep the wording clear, respectful, and simple for patients and caregivers.
Return ONLY valid JSON with these keys:
{{
  "translated_text": "Translated text here",
  "simplified_explanation": "Plain-language summary"
}}

Source text:
{text}
"""

    try:
        raw_response = text_prompt(prompt)
        result = parse_json_response(raw_response)

    except Exception:
        return {
            "translated_text": text,
            "simplified_explanation": text,
            "target_language": target_language,
            "source": "fallback"
        }