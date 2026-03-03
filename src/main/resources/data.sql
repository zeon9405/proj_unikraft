INSERT INTO `unikraft`.`product`
(`category_id`, `like_cnt`, `pd_cnt`, `pd_id`, `pd_price`, `status`, `user_id`, `reg_date`, `img_url`, `keyword`, `pd_name`, `contents`)
VALUES
    (1, 150, 50, 1, 1200000, 0, 'admin', NOW(), 'https://picsum.photos/200/300?random=1', 'it,phone', '아이폰 15', '최신형 스마트폰입니다.'),
    (1, 80, 30, 2, 1100000, 0, 'admin', NOW(), 'https://picsum.photos/200/300?random=2', 'it,galaxy', '갤럭시 S24', 'AI 기능이 탑재된 스마트폰입니다.'),
    (2, 210, 20, 3, 1500000, 0, 'seller01', NOW(), 'https://picsum.photos/200/300?random=3', 'it,laptop', '맥북 에어 M3', '가볍고 강력한 노트북입니다.'),
    (2, 45, 15, 4, 1400000, 0, 'seller01', NOW(), 'https://picsum.photos/200/300?random=4', 'it,lg', 'LG 그램 16', '대화면 초경량 노트북입니다.'),
    (3, 300, 100, 5, 15000, 0, 'admin', NOW(), 'https://picsum.photos/200/300?random=5', 'food,snack', '유기농 견과류 세트', '건강에 좋은 견과류 모음입니다.'),
    (3, 12, 200, 6, 2500, 0, 'admin', NOW(), 'https://picsum.photos/200/300?random=6', 'food,drink', '제로 콜라 500ml', '칼로리 걱정 없는 탄산음료입니다.'),
    (4, 55, 40, 7, 35000, 0, 'user02', NOW(), 'https://picsum.photos/200/300?random=7', 'living,towel', '호텔급 수건 세트', '부드러운 면 100% 수건입니다.'),
    (4, 95, 10, 8, 89000, 0, 'user02', NOW(), 'https://picsum.photos/200/300?random=8', 'living,lamp', '감성 무드등', '방 분위기를 바꿔주는 조명입니다.'),
    (5, 180, 5, 9, 250000, 0, 'admin', NOW(), 'https://picsum.photos/200/300?random=9', 'fashion,watch', '스마트 워치 밴드', '운동 기록이 가능한 워치입니다.'),
    (5, 25, 60, 10, 45000, 0, 'admin', NOW(), 'https://picsum.photos/200/300?random=10', 'fashion,cap', '볼캡 모자', '데일리로 쓰기 좋은 모자입니다.');