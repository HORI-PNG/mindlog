from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, Field
from transformers import pipeline
import joblib
import fugashi
import numpy as np

# --- アプリケーション設定 ---
app = FastAPI(title="MindLog AI API", version="1.0.0")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"], # 本番環境ではフロントエンドのURLに変更
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# --- AIモデルのロード ---
print("AIモデルを読み込み中...")
# 1. 感情分析モデル
sentiment_analyzer = pipeline(
    "sentiment-analysis",
    model="koheiduck/bert-japanese-finetuned-sentiment",
    device=-1
)
# 2. 集中力予測モデル (先ほど学習したscikit-learnモデル)
try:
    focus_model = joblib.load('focus_model.pkl')
except FileNotFoundError:
    focus_model = None
    print("警告: focus_model.pkl が見つかりません。train_model.py を実行してください。")

# 3. 形態素解析ターガー (キーワード抽出用)
tagger = fugashi.Tagger()

# --- データモデル ---
class DiaryEntry(BaseModel):
    text: str = Field(..., min_length=1)

class FocusData(BaseModel):
    sleep_hours: float = Field(..., ge=0, le=24)
    caffeine_mg: int = Field(..., ge=0)
    emotion_score: float = Field(...)

# --- エンドポイント ---

@app.post("/api/analyze-sentiment")
def analyze_sentiment(entry: DiaryEntry) -> dict:
    """日記から感情スコアと重要キーワードを抽出します"""
    
    # 1. 感情分析
    result = sentiment_analyzer(entry.text)[0]
    label = result["label"]
    confidence = result["score"]
    
    if label == "POSITIVE":
        emotion_score = confidence
    elif label == "NEGATIVE":
        emotion_score = -confidence
    else:
        emotion_score = 0.0

    # 2. キーワード抽出 (名詞のみを抽出)
    keywords = []
    for word in tagger(entry.text):
        # 名詞であり、数詞や代名詞ではないものを抽出
        if word.feature.pos1 == "名詞" and word.feature.pos2 not in ["数詞", "代名詞", "非自立"]:
            keywords.append(word.surface)
    
    # 重複を削除して上位5件を返す
    unique_keywords = list(dict.fromkeys(keywords))[:5]

    return {
        "emotion_score": round(emotion_score, 4),
        "keywords": unique_keywords
    }

@app.post("/api/predict-focus")
def predict_focus(data: FocusData) -> dict:
    """学習済み機械学習モデルを使用して集中力を予測します"""
    if focus_model is None:
        return {"error": "モデルがロードされていません"}

    # 入力データをモデルの形式に変換
    input_data = np.array([[data.sleep_hours, data.caffeine_mg, data.emotion_score]])
    
    # モデルによる予測の実行
    prediction = focus_model.predict(input_data)[0]
    
    return {
        "predicted_focus_percentage": round(prediction, 1)
    }