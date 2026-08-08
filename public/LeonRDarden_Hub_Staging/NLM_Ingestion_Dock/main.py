# main.py - The Convergence Engine
from fastapi import FastAPI, Request, HTTPException
from fastapi.staticfiles import StaticFiles
from fastapi.templating import Jinja2Templates
import firebase_admin
from firebase_admin import credentials, firestore

# Initialize Firebase Admin SDK (Bypasses client security rules)
cred = credentials.Certificate("path/to/serviceAccountKey.json")
firebase_admin.initialize_app(cred)
db = firestore.client()

app = FastAPI()

# Mount static assets and templates
app.mount("/static", StaticFiles(directory="static"), name="static")
templates = Jinja2Templates(directory="templates")

@app.get("/always-audit-ready-part-1")
async def serve_vip_module(request: Request):
    return templates.TemplateResponse("video_workbook.html", {"request": request})

@app.post("/grade-quiz")
async def grade_module_quiz(user_id: str, quiz_id: str, payload: dict):
    user_guesses = payload.get("answers", {})
    user_ref = db.collection("users").document(user_id)
    user_data = user_ref.get().to_dict()
    
    # 1. Check attempts remaining
    if user_data.get("attempts_remaining", 0) <= 0:
        raise HTTPException(status_code=403, detail="No attempts remaining!")

    # 2. Securely fetch answer key bypassing security rules
    secure_answers = db.collection("quizzes").document(quiz_id).collection("secure").document("answers").get().to_dict()
    
    # 3. Grade the VIP Quiz
    score = sum(1 for q_id, ans in secure_answers.items() if user_guesses.get(q_id) == ans)
    passed = (score / len(secure_answers)) >= 0.80 
    
    # 4. Update the user profile securely
    @firestore.transactional
    def update_user_record(transaction, user_ref):
        transaction.update(user_ref, {
            "attempts_remaining": firestore.Increment(-1),
            "last_score": score,
            "passed_module": passed
        })
        
    update_user_record(db.transaction(), user_ref)
    return {"passed": passed, "score": score, "attempts_left": user_data["attempts_remaining"] - 1}