import os
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, Field

app = FastAPI(
    title="MindLog AI Python Service",
    description="感情分析および集中力予測を提供するAIマイクロサービス",
    version="1.0.0"
)

# --- 本番専用 CORS設定 ---
# Renderなどの環境変数 FRONTEND_URL に指定されたURL、またはVercelの本番/プレビューURLのみを許可
frontend_url = os.getenv("FRONTEND_URL", "https://mindlog-two.vercel.app")

allowed_origins = [
    frontend_url,
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=allowed_origins,
    allow_origin_regex=r"https://.*\.vercel\.app",  # VercelのすべてのデプロイURL（*.vercel.app）からの通信を許可
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


# --- Pydanticモデル（リクエスト / レスポンスの型定義） ---

class DiaryEntryRequest(BaseModel):
    title: str
    content: str

class SentimentAnalysisResponse(BaseModel):
    sentiment_score: float = Field(..., description="感情スコア (-1.0 ～ 1.0)")
    keywords: list[str] = Field(..., description="抽出された重要キーワード")

class ConditionRequest(BaseModel):
    study_minutes: int
    focus_level: int
    sleep_hours: float
    caffeine_amount: int
    mood: str

class FocusPredictionResponse(BaseModel):
    predicted_focus_level: float = Field(..., description="AIによる予測集中度")


# --- エンドポイント定義 ---

@app.get("/")
def read_root() -> dict[str, str]:
    return {"status": "ok", "message": "MindLog AI Python Service is running"}


@app.post("/api/analyze-sentiment", response_model=SentimentAnalysisResponse)
def analyze_sentiment(entry: DiaryEntryRequest) -> SentimentAnalysisResponse:
    """
    日記のテキストから感情スコアと重要キーワードを抽出するAPI
    """
    try:
        text = entry.content
        
        # モックレスポンス例
        dummy_score = 0.85
        dummy_keywords = ["学習", "Spring Boot", "FastAPI"]

        return SentimentAnalysisResponse(
            sentiment_score=dummy_score,
            keywords=dummy_keywords
        )
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"感情分析に失敗しました: {str(e)}")


@app.post("/api/predict-focus", response_model=FocusPredictionResponse)
def predict_focus(condition: ConditionRequest) -> FocusPredictionResponse:
    """
    生活習慣・学習ログから次回の集中度を予測するAPI
    """
    try:
        predicted_score = round(min(5.0, max(1.0, condition.sleep_hours * 0.5 + condition.focus_level * 0.5)), 2)

        return FocusPredictionResponse(
            predicted_focus_level=predicted_score
        )
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"集中度予測に失敗しました: {str(e)}")