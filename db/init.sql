-- UUID拡張機能の有効化
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 1. users (ユーザー情報)
CREATE TABLE users (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    username VARCHAR(50) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 2. daily_records (日次記録)
CREATE TABLE daily_records (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    record_date DATE NOT NULL,
    study_time_mins INTEGER NOT NULL,
    concentration INTEGER CHECK (concentration >= 1 AND concentration <= 5),
    sleep_hours NUMERIC(4,1),
    caffeine_intake VARCHAR(50),
    mood_emoji VARCHAR(20),
    UNIQUE(user_id, record_date)
);

-- 3. tasks (タスク管理)
CREATE TABLE tasks (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    target_date DATE NOT NULL,
    content VARCHAR(255) NOT NULL,
    is_completed BOOLEAN DEFAULT FALSE
);

-- 4. diaries (日記データ)
CREATE TABLE diaries (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    diary_date DATE NOT NULL,
    title VARCHAR(100) NOT NULL,
    content TEXT NOT NULL,
    UNIQUE(user_id, diary_date)
);

-- 5. ai_insights (AI分析インサイト)
CREATE TABLE ai_insights (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    target_date DATE NOT NULL,
    emotion_score NUMERIC(5,2),
    concentration_pred NUMERIC(4,2),
    next_review_time TIMESTAMP WITH TIME ZONE,
    UNIQUE(user_id, target_date)
);

-- 6. diary_keywords (抽出キーワード)
CREATE TABLE diary_keywords (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    diary_id UUID NOT NULL REFERENCES diaries(id) ON DELETE CASCADE,
    keyword VARCHAR(50) NOT NULL
);