package com.mindlog.api.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.UUID;

@Entity
@Table(name = "daily_logs")
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class DailyLog {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;

    // この記録が「どのユーザーのものか」を紐づける設定
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    // 記録した日付（例: 2026-08-11）
    @Column(nullable = false)
    private LocalDate date;

    // 学習時間（分単位などを想定）
    @Column(name = "study_minutes", nullable = false)
    private Integer studyMinutes;

    // 集中度（1〜5の星評価）
    @Column(name = "focus_level", nullable = false)
    private Integer focusLevel;

    // 睡眠時間
    @Column(name = "sleep_hours")
    private Double sleepHours;

    // カフェイン摂取量（杯数やmg）
    @Column(name = "caffeine_amount")
    private Integer caffeineAmount;

    // 気分（例: "Good", "Bad" など）
    private String mood;

    @CreationTimestamp
    @Column(name = "created_at", updatable = false)
    private LocalDateTime createdAt;

    @UpdateTimestamp
    @Column(name = "updated_at")
    private LocalDateTime updatedAt;
}