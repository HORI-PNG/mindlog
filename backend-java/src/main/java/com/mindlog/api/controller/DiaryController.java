package com.mindlog.api.controller;

import com.mindlog.api.dto.DiaryRequest;
import com.mindlog.api.entity.Diary;
import com.mindlog.api.service.DiaryService;
import lombok.RequiredArgsConstructor;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.util.List;

@RestController
@RequestMapping("/api/diaries")
@RequiredArgsConstructor
public class DiaryController {

    private final DiaryService diaryService;

    // 日記の保存（POST /api/diaries）
    @PostMapping
    public ResponseEntity<Diary> saveDiary(Authentication authentication, @RequestBody DiaryRequest request) {
        String email = authentication.getName();
        Diary savedDiary = diaryService.saveDiary(email, request);
        return ResponseEntity.ok(savedDiary);
    }

    // 全日記の取得（GET /api/diaries）
    @GetMapping
    public ResponseEntity<List<Diary>> getAllDiaries(Authentication authentication) {
        String email = authentication.getName();
        List<Diary> diaries = diaryService.getAllDiaries(email);
        return ResponseEntity.ok(diaries);
    }

    // 特定の日付の日記を取得（GET /api/diaries/2026-08-11）
    @GetMapping("/{date}")
    public ResponseEntity<Diary> getDiaryByDate(
            Authentication authentication,
            @PathVariable @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate date) {
        String email = authentication.getName();
        Diary diary = diaryService.getDiaryByDate(email, date);
        return ResponseEntity.ok(diary);
    }
}