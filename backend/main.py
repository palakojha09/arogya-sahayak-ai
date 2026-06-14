import os

from fastapi import Body, FastAPI, File, HTTPException, UploadFile, Form
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel

from services.action_service import generate_action_plan
from services.bill_service import analyze_bill_file
from services.gemini_service import ai_test as run_ai_test
from services.language_service import translate_text
from services.prescription_service import analyze_prescription_file

app = FastAPI(
    title="ArogyaSahayak AI Backend",
    description="AI-powered healthcare assistant backend with prescription, bill, translation, and action-plan support.",
    version="1.0.0",
)

frontend_origins = [
    origin.strip()
    for origin in os.getenv("FRONTEND_ORIGINS", "*").split(",")
    if origin.strip()
]
if "*" in frontend_origins:
    allowed_origins = ["*"]
else:
    allowed_origins = frontend_origins

app.add_middleware(
    CORSMiddleware,
    allow_origins=allowed_origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


class TranslateRequest(BaseModel):
    text: str
    target_language: str = "English"


class ActionPlanRequest(BaseModel):
    prescription_analysis: dict
    language: str = "English"


@app.get("/health")
def health_check():
    return {"status": "ok", "service": "ArogyaSahayak AI Backend"}


@app.post("/ai-test")
async def ai_test():
    try:
        return {
            "ok": True,
            "message": "Gemini connectivity check passed.",
            "details": run_ai_test(),
        }
    except Exception as exc:
        raise HTTPException(
            status_code=500, detail=f"Gemini test failed: {str(exc)}"
        ) from exc


@app.post("/analyze-prescription")
async def analyze_prescription(
    file: UploadFile = File(...), language: str = Form("English")
):

    print("LANGUAGE RECEIVED:", language)

    try:
        result = await analyze_prescription_file(file, language)
        return result
    except Exception as exc:
        raise HTTPException(
            status_code=500, detail=f"Prescription analysis failed: {str(exc)}"
        ) from exc


@app.post("/analyze-bill")
async def analyze_bill(file: UploadFile = File(...), language: str = Form("English")):
    try:
        result = await analyze_bill_file(file, language)
        return result
    except Exception as exc:
        raise HTTPException(
            status_code=500, detail=f"Bill analysis failed: {str(exc)}"
        ) from exc


@app.post("/translate")
async def translate(request: TranslateRequest):
    try:
        return translate_text(request.text, request.target_language)
    except Exception as exc:
        raise HTTPException(
            status_code=500, detail=f"Translation failed: {str(exc)}"
        ) from exc


@app.post("/generate-action-plan")
async def generate_plan(request: ActionPlanRequest = Body(...)):
    try:
        return generate_action_plan(
            request.prescription_analysis,
            request.language,
        )
    except Exception as exc:
        raise HTTPException(
            status_code=500, detail=f"Action-plan generation failed: {str(exc)}"
        ) from exc
