package com.mindlog.api.controller;

import com.mindlog.api.dto.JwtResponse;
import com.mindlog.api.dto.SignInRequest;
import com.mindlog.api.dto.SignUpRequest;
import com.mindlog.api.service.AuthService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/auth")
@RequiredArgsConstructor
public class AuthController {

    private final AuthService authService;

    // サインアップ（会員登録）エンドポイント
    @PostMapping("/signup")
    public ResponseEntity<String> registerUser(@RequestBody SignUpRequest signUpRequest) {
        try {
            authService.register(signUpRequest);
            return ResponseEntity.ok("ユーザー登録が完了しました。");
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    // サインイン（ログイン）エンドポイント
    @PostMapping("/signin")
    public ResponseEntity<JwtResponse> authenticateUser(@RequestBody SignInRequest signInRequest) {
        JwtResponse jwtResponse = authService.login(signInRequest);
        return ResponseEntity.ok(jwtResponse);
    }
}