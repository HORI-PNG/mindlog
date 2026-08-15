package com.mindlog.api.controller;

import com.mindlog.api.dto.ReviewResponseDto;
import com.mindlog.api.service.ReviewService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/reviews")
@RequiredArgsConstructor
public class ReviewController {

    private final ReviewService reviewService;

    // 復習推奨時期に達した項目を取得するエンドポイント
    @GetMapping("/pending")
    public ResponseEntity<List<ReviewResponseDto>> getPendingReviews(Authentication authentication) {
        // ログイン中のユーザーのメールアドレスを取得
        String email = authentication.getName();
        
        // Serviceを呼び出して復習リストを取得
        List<ReviewResponseDto> pendingReviews = reviewService.getPendingReviews(email);
        
        return ResponseEntity.ok(pendingReviews);
    }
}