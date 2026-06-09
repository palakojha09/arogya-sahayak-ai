from fastapi import UploadFile

from services.gemini_service import image_prompt, parse_json_response


async def analyze_prescription_file(file: UploadFile):
    """Analyze a prescription image and return structured healthcare guidance."""
    file_bytes = await file.read()

    prompt = """
You are ArogyaSahayak AI, an assistant for patients and caregivers.
Read the prescription image carefully and return ONLY valid JSON.

Required fields:
{
  "patient_summary": "Short summary of the patient condition or the prescription context in simple language.",
  "medicines": [
    {
      "name": "Medicine name",
      "dose": "Dose and strength",
      "timing": "When to take it",
      "purpose": "Why it is used"
    }
  ],
  "dosage_schedule": "Simple schedule explanation.",
  "precautions": ["Important safety instructions"],
  "simple_explanation": "Simple plain-language explanation for the patient.",
  "caregiver_summary": "Short summary for a caregiver or family member."
}

If any value is unclear, write 'Not clearly visible in the image' instead of guessing.
"""

    raw_response = image_prompt(file_bytes, prompt)
    result = parse_json_response(raw_response)

    return {
        "patient_summary": result.get("patient_summary", "Not available"),
        "medicines": result.get("medicines", []),
        "dosage_schedule": result.get("dosage_schedule", "Not available"),
        "precautions": result.get("precautions", ["Please follow doctor's advice"]),
        "simple_explanation": result.get("simple_explanation", "No simple explanation available."),
        "caregiver_summary": result.get("caregiver_summary", "No caregiver summary available."),
        "source": "gemini_vision",
    }
