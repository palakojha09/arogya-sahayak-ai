# ArogyaSahayak Backend API

## GET /health
Returns backend status.

## POST /analyze-prescription
Input: Image file
Output:
- patient_summary
- medicines
- dosage_schedule
- precautions
- caregiver_summary

## POST /analyze-bill
Input: Bill image/PDF
Output:
- bill_summary
- cost_categories
- expensive_components

## POST /generate-action-plan
Input:
{
  "prescription_analysis": {}
}

Output:
{
  "reminders": [],
  "caregiver_actions": [],
  "next_steps": []
}

## POST /translate
Input:
{
  "text": "...",
  "target_language": "Hindi"
}