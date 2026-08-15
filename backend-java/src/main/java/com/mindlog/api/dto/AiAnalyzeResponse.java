package com.mindlog.api.dto;

import java.util.List;
import com.fasterxml.jackson.annotation.JsonProperty;

public class AiAnalyzeResponse {
    
    @JsonProperty("emotion_score")
    private Double emotionScore;
    
    private List<String> keywords;

    // Getters and Setters
    public Double getEmotionScore() {
        return emotionScore;
    }

    public void setEmotionScore(Double emotionScore) {
        this.emotionScore = emotionScore;
    }

    public List<String> getKeywords() {
        return keywords;
    }

    public void setKeywords(List<String> keywords) {
        this.keywords = keywords;
    }
}