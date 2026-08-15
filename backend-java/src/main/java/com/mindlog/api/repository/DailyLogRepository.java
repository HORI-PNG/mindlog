package com.mindlog.api.repository;

import com.mindlog.api.entity.DailyLog;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Repository
public interface DailyLogRepository extends JpaRepository<DailyLog, UUID> {
    
    // ① 特定のユーザーのすべてのログを取得する（履歴やグラフ表示用）
    List<DailyLog> findAllByUserId(UUID userId);
    
    // ② 特定のユーザーの、特定の日付のログを取得する（その日の記録が既にあるかチェック用）
    Optional<DailyLog> findByUserIdAndDate(UUID userId, LocalDate date);
}