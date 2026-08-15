package com.mindlog.api.dto;

import lombok.Data;
import java.time.LocalDate;

@Data
public class DailyLogRequest {
    private LocalDate date;           // 記録日（例: "2026-08-11"）
    private Integer studyMinutes;     // 学習時間（分）
    private Integer focusLevel;       // 集中度（1〜5）
    private Double sleepHours;        // 睡眠時間
    private Integer caffeineAmount;   // カフェイン摂取量
    private String mood;              // 気分
}