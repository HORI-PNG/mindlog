package com.mindlog.api.dto;

import lombok.Data;
import java.time.LocalDate;

@Data
public class DiaryRequest {
    private LocalDate date;    // 日記の日付（例: "2026-08-11"）
    private String title;     // タイトル
    private String content;   // 本文
}