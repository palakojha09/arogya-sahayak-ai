import json

from services.gemini_service import parse_json_response, text_prompt


def generate_action_plan(prescription_analysis: dict):
    """Generate reminders, caregiver actions, and next-step guidance from prescription data."""
    prompt = f"""
You are ArogyaSahayak AI. Based on the prescription analysis, create a simple action plan for a patient and caregiver.
Return ONLY valid JSON with these keys:
{{
  "reminders": ["Reminder 1", "Reminder 2"],
  "caregiver_actions": ["Action 1", "Action 2"],
  "next_steps": ["Next step 1", "Next step 2"],
  "support_note": "Short note about safety or follow-up."
}}

Prescription analysis:
{json.dumps(prescription_analysis, indent=2)}
"""

    raw_response = text_prompt(prompt)
    result = parse_json_response(raw_response)

    return {
        "reminders": result.get("reminders", ["Take medicines on time", "Keep a note of side effects"]),
        "caregiver_actions": result.get("caregiver_actions", ["Monitor the patient", "Confirm medicine timings"]),
        "next_steps": result.get("next_steps", ["Follow the doctor’s advice", "Seek help if symptoms worsen"]),
        "support_note": result.get("support_note", "Please consult a qualified doctor for medical concerns."),
        "source": "gemini_text",
    }
