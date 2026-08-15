package com.mindlog.api.service;

import com.mindlog.api.dto.DailyLogRequest;
import com.mindlog.api.entity.DailyLog;
import com.mindlog.api.entity.User;
import com.mindlog.api.repository.DailyLogRepository;
import com.mindlog.api.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class DailyLogService {

    private final DailyLogRepository dailyLogRepository;
    private final UserRepository userRepository;

    // ログの保存（新規作成または更新）
    public DailyLog saveLog(String userEmail, DailyLogRequest request) {
        // 1. Eメールからユーザー情報を取得
        User user = userRepository.findByEmail(userEmail)
                .orElseThrow(() -> new RuntimeException("ユーザーが見つかりません"));

        // 2. そのユーザーの「指定した日付」の記録が既にあるか探す
        DailyLog dailyLog = dailyLogRepository.findByUserIdAndDate(user.getId(), request.getDate())
                .orElse(new DailyLog()); // なければ新しい空のDailyLogを用意する

        // 3. データをセットする
        dailyLog.setUser(user);
        dailyLog.setDate(request.getDate());
        dailyLog.setStudyMinutes(request.getStudyMinutes());
        dailyLog.setFocusLevel(request.getFocusLevel());
        dailyLog.setSleepHours(request.getSleepHours());
        dailyLog.setCaffeineAmount(request.getCaffeineAmount());
        dailyLog.setMood(request.getMood());

        // 4. データベースに保存
        return dailyLogRepository.save(dailyLog);
    }

    // ログイン中のユーザーの全ログを取得（将来グラフ表示などに使います）
    public List<DailyLog> getAllLogs(String userEmail) {
        User user = userRepository.findByEmail(userEmail)
                .orElseThrow(() -> new RuntimeException("ユーザーが見つかりません"));
        return dailyLogRepository.findAllByUserId(user.getId());
    }
}