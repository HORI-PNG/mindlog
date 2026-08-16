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
@Table(name = "diaries")
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class Diary {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;

    // ユーザーとの紐付け
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    // 日記の日付
    @Column(nullable = false)
    private LocalDate date;

    // タイトル
    @Column(nullable = false)
    private String title;

    // 本文（長文が入るよう TEXT 型を指定）
    @Column(columnDefinition = "TEXT", nullable = false)
    private String content;

    // AI感情分析スコア（-1.0〜+1.0 など。フェーズ4のPython連携で使用）
    @Column(name = "sentiment_score")
    private Double sentimentScore;

    // AI抽出キーワード（カンマ区切りテキストなど。フェーズ4で使用）
    private String keywords;

    @CreationTimestamp
    @Column(name = "created_at", updatable = false)
    private LocalDateTime createdAt;

    @UpdateTimestamp
    @Column(name = "updated_at")
    private LocalDateTime updatedAt;
}