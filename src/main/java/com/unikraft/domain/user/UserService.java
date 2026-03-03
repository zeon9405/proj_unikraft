package com.unikraft.domain.user;

import com.unikraft.domain.product.Product;
import com.unikraft.domain.product.ProductRepository;
import com.unikraft.domain.product.dto.ProductMainCardFormResponse;
import com.unikraft.domain.user.dto.FindIdRequest;
import com.unikraft.domain.user.dto.FindPwRequest;
import com.unikraft.domain.user.dto.JoinRequest;
import com.unikraft.domain.user.dto.LoginRequest;
import com.unikraft.domain.user.dto.LoginResponse;
import com.unikraft.domain.user.dto.MasterListResponse;
import com.unikraft.domain.user.dto.MasterViewResponse;
import com.unikraft.domain.user.dto.UpdateProfileRequest;
import com.unikraft.domain.user.dto.UserProfileResponse;
import com.unikraft.global.security.jwt.JwtTokenProvider;
import jakarta.persistence.EntityNotFoundException;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.Comparator;
import java.util.List;
import java.util.stream.Collectors;

@Service
@Transactional
@RequiredArgsConstructor
public class UserService {

    private final UserRepository userRepository;
    private final ProductRepository productRepository;
    private final BCryptPasswordEncoder passwordEncoder;
    private final JwtTokenProvider jwtTokenProvider;

    public LoginResponse login(LoginRequest req) {
        return userRepository.findByLoginId(req.getLoginId())
                .filter(u -> passwordEncoder.matches(req.getPw(), u.getPw()))
                .map(u -> {
                    String token = jwtTokenProvider.createToken(u.getUserId(), u.getRole());
                    return new LoginResponse(u.getUserId(), u.getName(), u.getRole(), token);
                })
                .orElse(null);
    }

    public void join(JoinRequest req) {
        User user = User.builder()
                .name(req.getName())
                .loginId(req.getLoginId())
                .pw(passwordEncoder.encode(req.getPw()))
                .email(req.getEmail())
                .tel(req.getTel())
                .role(req.getRole() != null ? req.getRole() : 0)
                .major(req.getMajor())
                .brand(req.getBrand())
                .contents(req.getContents())
                .imgUrl(req.getImgUrl())
                .build();
        userRepository.save(user);
    }

    public boolean checkLoginId(String loginId) {
        return userRepository.existsByLoginId(loginId);
    }

    public List<MasterListResponse> getMasters(String sort) {
        List<User> sellers = userRepository.findByRole(1);

        List<MasterListResponse> list = sellers.stream()
                .map(user -> {
                    List<Product> products = productRepository.findByUserUserId(user.getUserId());
                    int productCount = products.size();
                    int totalSale = products.stream()
                            .mapToInt(p -> p.getSaleCnt() == null ? 0 : p.getSaleCnt())
                            .sum();
                    return new MasterListResponse(user, productCount, totalSale);
                })
                .collect(Collectors.toList());

        if ("sale".equals(sort)) {
            list.sort((a, b) -> b.getTotalSaleCnt() - a.getTotalSaleCnt());
        } else {
            // reg: userId 오름차순 (등록순)
            list.sort(Comparator.comparingInt(MasterListResponse::getUserId));
        }

        return list;
    }

    public String findId(FindIdRequest req) {
        return userRepository.findByNameAndEmail(req.getName(), req.getEmail())
                .map(u -> {
                    String id = u.getLoginId();
                    if (id.length() <= 3) return id.charAt(0) + "*".repeat(id.length() - 1);
                    return id.substring(0, 3) + "*".repeat(id.length() - 3);
                })
                .orElse(null);
    }

    public String resetPw(FindPwRequest req) {
        return userRepository.findByNameAndLoginIdAndEmail(req.getName(), req.getLoginId(), req.getEmail())
                .map(u -> {
                    String tempPw = "temp" + (int)(Math.random() * 9000 + 1000);
                    u.setPw(passwordEncoder.encode(tempPw));
                    userRepository.save(u);
                    return tempPw;  // 사용자에게는 원문 임시 비밀번호를 반환
                })
                .orElse(null);
    }

    public UserProfileResponse getProfile(Integer userId) {
        User user = userRepository.findByUserId(userId)
                .orElseThrow(() -> new EntityNotFoundException("사용자를 찾을 수 없습니다."));
        return new UserProfileResponse(user);
    }

    public void updateProfile(Integer userId, UpdateProfileRequest req) {
        User user = userRepository.findByUserId(userId)
                .orElseThrow(() -> new EntityNotFoundException("사용자를 찾을 수 없습니다."));
        if (req.getName() != null && !req.getName().isBlank()) user.setName(req.getName());
        if (req.getEmail() != null && !req.getEmail().isBlank()) user.setEmail(req.getEmail());
        if (req.getTel() != null && !req.getTel().isBlank()) user.setTel(req.getTel());
        if (req.getPw() != null && !req.getPw().isBlank()) user.setPw(passwordEncoder.encode(req.getPw()));
        if (req.getMajor() != null) user.setMajor(req.getMajor());
        if (req.getBrand() != null) user.setBrand(req.getBrand());
        if (req.getContents() != null) user.setContents(req.getContents());
        if (req.getImgUrl() != null && !req.getImgUrl().isBlank()) user.setImgUrl(req.getImgUrl());
        userRepository.save(user);
    }

    public MasterViewResponse getMasterView(Integer userId) {
        User user = userRepository.findByUserId(userId)
                .orElseThrow(() -> new EntityNotFoundException("장인을 찾을 수 없습니다."));

        List<Product> products = productRepository.findByUserUserId(userId);
        int productCount = products.size();
        int totalSale = products.stream()
                .mapToInt(p -> p.getSaleCnt() == null ? 0 : p.getSaleCnt())
                .sum();

        List<ProductMainCardFormResponse> top4 = products.stream()
                .sorted((a, b) -> (b.getSaleCnt() == null ? 0 : b.getSaleCnt())
                        - (a.getSaleCnt() == null ? 0 : a.getSaleCnt()))
                .limit(4)
                .map(ProductMainCardFormResponse::new)
                .collect(Collectors.toList());

        return new MasterViewResponse(user, productCount, totalSale, top4);
    }
}
