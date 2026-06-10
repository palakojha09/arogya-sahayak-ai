from fastapi import UploadFile

from services.gemini_service import (
    image_prompt,
    parse_json_response,
)


async def analyze_prescription_file(file: UploadFile):
    """Analyze prescription image."""

    file_bytes = await file.read()

    prompt = """
You are ArogyaSahayak AI.

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

    raw_response = image_prompt(
        file_bytes,
        prompt
    )

    print("\n==============================")
    print("PRESCRIPTION RESPONSE")
    print("==============================")
    print(raw_response)
    print("==============================\n")

    result = parse_json_response(raw_response)

    return {
        "patient_summary": result.get(
            "patient_summary",
            "Not available"
        ),
        "medicines": result.get(
            "medicines",
            []
        ),
        "dosage_schedule": result.get(
            "dosage_schedule",
            "Not available"
        ),
        "precautions": result.get(
            "precautions",
            ["Please follow doctor's advice"]
        ),
        "simple_explanation": result.get(
            "simple_explanation",
            "No simple explanation available."
        ),
        "caregiver_summary": result.get(
            "caregiver_summary",
            "No caregiver summary available."
        ),
        "source": "gemini_vision"
    }