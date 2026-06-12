from fastapi import UploadFile

from services.gemini_service import (
    image_prompt,
    parse_json_response,
)


async def analyze_prescription_file(file: UploadFile, language: str = "English"):
    """Analyze prescription image."""

    file_bytes = await file.read()

    prompt = """
You are ArogyaSahayak AI.

Return all summaries, explanations, schedules,
and caregiver guidance in {language}.

Analyze the prescription image carefully.

Return ONLY valid JSON.

{
  "patient_summary": "Short summary",
  "medicines": [
    {
      "name": "Medicine name",
      "dose": "Dose",
      "timing": "Timing",
      "purpose": "Purpose"
    }
  ],
  "dosage_schedule": "Simple schedule",
  "precautions": [
    "Precaution 1"
  ],
  "simple_explanation": "Easy explanation",
  "caregiver_summary": "Caregiver guidance"
}

IMPORTANT:
- Return ONLY JSON
- No markdown
- No explanation outside JSON
- If unreadable write:
  "Not clearly visible in image"
"""

    try:
        raw_response = image_prompt(file_bytes, prompt)

        result = parse_json_response(raw_response)

    except Exception:
        return {
            "patient_summary": "Demo mode active",
            "medicines": [
                {
                    "name": "Sample Medicine",
                    "dose": "1 tablet",
                    "timing": "After food",
                    "purpose": "Demonstration",
                }
            ],
            "dosage_schedule": "Take medicine as prescribed.",
            "precautions": ["Follow doctor advice"],
            "simple_explanation": "AI service temporarily unavailable. Showing demo data.",
            "caregiver_summary": "Ensure medicines are taken on time.",
            "source": "fallback",
        }

    return {
        "patient_summary": result.get("patient_summary", "Not available"),
        "medicines": result.get("medicines", []),
        "dosage_schedule": result.get("dosage_schedule", "Not available"),
        "precautions": result.get("precautions", ["Please follow doctor's advice"]),
        "simple_explanation": result.get(
            "simple_explanation", "No simple explanation available."
        ),
        "caregiver_summary": result.get(
            "caregiver_summary", "No caregiver summary available."
        ),
        "source": "gemini_vision",
    }
