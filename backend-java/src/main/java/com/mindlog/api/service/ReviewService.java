package com.mindlog.api.service;

import com.mindlog.api.dto.ReviewResponseDto;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.util.List;
import java.util.UUID;

@Service
public class ReviewService {

    public List<ReviewResponseDto> getPendingReviews(String email) {
        // ※本来はここでデータベースを検索し、復習タイミングが今日に該当する日記やログを取得します。
        // 今回は連携テストのため、ダミーの復習データを2件返します。
        return List.of(
            new ReviewResponseDto(
                UUID.randomUUID().toString(), 
                "JavaとPythonの連携テスト", 
                LocalDate.now().toString()
            ),
            new ReviewResponseDto(
                UUID.randomUUID().toString(), 
                "Spring SecurityのCORS設定", 
                LocalDate.now().toString()
            )
        );
    }
}