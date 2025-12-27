-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Generation Time: Dec 26, 2025 at 09:13 AM
-- Server version: 10.4.32-MariaDB
-- PHP Version: 8.2.12

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `fishing_shop`
--

-- --------------------------------------------------------

--
-- Table structure for table `activity_logs`
--

CREATE TABLE `activity_logs` (
  `id` bigint(20) UNSIGNED NOT NULL COMMENT 'ID bản ghi',
  `user_id` int(10) UNSIGNED DEFAULT NULL COMMENT 'ID người dùng (NULL nếu là hệ thống)',
  `action` varchar(120) NOT NULL COMMENT 'Hành động (ví dụ: login, create_order, update_product)',
  `metadata` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin DEFAULT NULL COMMENT 'Dữ liệu bổ sung dạng JSON' CHECK (json_valid(`metadata`)),
  `created_at` timestamp NOT NULL DEFAULT current_timestamp() COMMENT 'Thời gian tạo'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='Bảng nhật ký hoạt động người dùng và hệ thống';

-- --------------------------------------------------------

--
-- Table structure for table `addresses`
--

CREATE TABLE `addresses` (
  `id` int(10) UNSIGNED NOT NULL COMMENT 'ID địa chỉ',
  `user_id` int(10) UNSIGNED NOT NULL COMMENT 'ID người dùng',
  `label` varchar(60) NOT NULL COMMENT 'Nhãn địa chỉ (ví dụ: Nhà riêng, Công ty)',
  `full_name` varchar(120) NOT NULL COMMENT 'Họ tên người nhận',
  `phone` varchar(20) NOT NULL COMMENT 'Số điện thoại',
  `address_line` text NOT NULL COMMENT 'Địa chỉ chi tiết',
  `province` varchar(80) NOT NULL COMMENT 'Tỉnh/Thành phố',
  `district` varchar(80) NOT NULL COMMENT 'Quận/Huyện',
  `ward` varchar(80) NOT NULL COMMENT 'Phường/Xã',
  `is_default` tinyint(1) DEFAULT 0 COMMENT 'Địa chỉ mặc định (1) hay không (0)',
  `created_at` timestamp NOT NULL DEFAULT current_timestamp() COMMENT 'Thời gian tạo'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='Bảng địa chỉ giao hàng';

--
-- Dumping data for table `addresses`
--

INSERT INTO `addresses` (`id`, `user_id`, `label`, `full_name`, `phone`, `address_line`, `province`, `district`, `ward`, `is_default`, `created_at`) VALUES
(1, 2, 'Nhà riêng', 'Nguyễn Văn A', '0987654321', '123 Đường ABC', 'Hà Nội', 'Cầu Giấy', 'Dịch Vọng', 1, '2025-12-25 13:01:03'),
(2, 2, 'Công ty', 'Nguyễn Văn A', '0987654321', '456 Đường XYZ', 'Hà Nội', 'Đống Đa', 'Láng Hạ', 0, '2025-12-25 13:01:03');

-- --------------------------------------------------------

--
-- Table structure for table `blogs`
--

CREATE TABLE `blogs` (
  `id` int(10) UNSIGNED NOT NULL COMMENT 'ID blog',
  `title` varchar(255) NOT NULL COMMENT 'Tiêu đề bài viết',
  `slug` varchar(255) NOT NULL COMMENT 'URL slug',
  `excerpt` text DEFAULT NULL COMMENT 'Tóm tắt ngắn',
  `content` longtext NOT NULL COMMENT 'Nội dung đầy đủ',
  `thumbnail` varchar(500) DEFAULT NULL COMMENT 'Ảnh đại diện',
  `author_id` int(10) UNSIGNED DEFAULT NULL COMMENT 'ID người viết',
  `category` varchar(100) DEFAULT NULL COMMENT 'Danh mục blog',
  `tags` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin DEFAULT NULL COMMENT 'Các tag' CHECK (json_valid(`tags`)),
  `view_count` int(11) DEFAULT 0 COMMENT 'Số lượt xem',
  `is_published` tinyint(1) DEFAULT 0 COMMENT 'Đã xuất bản',
  `published_at` datetime DEFAULT NULL COMMENT 'Thời gian xuất bản',
  `created_at` timestamp NOT NULL DEFAULT current_timestamp() COMMENT 'Thời gian tạo',
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp() COMMENT 'Thời gian cập nhật'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='Bảng blog';

--
-- Dumping data for table `blogs`
--

INSERT INTO `blogs` (`id`, `title`, `slug`, `excerpt`, `content`, `thumbnail`, `author_id`, `category`, `tags`, `view_count`, `is_published`, `published_at`, `created_at`, `updated_at`) VALUES
(1, 'Kỹ thuật câu cá lóc hiệu quả', 'ky-thuat-cau-ca-loc-hieu-qua', 'Chia sẻ kinh nghiệm và kỹ thuật câu cá lóc cho người mới bắt đầu', '<h2>Giới thiệu về cá lóc</h2><p>Cá lóc là loài cá nước ngọt phổ biến tại Việt Nam, được nhiều người yêu thích...</p><h2>Dụng cụ cần chuẩn bị</h2><p>Cần câu 1.8-2.4m, máy câu ngang size 3000-4000, dây PE 2-4...</p><h2>Kỹ thuật câu</h2><p>Sử dụng mồi giả như con quay, wobler, hoặc mồi tự nhiên như cá rô nhỏ...</p>', '/images/blog/ky-thuat-cau-ca-loc.jpg', 1, 'Kỹ thuật câu', '[\"cá lóc\", \"kỹ thuật\", \"hướng dẫn\"]', 1250, 1, '2025-11-01 10:00:00', '2025-12-25 13:01:03', '2025-12-25 13:01:03'),
(2, 'Top 5 cần câu tốt nhất 2025', 'top-5-can-cau-tot-nhat-2025', 'Đánh giá và so sánh 5 cần câu được ưa chuộng nhất năm 2025', '<h2>1. Shimano Surf Leader 425 BX</h2><p>Thân carbon cao cấp, độ bền vượt trội...</p><h2>2. Daiwa Crossfire</h2><p>Thiết kế đa năng phù hợp nhiều địa hình...</p><h2>3. Abu Garcia Vengeance</h2><p>Giá cả phải chăng, chất lượng tốt...</p>', '/images/blog/top-5-can-cau.jpg', 1, 'Đánh giá sản phẩm', '[\"cần câu\", \"đánh giá\", \"top 5\"]', 2340, 1, '2025-10-15 14:30:00', '2025-12-25 13:01:03', '2025-12-25 13:01:03'),
(3, 'Bảo quản dụng cụ câu cá đúng cách', 'bao-quan-dung-cu-cau-ca-dung-cach', 'Hướng dẫn cách bảo quản cần câu, máy câu và phụ kiện để sử dụng lâu dài', '<h2>Bảo quản cần câu</h2><p>Sau mỗi lần câu, cần rửa sạch bằng nước ngọt, lau khô...</p><h2>Bảo quản máy câu</h2><p>Định kỳ tra dầu, làm sạch bụi bẩn, bảo quản nơi khô ráo...</p><h2>Bảo quản dây cước</h2><p>Tránh ánh nắng trực tiếp, kiểm tra độ sợi thường xuyên...</p>', '/images/blog/bao-quan-dung-cu.jpg', 1, 'Hướng dẫn', '[\"bảo quản\", \"bảo trì\", \"dụng cụ\"]', 890, 1, '2025-10-20 09:00:00', '2025-12-25 13:01:03', '2025-12-25 13:01:03'),
(4, 'Hướng Dẫn Chọn Cần Câu Phù Hợp Cho Người Mới Bắt Đầu', 'huong-dan-chon-can-cau-phu-hop', 'Tìm hiểu cách chọn cần câu phù hợp với điều kiện câu và kỹ năng của bạn', '\n      <h2>Giới thiệu</h2>\n      <p>Chọn cần câu phù hợp là bước đầu tiên quan trọng trong hành trình câu cá. Một cây cần phù hợp sẽ giúp bạn có trải nghiệm câu cá tốt hơn và tăng tỷ lệ thành công.</p>\n      \n      <h2>Các yếu tố cần xem xét</h2>\n      <h3>1. Chiều dài cần câu</h3>\n      <p>- Cần ngắn (1.8-2.1m): Phù hợp câu cá nhỏ, địa hình hẹp</p>\n      <p>- Cần trung bình (2.4-2.7m): Đa năng, phù hợp nhiều môi trường</p>\n      <p>- Cần dài (3.0m trở lên): Phù hợp câu xa bờ, cá lớn</p>\n      \n      <h3>2. Độ cứng của cần</h3>\n      <p>Độ cứng ảnh hưởng đến khả năng nhạy cảm và sức mạnh khi đối đầu với cá.</p>\n      \n      <h3>3. Chất liệu</h3>\n      <p>- Carbon: Nhẹ, bền, đắt tiền</p>\n      <p>- Composite: Cân bằng giữa giá và chất lượng</p>\n      <p>- Fiberglass: Rẻ tiền, phù hợp người mới</p>\n      \n      <h2>Lời khuyên cho người mới</h2>\n      <p>Nên bắt đầu với cần câu tầm trung, chiều dài 2.4m để làm quen và tích lũy kinh nghiệm.</p>\n    ', '/images/blog/can-cau.jpg', 1, NULL, NULL, 0, 1, '2025-12-26 13:52:27', '2025-12-26 06:52:27', '2025-12-26 06:52:27'),
(5, 'Top 5 Mồi Câu Hiệu Quả Nhất Mùa Thu Này', 'top-5-moi-cau-hieu-qua-nhat', 'Khám phá những loại mồi câu được ưa chuộng nhất và cách sử dụng chúng hiệu quả', '\n      <h2>1. Mồi tôm sống</h2>\n      <p>Mồi tôm sống là lựa chọn hàng đầu cho câu cá nước lợ và biển. Tôm tươi sống mang lại mùi vị tự nhiên thu hút nhiều loại cá.</p>\n      \n      <h2>2. Mồi giả silicone</h2>\n      <p>Mồi giả silicone bền, dễ sử dụng và có nhiều màu sắc, kích thước. Phù hợp cho câu lure.</p>\n      \n      <h2>3. Mồi trùn đất</h2>\n      <p>Trùn đất là mồi truyền thống, hiệu quả với cá nước ngọt như cá trê, cá chép.</p>\n      \n      <h2>4. Mồi cá nhỏ</h2>\n      <p>Sử dụng cá nhỏ làm mồi để câu các loại cá to, săn mồi như cá lóc, cá chình.</p>\n      \n      <h2>5. Mồi cá tươi</h2>\n      <p>Mồi cá tươi cắt miếng thu hút cá bằng mùi và hình dạng tự nhiên, hiệu quả cao vào mùa thu.</p>\n      \n      <h2>Kết luận</h2>\n      <p>Mỗi loại mồi có ưu điểm riêng, hãy thử nghiệm và tìm ra mồi phù hợp với điều kiện câu của bạn.</p>\n    ', '/images/blog/moi-cau.jpg', 1, NULL, NULL, 0, 1, '2025-12-26 13:52:27', '2025-12-26 06:52:27', '2025-12-26 06:52:27'),
(6, 'Kỹ Thuật Câu Cá Nước Lợ Cho Người Mới', 'ky-thuat-cau-ca-nuoc-lo', 'Hướng dẫn chi tiết về kỹ thuật và thiết bị câu cá nước lợ', '\n      <h2>Đặc điểm môi trường nước lợ</h2>\n      <p>Nước lợ là môi trường giao thoa giữa nước ngọt và nước mặn, nơi sinh sống của nhiều loài cá có giá trị.</p>\n      \n      <h2>Thiết bị cần chuẩn bị</h2>\n      <ul>\n        <li>Cần câu chuyên dụng chống gỉ</li>\n        <li>Máy câu có hệ thống chống nước mặn</li>\n        <li>Dây câu PE hoặc Nylon chất lượng cao</li>\n        <li>Lưỡi câu phù hợp với kích thước cá mục tiêu</li>\n      </ul>\n      \n      <h2>Kỹ thuật câu cơ bản</h2>\n      <h3>1. Chọn điểm câu</h3>\n      <p>Ưu tiên các khu vực có dòng chảy, cửa sông, bãi đá.</p>\n      \n      <h3>2. Thời điểm câu</h3>\n      <p>Sáng sớm và chiều tối là thời điểm cá hoạt động mạnh.</p>\n      \n      <h3>3. Kỹ thuật quăng câu</h3>\n      <p>Quăng câu xa và chính xác vào vùng nước có cá.</p>\n      \n      <h2>Lưu ý an toàn</h2>\n      <p>Luôn kiểm tra thủy triều, thời tiết và mang theo thiết bị an toàn.</p>\n    ', '/images/blog/cau-nuoc-lo.jpg', 1, NULL, NULL, 0, 1, '2025-12-26 13:52:27', '2025-12-26 06:52:27', '2025-12-26 06:52:27'),
(7, 'Bảo Quản và Bảo Dưỡng Dụng Cụ Câu Cá', 'bao-quan-bao-duong-dung-cu-cau-ca', 'Cách bảo quản và bảo dưỡng thiết bị câu cá để kéo dài tuổi thọ', '\n      <h2>Tại sao cần bảo quản đúng cách?</h2>\n      <p>Dụng cụ câu cá là khoản đầu tư không nhỏ. Bảo quản đúng cách giúp tiết kiệm chi phí và luôn sẵn sàng cho chuyến câu.</p>\n      \n      <h2>Bảo quản cần câu</h2>\n      <ul>\n        <li>Rửa sạch bằng nước ngọt sau mỗi lần sử dụng</li>\n        <li>Lau khô hoàn toàn trước khi cất giữ</li>\n        <li>Bảo quản ở nơi khô ráo, thoáng mát</li>\n        <li>Tránh để cần bị cong vênh</li>\n      </ul>\n      \n      <h2>Bảo dưỡng máy câu</h2>\n      <h3>1. Vệ sinh</h3>\n      <p>Rửa máy bằng nước ngọt, lau khô cẩn thận.</p>\n      \n      <h3>2. Bôi trơn</h3>\n      <p>Định kỳ bôi dầu máy câu vào các bộ phận chuyển động.</p>\n      \n      <h3>3. Kiểm tra</h3>\n      <p>Kiểm tra phanh, hệ thống cuộn dây thường xuyên.</p>\n      \n      <h2>Bảo quản dây câu và phụ kiện</h2>\n      <p>Dây câu cần được cuộn gọn, tránh ánh nắng trực tiếp. Lưỡi câu nên được bảo quản riêng trong hộp chống gỉ.</p>\n      \n      <h2>Kết luận</h2>\n      <p>Chăm sóc thiết bị câu cá như chăm sóc người bạn đồng hành của bạn.</p>\n    ', '/images/blog/bao-quan.jpg', 1, NULL, NULL, 0, 1, '2025-12-26 13:52:27', '2025-12-26 06:52:27', '2025-12-26 06:52:27'),
(8, '10 Địa Điểm Câu Cá Lý Tưởng Tại Việt Nam', '10-dia-diem-cau-ca-ly-tuong', 'Khám phá những địa điểm câu cá đẹp và nhiều cá nhất Việt Nam', '\n      <h2>1. Vịnh Hạ Long - Quảng Ninh</h2>\n      <p>Nổi tiếng với cảnh đẹp và nhiều loại cá biển quý hiếm.</p>\n      \n      <h2>2. Hồ Thác Bà - Yên Bái</h2>\n      <p>Hồ nước ngọt lớn với cá đa dạng và phong cảnh hữu tình.</p>\n      \n      <h2>3. Sông Hậu - Đồng bằng sông Cửu Long</h2>\n      <p>Sông lớn với nhiều loại cá nước ngọt đặc trưng miền Tây.</p>\n      \n      <h2>4. Biển Mũi Né - Bình Thuận</h2>\n      <p>Điểm câu cá biển lý tưởng với nhiều loại cá to.</p>\n      \n      <h2>5. Hồ Tây - Hà Nội</h2>\n      <p>Địa điểm câu cá trong thành phố, thuận tiện cho dân câu phố.</p>\n      \n      <h2>6. Biển Nha Trang - Khánh Hòa</h2>\n      <p>Biển đẹp, nước trong, nhiều loại cá cảnh và cá thương phẩm.</p>\n      \n      <h2>7. Sông Đồng Nai</h2>\n      <p>Sông lớn với hệ sinh thái phong phú.</p>\n      \n      <h2>8. Hồ Núi Cốc - Thái Nguyên</h2>\n      <p>Hồ thủy điện xinh đẹp, cá đa dạng.</p>\n      \n      <h2>9. Biển Cửa Lò - Nghệ An</h2>\n      <p>Bãi biển đẹp, phù hợp câu cá xa bờ.</p>\n      \n      <h2>10. Hồ Ea Kao - Đắk Lắk</h2>\n      <p>Hồ lớn ở Tây Nguyên với cá nước ngọt phong phú.</p>\n    ', '/images/blog/dia-diem.jpg', 1, NULL, NULL, 0, 1, '2025-12-26 13:52:27', '2025-12-26 06:52:27', '2025-12-26 06:52:27'),
(9, 'Câu Cá Ban Đêm: Bí Quyết và Lưu Ý An Toàn', 'cau-ca-ban-dem-bi-quyet', 'Hướng dẫn kỹ thuật và các lưu ý quan trọng khi câu cá ban đêm', '\n      <h2>Tại sao nên câu cá ban đêm?</h2>\n      <p>Ban đêm, nhiều loài cá hoạt động mạnh hơn, ít cạnh tranh và mang lại trải nghiệm độc đáo.</p>\n      \n      <h2>Chuẩn bị thiết bị</h2>\n      <h3>1. Đèn chiếu sáng</h3>\n      <ul>\n        <li>Đèn pin đội đầu</li>\n        <li>Đèn dù câu cá</li>\n        <li>Đèn tín hiệu</li>\n      </ul>\n      \n      <h3>2. Thiết bị câu cá</h3>\n      <p>Chuẩn bị thiết bị câu như ban ngày, nhưng có thêm chuông báo câu.</p>\n      \n      <h2>Kỹ thuật câu ban đêm</h2>\n      <h3>1. Chọn điểm câu</h3>\n      <p>Nên khảo sát địa điểm vào ban ngày trước, chọn nơi an toàn.</p>\n      \n      <h3>2. Sử dụng ánh sáng</h3>\n      <p>Đèn chiếu vào mặt nước thu hút cá nhỏ, từ đó thu hút cá to.</p>\n      \n      <h3>3. Lựa chọn mồi</h3>\n      <p>Mồi phát quang hoặc mồi có mùi mạnh hiệu quả hơn vào ban đêm.</p>\n      \n      <h2>An toàn khi câu đêm</h2>\n      <ul>\n        <li>Luôn đi theo nhóm, không câu một mình</li>\n        <li>Mang theo đầy đủ trang bị chiếu sáng</li>\n        <li>Kiểm tra thời tiết trước khi đi</li>\n        <li>Mang theo thuốc sơ cứu</li>\n        <li>Thông báo cho người thân về địa điểm</li>\n        <li>Tránh uống rượu bia</li>\n      </ul>\n      \n      <h2>Kết luận</h2>\n      <p>Câu cá ban đêm mang lại nhiều thú vị nhưng cần chuẩn bị kỹ lưỡng và đặt an toàn lên hàng đầu.</p>\n    ', '/images/blog/cau-dem.jpg', 1, NULL, NULL, 0, 1, '2025-12-26 13:52:27', '2025-12-26 06:52:27', '2025-12-26 06:52:27');

-- --------------------------------------------------------

--
-- Table structure for table `carts`
--

CREATE TABLE `carts` (
  `id` int(10) UNSIGNED NOT NULL COMMENT 'ID giỏ hàng',
  `user_id` int(10) UNSIGNED NOT NULL COMMENT 'ID người dùng',
  `created_at` timestamp NOT NULL DEFAULT current_timestamp() COMMENT 'Thời gian tạo',
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp() COMMENT 'Thời gian cập nhật'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='Bảng giỏ hàng';

--
-- Dumping data for table `carts`
--

INSERT INTO `carts` (`id`, `user_id`, `created_at`, `updated_at`) VALUES
(1, 1, '2025-12-25 13:01:16', '2025-12-25 13:01:16'),
(2, 3, '2025-12-25 15:59:00', '2025-12-25 15:59:00');

-- --------------------------------------------------------

--
-- Table structure for table `cart_items`
--

CREATE TABLE `cart_items` (
  `id` int(10) UNSIGNED NOT NULL COMMENT 'ID chi tiết giỏ hàng',
  `cart_id` int(10) UNSIGNED NOT NULL COMMENT 'ID giỏ hàng',
  `product_id` int(10) UNSIGNED NOT NULL COMMENT 'ID sản phẩm',
  `quantity` int(11) NOT NULL DEFAULT 1 COMMENT 'Số lượng',
  `created_at` timestamp NOT NULL DEFAULT current_timestamp() COMMENT 'Thời gian tạo',
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp() COMMENT 'Thời gian cập nhật'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='Bảng chi tiết giỏ hàng';

--
-- Dumping data for table `cart_items`
--

INSERT INTO `cart_items` (`id`, `cart_id`, `product_id`, `quantity`, `created_at`, `updated_at`) VALUES
(17, 2, 4, 49, '2025-12-25 17:45:10', '2025-12-25 18:00:14'),
(18, 2, 1, 1, '2025-12-25 17:59:57', '2025-12-25 17:59:57'),
(26, 1, 4, 5, '2025-12-26 06:15:46', '2025-12-26 06:19:33');

-- --------------------------------------------------------

--
-- Table structure for table `categories`
--

CREATE TABLE `categories` (
  `id` int(10) UNSIGNED NOT NULL COMMENT 'ID danh mục',
  `name` varchar(120) NOT NULL COMMENT 'Tên danh mục',
  `description` text DEFAULT NULL COMMENT 'Mô tả danh mục',
  `created_at` timestamp NOT NULL DEFAULT current_timestamp() COMMENT 'Thời gian tạo'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='Bảng danh mục sản phẩm';

--
-- Dumping data for table `categories`
--

INSERT INTO `categories` (`id`, `name`, `description`, `created_at`) VALUES
(1, 'Cần Câu', 'Các loại cần câu carbon, composite, telescopic', '2025-12-25 13:01:03'),
(2, 'Máy Câu', 'Máy câu cá các loại spinning, baitcasting, trolling', '2025-12-25 13:01:03'),
(3, 'Dây Cước', 'Dây câu PE, Carbon, Nylon, Fluorocarbon', '2025-12-25 13:01:03'),
(4, 'Lưỡi Câu', 'Móc câu các size và loại cho mọi đối tượng cá', '2025-12-25 13:01:03'),
(5, 'Mồi Câu', 'Mồi giả, mồi sống, wobbler, crankbait', '2025-12-25 13:01:03'),
(6, 'Phụ Kiện Cần', 'Túi đựng, hộp đồ nghề, găng tay, khăn', '2025-12-25 13:01:03'),
(7, 'Chì Câu', 'Chì câu, chì nổi, chì đáy các loại', '2025-12-25 13:01:03'),
(8, 'Kéo & Dao', 'Kéo cắt dây, dao phi lê, dao đa năng', '2025-12-25 13:01:03'),
(9, 'Quần Áo Câu', 'Áo chống nắng, quần câu cá, giày ủng', '2025-12-25 13:01:03'),
(10, 'Túi Đồ Nghề', 'Ba lô, túi đeo, hộp nhựa đựng đồ câu', '2025-12-25 13:01:03');

-- --------------------------------------------------------

--
-- Table structure for table `coupons`
--

CREATE TABLE `coupons` (
  `id` int(10) UNSIGNED NOT NULL COMMENT 'ID mã giảm giá',
  `code` varchar(50) NOT NULL COMMENT 'Mã giảm giá',
  `description` text DEFAULT NULL COMMENT 'Mô tả khuyến mãi',
  `discount_type` enum('percentage','fixed') NOT NULL DEFAULT 'percentage' COMMENT 'Loại giảm: phần trăm hoặc cố định',
  `discount_value` decimal(10,2) NOT NULL COMMENT 'Giá trị giảm',
  `min_order_value` decimal(10,2) DEFAULT 0.00 COMMENT 'Giá trị đơn hàng tối thiểu',
  `max_discount` decimal(10,2) DEFAULT NULL COMMENT 'Giảm tối đa (cho % discount)',
  `usage_limit` int(11) DEFAULT NULL COMMENT 'Số lần sử dụng tối đa',
  `used_count` int(11) DEFAULT 0 COMMENT 'Số lần đã sử dụng',
  `start_date` datetime NOT NULL COMMENT 'Ngày bắt đầu',
  `end_date` datetime NOT NULL COMMENT 'Ngày kết thúc',
  `is_active` tinyint(1) DEFAULT 1 COMMENT 'Trạng thái kích hoạt',
  `created_at` timestamp NOT NULL DEFAULT current_timestamp() COMMENT 'Thời gian tạo',
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp() COMMENT 'Thời gian cập nhật'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='Bảng mã giảm giá';

--
-- Dumping data for table `coupons`
--

INSERT INTO `coupons` (`id`, `code`, `description`, `discount_type`, `discount_value`, `min_order_value`, `max_discount`, `usage_limit`, `used_count`, `start_date`, `end_date`, `is_active`, `created_at`, `updated_at`) VALUES
(1, 'WELCOME10', 'Giảm 10% cho đơn hàng đầu tiên', 'percentage', 10.00, 500000.00, 100000.00, 100, 0, '2025-01-01 00:00:00', '2025-12-31 23:59:59', 1, '2025-12-25 13:01:03', '2025-12-25 13:01:03'),
(2, 'FLASHSALE', 'Flash Sale - Giảm 15%', 'percentage', 15.00, 1000000.00, 200000.00, 50, 0, '2025-11-01 00:00:00', '2025-11-30 23:59:59', 1, '2025-12-25 13:01:03', '2025-12-25 13:01:03'),
(3, 'FREESHIP', 'Miễn phí vận chuyển - Giảm 50k', 'fixed', 50000.00, 300000.00, NULL, 200, 0, '2025-01-01 00:00:00', '2025-12-31 23:59:59', 1, '2025-12-25 13:01:03', '2025-12-25 13:01:03'),
(4, 'VIP2025', 'Giảm 20% cho khách VIP', 'percentage', 20.00, 2000000.00, 500000.00, 30, 0, '2025-01-01 00:00:00', '2025-12-31 23:59:59', 1, '2025-12-25 13:01:03', '2025-12-25 13:01:03'),
(5, 'NEWYEAR', 'Tết 2025 - Giảm 200k', 'fixed', 200000.00, 1500000.00, NULL, 100, 0, '2025-01-20 00:00:00', '2025-02-10 23:59:59', 1, '2025-12-25 13:01:03', '2025-12-25 13:01:03');

-- --------------------------------------------------------

--
-- Table structure for table `flash_sales`
--

CREATE TABLE `flash_sales` (
  `id` int(11) NOT NULL,
  `product_id` int(11) NOT NULL,
  `discount_percentage` decimal(5,2) NOT NULL,
  `start_time` datetime NOT NULL,
  `end_time` datetime NOT NULL,
  `status` enum('active','inactive','expired') DEFAULT 'active',
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `flash_sales`
--

INSERT INTO `flash_sales` (`id`, `product_id`, `discount_percentage`, `start_time`, `end_time`, `status`, `created_at`, `updated_at`) VALUES
(1, 2, 78.00, '2025-12-25 13:42:00', '2025-12-26 13:42:00', 'active', '2025-12-25 13:42:25', '2025-12-25 13:42:25');

-- --------------------------------------------------------

--
-- Table structure for table `orders`
--

CREATE TABLE `orders` (
  `id` int(10) UNSIGNED NOT NULL COMMENT 'ID đơn hàng',
  `user_id` int(10) UNSIGNED NOT NULL COMMENT 'ID người dùng',
  `address_id` int(10) UNSIGNED DEFAULT NULL,
  `status` enum('pending','paid','shipped','completed','cancelled') DEFAULT 'pending' COMMENT 'Trạng thái: chờ xử lý, đã thanh toán, đã giao hàng, hoàn thành, đã hủy',
  `payment_method` enum('cod','bank_transfer','e_wallet') DEFAULT 'cod' COMMENT 'Phương thức thanh toán: COD, chuyển khoản, ví điện tử',
  `total_amount` decimal(12,2) NOT NULL COMMENT 'Tổng tiền (VNĐ)',
  `note` text DEFAULT NULL COMMENT 'Ghi chú đơn hàng',
  `created_at` timestamp NOT NULL DEFAULT current_timestamp() COMMENT 'Thời gian tạo',
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp() COMMENT 'Thời gian cập nhật',
  `shipping_fee` decimal(12,2) DEFAULT 0.00 COMMENT 'Phí vận chuyển',
  `ghn_order_code` varchar(50) DEFAULT NULL COMMENT 'Mã đơn hàng GHN',
  `recipient_name` varchar(120) DEFAULT NULL COMMENT 'Tên người nhận',
  `recipient_phone` varchar(20) DEFAULT NULL COMMENT 'SĐT người nhận',
  `recipient_address` text DEFAULT NULL COMMENT 'Địa chỉ chi tiết',
  `province_id` int(11) DEFAULT NULL COMMENT 'ID tỉnh/thành GHN',
  `district_id` int(11) DEFAULT NULL COMMENT 'ID quận/huyện GHN',
  `ward_code` varchar(20) DEFAULT NULL COMMENT 'Mã phường/xã GHN'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='Bảng đơn hàng';

--
-- Dumping data for table `orders`
--

INSERT INTO `orders` (`id`, `user_id`, `address_id`, `status`, `payment_method`, `total_amount`, `note`, `created_at`, `updated_at`, `shipping_fee`, `ghn_order_code`, `recipient_name`, `recipient_phone`, `recipient_address`, `province_id`, `district_id`, `ward_code`) VALUES
(1, 1, NULL, 'pending', 'bank_transfer', 15270000.00, 'test', '2025-12-25 13:49:50', '2025-12-25 13:49:50', 30000.00, NULL, 'Nguyễn Đình Nhật Huy ', '0376911677', '90', 214, 2103, '580805'),
(2, 1, NULL, 'pending', 'cod', 15346702.00, 'test', '2025-12-25 15:45:33', '2025-12-25 15:45:33', 106702.00, NULL, 'Nguyễn Đình Nhật Huy', '0376911677', '90', 214, 1560, '580106'),
(3, 3, NULL, 'shipped', 'cod', 15454752.00, 'test', '2025-12-25 16:00:17', '2025-12-25 16:31:49', 104752.00, NULL, 'Nguyễn Đình Nhật Huy', '0376911677', '90', 214, 1560, '580106'),
(4, 4, NULL, 'completed', 'cod', 530000.00, 'Đơn test tích hợp GHN', '2025-12-25 16:11:26', '2025-12-25 16:31:39', 30000.00, NULL, 'Nguyễn Văn Test', '0901234567', '123 Đường Test, Phường 1', 202, 1442, '10101'),
(5, 3, NULL, 'paid', 'cod', 4286751.00, 'test', '2025-12-25 16:30:19', '2025-12-25 16:31:10', 36751.00, NULL, 'Nguyễn Đình Nhật Huy', '0376911677', '90', 214, 1560, '580106'),
(6, 1, NULL, 'pending', 'bank_transfer', 127546768.00, 'h', '2025-12-25 16:58:59', '2025-12-25 16:58:59', 796768.00, NULL, 'huy', '03769111677', '90', 214, 1560, '580108'),
(7, 1, NULL, 'pending', 'cod', 1724001.00, 'huy', '2025-12-25 17:18:46', '2025-12-25 17:18:46', 24001.00, NULL, 'huy', '0376911677', '90', 214, 1560, '580108'),
(8, 1, NULL, 'pending', 'cod', 1472751.00, 'huy', '2025-12-25 17:27:25', '2025-12-25 17:27:25', 22751.00, NULL, 'Huy', '0376911677', '90', 214, 1560, '580109'),
(9, 1, NULL, 'pending', 'cod', 865501.00, 'huy', '2025-12-25 17:31:25', '2025-12-25 17:31:25', 15501.00, NULL, 'Nguyễn Đình Nhật Huy', '0376911677', '99', 214, 1560, '580109'),
(10, 3, NULL, 'pending', 'cod', 1486251.00, 'j', '2025-12-25 17:40:30', '2025-12-25 17:40:30', 36251.00, NULL, 'huy', '0376911677', '09', 214, 3443, '580907'),
(11, 1, NULL, 'pending', 'cod', 165501.00, 'test', '2025-12-25 18:02:10', '2025-12-25 18:02:10', 15501.00, 'GYP7C4GN', 'huyu', '0376911677', '09', 214, 1560, '580109');

-- --------------------------------------------------------

--
-- Table structure for table `order_items`
--

CREATE TABLE `order_items` (
  `id` int(10) UNSIGNED NOT NULL COMMENT 'ID chi tiết đơn hàng',
  `order_id` int(10) UNSIGNED NOT NULL COMMENT 'ID đơn hàng',
  `product_id` int(10) UNSIGNED NOT NULL COMMENT 'ID sản phẩm',
  `quantity` int(11) NOT NULL COMMENT 'Số lượng',
  `price` decimal(12,2) NOT NULL COMMENT 'Giá tại thời điểm đặt hàng (VNĐ)',
  `created_at` timestamp NOT NULL DEFAULT current_timestamp() COMMENT 'Thời gian tạo'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='Bảng chi tiết đơn hàng';

--
-- Dumping data for table `order_items`
--

INSERT INTO `order_items` (`id`, `order_id`, `product_id`, `quantity`, `price`, `created_at`) VALUES
(1, 1, 1, 5, 1500000.00, '2025-12-25 13:49:50'),
(2, 1, 4, 3, 980000.00, '2025-12-25 13:49:50'),
(3, 1, 2, 4, 1200000.00, '2025-12-25 13:49:50'),
(4, 2, 1, 5, 1500000.00, '2025-12-25 15:45:33'),
(5, 2, 4, 3, 980000.00, '2025-12-25 15:45:33'),
(6, 2, 2, 4, 1200000.00, '2025-12-25 15:45:33'),
(7, 3, 5, 3, 2200000.00, '2025-12-25 16:00:17'),
(8, 3, 1, 3, 1500000.00, '2025-12-25 16:00:17'),
(9, 3, 3, 5, 850000.00, '2025-12-25 16:00:17'),
(10, 4, 1, 2, 250000.00, '2025-12-25 16:11:26'),
(11, 5, 3, 5, 850000.00, '2025-12-25 16:30:19'),
(12, 6, 8, 65, 1950000.00, '2025-12-25 16:58:59'),
(13, 7, 3, 2, 850000.00, '2025-12-25 17:18:46'),
(14, 8, 9, 1, 1450000.00, '2025-12-25 17:27:25'),
(15, 9, 3, 1, 850000.00, '2025-12-25 17:31:25'),
(16, 10, 9, 1, 1450000.00, '2025-12-25 17:40:30'),
(17, 11, 1, 1, 150000.00, '2025-12-25 18:02:10');

-- --------------------------------------------------------

--
-- Table structure for table `products`
--

CREATE TABLE `products` (
  `id` int(10) UNSIGNED NOT NULL COMMENT 'ID sản phẩm',
  `category_id` int(10) UNSIGNED DEFAULT NULL COMMENT 'ID danh mục',
  `name` varchar(200) NOT NULL COMMENT 'Tên sản phẩm',
  `description` text DEFAULT NULL COMMENT 'Mô tả chi tiết',
  `price` decimal(12,2) NOT NULL COMMENT 'Giá bán (VNĐ)',
  `sku` varchar(80) NOT NULL COMMENT 'Mã SKU sản phẩm',
  `stock_quantity` int(11) NOT NULL DEFAULT 0 COMMENT 'Số lượng tồn kho',
  `status` enum('draft','active','inactive') DEFAULT 'active' COMMENT 'Trạng thái: nháp, đang bán, ngừng bán',
  `created_at` timestamp NOT NULL DEFAULT current_timestamp() COMMENT 'Thời gian tạo',
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp() COMMENT 'Thời gian cập nhật'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='Bảng sản phẩm';

--
-- Dumping data for table `products`
--

INSERT INTO `products` (`id`, `category_id`, `name`, `description`, `price`, `sku`, `stock_quantity`, `status`, `created_at`, `updated_at`) VALUES
(1, 1, 'Cần Câu Carbon Pro 2.1m', 'Cần câu carbon cao cấp chuyên dụng cho câu lure và bơi câu. Độ bền vượt trội, trọng lượng nhẹ 185g.', 150000.00, 'CC-PRO-21', 50, 'active', '2025-12-25 13:01:03', '2025-12-25 17:59:35'),
(2, 1, 'Cần Câu Daiwa Legalis 1.8m', 'Cần câu Daiwa nhập khẩu chính hãng từ Nhật Bản. Thiết kế 2 khúc rời tiện lợi.', 1200000.00, 'CC-DAI-18', 45, 'active', '2025-12-25 13:01:03', '2025-12-25 13:01:03'),
(3, 1, 'Cần Câu Telescopic 3.6m', 'Cần câu rút gọn tiện lợi, dài 3.6m khi mở, chỉ 50cm khi gấp. Phù hợp cho câu xa bờ.', 850000.00, 'CC-TEL-36', 60, 'active', '2025-12-25 13:01:03', '2025-12-25 13:01:03'),
(4, 1, 'Cần Câu Shimano FX 2.4m', 'Cần câu giá tốt cho người mới bắt đầu, độ bền cao, chịu lực 10kg.', 980000.00, 'CC-SHI-24', 55, 'active', '2025-12-25 13:01:03', '2025-12-25 13:01:03'),
(5, 1, 'Cần Câu Jigging 1.65m', 'Cần câu jigging chuyên dụng cho câu cá biển, thân cứng, nhạy cảm tốt.', 2200000.00, 'CC-JIG-165', 30, 'active', '2025-12-25 13:01:03', '2025-12-25 13:01:03'),
(6, 1, 'Cần Câu Surf 4.2m', 'Cần câu surf casting dài 4.2m cho câu ném xa từ bờ biển.', 1800000.00, 'CC-SURF-42', 25, 'active', '2025-12-25 13:01:03', '2025-12-25 13:01:03'),
(7, 1, 'Cần Câu Lure Bass 1.98m', 'Cần câu lure chuyên săn cá bass, độ nhạy cao, thiết kế split grip.', 1650000.00, 'CC-BASS-198', 40, 'active', '2025-12-25 13:01:03', '2025-12-25 13:01:03'),
(8, 1, 'Cần Câu Abu Garcia 2.13m', 'Cần câu Abu Garcia chất lượng Mỹ, thiết kế robust cho câu cá lớn.', 1950000.00, 'CC-ABU-213', 35, 'active', '2025-12-25 13:01:03', '2025-12-25 13:01:03'),
(9, 1, 'Cần Câu Máy Ngang 1.8m', 'Cần câu chuyên dụng cho máy câu ngang baitcasting, chịu lực 15kg.', 1450000.00, 'CC-NGANG-18', 42, 'active', '2025-12-25 13:01:03', '2025-12-25 13:01:03'),
(10, 1, 'Cần Câu Cá Tre 5.4m', 'Cần câu cá tre truyền thống Nhật Bản, siêu nhẹ, độ bền tuyệt vời.', 3500000.00, 'CC-TRE-54', 15, 'active', '2025-12-25 13:01:03', '2025-12-25 13:01:03'),
(11, 2, 'Máy Câu Shimano 3000', 'Máy câu spinning Shimano 3000 với công nghệ Hagane Body, 5+1BB.', 2500000.00, 'MC-SHI-3000', 38, '/images/products/may-cau-1.jpg', 'active', '2025-12-25 13:01:03', '2025-12-25 13:01:03'),
(12, 2, 'Máy Câu Daiwa BG 4000', 'Máy câu Daiwa BG 4000 chuyên dụng cho cá biển và cá nước ngọt cỡ lớn.', 3200000.00, 'MC-DAI-4000', 28, '/images/products/may-cau-2.jpg', 'active', '2025-12-25 13:01:03', '2025-12-25 13:01:03'),
(13, 2, 'Máy Câu Penn Battle III 2500', 'Máy câu Penn Battle chống nước mặn tuyệt đối, 6+1BB.', 2800000.00, 'MC-PENN-2500', 32, '/images/products/may-cau-3.jpg', 'active', '2025-12-25 13:01:03', '2025-12-25 13:01:03'),
(14, 2, 'Máy Câu Abu Garcia Pro Max', 'Máy câu ngang Abu Garcia cho câu lure bass, tỷ số truyền 7.1:1.', 2100000.00, 'MC-ABU-PMAX', 35, '/images/products/may-cau-4.jpg', 'active', '2025-12-25 13:01:03', '2025-12-25 13:01:03'),
(15, 2, 'Máy Câu Daiwa Tatula 100', 'Máy câu ngang Daiwa Tatula siêu nhẹ 190g, phanh từ tính TWS.', 3800000.00, 'MC-TAT-100', 22, '/images/products/may-cau-5.jpg', 'active', '2025-12-25 13:01:03', '2025-12-25 13:01:03'),
(16, 2, 'Máy Câu Shimano Stradic 4000', 'Máy câu Shimano Stradic CI4+ siêu nhẹ, công nghệ X-Ship.', 4200000.00, 'MC-STR-4000', 18, '/images/products/may-cau-6.jpg', 'active', '2025-12-25 13:01:03', '2025-12-25 13:01:03'),
(17, 2, 'Máy Câu Okuma Ceymar 3000', 'Máy câu giá rẻ chất lượng tốt cho người mới, 8BB.', 850000.00, 'MC-OKU-3000', 65, '/images/products/may-cau-7.jpg', 'active', '2025-12-25 13:01:03', '2025-12-25 13:01:03'),
(18, 2, 'Máy Câu Shimano Sedona 2500', 'Máy câu Shimano Sedona entry level, độ bền cao.', 1200000.00, 'MC-SED-2500', 55, '/images/products/may-cau-8.jpg', 'active', '2025-12-25 13:01:03', '2025-12-25 13:01:03'),
(19, 2, 'Máy Câu Jigging Daiwa Saltiga', 'Máy câu jigging cao cấp Daiwa Saltiga cho cá biển lớn.', 12500000.00, 'MC-SALT-JIG', 8, '/images/products/may-cau-9.jpg', 'active', '2025-12-25 13:01:03', '2025-12-25 13:01:03'),
(20, 2, 'Máy Câu Fly Fishing Orvis', 'Máy câu ruồi Orvis chuyên nghiệp cho câu cá hồi.', 5800000.00, 'MC-FLY-ORV', 12, '/images/products/may-cau-10.jpg', 'active', '2025-12-25 13:01:03', '2025-12-25 13:01:03'),
(21, 3, 'Dây PE 8 Lõi 150m', 'Dây câu PE 8 lõi cao cấp, sức bền vượt trội, độ dãn giãn thấp.', 350000.00, 'DY-PE8-150', 120, '/images/products/day-cuoc-1.jpg', 'active', '2025-12-25 13:01:03', '2025-12-25 13:01:03'),
(22, 3, 'Dây Carbon Fluorocarbon 50m', 'Dây Fluorocarbon 100% trong suốt dưới nước, độ chìm nhanh.', 280000.00, 'DY-CF-50', 95, '/images/products/day-cuoc-2.jpg', 'active', '2025-12-25 13:01:03', '2025-12-25 13:01:03'),
(23, 3, 'Dây Nylon Asso 300m', 'Dây nylon chất lượng Đức, độ bền cao, giá cả phải chăng.', 150000.00, 'DY-NYL-300', 150, '/images/products/day-cuoc-3.jpg', 'active', '2025-12-25 13:01:03', '2025-12-25 13:01:03'),
(24, 3, 'Dây PE 4 Lõi Sunline 200m', 'Dây PE 4 lõi Sunline Nhật Bản, mềm mại, ném xa.', 420000.00, 'DY-PE4-200', 85, '/images/products/day-cuoc-4.jpg', 'active', '2025-12-25 13:01:03', '2025-12-25 13:01:03'),
(25, 3, 'Dây Leader Fluorocarbon 30m', 'Dây leader chống mài mòn cho câu cá có răng sắc.', 180000.00, 'DY-LD-30', 110, '/images/products/day-cuoc-5.jpg', 'active', '2025-12-25 13:01:03', '2025-12-25 13:01:03'),
(26, 3, 'Dây Braid Daiwa J-Braid 300m', 'Dây braid Daiwa 8 sợi, độ bền cao, nhiều màu sắc.', 580000.00, 'DY-JBR-300', 75, '/images/products/day-cuoc-6.jpg', 'active', '2025-12-25 13:01:03', '2025-12-25 13:01:03'),
(27, 3, 'Dây Monofilament 500m', 'Dây monofilament cơ bản cho câu cá phổ thông.', 85000.00, 'DY-MONO-500', 200, '/images/products/day-cuoc-7.jpg', 'active', '2025-12-25 13:01:03', '2025-12-25 13:01:03'),
(28, 3, 'Dây PE Shimano Kairiki 150m', 'Dây PE Shimano Kairiki 8 sợi màu xanh lá.', 520000.00, 'DY-KAI-150', 68, '/images/products/day-cuoc-8.jpg', 'active', '2025-12-25 13:01:03', '2025-12-25 13:01:03'),
(29, 3, 'Dây Casting Line 100m', 'Dây chuyên dụng cho máy câu ngang, độ cứng vừa phải.', 220000.00, 'DY-CAST-100', 90, '/images/products/day-cuoc-9.jpg', 'active', '2025-12-25 13:01:03', '2025-12-25 13:01:03'),
(30, 3, 'Dây Fly Line Trout', 'Dây câu ruồi cho cá hồi, nổi, màu cam.', 850000.00, 'DY-FLY-TRT', 45, '/images/products/day-cuoc-10.jpg', 'active', '2025-12-25 13:01:03', '2025-12-25 13:01:03'),
(31, 4, 'Bộ 100 Lưỡi Câu Assorted', 'Bộ 100 chiếc lưỡi câu đa dạng size 1-10 trong hộp nhựa tiện lợi.', 150000.00, 'LC-ASS-100', 250, '/images/products/luoi-cau-1.jpg', 'active', '2025-12-25 13:01:03', '2025-12-25 13:01:03'),
(32, 4, 'Lưỡi Câu Chuyên Dụng Size 8/0', 'Lưỡi câu cỡ lớn size 8/0 cho săn cá tra, cá hú, cá mú.', 80000.00, 'LC-BIG-80', 180, '/images/products/luoi-cau-2.jpg', 'active', '2025-12-25 13:01:03', '2025-12-25 13:01:03'),
(33, 4, 'Lưỡi Câu Owner Treble Hook', 'Lưỡi câu 3 nhánh Owner Nhật Bản, cực sắc, chống gỉ.', 120000.00, 'LC-OWN-TRE', 140, '/images/products/luoi-cau-3.jpg', 'active', '2025-12-25 13:01:03', '2025-12-25 13:01:03'),
(34, 4, 'Lưỡi Câu Circle Hook Size 2/0', 'Lưỡi câu tròn tự móc, giảm tỷ lệ cá chết, size 2/0.', 95000.00, 'LC-CIR-20', 165, '/images/products/luoi-cau-4.jpg', 'active', '2025-12-25 13:01:03', '2025-12-25 13:01:03'),
(35, 4, 'Lưỡi Câu Jig Head 5g', 'Lưỡi jig head có chì 5g cho câu mồi mềm.', 45000.00, 'LC-JIG-5G', 220, '/images/products/luoi-cau-5.jpg', 'active', '2025-12-25 13:01:03', '2025-12-25 13:01:03'),
(36, 4, 'Lưỡi Câu Worm Hook', 'Lưỡi câu worm offset cho mồi giun nhựa, size 2/0.', 75000.00, 'LC-WORM-20', 155, '/images/products/luoi-cau-6.jpg', 'active', '2025-12-25 13:01:03', '2025-12-25 13:01:03'),
(37, 4, 'Lưỡi Câu Gamakatsu Octopus', 'Lưỡi câu Gamakatsu Octopus chống rỉ, size 1/0.', 110000.00, 'LC-GAM-OCT', 125, '/images/products/luoi-cau-7.jpg', 'active', '2025-12-25 13:01:03', '2025-12-25 13:01:03'),
(38, 4, 'Lưỡi Câu Chống Rối Hair Rig', 'Lưỡi câu chống rối với lông cho câu cá chép.', 65000.00, 'LC-HAIR-RIG', 185, '/images/products/luoi-cau-8.jpg', 'active', '2025-12-25 13:01:03', '2025-12-25 13:01:03'),
(39, 4, 'Lưỡi Câu Assist Hook Jigging', 'Lưỡi câu assist dành cho jigging cá biển lớn.', 180000.00, 'LC-AST-JIG', 95, '/images/products/luoi-cau-9.jpg', 'active', '2025-12-25 13:01:03', '2025-12-25 13:01:03'),
(40, 4, 'Lưỡi Câu Drop Shot', 'Lưỡi câu drop shot size 1 cho kỹ thuật câu thả chìm.', 85000.00, 'LC-DROP-1', 170, '/images/products/luoi-cau-10.jpg', 'active', '2025-12-25 13:01:03', '2025-12-25 13:01:03'),
(41, 5, 'Mồi Giả Rapala 12cm', 'Mồi cá giả Rapala Original Floating 12cm, huyền thoại câu lure.', 250000.00, 'MG-RAP-12', 75, '/images/products/moi-cau-1.jpg', 'active', '2025-12-25 13:01:03', '2025-12-25 13:01:03'),
(42, 5, 'Mồi Mềm Silicon 10 Con', 'Bộ 10 con mồi mềm silicon nhiều màu sắc cho câu cá lóc, cá rô.', 120000.00, 'MM-SIL-10', 110, '/images/products/moi-cau-2.jpg', 'active', '2025-12-25 13:01:03', '2025-12-25 13:01:03'),
(43, 5, 'Mồi Crankbait Duo Realis', 'Mồi crankbait Duo Realis lặn sâu 2-3m, âm thanh hấp dẫn.', 320000.00, 'MC-DUO-CRK', 65, '/images/products/moi-cau-3.jpg', 'active', '2025-12-25 13:01:03', '2025-12-25 13:01:03'),
(44, 5, 'Mồi Topwater Popper', 'Mồi nổi popper tạo âm thanh chộp nước, câu cá tầng mặt.', 180000.00, 'MT-POP-7CM', 88, '/images/products/moi-cau-4.jpg', 'active', '2025-12-25 13:01:03', '2025-12-25 13:01:03'),
(45, 5, 'Mồi Spinner Mepps', 'Mồi quay Mepps cổ điển Pháp, lưỡi kim loại lấp lánh.', 95000.00, 'MS-MEP-3', 145, '/images/products/moi-cau-5.jpg', 'active', '2025-12-25 13:01:03', '2025-12-25 13:01:03'),
(46, 5, 'Mồi Jig Rubber 14g', 'Mồi jig cao su 14g với váy silicon rung động mạnh.', 55000.00, 'MJ-RUB-14', 195, '/images/products/moi-cau-6.jpg', 'active', '2025-12-25 13:01:03', '2025-12-25 13:01:03'),
(47, 5, 'Mồi Frog Topwater', 'Mồi nhái silicon cho câu cá lóc ở vùng đầm lầy.', 160000.00, 'MF-FROG-6CM', 92, '/images/products/moi-cau-7.jpg', 'active', '2025-12-25 13:01:03', '2025-12-25 13:01:03'),
(48, 5, 'Mồi Shad Tail 12cm', 'Mồi đuôi quẹt 12cm mô phỏng cá mồi tự nhiên.', 85000.00, 'MS-SHAD-12', 135, '/images/products/moi-cau-8.jpg', 'active', '2025-12-25 13:01:03', '2025-12-25 13:01:03'),
(49, 5, 'Mồi Metal Jig 60g', 'Mồi kim loại 60g cho jigging cá biển sâu.', 280000.00, 'MM-JIG-60', 72, '/images/products/moi-cau-9.jpg', 'active', '2025-12-25 13:01:03', '2025-12-25 13:01:03'),
(50, 5, 'Mồi Sống Giun Nhật', 'Giun nhật tươi sống đóng hộp 50g cho câu cá tự nhiên.', 45000.00, 'MS-GIUN-50', 250, '/images/products/moi-cau-10.jpg', 'active', '2025-12-25 13:01:03', '2025-12-25 13:01:03'),
(51, 6, 'Túi Đựng Cần 2 Ngăn', 'Túi vải canvas bền chắc đựng 3-4 cần câu, 2 ngăn riêng biệt.', 450000.00, 'PK-TUI-2N', 58, '/images/products/phu-kien-1.jpg', 'active', '2025-12-25 13:01:03', '2025-12-25 13:01:03'),
(52, 6, 'Hộp Đồ Nghề 4 Tầng', 'Hộp nhựa ABS 4 tầng, 40 ngăn chứa lưỡi câu và phụ kiện.', 320000.00, 'PK-HOP-4T', 68, '/images/products/phu-kien-2.jpg', 'active', '2025-12-25 13:01:03', '2025-12-25 13:01:03'),
(53, 6, 'Găng Tay Câu Cá', 'Găng tay chống trượt, chống nắng, để lộ 3 ngón tiện dụng.', 85000.00, 'PK-GANG-TAY', 150, '/images/products/phu-kien-3.jpg', 'active', '2025-12-25 13:01:03', '2025-12-25 13:01:03'),
(54, 6, 'Khăn Lau Đa Năng', 'Khăn microfiber thấm hút tốt, lau cần máy câu.', 35000.00, 'PK-KHAN-LAU', 220, '/images/products/phu-kien-4.jpg', 'active', '2025-12-25 13:01:03', '2025-12-25 13:01:03'),
(55, 6, 'Kẹp Cần Câu Inox', 'Kẹp cần câu inox gắn thuyền hoặc ghế, xoay 360 độ.', 280000.00, 'PK-KEP-CAN', 42, '/images/products/phu-kien-5.jpg', 'active', '2025-12-25 13:01:03', '2025-12-25 13:01:03'),
(56, 6, 'Giá Đỡ Cần 3 Chân', 'Giá đỡ cần câu tripod nhôm, điều chỉnh độ cao linh hoạt.', 420000.00, 'PK-GIA-DO', 35, '/images/products/phu-kien-6.jpg', 'active', '2025-12-25 13:01:03', '2025-12-25 13:01:03'),
(57, 6, 'Dây Đeo Cần Câu', 'Dây đeo cần câu có đệm vai, giảm mỏi khi di chuyển.', 120000.00, 'PK-DAY-DEO', 95, '/images/products/phu-kien-7.jpg', 'active', '2025-12-25 13:01:03', '2025-12-25 13:01:03'),
(58, 6, 'Đèn Pin Đội Đầu LED', 'Đèn pin đội đầu sạc USB, 3 chế độ sáng cho câu đêm.', 180000.00, 'PK-DEN-DAU', 78, '/images/products/phu-kien-8.jpg', 'active', '2025-12-25 13:01:03', '2025-12-25 13:01:03'),
(59, 6, 'Thùng Đá Giữ Lạnh 30L', 'Thùng đá giữ lạnh cá 30L, giữ lạnh 48h.', 850000.00, 'PK-THUNG-DA', 28, '/images/products/phu-kien-9.jpg', 'active', '2025-12-25 13:01:03', '2025-12-25 13:01:03'),
(60, 6, 'Kìm Bấm Chì Đa Năng', 'Kìm bấm chì, cắt dây, tháo lưỡi câu 3 trong 1.', 95000.00, 'PK-KIM-BAM', 125, '/images/products/phu-kien-10.jpg', 'active', '2025-12-25 13:01:03', '2025-12-25 13:01:03'),
(61, 7, 'Chì Câu Hình Oliu 10g', 'Chì câu hình oliu 10g chống rối, dễ ném xa.', 25000.00, 'CH-OLIU-10', 280, '/images/products/chi-cau-1.jpg', 'active', '2025-12-25 13:01:03', '2025-12-25 13:01:03'),
(62, 7, 'Chì Nổi Câu Cá Chép', 'Phao câu cá chép hình giọt nước, nhạy cảm cao.', 45000.00, 'CH-NOI-CHEP', 195, '/images/products/chi-cau-2.jpg', 'active', '2025-12-25 13:01:03', '2025-12-25 13:01:03'),
(63, 7, 'Chì Đáy Dẹt 50g', 'Chì đáy dẹt 50g cho câu biển, chống trôi dòng nước.', 35000.00, 'CH-DAY-50', 220, '/images/products/chi-cau-3.jpg', 'active', '2025-12-25 13:01:03', '2025-12-25 13:01:03'),
(64, 7, 'Chì Lê Dài 20g', 'Chì lê dài 20g cho câu ném xa, hình dáng aerodynamic.', 18000.00, 'CH-LE-20', 310, '/images/products/chi-cau-4.jpg', 'active', '2025-12-25 13:01:03', '2025-12-25 13:01:03'),
(65, 7, 'Phao Câu Điện Tử LED', 'Phao câu điện tử phát sáng LED cho câu đêm.', 120000.00, 'CH-LED-PHAO', 85, '/images/products/chi-cau-5.jpg', 'active', '2025-12-25 13:01:03', '2025-12-25 13:01:03'),
(66, 7, 'Chì Hình Tròn Assorted', 'Bộ chì hình tròn nhiều size từ 5g-30g.', 55000.00, 'CH-TRON-SET', 165, '/images/products/chi-cau-6.jpg', 'active', '2025-12-25 13:01:03', '2025-12-25 13:01:03'),
(67, 7, 'Chì Texas Rig Bullet', 'Chì hình đạn cho texas rig, chống rối cỏ tốt.', 32000.00, 'CH-TEX-BUL', 240, '/images/products/chi-cau-7.jpg', 'active', '2025-12-25 13:01:03', '2025-12-25 13:01:03'),
(68, 7, 'Chì Carolina Rig Egg', 'Chì hình trứng cho carolina rig câu bass.', 28000.00, 'CH-CAR-EGG', 255, '/images/products/chi-cau-8.jpg', 'active', '2025-12-25 13:01:03', '2025-12-25 13:01:03'),
(69, 7, 'Phao Cá Sống Balsa', 'Phao gỗ balsa tự nhiên cho câu cá sống.', 65000.00, 'CH-BALSA-PHO', 125, '/images/products/chi-cau-9.jpg', 'active', '2025-12-25 13:01:03', '2025-12-25 13:01:03'),
(70, 7, 'Chì Nổi Waggler', 'Phao waggler Anh Quốc cho câu xa, chống gió.', 95000.00, 'CH-WAGG-UK', 95, '/images/products/chi-cau-10.jpg', 'active', '2025-12-25 13:01:03', '2025-12-25 13:01:03'),
(71, 8, 'Kéo Cắt Dây Titan', 'Kéo cắt dây câu titan, sắc bén, chống gỉ hoàn toàn.', 120000.00, 'KD-KEO-TIT', 110, '/images/products/keo-dao-1.jpg', 'active', '2025-12-25 13:01:03', '2025-12-25 13:01:03'),
(72, 8, 'Dao Phi Lê 7 Inch', 'Dao phi lê cá 7 inch lưỡi mỏng, linh hoạt.', 280000.00, 'KD-DAO-PHI', 68, '/images/products/keo-dao-2.jpg', 'active', '2025-12-25 13:01:03', '2025-12-25 13:01:03'),
(73, 8, 'Kéo Đa Năng Rapala', 'Kéo đa năng Rapala có vỏ bảo vệ, mở nắp chai.', 180000.00, 'KD-KEO-RAP', 85, '/images/products/keo-dao-3.jpg', 'active', '2025-12-25 13:01:03', '2025-12-25 13:01:03'),
(74, 8, 'Dao Swiss Army', 'Dao đa năng Swiss Army 12 chức năng cho câu cá.', 450000.00, 'KD-DAO-SWI', 52, '/images/products/keo-dao-4.jpg', 'active', '2025-12-25 13:01:03', '2025-12-25 13:01:03'),
(75, 8, 'Kéo Cắt Braid Chuyên Dụng', 'Kéo cắt dây braid PE chuyên dụng, cực sắc.', 95000.00, 'KD-KEO-BRA', 125, '/images/products/keo-dao-5.jpg', 'active', '2025-12-25 13:01:03', '2025-12-25 13:01:03'),
(76, 8, 'Dao Mổ Cá Mini', 'Dao mổ cá mini gọn nhẹ, lưỡi inox không gỉ.', 55000.00, 'KD-DAO-MIN', 180, '/images/products/keo-dao-6.jpg', 'active', '2025-12-25 13:01:03', '2025-12-25 13:01:03'),
(77, 8, 'Kìm Bấm Chì & Cắt', 'Kìm bấm chì kiêm cắt dây, tay cầm cao su chống trượt.', 135000.00, 'KD-KIM-BAM', 95, '/images/products/keo-dao-7.jpg', 'active', '2025-12-25 13:01:03', '2025-12-25 13:01:03'),
(78, 8, 'Dao Bỏ Vẩy Cá', 'Dao bỏ vẩy cá với răng cưa, tay cầm ergonomic.', 75000.00, 'KD-DAO-VAY', 145, '/images/products/keo-dao-8.jpg', 'active', '2025-12-25 13:01:03', '2025-12-25 13:01:03'),
(79, 8, 'Kéo Tháo Lưỡi Câu', 'Kéo tháo lưỡi câu y tế, đầu cong, giảm tổn thương cá.', 85000.00, 'KD-KEO-THAO', 105, '/images/products/keo-dao-9.jpg', 'active', '2025-12-25 13:01:03', '2025-12-25 13:01:03'),
(80, 8, 'Dao Gập Outdoor', 'Dao gập outdoor có khóa an toàn, lưỡi 3 inch.', 220000.00, 'KD-DAO-GAP', 72, '/images/products/keo-dao-10.jpg', 'active', '2025-12-25 13:01:03', '2025-12-25 13:01:03'),
(81, 9, 'Áo Chống Nắng UPF50+', 'Áo chống nắng UPF50+ siêu mát, nhanh khô.', 180000.00, 'QA-AO-NANG', 125, '/images/products/quan-ao-1.jpg', 'active', '2025-12-25 13:01:03', '2025-12-25 13:01:03'),
(82, 9, 'Quần Câu Cá Nhanh Khô', 'Quần câu cá nhanh khô, nhiều túi, co giãn 4 chiều.', 250000.00, 'QA-QUAN-NK', 95, '/images/products/quan-ao-2.jpg', 'active', '2025-12-25 13:01:03', '2025-12-25 13:01:03'),
(83, 9, 'Giày Ủng Đi Biển', 'Giày ủng cao su đi biển, chống trượt, thoáng khí.', 320000.00, 'QA-GIAY-UNG', 68, '/images/products/quan-ao-3.jpg', 'active', '2025-12-25 13:01:03', '2025-12-25 13:01:03'),
(84, 9, 'Áo Khoác Chống Thấm', 'Áo khoác chống thấm nước, chống gió cho câu mùa mưa.', 450000.00, 'QA-AO-THAM', 55, '/images/products/quan-ao-4.jpg', 'active', '2025-12-25 13:01:03', '2025-12-25 13:01:03'),
(85, 9, 'Mũ Rộng Vành Chống Nắng', 'Mũ rộng vành chống nắng, thông gió tốt.', 95000.00, 'QA-MU-VANH', 165, '/images/products/quan-ao-5.jpg', 'active', '2025-12-25 13:01:03', '2025-12-25 13:01:03'),
(86, 9, 'Găng Tay Lộ 3 Ngón', 'Găng tay câu cá lộ 3 ngón, chống nắng UV.', 75000.00, 'QA-GANG-3N', 185, '/images/products/quan-ao-6.jpg', 'active', '2025-12-25 13:01:03', '2025-12-25 13:01:03'),
(87, 9, 'Áo Phao Cứu Sinh', 'Áo phao cứu sinh cho câu trên thuyền, đạt chuẩn.', 380000.00, 'QA-AO-PHAO', 48, '/images/products/quan-ao-7.jpg', 'active', '2025-12-25 13:01:03', '2025-12-25 13:01:03'),
(88, 9, 'Khăn Trùm Đầu Ninja', 'Khăn trùm đầu ninja chống nắng toàn diện.', 55000.00, 'QA-KHAN-NIN', 210, '/images/products/quan-ao-8.jpg', 'active', '2025-12-25 13:01:03', '2025-12-25 13:01:03'),
(89, 9, 'Quần Lội Nước Wader', 'Quần lội nước wader cao đến ngực cho câu suối.', 850000.00, 'QA-QUAN-WAD', 32, '/images/products/quan-ao-9.jpg', 'active', '2025-12-25 13:01:03', '2025-12-25 13:01:03'),
(90, 9, 'Áo Gi-lê Đa Túi', 'Áo gi-lê đa túi chuyên dụng cho câu cá, 12 túi.', 420000.00, 'QA-AO-GILE', 62, '/images/products/quan-ao-10.jpg', 'active', '2025-12-25 13:01:03', '2025-12-25 13:01:03'),
(91, 10, 'Ba Lô Câu Cá 40L', 'Ba lô câu cá chống nước 40L, nhiều ngăn tiện dụng.', 650000.00, 'TUI-BALO-40', 45, '/images/products/tui-do-1.jpg', 'active', '2025-12-25 13:01:03', '2025-12-25 13:01:03'),
(92, 10, 'Túi Đeo Hông Tactical', 'Túi đeo hông tactical, chứa hộp mồi và phụ kiện nhỏ.', 280000.00, 'TUI-DEO-TAC', 82, '/images/products/tui-do-2.jpg', 'active', '2025-12-25 13:01:03', '2025-12-25 13:01:03'),
(93, 10, 'Hộp Nhựa 5 Tầng', 'Hộp nhựa trong suốt 5 tầng, 50 ngăn chia linh hoạt.', 380000.00, 'TUI-HOP-5T', 58, '/images/products/tui-do-3.jpg', 'active', '2025-12-25 13:01:03', '2025-12-25 13:01:03'),
(94, 10, 'Túi Đựng Mồi Giả', 'Túi đựng mồi giả chuyên dụng, ngăn đệm mút xốp.', 220000.00, 'TUI-MOI-GIA', 95, '/images/products/tui-do-4.jpg', 'active', '2025-12-25 13:01:03', '2025-12-25 13:01:03'),
(95, 10, 'Hộp Chống Nước IP67', 'Hộp chống nước IP67 cho điện thoại và ví.', 150000.00, 'TUI-HOP-IP67', 125, '/images/products/tui-do-5.jpg', 'active', '2025-12-25 13:01:03', '2025-12-25 13:01:03'),
(96, 10, 'Túi Đựng Cá Lưới', 'Túi lưới đựng cá giữ tươi sống, kích thước 60cm.', 85000.00, 'TUI-LUOI-60', 155, '/images/products/tui-do-6.jpg', 'active', '2025-12-25 13:01:03', '2025-12-25 13:01:03'),
(97, 10, 'Ba Lô Ghế Gấp 2in1', 'Ba lô kiêm ghế gấp cho câu cá ngồi lâu.', 780000.00, 'TUI-BALO-GHE', 35, '/images/products/tui-do-7.jpg', 'active', '2025-12-25 13:01:03', '2025-12-25 13:01:03'),
(98, 10, 'Túi Giữ Nhiệt 15L', 'Túi giữ nhiệt 15L đựng đồ ăn uống và mồi sống.', 420000.00, 'TUI-NHIET-15', 68, '/images/products/tui-do-8.jpg', 'active', '2025-12-25 13:01:03', '2025-12-25 13:01:03'),
(99, 10, 'Hộp Đựng Lưỡi Câu Từ Tính', 'Hộp đựng lưỡi câu có nam châm, chống rớt.', 95000.00, 'TUI-HOP-TU', 145, '/images/products/tui-do-9.jpg', 'active', '2025-12-25 13:01:03', '2025-12-25 13:01:03'),
(100, 10, 'Túi Cuộn Cần Telescopic', 'Túi cuộn đựng cần telescopic gọn nhẹ, chống nước.', 180000.00, 'TUI-CUON-TEL', 88, '/images/products/tui-do-10.jpg', 'active', '2025-12-25 13:01:03', '2025-12-25 13:01:03');

-- --------------------------------------------------------

--
-- Table structure for table `product_images`
--

CREATE TABLE `product_images` (
  `id` int(10) UNSIGNED NOT NULL COMMENT 'ID hình ảnh',
  `product_id` int(10) UNSIGNED NOT NULL COMMENT 'ID sản phẩm',
  `image_url` varchar(255) NOT NULL COMMENT 'URL hình ảnh',
  `alt_text` varchar(120) DEFAULT NULL COMMENT 'Mô tả ảnh (alt text)',
  `is_primary` tinyint(1) DEFAULT 0 COMMENT 'Là ảnh chính (1) hay không (0)',
  `created_at` timestamp NOT NULL DEFAULT current_timestamp() COMMENT 'Thời gian tạo'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='Bảng hình ảnh sản phẩm';

--
-- Dumping data for table `product_images`
--

INSERT INTO `product_images` (`id`, `product_id`, `image_url`, `alt_text`, `is_primary`, `created_at`) VALUES
(5, 2, '/images/products/can-cau-daiwa-1.jpg', 'Cần câu Daiwa', 1, '2025-12-25 13:01:03'),
(6, 2, '/images/products/can-cau-daiwa-2.jpg', 'Chi tiết cần', 0, '2025-12-25 13:01:03'),
(7, 2, '/images/products/can-cau-daiwa-3.jpg', 'Góc sử dụng', 0, '2025-12-25 13:01:03'),
(8, 3, '/images/products/may-cau-shimano-1.jpg', 'Máy câu Shimano 3000', 1, '2025-12-25 13:01:03'),
(9, 3, '/images/products/may-cau-shimano-2.jpg', 'Chi tiết máy câu', 0, '2025-12-25 13:01:03'),
(10, 3, '/images/products/may-cau-shimano-3.jpg', 'Góc cận cảnh', 0, '2025-12-25 13:01:03'),
(11, 3, '/images/products/may-cau-shimano-4.jpg', 'Máy câu trên cần', 0, '2025-12-25 13:01:03'),
(12, 4, '/images/products/may-cau-daiwa-1.jpg', 'Máy câu Daiwa BG', 1, '2025-12-25 13:01:03'),
(13, 4, '/images/products/may-cau-daiwa-2.jpg', 'Chi tiết máy', 0, '2025-12-25 13:01:03'),
(14, 4, '/images/products/may-cau-daiwa-3.jpg', 'Cận cảnh', 0, '2025-12-25 13:01:03'),
(15, 5, '/images/products/day-pe-8-loi-1.jpg', 'Cuộn dây PE', 1, '2025-12-25 13:01:03'),
(16, 5, '/images/products/day-pe-8-loi-2.jpg', 'Chi tiết dây', 0, '2025-12-25 13:01:03'),
(17, 5, '/images/products/day-pe-8-loi-3.jpg', 'Dây trên máy câu', 0, '2025-12-25 13:01:03'),
(18, 6, '/images/products/day-carbon-1.jpg', 'Cuộn dây carbon', 1, '2025-12-25 13:01:03'),
(19, 6, '/images/products/day-carbon-2.jpg', 'Chi tiết', 0, '2025-12-25 13:01:03'),
(20, 7, '/images/products/luoi-cau-assorted-1.jpg', 'Bộ lưỡi câu đa dạng', 1, '2025-12-25 13:01:03'),
(21, 7, '/images/products/luoi-cau-assorted-2.jpg', 'Chi tiết lưỡi câu', 0, '2025-12-25 13:01:03'),
(22, 7, '/images/products/luoi-cau-assorted-3.jpg', 'Các size khác nhau', 0, '2025-12-25 13:01:03'),
(23, 8, '/images/products/luoi-cau-ca-lon-1.jpg', 'Lưỡi câu cỡ lớn', 1, '2025-12-25 13:01:03'),
(24, 8, '/images/products/luoi-cau-ca-lon-2.jpg', 'Chi tiết móc', 0, '2025-12-25 13:01:03'),
(25, 9, '/images/products/moi-gia-rapala-1.jpg', 'Mồi giả Rapala', 1, '2025-12-25 13:01:03'),
(26, 9, '/images/products/moi-gia-rapala-2.jpg', 'Chi tiết mồi', 0, '2025-12-25 13:01:03'),
(27, 9, '/images/products/moi-gia-rapala-3.jpg', 'Góc khác', 0, '2025-12-25 13:01:03'),
(28, 9, '/images/products/moi-gia-rapala-4.jpg', 'Mồi trong nước', 0, '2025-12-25 13:01:03'),
(29, 10, '/images/products/moi-mem-silicon-1.jpg', 'Bộ mồi mềm silicon', 1, '2025-12-25 13:01:03'),
(30, 10, '/images/products/moi-mem-silicon-2.jpg', 'Chi tiết mồi mềm', 0, '2025-12-25 13:01:03'),
(31, 10, '/images/products/moi-mem-silicon-3.jpg', 'Các màu sắc', 0, '2025-12-25 13:01:03'),
(32, 11, '/images/products/tui-dung-can-1.jpg', 'Túi đựng cần câu', 1, '2025-12-25 13:01:03'),
(33, 11, '/images/products/tui-dung-can-2.jpg', 'Chi tiết túi', 0, '2025-12-25 13:01:03'),
(34, 11, '/images/products/tui-dung-can-3.jpg', 'Ngăn chứa', 0, '2025-12-25 13:01:03'),
(35, 12, '/images/products/hop-do-nghe-1.jpg', 'Hộp đồ nghề 4 tầng', 1, '2025-12-25 13:01:03'),
(36, 12, '/images/products/hop-do-nghe-2.jpg', 'Chi tiết các ngăn', 0, '2025-12-25 13:01:03'),
(37, 12, '/images/products/hop-do-nghe-3.jpg', 'Hộp mở ra', 0, '2025-12-25 13:01:03'),
(38, 12, '/images/products/hop-do-nghe-4.jpg', 'Đựng phụ kiện', 0, '2025-12-25 13:01:03');

-- --------------------------------------------------------

--
-- Table structure for table `product_reviews`
--

CREATE TABLE `product_reviews` (
  `id` int(10) UNSIGNED NOT NULL COMMENT 'ID đánh giá',
  `product_id` int(10) UNSIGNED NOT NULL COMMENT 'ID sản phẩm',
  `user_id` int(10) UNSIGNED NOT NULL COMMENT 'ID người dùng',
  `rating` tinyint(4) NOT NULL COMMENT 'Điểm đánh giá (1-5 sao)',
  `comment` text DEFAULT NULL COMMENT 'Nội dung đánh giá',
  `created_at` timestamp NOT NULL DEFAULT current_timestamp() COMMENT 'Thời gian tạo',
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp() COMMENT 'Thời gian cập nhật'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='Bảng đánh giá sản phẩm';

-- --------------------------------------------------------

--
-- Table structure for table `refresh_tokens`
--

CREATE TABLE `refresh_tokens` (
  `id` int(10) UNSIGNED NOT NULL COMMENT 'ID token',
  `user_id` int(10) UNSIGNED NOT NULL COMMENT 'ID người dùng',
  `token` varchar(255) NOT NULL COMMENT 'Token làm mới',
  `expires_at` datetime NOT NULL COMMENT 'Thời gian hết hạn',
  `created_at` timestamp NOT NULL DEFAULT current_timestamp() COMMENT 'Thời gian tạo'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='Bảng token làm mới phiên đăng nhập';

-- --------------------------------------------------------

--
-- Table structure for table `users`
--

CREATE TABLE `users` (
  `id` int(10) UNSIGNED NOT NULL COMMENT 'ID người dùng',
  `full_name` varchar(120) NOT NULL COMMENT 'Họ và tên',
  `email` varchar(150) NOT NULL COMMENT 'Email đăng nhập',
  `password_hash` varchar(255) NOT NULL COMMENT 'Mật khẩu đã mã hóa',
  `role` enum('customer','admin') NOT NULL DEFAULT 'customer' COMMENT 'Vai trò: khách hàng hoặc quản trị viên',
  `phone` varchar(20) DEFAULT NULL COMMENT 'Số điện thoại',
  `created_at` timestamp NOT NULL DEFAULT current_timestamp() COMMENT 'Thời gian tạo',
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp() COMMENT 'Thời gian cập nhật'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='Bảng người dùng';

--
-- Dumping data for table `users`
--

INSERT INTO `users` (`id`, `full_name`, `email`, `password_hash`, `role`, `phone`, `created_at`, `updated_at`) VALUES
(1, 'Admin', 'admin@fishing-shop.com', '$2b$10$EKourMjlxZhgXt5XDjF47.9FVqlmryxqvsSojaaMQulAWuRV/NtSi', 'admin', '0123456789', '2025-12-25 13:01:03', '2025-12-25 13:01:03'),
(2, 'Nguyễn Văn A', 'user@example.com', '$2b$10$EKourMjlxZhgXt5XDjF47.9FVqlmryxqvsSojaaMQulAWuRV/NtSi', 'customer', '0987654321', '2025-12-25 13:01:03', '2025-12-25 13:01:03'),
(3, 'huy', 'nhathuy@gmail.com', '$2b$10$uYbIf8RiA9KWymFUzEl.kOvBeC8XNtyjPL70clLqNWQ1Ab.GAbI4y', 'customer', NULL, '2025-12-25 15:56:03', '2025-12-25 15:56:03'),
(4, 'Test User', 'test@ghn.com', '$2b$10$LDtbmvIcnK6qsNT0XoR6MOnAAkTCp7pAUV0/lqpQ3MP18L6v/mHPW', 'customer', NULL, '2025-12-25 16:11:26', '2025-12-25 16:11:26');

-- --------------------------------------------------------

--
-- Table structure for table `wishlists`
--

CREATE TABLE `wishlists` (
  `id` int(10) UNSIGNED NOT NULL COMMENT 'ID wishlist',
  `user_id` int(10) UNSIGNED NOT NULL COMMENT 'ID người dùng',
  `product_id` int(10) UNSIGNED NOT NULL COMMENT 'ID sản phẩm',
  `created_at` timestamp NOT NULL DEFAULT current_timestamp() COMMENT 'Thời gian thêm'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='Bảng danh sách yêu thích';

--
-- Dumping data for table `wishlists`
--

INSERT INTO `wishlists` (`id`, `user_id`, `product_id`, `created_at`) VALUES
(1, 1, 81, '2025-12-25 13:01:36');

--
-- Indexes for dumped tables
--

--
-- Indexes for table `activity_logs`
--
ALTER TABLE `activity_logs`
  ADD PRIMARY KEY (`id`),
  ADD KEY `idx_logs_user` (`user_id`);

--
-- Indexes for table `addresses`
--
ALTER TABLE `addresses`
  ADD PRIMARY KEY (`id`),
  ADD KEY `fk_addresses_user` (`user_id`);

--
-- Indexes for table `blogs`
--
ALTER TABLE `blogs`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `slug` (`slug`),
  ADD KEY `author_id` (`author_id`);

--
-- Indexes for table `carts`
--
ALTER TABLE `carts`
  ADD PRIMARY KEY (`id`),
  ADD KEY `fk_carts_user` (`user_id`);

--
-- Indexes for table `cart_items`
--
ALTER TABLE `cart_items`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `uniq_cart_product` (`cart_id`,`product_id`),
  ADD KEY `fk_cart_items_product` (`product_id`);

--
-- Indexes for table `categories`
--
ALTER TABLE `categories`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `name` (`name`);

--
-- Indexes for table `coupons`
--
ALTER TABLE `coupons`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `code` (`code`);

--
-- Indexes for table `flash_sales`
--
ALTER TABLE `flash_sales`
  ADD PRIMARY KEY (`id`),
  ADD KEY `idx_flash_sales_product` (`product_id`),
  ADD KEY `idx_flash_sales_status` (`status`),
  ADD KEY `idx_flash_sales_time` (`start_time`,`end_time`);

--
-- Indexes for table `orders`
--
ALTER TABLE `orders`
  ADD PRIMARY KEY (`id`),
  ADD KEY `fk_orders_user` (`user_id`),
  ADD KEY `fk_orders_address` (`address_id`);

--
-- Indexes for table `order_items`
--
ALTER TABLE `order_items`
  ADD PRIMARY KEY (`id`),
  ADD KEY `fk_order_items_order` (`order_id`),
  ADD KEY `fk_order_items_product` (`product_id`);

--
-- Indexes for table `products`
--
ALTER TABLE `products`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `sku` (`sku`),
  ADD KEY `fk_products_category` (`category_id`);

--
-- Indexes for table `product_images`
--
ALTER TABLE `product_images`
  ADD PRIMARY KEY (`id`),
  ADD KEY `fk_images_product` (`product_id`);

--
-- Indexes for table `product_reviews`
--
ALTER TABLE `product_reviews`
  ADD PRIMARY KEY (`id`),
  ADD KEY `idx_review_product` (`product_id`),
  ADD KEY `idx_review_user` (`user_id`);

--
-- Indexes for table `refresh_tokens`
--
ALTER TABLE `refresh_tokens`
  ADD PRIMARY KEY (`id`),
  ADD KEY `fk_refresh_user` (`user_id`);

--
-- Indexes for table `users`
--
ALTER TABLE `users`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `email` (`email`);

--
-- Indexes for table `wishlists`
--
ALTER TABLE `wishlists`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `unique_user_product` (`user_id`,`product_id`),
  ADD KEY `fk_wishlist_product` (`product_id`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `activity_logs`
--
ALTER TABLE `activity_logs`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT COMMENT 'ID bản ghi';

--
-- AUTO_INCREMENT for table `addresses`
--
ALTER TABLE `addresses`
  MODIFY `id` int(10) UNSIGNED NOT NULL AUTO_INCREMENT COMMENT 'ID địa chỉ', AUTO_INCREMENT=3;

--
-- AUTO_INCREMENT for table `blogs`
--
ALTER TABLE `blogs`
  MODIFY `id` int(10) UNSIGNED NOT NULL AUTO_INCREMENT COMMENT 'ID blog', AUTO_INCREMENT=10;

--
-- AUTO_INCREMENT for table `carts`
--
ALTER TABLE `carts`
  MODIFY `id` int(10) UNSIGNED NOT NULL AUTO_INCREMENT COMMENT 'ID giỏ hàng', AUTO_INCREMENT=3;

--
-- AUTO_INCREMENT for table `cart_items`
--
ALTER TABLE `cart_items`
  MODIFY `id` int(10) UNSIGNED NOT NULL AUTO_INCREMENT COMMENT 'ID chi tiết giỏ hàng', AUTO_INCREMENT=27;

--
-- AUTO_INCREMENT for table `categories`
--
ALTER TABLE `categories`
  MODIFY `id` int(10) UNSIGNED NOT NULL AUTO_INCREMENT COMMENT 'ID danh mục', AUTO_INCREMENT=11;

--
-- AUTO_INCREMENT for table `coupons`
--
ALTER TABLE `coupons`
  MODIFY `id` int(10) UNSIGNED NOT NULL AUTO_INCREMENT COMMENT 'ID mã giảm giá', AUTO_INCREMENT=6;

--
-- AUTO_INCREMENT for table `flash_sales`
--
ALTER TABLE `flash_sales`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- AUTO_INCREMENT for table `orders`
--
ALTER TABLE `orders`
  MODIFY `id` int(10) UNSIGNED NOT NULL AUTO_INCREMENT COMMENT 'ID đơn hàng', AUTO_INCREMENT=12;

--
-- AUTO_INCREMENT for table `order_items`
--
ALTER TABLE `order_items`
  MODIFY `id` int(10) UNSIGNED NOT NULL AUTO_INCREMENT COMMENT 'ID chi tiết đơn hàng', AUTO_INCREMENT=18;

--
-- AUTO_INCREMENT for table `products`
--
ALTER TABLE `products`
  MODIFY `id` int(10) UNSIGNED NOT NULL AUTO_INCREMENT COMMENT 'ID sản phẩm', AUTO_INCREMENT=101;

--
-- AUTO_INCREMENT for table `product_images`
--
ALTER TABLE `product_images`
  MODIFY `id` int(10) UNSIGNED NOT NULL AUTO_INCREMENT COMMENT 'ID hình ảnh', AUTO_INCREMENT=39;

--
-- AUTO_INCREMENT for table `product_reviews`
--
ALTER TABLE `product_reviews`
  MODIFY `id` int(10) UNSIGNED NOT NULL AUTO_INCREMENT COMMENT 'ID đánh giá';

--
-- AUTO_INCREMENT for table `refresh_tokens`
--
ALTER TABLE `refresh_tokens`
  MODIFY `id` int(10) UNSIGNED NOT NULL AUTO_INCREMENT COMMENT 'ID token';

--
-- AUTO_INCREMENT for table `users`
--
ALTER TABLE `users`
  MODIFY `id` int(10) UNSIGNED NOT NULL AUTO_INCREMENT COMMENT 'ID người dùng', AUTO_INCREMENT=5;

--
-- AUTO_INCREMENT for table `wishlists`
--
ALTER TABLE `wishlists`
  MODIFY `id` int(10) UNSIGNED NOT NULL AUTO_INCREMENT COMMENT 'ID wishlist', AUTO_INCREMENT=2;

--
-- Constraints for dumped tables
--

--
-- Constraints for table `activity_logs`
--
ALTER TABLE `activity_logs`
  ADD CONSTRAINT `fk_logs_user` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE SET NULL;

--
-- Constraints for table `addresses`
--
ALTER TABLE `addresses`
  ADD CONSTRAINT `fk_addresses_user` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `blogs`
--
ALTER TABLE `blogs`
  ADD CONSTRAINT `blogs_ibfk_1` FOREIGN KEY (`author_id`) REFERENCES `users` (`id`) ON DELETE SET NULL;

--
-- Constraints for table `carts`
--
ALTER TABLE `carts`
  ADD CONSTRAINT `fk_carts_user` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `cart_items`
--
ALTER TABLE `cart_items`
  ADD CONSTRAINT `fk_cart_items_cart` FOREIGN KEY (`cart_id`) REFERENCES `carts` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `fk_cart_items_product` FOREIGN KEY (`product_id`) REFERENCES `products` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `orders`
--
ALTER TABLE `orders`
  ADD CONSTRAINT `fk_orders_address` FOREIGN KEY (`address_id`) REFERENCES `addresses` (`id`) ON DELETE SET NULL,
  ADD CONSTRAINT `fk_orders_user` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `order_items`
--
ALTER TABLE `order_items`
  ADD CONSTRAINT `fk_order_items_order` FOREIGN KEY (`order_id`) REFERENCES `orders` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `fk_order_items_product` FOREIGN KEY (`product_id`) REFERENCES `products` (`id`);

--
-- Constraints for table `products`
--
ALTER TABLE `products`
  ADD CONSTRAINT `fk_products_category` FOREIGN KEY (`category_id`) REFERENCES `categories` (`id`) ON DELETE SET NULL;

--
-- Constraints for table `product_images`
--
ALTER TABLE `product_images`
  ADD CONSTRAINT `fk_images_product` FOREIGN KEY (`product_id`) REFERENCES `products` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `product_reviews`
--
ALTER TABLE `product_reviews`
  ADD CONSTRAINT `fk_review_product` FOREIGN KEY (`product_id`) REFERENCES `products` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `fk_review_user` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `refresh_tokens`
--
ALTER TABLE `refresh_tokens`
  ADD CONSTRAINT `fk_refresh_user` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `wishlists`
--
ALTER TABLE `wishlists`
  ADD CONSTRAINT `fk_wishlist_product` FOREIGN KEY (`product_id`) REFERENCES `products` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `fk_wishlist_user` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
