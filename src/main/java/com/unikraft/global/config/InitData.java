package com.unikraft.global.config;

import com.unikraft.domain.product.category.Category;
import com.unikraft.domain.product.category.CategoryRepository;
import com.unikraft.domain.product.Product;
import com.unikraft.domain.product.ProductRepository;
import com.unikraft.domain.user.User;
import com.unikraft.domain.user.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Component;

import java.time.LocalDateTime;
import java.util.Arrays;
import java.util.List;

@Component
@RequiredArgsConstructor
public class InitData implements CommandLineRunner {

    private final ProductRepository productRepository;
    private final UserRepository userRepository;
    private final CategoryRepository categoryRepository;
    private final BCryptPasswordEncoder passwordEncoder;

    @Override
    public void run(String... args) throws Exception {
        if (userRepository.count() > 0) return;

        // ── 유저 생성 (1 admin, 5 sellers, 4 buyers) ────────────────────────
        User admin   = createUser(2, "admin",    "관리자",   "1234", "010-0000-0001", "MAISON",     "플랫폼 관리자입니다.",        "admin@maison.com",  "1",  "플랫폼운영");
        User seller1 = createUser(1, "knitter01","박뜨개",   "1234", "010-1111-0001", "실과바늘",    "10년 경력의 뜨개 장인입니다.", "knit@maison.com",   "2",  "뜨개·자수");
        User seller2 = createUser(1, "woodcraft","이목수",   "1234", "010-1111-0002", "나무결공방",  "원목 가구 전문 제작 장인.",    "wood@maison.com",   "3",  "원목 가구");
        User seller3 = createUser(1, "scent01",  "최향기",   "1234", "010-1111-0003", "향기스튜디오","천연 원료만 사용합니다.",      "scent@maison.com",  "4",  "향수·캔들");
        User seller4 = createUser(1, "jewel01",  "정보석",   "1234", "010-1111-0004", "달빛주얼리",  "핸드메이드 은공예 전문.",       "jewel@maison.com",  "5",  "주얼리·액세서리");
        User seller5 = createUser(1, "leather01","강가죽",   "1234", "010-1111-0005", "가죽공방K",   "식물성 무두질 가죽만 사용.",    "leather@maison.com","6",  "가죽 공예");
        User buyer1  = createUser(0, "buyer01",  "김소비",   "1234", "010-2222-0001", "",            "핸드메이드 애호가.",           "b1@mail.com",       "7",  "시각디자인");
        User buyer2  = createUser(0, "buyer02",  "이구매",   "1234", "010-2222-0002", "",            "선물 전문 구매자.",            "b2@mail.com",       "8",  "경영학");
        User buyer3  = createUser(0, "buyer03",  "박고객",   "1234", "010-2222-0003", "",            "인테리어 소품 수집중.",         "b3@mail.com",       "9",  "건축학");
        User buyer4  = createUser(0, "buyer04",  "최회원",   "1234", "010-2222-0004", "",            "처음 가입했습니다.",            "b4@mail.com",       "10", "컴퓨터공학");

        List<User> users = userRepository.saveAll(Arrays.asList(
                admin, seller1, seller2, seller3, seller4, seller5,
                buyer1, buyer2, buyer3, buyer4
        ));
        System.out.println("유저 데이터 삽입 완료!");

        // ── 카테고리 생성 ───────────────────────────────────────────────────
        List<Category> cats = categoryRepository.saveAll(Arrays.asList(
                createCategory("뜨개·자수",      "손바늘로 엮어낸 따뜻한 감성, 세상 하나뿐인 핸드메이드", "뜨개자수.png"),
                createCategory("원목 가구",      "나무 결이 살아있는 자연의 온기, 오래 함께할 가구",       "원목가구.png"),
                createCategory("향수·캔들",      "은은한 향으로 채우는 일상의 여유와 감성",               "향수캔들.png"),
                createCategory("주얼리·액세서리","장인의 손끝에서 탄생한, 나를 위한 특별한 장신구",       "주얼리액세서리.png"),
                createCategory("가죽 공예",      "시간이 지날수록 깊어지는 천연 가죽의 풍미",             "가죽공예.png"),
                createCategory("도자기·식기",    "흙에서 빚어낸 생활 속 작은 예술 작품",                 "도자기식기.png"),
                createCategory("아트·소품",      "공간을 채우는 감각적인 핸드메이드 아트 오브제",         "아트소품.png"),
                createCategory("수제 디저트",    "정성 가득 담은 달콤한 수제 베이커리와 디저트",          "수제디저트.png"),
                createCategory("천연 비누·뷰티", "피부가 먼저 느끼는 자연 성분의 순수한 케어",            "천연비누뷰티.png"),
                createCategory("패브릭·홈웨어",  "집을 더 아늑하게 만드는 부드러운 패브릭 컬렉션",       "패브릭홈웨어.png")
        ));
        System.out.println("카테고리 데이터 삽입 완료!");

        Category c0 = cats.get(0); // 뜨개·자수
        Category c1 = cats.get(1); // 원목 가구
        Category c2 = cats.get(2); // 향수·캔들
        Category c3 = cats.get(3); // 주얼리·액세서리
        Category c4 = cats.get(4); // 가죽 공예
        Category c5 = cats.get(5); // 도자기·식기
        Category c6 = cats.get(6); // 아트·소품
        Category c7 = cats.get(7); // 수제 디저트
        Category c8 = cats.get(8); // 천연 비누·뷰티
        Category c9 = cats.get(9); // 패브릭·홈웨어

        LocalDateTime now = LocalDateTime.now();

        productRepository.saveAll(Arrays.asList(

            // ── 0. 뜨개·자수 (seller1: 박뜨개) ──────────────────────────────
            createProduct(c0, "메리노울 손뜨개 가디건",   89000, 12,  85, 34, 0, seller1, "뜨개,가디건,울",      "100% 메리노울로 손뜨개한 따뜻한 가디건입니다.",          "1",  now.minusDays(2)),
            createProduct(c0, "코튼 손뜨개 가방",         45000, 20,  62, 28, 0, seller1, "뜨개,가방,코튼",      "가볍고 실용적인 코튼 손뜨개 숄더백.",                    "2",  now.minusDays(7)),
            createProduct(c0, "알파카 니트 비니",          32000, 30, 110, 55, 0, seller1, "뜨개,비니,알파카",    "부드러운 알파카 원사로 완성한 겨울 비니.",               "3",  now.minusDays(15)),
            createProduct(c0, "프랑스 자수 파우치",        38000, 18,  47, 19, 0, seller1, "자수,파우치,선물",    "손으로 수놓은 플로럴 패턴 파우치.",                      "4",  now.minusDays(30)),
            createProduct(c0, "손뜨개 아기 담요",          72000,  8,  93, 41, 0, seller1, "뜨개,담요,베이비",    "신생아 선물로 인기 있는 순면 손뜨개 담요.",              "5",  now.minusDays(45)),
            createProduct(c0, "크로셰 코스터 세트",        24000, 50,  38, 22, 0, seller1, "크로셰,코스터,홈",    "4개 1세트, 다양한 컬러로 구성된 코스터.",                "6",  now.minusDays(60)),

            // ── 1. 원목 가구 (seller2: 이목수) ──────────────────────────────
            createProduct(c1, "월넛 원목 커피 테이블",    320000,  3,  52, 12, 0, seller2, "가구,테이블,월넛",    "천연 월넛 원목으로 제작한 거실용 커피 테이블.",          "7",  now.minusDays(5)),
            createProduct(c1, "편백 원목 1인 의자",       180000,  5,  41, 18, 0, seller2, "가구,의자,편백",      "등받이가 편안한 편백나무 핸드메이드 의자.",              "8",  now.minusDays(12)),
            createProduct(c1, "참나무 원목 책상",         450000,  2,  67, 8,  0, seller2, "가구,책상,참나무",    "원목 책상, 친환경 오일 마감 처리.",                      "9",  now.minusDays(20)),
            createProduct(c1, "오크 선반 3단",            95000,  10,  33, 14, 0, seller2, "가구,선반,오크",      "벽에 설치하는 오크 원목 플로팅 선반 3단 세트.",         "10", now.minusDays(35)),
            createProduct(c1, "소나무 원목 스툴",          68000,  7,  28, 21, 0, seller2, "가구,스툴,소나무",    "다용도로 활용 가능한 원목 스툴.",                        "11", now.minusDays(50)),
            createProduct(c1, "체리나무 협탁",            145000,  4,  45, 10, 1, seller2, "가구,협탁,체리",      "침실 협탁으로 딱인 체리나무 원목 협탁. (품절)",          "12", now.minusDays(90)),

            // ── 2. 향수·캔들 (seller3: 최향기) ──────────────────────────────
            createProduct(c2, "우드 향 소이 캔들 200g",   32000, 35, 145, 62, 0, seller3, "캔들,소이,우드",      "천연 소이왁스와 우드 향으로 완성한 감성 캔들.",          "13", now.minusDays(3)),
            createProduct(c2, "플로럴 퍼퓸 오 드 뚜왈렛", 78000, 20,  88, 35, 0, seller3, "향수,플로럴,퍼퓸",    "장미·모란·쟈스민 블렌드 천연 향수 50ml.",               "14", now.minusDays(10)),
            createProduct(c2, "시더우드 디퓨저 100ml",    45000, 25,  72, 44, 0, seller3, "디퓨저,시더우드,인테리어","천연 오일 디퓨저, 4~6주 지속.",                     "15", now.minusDays(18)),
            createProduct(c2, "라벤더 룸 스프레이",        28000, 40, 101, 58, 0, seller3, "룸스프레이,라벤더,수면","취침 전 사용하면 숙면에 도움이 됩니다.",              "16", now.minusDays(25)),
            createProduct(c2, "바닐라 왁스 타블렛 세트",   18000, 60,  55, 30, 0, seller3, "왁스타블렛,바닐라,방향","옷장·서랍에 두면 은은한 향을 오래 유지.",             "17", now.minusDays(40)),
            createProduct(c2, "시트러스 핸드 크림 세트",   36000, 15,  43, 20, 0, seller3, "핸드크림,시트러스,선물","레몬·오렌지 블렌드 천연 핸드크림 2종 세트.",           "18", now.minusDays(55)),

            // ── 3. 주얼리·액세서리 (seller4: 정보석) ────────────────────────
            createProduct(c3, "925 실버 물방울 귀걸이",    55000, 22, 132, 67, 0, seller4, "귀걸이,실버,주얼리",  "순은 925 소재의 물방울 형태 귀걸이.",                    "19", now.minusDays(1)),
            createProduct(c3, "황동 체인 레이어드 목걸이", 48000, 18,  96, 48, 0, seller4, "목걸이,황동,레이어드", "3단 레이어드 가능한 황동 체인 목걸이.",                  "20", now.minusDays(8)),
            createProduct(c3, "수제 비즈 팔찌",            32000, 30,  78, 39, 0, seller4, "팔찌,비즈,수제",      "반수제 방식으로 제작한 파스텔 비즈 팔찌.",               "21", now.minusDays(14)),
            createProduct(c3, "패브릭 헤어 스크런치 세트", 22000, 50,  61, 33, 0, seller4, "헤어,스크런치,패브릭", "비단결 소재 헤어 스크런치 3종 세트.",                    "22", now.minusDays(22)),
            createProduct(c3, "천연석 반지 (문스톤)",       68000, 10,  44, 17, 0, seller4, "반지,문스톤,천연석",   "오직 하나뿐인 천연 문스톤 세팅 반지.",                   "23", now.minusDays(38)),
            createProduct(c3, "플라워 브로치",              42000, 14,  37, 14, 1, seller4, "브로치,플라워,패션",   "린넨 소재 꽃 모양 브로치. (품절)",                       "24", now.minusDays(70)),

            // ── 4. 가죽 공예 (seller5: 강가죽) ──────────────────────────────
            createProduct(c4, "식물성 무두질 가죽 명함 지갑", 65000, 15,  89, 42, 0, seller5, "가죽,지갑,명함",     "100% 식물성 무두질 가죽으로 만든 슬림 명함 지갑.",       "25", now.minusDays(4)),
            createProduct(c4, "핸드 스티치 가죽 장지갑",   135000,  8,  74, 31, 0, seller5, "가죽,장지갑,스티치",  "새들 스티치 기법으로 제작한 풀 그레인 장지갑.",          "26", now.minusDays(11)),
            createProduct(c4, "가죽 키링 세트",             38000, 25,  58, 26, 0, seller5, "키링,가죽,선물",      "각인 가능한 가죽 키링 (이름 각인 옵션 있음).",           "27", now.minusDays(19)),
            createProduct(c4, "맞춤 가죽 벨트",             98000,  6,  35, 15, 0, seller5, "벨트,가죽,맞춤",      "허리 사이즈에 맞게 제작하는 주문 제작 벨트.",            "28", now.minusDays(28)),
            createProduct(c4, "가죽 파우치 M",              72000, 11,  48, 22, 0, seller5, "파우치,가죽,여행",     "여행·출장용으로 딱 맞는 M 사이즈 가죽 파우치.",          "29", now.minusDays(42)),
            createProduct(c4, "가죽 노트 커버 A5",          55000, 20,  31, 13, 0, seller5, "노트커버,가죽,다이어리","A5 노트에 딱 맞는 착탈식 가죽 커버.",                   "30", now.minusDays(65)),

            // ── 5. 도자기·식기 (seller2: 이목수 — 부업) ─────────────────────
            createProduct(c5, "손빚기 머그컵 (스모키 그레이)",  48000, 14,  97, 46, 0, seller2, "도자기,머그,식기",    "물레성형 없이 손으로 빚은 스모키 그레이 머그.",          "31", now.minusDays(6)),
            createProduct(c5, "핸드메이드 볼 세트 3P",        120000,  5,  63, 28, 0, seller2, "도자기,볼,세트",      "그라데이션 유약의 볼 3개 세트.",                         "32", now.minusDays(16)),
            createProduct(c5, "백자 미니 꽃병",               58000, 18,  82, 37, 0, seller2, "백자,꽃병,인테리어",  "한국 전통 백자 스타일의 미니 꽃병.",                     "33", now.minusDays(24)),
            createProduct(c5, "수제 간장 종지 4P",            36000, 20,  44, 21, 0, seller2, "도자기,종지,한식기",  "한식 상차림에 어울리는 간장 종지 4개 세트.",             "34", now.minusDays(33)),
            createProduct(c5, "사각 플레이트 (마블 유약)",     72000, 10,  55, 24, 0, seller2, "도자기,플레이트,식기", "독특한 마블링 유약이 돋보이는 사각 접시.",               "35", now.minusDays(48)),
            createProduct(c5, "손빚기 에스프레소 잔 2P",       62000,  0,  29, 18, 1, seller2, "도자기,에스프레소,커피","소용량 에스프레소용 수제 잔 2종 세트. (품절)",          "36", now.minusDays(80)),

            // ── 6. 아트·소품 (seller3: 최향기 — 부업) ───────────────────────
            createProduct(c6, "핸드페인팅 캔버스 아트 A3",   150000,  6,  71, 22, 0, seller3, "아트,캔버스,인테리어", "아크릴 물감으로 직접 그린 추상 캔버스 작품.",            "37", now.minusDays(9)),
            createProduct(c6, "수제 리소그래프 포스터",        35000, 30,  58, 35, 0, seller3, "포스터,리소그래프,그래픽","2도 리소그래프 인쇄 한정판 포스터.",                 "38", now.minusDays(17)),
            createProduct(c6, "드라이플라워 캔들 홀더",        42000, 22,  84, 40, 0, seller3, "드라이플라워,캔들홀더,인테리어","말린 꽃으로 장식한 유리 캔들 홀더.",            "39", now.minusDays(26)),
            createProduct(c6, "손그림 엽서 세트 10종",         22000, 40,  47, 28, 0, seller3, "엽서,손그림,선물",    "작가가 직접 그린 엽서 10장 세트.",                       "40", now.minusDays(36)),
            createProduct(c6, "핸드메이드 석고 오브제",         38000, 16,  39, 19, 0, seller3, "석고,오브제,인테리어", "미니멀한 인테리어 포인트가 되는 석고 조각.",             "41", now.minusDays(52)),
            createProduct(c6, "압화 액자 (야생화)",             55000, 10,  26, 11, 0, seller3, "압화,액자,꽃",        "직접 채집·건조한 야생화로 만든 압화 액자.",              "42", now.minusDays(75)),

            // ── 7. 수제 디저트 (seller1: 박뜨개 — 취미 겸업) ───────────────
            createProduct(c7, "수제 마카롱 12구 박스",         28000, 40, 188, 95, 0, seller1, "마카롱,수제,선물",    "당일 제조·당일 배송, 12가지 맛 구성.",                   "43", now.minusDays(1)),
            createProduct(c7, "버터 수제 쿠키 어시orted",      22000, 55, 156, 80, 0, seller1, "쿠키,버터,수제",      "덴마크산 버터로 구운 10종 모둠 쿠키.",                   "44", now.minusDays(3)),
            createProduct(c7, "수제 잼 3종 선물 세트",         35000, 30,  92, 47, 0, seller1, "잼,수제,선물세트",    "딸기·블루베리·복숭아 수제 잼 미니 세트.",               "45", now.minusDays(10)),
            createProduct(c7, "통밀 스콘 8개 세트",            18000, 45, 124, 63, 0, seller1, "스콘,통밀,베이커리",  "글루텐 프리 통밀 스콘 8개, 당일 제조.",                  "46", now.minusDays(14)),
            createProduct(c7, "수제 초콜릿 봉봉 9구",           32000, 25,  74, 36, 0, seller1, "초콜릿,봉봉,수제",    "벨기에 커버처 초콜릿으로 만든 수제 봉봉.",              "47", now.minusDays(20)),
            createProduct(c7, "흑임자 무스 케이크 미니",         45000,  0,  38, 19, 1, seller1, "케이크,흑임자,무스",  "흑임자 크림 무스케이크. (현재 품절)",                    "48", now.minusDays(45)),

            // ── 8. 천연 비누·뷰티 (seller4: 정보석 — 부업) ─────────────────
            createProduct(c8, "콜드프로세스 라벤더 비누",       15000, 50,  99, 52, 0, seller4, "비누,라벤더,천연",    "라벤더 에센셜 오일 100% 함유 천연 비누.",               "49", now.minusDays(2)),
            createProduct(c8, "카렌둘라 민감성 클렌저",         28000, 35,  76, 39, 0, seller4, "클렌저,카렌둘라,민감성","민감한 피부를 위한 저자극 카렌둘라 클렌저.",           "50", now.minusDays(9)),
            createProduct(c8, "시어버터 바디 로션 200ml",       32000, 28,  65, 34, 0, seller4, "로션,시어버터,바디",   "시어버터·호호바 오일 블렌드 촉촉한 바디 로션.",         "51", now.minusDays(16)),
            createProduct(c8, "숯 비누 (블랙 디톡스)",          18000, 42,  53, 28, 0, seller4, "비누,숯,디톡스",      "대나무 숯 함유, 모공 관리에 효과적인 비누.",             "52", now.minusDays(23)),
            createProduct(c8, "로즈힙 페이스 오일 30ml",        48000, 15,  41, 18, 0, seller4, "오일,로즈힙,안티에이징","로즈힙+비타민E 블렌드, 탄력 피부를 위한 오일.",       "53", now.minusDays(31)),
            createProduct(c8, "립밤 3종 세트 (SPF15)",          14000,  0,  33, 16, 1, seller4, "립밤,SPF,천연",       "천연 밀랍 립밤 3가지 향 세트. (품절)",                   "54", now.minusDays(60)),

            // ── 9. 패브릭·홈웨어 (seller5: 강가죽 — 부업) ──────────────────
            createProduct(c9, "린넨 쿠션 커버 2P",              42000, 20,  87, 44, 0, seller5, "쿠션커버,린넨,홈텍스타일","워싱 린넨 소재 쿠션 커버 2종 세트.",               "55", now.minusDays(5)),
            createProduct(c9, "무명 순면 이불 홑청",             88000,  8,  55, 27, 0, seller5, "이불,순면,침구",      "국내산 무명 순면 100% 이불 홑청.",                       "56", now.minusDays(13)),
            createProduct(c9, "핸드메이드 퀼트 테이블 러너",     65000, 12,  62, 30, 0, seller5, "퀼트,테이블러너,홈인테리어","패치워크 퀼트 테이블 러너, 각 1점 제작.",         "57", now.minusDays(21)),
            createProduct(c9, "washed 면 앞치마",               38000, 25,  47, 23, 0, seller5, "앞치마,면,워싱",      "워싱 처리된 부드러운 면 앞치마.",                        "58", now.minusDays(29)),
            createProduct(c9, "자수 패브릭 바구니 세트",          52000, 18,  34, 16, 0, seller5, "바구니,패브릭,자수",   "수작업 자수 장식의 접이식 패브릭 바구니 3종.",           "59", now.minusDays(44)),
            createProduct(c9, "핸드메이드 마크라메 벽 장식",      75000,  0,  29, 12, 1, seller5, "마크라메,벽장식,보헤미안","코튼 로프 마크라메 월 행잉. (품절)",                  "60", now.minusDays(85))

        ));
        System.out.println("상품 데이터 삽입 완료! (총 60개)");
    }

    private User createUser(int role, String loginId, String name, String pw, String tel,
                            String brand, String contents, String email, String imgId, String major) {
        return User.builder()
                .role(role)
                .loginId(loginId)
                .name(name)
                .pw(passwordEncoder.encode(pw)) // BCrypt 암호화
                .tel(tel)
                .brand(brand)
                .contents(contents)
                .email(email)
                .imgUrl("/uploads/user/" + imgId+".png")
                .major(major)
                .build();
    }

    private Product createProduct(Category category, String name, Integer price, Integer cnt,
                                   Integer like, Integer sale, Integer status, User user,
                                   String key, String content, String imgId, LocalDateTime regDate) {
        return Product.builder()
                .category(category)
                .pdName(name)
                .pdPrice(price)
                .pdCnt(cnt)
                .likeCnt(like)
                .saleCnt(sale)
                .status(status)
                .user(user)
                .keyword(key)
                .contents(content)
                .regDate(regDate)
                .imgUrl("/uploads/product/" + imgId + ".jpg")
                .build();
    }

    private Category createCategory(String name, String desc, String imgUrl) {
        return Category.builder()
                .categoryName(name)
                .categoryDesc(desc)
                .imgUrl(imgUrl)
                .build();
    }
}
