package com.mindlog.api.repository;

import com.mindlog.api.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;
import java.util.UUID;

@Repository
public interface UserRepository extends JpaRepository<User, UUID> {
    
    // Eメールを使ってユーザーを検索するためのメソッド（サインイン時に使用します）
    Optional<User> findByEmail(String email);
    
    // Eメールがすでに登録されているかチェックするメソッド（サインアップ時に使用します）
    boolean existsByEmail(String email);
}