package com.unikraft.domain.product;

import com.unikraft.domain.product.category.Category;
import com.unikraft.domain.product.category.CategoryRepository;
import com.unikraft.domain.product.dto.ProductEditRequest;
import com.unikraft.domain.product.dto.ProductWriteRequest;
import com.unikraft.domain.user.User;
import com.unikraft.domain.user.UserRepository;
import jakarta.persistence.EntityNotFoundException;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

import com.unikraft.domain.product.dto.ProductListResponse;
import com.unikraft.domain.product.dto.ProductMainCardFormResponse;
import com.unikraft.domain.product.dto.ProductViewResponse;

@Service
@Transactional
@RequiredArgsConstructor
public class ProductService {

    private final ProductRepository productRepository;
    private final UserRepository userRepository;
    private final CategoryRepository categoryRepository;

    public List<Product> productListOrderByLike(){
        List<Product> productList = productRepository.findTop4ByOrderByLikeCntDesc();
        return productList;
    }
    public List<Product> productListOrderByRegDate(){
        List<Product> productList = productRepository.findTop4ByOrderByRegDateDesc();
        return productList;
    }

    public List<ProductMainCardFormResponse> getSaleTop4() {
        return productRepository.findAll(Sort.by(Sort.Direction.DESC, "saleCnt"))
                .stream()
                .limit(4)
                .map(ProductMainCardFormResponse::new)
                .collect(Collectors.toList());
    }

    public List<Product> productListByCatId(Integer categoryId){
        List<Product> productList = productRepository.findByCategoryCategoryId(categoryId);
        return productList;
    }

    public Product productInfo(Integer pdId) {
        return productRepository.findById(pdId)
                .orElseThrow(() -> new EntityNotFoundException("상품을 찾을 수 없습니다."));
    }

    public List<ProductListResponse> getAllProductList() {
        return productRepository.findAll().stream()
                .map(ProductListResponse::new)
                .collect(Collectors.toList());
    }

    public List<ProductListResponse> getNew12() {
        return productRepository.findTop12ByOrderByRegDateDesc().stream()
                .map(ProductListResponse::new)
                .collect(Collectors.toList());
    }

    public ProductViewResponse getProductView(Integer pdId) {
        Product product = productRepository.findById(pdId)
                .orElseThrow(() -> new EntityNotFoundException("상품을 찾을 수 없습니다."));
        return new ProductViewResponse(product);
    }

    public List<ProductListResponse> getMyProducts(Integer userId) {
        return productRepository.findByUserUserId(userId).stream()
                .map(ProductListResponse::new)
                .collect(Collectors.toList());
    }

    public ProductViewResponse writeProduct(Integer userId, ProductWriteRequest req) {
        User user = userRepository.findByUserId(userId)
                .orElseThrow(() -> new EntityNotFoundException("사용자를 찾을 수 없습니다."));
        Category category = categoryRepository.findById(Long.valueOf(req.getCategoryId()))
                .orElseThrow(() -> new EntityNotFoundException("카테고리를 찾을 수 없습니다."));
        Product product = Product.builder()
                .pdName(req.getPdName())
                .pdPrice(req.getPdPrice())
                .pdCnt(req.getPdCnt())
                .status(req.getStatus())
                .keyword(req.getKeyword())
                .contents(req.getContents())
                .imgUrl(req.getImgUrl())
                .user(user)
                .category(category)
                .likeCnt(0)
                .saleCnt(0)
                .regDate(LocalDateTime.now())
                .build();
        productRepository.save(product);
        return new ProductViewResponse(product);
    }

    public ProductViewResponse editProduct(Integer pdId, ProductEditRequest req) {
        Product product = productRepository.findById(pdId)
                .orElseThrow(() -> new EntityNotFoundException("상품을 찾을 수 없습니다."));
        Category category = categoryRepository.findById(Long.valueOf(req.getCategoryId()))
                .orElseThrow(() -> new EntityNotFoundException("카테고리를 찾을 수 없습니다."));
        product.setPdName(req.getPdName());
        product.setPdPrice(req.getPdPrice());
        product.setPdCnt(req.getPdCnt());
        product.setStatus(req.getStatus());
        product.setKeyword(req.getKeyword());
        product.setContents(req.getContents());
        product.setImgUrl(req.getImgUrl());
        product.setCategory(category);
        return new ProductViewResponse(product);
    }

    public void deleteProduct(Integer pdId) {
        Product product = productRepository.findById(pdId)
                .orElseThrow(() -> new EntityNotFoundException("상품을 찾을 수 없습니다."));
        productRepository.delete(product);
    }

    public List<ProductListResponse> searchProducts(String categoryId, String searchField, String keyword, String sort) {
        // 카테고리별 조회
        List<Product> products = "ALL".equalsIgnoreCase(categoryId)
                ? productRepository.findAll()
                : productRepository.findByCategoryCategoryId(Integer.parseInt(categoryId));

        // 키워드 필터링
        if (keyword != null && !keyword.trim().isEmpty()) {
            String word = keyword.trim().toLowerCase();
            products = products.stream()
                    .filter(p -> {
                        if ("userName".equals(searchField)) {
                            return p.getUser() != null && p.getUser().getName().toLowerCase().contains(word);
                        }
                        return p.getPdName() != null && p.getPdName().toLowerCase().contains(word);
                    })
                    .collect(Collectors.toList());
        }

        // 정렬
        if ("like".equals(sort)) {
            products.sort((a, b) -> (b.getLikeCnt() == null ? 0 : b.getLikeCnt()) - (a.getLikeCnt() == null ? 0 : a.getLikeCnt()));
        } else if ("sale".equals(sort)) {
            products.sort((a, b) -> (b.getSaleCnt() == null ? 0 : b.getSaleCnt()) - (a.getSaleCnt() == null ? 0 : a.getSaleCnt()));
        } else {
            // reg: 최신순
            products.sort((a, b) -> {
                if (a.getRegDate() == null && b.getRegDate() == null) return 0;
                if (a.getRegDate() == null) return 1;
                if (b.getRegDate() == null) return -1;
                return b.getRegDate().compareTo(a.getRegDate());
            });
        }

        return products.stream().map(ProductListResponse::new).collect(Collectors.toList());
    }
}
