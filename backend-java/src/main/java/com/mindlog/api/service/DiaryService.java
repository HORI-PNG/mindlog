package com.mindlog.api.service;

import com.mindlog.api.dto.AiAnalyzeRequest;
import com.mindlog.api.dto.AiAnalyzeResponse;
import com.mindlog.api.dto.DiaryRequest;
import com.mindlog.api.entity.Diary;
import com.mindlog.api.entity.User;
import com.mindlog.api.repository.DiaryRepository;
import com.mindlog.api.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

import java.time.LocalDate;
import java.util.List;

@Service
@RequiredArgsConstructor
public class DiaryService {

    private final DiaryRepository diaryRepository;
    private final UserRepository userRepository;
    
    // Lombokの @RequiredArgsConstructor により自動でDI（注入）されます
    private final RestTemplate restTemplate;

    // Python APIのURL
    @Value("${ai.api.url:http://localhost:8000/api/analyze-sentiment}")
    private String aiApiUrl;

    // 日記の保存（新規作成または更新）
    public Diary saveDiary(String userEmail, DiaryRequest request) {
        User user = userRepository.findByEmail(userEmail)
                .orElseThrow(() -> new RuntimeException("ユーザーが見つかりません"));

        Diary diary = diaryRepository.findByUserIdAndDate(user.getId(), request.getDate())
                .orElse(new Diary());

        diary.setUser(user);
        diary.setDate(request.getDate());
        diary.setTitle(request.getTitle());
        diary.setContent(request.getContent());


        try {
            AiAnalyzeRequest aiRequest = new AiAnalyzeRequest(diary.getContent());
            AiAnalyzeResponse aiResponse = restTemplate.postForObject(aiApiUrl, aiRequest, AiAnalyzeResponse.class);
            
            if (aiResponse != null) {
                // 返ってきたスコアとキーワードをエンティティにセット
                diary.setSentimentScore(aiResponse.getEmotionScore());
                if (aiResponse.getKeywords() != null && !aiResponse.getKeywords().isEmpty()) {
                    diary.setKeywords(String.join(",", aiResponse.getKeywords()));
                }
            }
        } catch (Exception e) {
            System.err.println("AI API呼び出しに失敗しました: " + e.getMessage());
            // エラー時も日記自体の保存は継続させる
        }

        // AIの分析結果も含めてデータベースに保存
        return diaryRepository.save(diary);
    }

    // ユーザーの全日記を取得（最新日付順）
    public List<Diary> getAllDiaries(String userEmail) {
        User user = userRepository.findByEmail(userEmail)
                .orElseThrow(() -> new RuntimeException("ユーザーが見つかりません"));
        return diaryRepository.findAllByUserIdOrderByDateDesc(user.getId());
    }

    // 特定の日付の日記を取得
    public Diary getDiaryByDate(String userEmail, LocalDate date) {
        User user = userRepository.findByEmail(userEmail)
                .orElseThrow(() -> new RuntimeException("ユーザーが見つかりません"));
        return diaryRepository.findByUserIdAndDate(user.getId(), date)
                .orElseThrow(() -> new RuntimeException("指定された日付の日記が見つかりません: " + date));
    }
}