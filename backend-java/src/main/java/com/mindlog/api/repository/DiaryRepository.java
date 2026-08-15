package com.mindlog.api.repository;

import com.mindlog.api.entity.Diary;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Repository
public interface DiaryRepository extends JpaRepository<Diary, UUID> {

    // ログインユーザーの全日記を取得（カレンダーやタイムライン表示用）
    List<Diary> findAllByUserIdOrderByDateDesc(UUID userId);

    // 特定の日付の日記を取得
    Optional<Diary> findByUserIdAndDate(UUID userId, LocalDate date);
}