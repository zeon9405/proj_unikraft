package com.unikraft.domain.product;

import com.unikraft.domain.product.dto.ProductEditRequest;
import com.unikraft.domain.product.dto.ProductListResponse;
import com.unikraft.domain.product.dto.ProductMainCardFormResponse;
import com.unikraft.domain.product.dto.ProductViewResponse;
import com.unikraft.domain.product.dto.ProductWriteRequest;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@RestController
//@NoArgsConstructor
@RequiredArgsConstructor
@RequestMapping("/api/product")
public class ProductController {

    private final ProductService productService;

    @GetMapping("/main")
    public ResponseEntity<Map<String, List<ProductMainCardFormResponse>>> findTop4LikeProduct() {

        Map<String, List<ProductMainCardFormResponse>> mainProductList = new HashMap<>();

        // top4 (좋아요순)
        List<ProductMainCardFormResponse> top4List = dtoMap(productService.productListOrderByLike());
        mainProductList.put("top4", top4List);

        // new4 (최신순)
        List<ProductMainCardFormResponse> new4List = dtoMap(productService.productListOrderByRegDate());
        mainProductList.put("new4", new4List);

        // sale4 (판매순)
        mainProductList.put("sale4", productService.getSaleTop4());

        return ResponseEntity.ok(mainProductList);
    }

    public List<ProductMainCardFormResponse> dtoMap(List<Product> products){
        return products.stream()
                .map(ProductMainCardFormResponse::new)
                .collect(Collectors.toList());
    }

    @GetMapping("/category/{id}")
    public List<ProductListResponse> ProductListByCatId(@PathVariable Integer id) {

        return productService.productListByCatId(id)
                .stream()
                .map(ProductListResponse::new) // 엔티티 -> DTO 변환
                .toList();
    }

    @GetMapping("/all")
    public ResponseEntity<List<ProductListResponse>> getAllProducts() {
        return ResponseEntity.ok(productService.getAllProductList());
    }

    @GetMapping("/view/{id}")
    public ResponseEntity<ProductViewResponse> productView(@PathVariable Integer id) {
        return ResponseEntity.ok(productService.getProductView(id));
    }

    @GetMapping("/new12")
    public ResponseEntity<List<ProductListResponse>> getNew12() {
        return ResponseEntity.ok(productService.getNew12());
    }

    @GetMapping("/my")
    public ResponseEntity<List<ProductListResponse>> getMyProducts() {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        if (auth == null || !auth.isAuthenticated() || !(auth.getPrincipal() instanceof Integer)) {
            return ResponseEntity.status(401).build();
        }
        return ResponseEntity.ok(productService.getMyProducts((Integer) auth.getPrincipal()));
    }

    @PostMapping("/write")
    public ResponseEntity<ProductViewResponse> writeProduct(@RequestBody ProductWriteRequest req) {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        if (auth == null || !auth.isAuthenticated() || !(auth.getPrincipal() instanceof Integer)) {
            return ResponseEntity.status(401).build();
        }
        return ResponseEntity.ok(productService.writeProduct((Integer) auth.getPrincipal(), req));
    }

    @PutMapping("/edit/{id}")
    public ResponseEntity<ProductViewResponse> editProduct(
            @PathVariable Integer id,
            @RequestBody ProductEditRequest req) {
        return ResponseEntity.ok(productService.editProduct(id, req));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteProduct(@PathVariable Integer id) {
        productService.deleteProduct(id);
        return ResponseEntity.ok().build();
    }

    @GetMapping("/search")
    public ResponseEntity<List<ProductListResponse>> searchProducts(
            @RequestParam(defaultValue = "ALL") String categoryId,
            @RequestParam(required = false) String searchField,
            @RequestParam(required = false) String keyword,
            @RequestParam(defaultValue = "reg") String sort) {
        return ResponseEntity.ok(productService.searchProducts(categoryId, searchField, keyword, sort));
    }
}
