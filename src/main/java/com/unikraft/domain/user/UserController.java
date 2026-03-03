package com.unikraft.domain.user;

import com.unikraft.domain.user.dto.FindIdRequest;
import com.unikraft.domain.user.dto.FindPwRequest;
import com.unikraft.domain.user.dto.JoinRequest;
import com.unikraft.domain.user.dto.LoginRequest;
import com.unikraft.domain.user.dto.LoginResponse;
import com.unikraft.domain.user.dto.MasterListResponse;
import com.unikraft.domain.user.dto.MasterViewResponse;
import com.unikraft.domain.user.dto.UpdateProfileRequest;
import com.unikraft.domain.user.dto.UserProfileResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/user")
public class UserController {

    private final UserService userService;

    @PostMapping("/login")
    public ResponseEntity<LoginResponse> login(@RequestBody LoginRequest req) {
        LoginResponse response = userService.login(req);
        if (response == null) {
            return ResponseEntity.status(401).build();
        }
        return ResponseEntity.ok(response);
    }

    @PostMapping("/join")
    public ResponseEntity<Void> join(@RequestBody JoinRequest req) {
        userService.join(req);
        return ResponseEntity.ok().build();
    }

    @GetMapping("/check-id/{loginId}")
    public ResponseEntity<Boolean> checkLoginId(@PathVariable String loginId) {
        return ResponseEntity.ok(userService.checkLoginId(loginId));
    }

    @PostMapping("/find-id")
    public ResponseEntity<String> findId(@RequestBody FindIdRequest req) {
        String maskedId = userService.findId(req);
        if (maskedId == null) return ResponseEntity.status(404).build();
        return ResponseEntity.ok(maskedId);
    }

    @PostMapping("/find-pw")
    public ResponseEntity<String> findPw(@RequestBody FindPwRequest req) {
        String tempPw = userService.resetPw(req);
        if (tempPw == null) return ResponseEntity.status(404).build();
        return ResponseEntity.ok(tempPw);
    }

    @GetMapping("/profile/{userId}")
    public ResponseEntity<UserProfileResponse> getProfile(@PathVariable Integer userId) {
        return ResponseEntity.ok(userService.getProfile(userId));
    }

    @PutMapping("/profile/{userId}")
    public ResponseEntity<Void> updateProfile(@PathVariable Integer userId,
                                               @RequestBody UpdateProfileRequest req) {
        userService.updateProfile(userId, req);
        return ResponseEntity.ok().build();
    }

    @GetMapping("/masters")
    public ResponseEntity<List<MasterListResponse>> getMasters(
            @RequestParam(defaultValue = "sale") String sort) {
        return ResponseEntity.ok(userService.getMasters(sort));
    }

    @GetMapping("/master/{userId}")
    public ResponseEntity<MasterViewResponse> getMasterView(@PathVariable Integer userId) {
        return ResponseEntity.ok(userService.getMasterView(userId));
    }
}
