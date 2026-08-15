# train_model.py
import pandas as pd
from sklearn.ensemble import RandomForestRegressor
import joblib
import numpy as np

print("ダミーデータを生成中...")
# 1. 学習用のダミーデータを作成 (睡眠時間, カフェイン, 感情スコア -> 集中力)
np.random.seed(42)
n_samples = 1000

sleep_hours = np.random.normal(7.0, 1.5, n_samples)
caffeine_mg = np.random.uniform(0, 400, n_samples)
emotion_score = np.random.uniform(-1.0, 1.0, n_samples)

# 集中力の計算（AIに学習させるための「正解データ」のルール）
focus = 50 + (sleep_hours - 7.5)**2 * -2 + (caffeine_mg / 100) * 5 + emotion_score * 10
focus += np.random.normal(0, 5, n_samples) # ノイズを追加
focus = np.clip(focus, 0, 100) # 0〜100に収める

df = pd.DataFrame({
    'sleep_hours': sleep_hours,
    'caffeine_mg': caffeine_mg,
    'emotion_score': emotion_score,
    'focus_percentage': focus
})

# 2. モデルの学習
print("AIモデル(RandomForest)を学習中...")
X = df[['sleep_hours', 'caffeine_mg', 'emotion_score']]
y = df['focus_percentage']

model = RandomForestRegressor(n_estimators=100, random_state=42)
model.fit(X, y)

# 3. 学習済みモデルをファイルに保存
joblib.dump(model, 'focus_model.pkl')
print("学習完了！ 'focus_model.pkl' を保存しました。")