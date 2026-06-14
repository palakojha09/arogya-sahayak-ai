from io import BytesIO

from fastapi import UploadFile
from pypdf import PdfReader

from services.gemini_service import (
    image_prompt,
    parse_json_response,
    text_prompt,
)


async def analyze_bill_file(file: UploadFile, language: str = "English"):
    """Analyze a bill image or PDF and return a simple charge breakdown."""
    file_bytes = await file.read()
    file_name = (file.filename or "").lower()
    content_type = (file.content_type or "").lower()

    if file_name.endswith(".pdf") or "pdf" in content_type:
        try:
            reader = PdfReader(BytesIO(file_bytes))
            text_parts = [page.extract_text() or "" for page in reader.pages]
            bill_text = "\n".join(text_parts)

            prompt = f"""
You are ArogyaSahayak AI. 

IMPORTANT:
Return ALL patient-facing text in {language}.

This includes:
- bill_summary
- explanations
- expensive_components
- simple_explanation

Charge names may remain in English if required.

Explain this hospital bill in simple language for a patient.
Return ONLY valid JSON with these keys:
{{
  "bill_summary": "Short summary of the bill in simple language.",
  "cost_categories": [{{"category": "Consultation", "amount": "1000", "explanation": "Why it is charged"}}],
  "expensive_components": ["List of costly or unusual charges"],
  "simple_explanation": "Plain-language explanation of the bill." 
}}

Bill text:
{bill_text}
"""
            raw_response = text_prompt(prompt)
            result = parse_json_response(raw_response)

            return {
                "bill_summary": result.get("bill_summary", "Bill summary unavailable."),
                "cost_categories": result.get("cost_categories", []),
                "expensive_components": result.get("expensive_components", []),
                "simple_explanation": result.get(
                    "simple_explanation", "No plain-language explanation available."
                ),
                "source": "pdf_text",
            }
        except Exception as exc:
            raise RuntimeError(f"Unable to read PDF bill: {str(exc)}") from exc

    prompt = f"""
You are ArogyaSahayak AI.

Return all explanations and summaries in {language}.

Analyze the uploaded bill image and explain it in simple language.

Return ONLY valid JSON with these keys:
{
        "bill_summary": "Short summary of the bill in simple language.",
  "cost_categories": [{
            "category": "Medicine", "amount": "500", "explanation": "Why this charge appears"}],
  "expensive_components": ["Expensive or unusual charges"],
  "simple_explanation": "Plain-language explanation of what the patient should understand."
}
"""

    try:
        raw_response = image_prompt(file_bytes, prompt)
        result = parse_json_response(raw_response)

    except Exception:
        return {
            "bill_summary": "Demo mode active",
            "cost_categories": [
                {
                    "category": "Consultation",
                    "amount": "500",
                    "explanation": "Doctor consultation fee",
                },
                {
                    "category": "Medicines",
                    "amount": "1200",
                    "explanation": "Prescribed medications",
                },
            ],
            "expensive_components": ["Room charges"],
            "simple_explanation": "AI service unavailable. Showing sample bill analysis.",
            "source": "fallback",
        }

    return {
        "bill_summary": result.get("bill_summary", "Bill summary unavailable."),
        "cost_categories": result.get("cost_categories", []),
        "expensive_components": result.get("expensive_components", []),
        "simple_explanation": result.get(
            "simple_explanation", "No plain-language explanation available."
        ),
        "source": "gemini_vision",
    }
