from fastapi import UploadFile

from backend.services.gemini_service import (
    image_prompt,
    parse_json_response,
)


async def analyze_prescription_file(file: UploadFile, language="English"):
    print("================================")
    print("LANGUAGE RECEIVED:", language)
    print("================================")

    file_bytes = await file.read()

    prompt = f"""
You are ArogyaSahayak AI.

Return all summaries, explanations, schedules,
and caregiver guidance in {language}.

Analyze the prescription image carefully.

Return ONLY valid JSON.

{{
  "patient_summary": "Short summary",
  "medicines": [
    {{
      "name": "Medicine name",
      "dose": "Dose",
      "timing": "Timing",
      "purpose": "Purpose"
    }}
  ],
  "dosage_schedule": "Simple schedule",
  "precautions": [
    "Precaution 1"
  ],
  "simple_explanation": "Easy explanation",
  "caregiver_summary": "Caregiver guidance"
}}

IMPORTANT:
- Return ONLY JSON
- No markdown
- No explanation outside JSON
- If unreadable write:
  "Not clearly visible in image"
"""

    try:
        raw_response = image_prompt(file_bytes, prompt)
        print("RAW GEMINI RESPONSE:")
        print(raw_response)

        result = parse_json_response(raw_response)

    except Exception as e:
        print("GEMINI ERROR:", repr(e))
        return {
            "patient_summary": "Demo mode active",
            "medicines": [],
            "dosage_schedule": "",
            "precautions": [],
            "simple_explanation": str(e),
            "caregiver_summary": "",
            "source": "fallback",
        }

    return {
        "patient_summary": result.get("patient_summary", "Not available"),
        "medicines": result.get("medicines", []),
        "dosage_schedule": result.get("dosage_schedule", "Not available"),
        "precautions": result.get("precautions", []),
        "simple_explanation": result.get("simple_explanation", ""),
        "caregiver_summary": result.get("caregiver_summary", ""),
        "source": "gemini_vision",
    }
