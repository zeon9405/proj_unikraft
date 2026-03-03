package com.unikraft.global.util;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.Map;
import java.util.UUID;

@RestController
public class FileUploadController {

    @PostMapping("/api/upload/product")
    public ResponseEntity<Map<String, String>> uploadProduct(
            @RequestParam("file") MultipartFile file) throws IOException {
        return upload(file, "uploads/product/", "/uploads/product/");
    }

    @PostMapping("/api/upload/user")
    public ResponseEntity<Map<String, String>> uploadUser(
            @RequestParam("file") MultipartFile file) throws IOException {
        return upload(file, "uploads/user/", "/uploads/user/");
    }

    private ResponseEntity<Map<String, String>> upload(MultipartFile file, String dir, String urlPrefix) throws IOException {
        Path uploadPath = Paths.get(dir);
        if (!Files.exists(uploadPath)) {
            Files.createDirectories(uploadPath);
        }

        String originalFilename = file.getOriginalFilename();
        String ext = "";
        if (originalFilename != null && originalFilename.contains(".")) {
            ext = originalFilename.substring(originalFilename.lastIndexOf("."));
        }

        String filename = UUID.randomUUID() + ext;
        Files.copy(file.getInputStream(), uploadPath.resolve(filename));

        return ResponseEntity.ok(Map.of("url", urlPrefix + filename));
    }
}
