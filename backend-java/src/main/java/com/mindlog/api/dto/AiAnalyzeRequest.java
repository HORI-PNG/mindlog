package com.mindlog.api.dto;

public class AiAnalyzeRequest {
    private String text;

    public AiAnalyzeRequest(String text) {
        this.text = text;
    }

    public String getText() {
        return text;
    }

    public void setText(String text) {
        this.text = text;
    }
}