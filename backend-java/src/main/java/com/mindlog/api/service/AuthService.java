package com.mindlog.api.service;

import com.mindlog.api.dto.JwtResponse;
import com.mindlog.api.dto.SignInRequest;
import com.mindlog.api.dto.SignUpRequest;
import com.mindlog.api.entity.User;
import com.mindlog.api.repository.UserRepository;
import com.mindlog.api.security.JwtUtils;
import lombok.RequiredArgsConstructor;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class AuthService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtUtils jwtUtils;
    private final AuthenticationManager authenticationManager;

    // 会員登録処理
    public void register(SignUpRequest request) {
        if (userRepository.existsByEmail(request.getEmail())) {
            throw new IllegalArgumentException("このEメールはすでに登録されています。");
        }

        User user = User.builder()
                .email(request.getEmail())
                // 受け取った生のパスワードをBCryptで強力に暗号化してから保存します
                .password(passwordEncoder.encode(request.getPassword()))
                .username(request.getUsername())
                .build();

        userRepository.save(user);
    }

    // ログイン処理
    public JwtResponse login(SignInRequest request) {
        // 1. パスワードが正しいかチェック（間違っていればここで自動的にエラー弾きになります）
        authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(request.getEmail(), request.getPassword())
        );

        // 2. 認証に成功したらJWTトークンを発行する
        String token = jwtUtils.generateJwtToken(request.getEmail());

        return JwtResponse.builder()
                .token(token)
                .build();
    }
}