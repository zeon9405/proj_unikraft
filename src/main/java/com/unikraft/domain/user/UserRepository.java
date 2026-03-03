package com.unikraft.domain.user;

import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface UserRepository extends JpaRepository<User, Long> {

    Optional<User> findByLoginId(String loginId);
    boolean existsByLoginId(String loginId);

    List<User> findByRole(Integer role);
    Optional<User> findByUserId(Integer userId);
    Optional<User> findByNameAndEmail(String name, String email);
    Optional<User> findByNameAndLoginIdAndEmail(String name, String loginId, String email);

    Optional<User> findByProviderAndProviderId(String provider, String providerId);
}
