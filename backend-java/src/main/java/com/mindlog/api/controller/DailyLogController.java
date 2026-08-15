package com.mindlog.api.controller;

import com.mindlog.api.dto.DailyLogRequest;
import com.mindlog.api.entity.DailyLog;
import com.mindlog.api.service.DailyLogService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/daily-logs")
@RequiredArgsConstructor
public class DailyLogController {

    private final DailyLogService dailyLogService;

    // ログを保存するエンドポイント
    @PostMapping
    public ResponseEntity<DailyLog> saveLog(Authentication authentication, @RequestBody DailyLogRequest request) {
        // JWTから解析されたEメールを取得
        String email = authentication.getName();
        
        DailyLog savedLog = dailyLogService.saveLog(email, request);
        return ResponseEntity.ok(savedLog);
    }

    // 自分の過去のログをすべて取得するエンドポイント
    @GetMapping
    public ResponseEntity<List<DailyLog>> getLogs(Authentication authentication) {
        String email = authentication.getName();
        List<DailyLog> logs = dailyLogService.getAllLogs(email);
        return ResponseEntity.ok(logs);
    }
}