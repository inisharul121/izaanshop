CREATE TABLE `User` (
	`id` int AUTO_INCREMENT NOT NULL,
	`name` varchar(255) NOT NULL,
	`email` varchar(255) NOT NULL,
	`password` varchar(255) NOT NULL,
	`role` varchar(255) NOT NULL DEFAULT 'user',
	`phone` varchar(255),
	`street` varchar(255),
	`city` varchar(255),
	`state` varchar(255),
	`zipCode` varchar(255),
	`country` varchar(255) DEFAULT 'Bangladesh',
	`isApproved` boolean NOT NULL DEFAULT true,
	`createdAt` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
	`updatedAt` timestamp ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `User_id` PRIMARY KEY(`id`),
	CONSTRAINT `User_email_unique` UNIQUE(`email`)
);
--> statement-breakpoint
CREATE TABLE `Category` (
	`id` int AUTO_INCREMENT NOT NULL,
	`name` varchar(255) NOT NULL,
	`slug` varchar(255) NOT NULL,
	`image` longtext,
	`description` text,
	`createdAt` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
	`updatedAt` timestamp ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `Category_id` PRIMARY KEY(`id`),
	CONSTRAINT `Category_name_unique` UNIQUE(`name`),
	CONSTRAINT `Category_slug_unique` UNIQUE(`slug`)
);
--> statement-breakpoint
CREATE TABLE `Product` (
	`id` int AUTO_INCREMENT NOT NULL,
	`name` varchar(255) NOT NULL,
	`slug` varchar(255) NOT NULL,
	`description` text NOT NULL,
	`price` double NOT NULL,
	`salePrice` double,
	`stock` int NOT NULL DEFAULT 0,
	`isFeatured` boolean NOT NULL DEFAULT false,
	`images` longtext,
	`rating` double NOT NULL DEFAULT 0,
	`numReviews` int NOT NULL DEFAULT 0,
	`type` enum('SIMPLE','VARIABLE') NOT NULL DEFAULT 'SIMPLE',
	`categoryId` int NOT NULL,
	`isDeleted` boolean NOT NULL DEFAULT false,
	`createdAt` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
	`updatedAt` timestamp ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `Product_id` PRIMARY KEY(`id`),
	CONSTRAINT `Product_slug_unique` UNIQUE(`slug`)
);
--> statement-breakpoint
CREATE TABLE `ProductAttribute` (
	`id` int AUTO_INCREMENT NOT NULL,
	`name` varchar(255) NOT NULL,
	`options` longtext NOT NULL,
	`productId` int NOT NULL,
	CONSTRAINT `ProductAttribute_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `ProductVariant` (
	`id` int AUTO_INCREMENT NOT NULL,
	`sku` varchar(255),
	`price` double NOT NULL,
	`salePrice` double,
	`stock` int NOT NULL DEFAULT 0,
	`options` longtext NOT NULL,
	`image` longtext,
	`productId` int NOT NULL,
	`isDefault` boolean NOT NULL DEFAULT false,
	`createdAt` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
	`updatedAt` timestamp ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `ProductVariant_id` PRIMARY KEY(`id`),
	CONSTRAINT `ProductVariant_sku_unique` UNIQUE(`sku`)
);
--> statement-breakpoint
CREATE TABLE `Review` (
	`id` int AUTO_INCREMENT NOT NULL,
	`name` varchar(255) NOT NULL,
	`rating` int NOT NULL,
	`comment` text NOT NULL,
	`productId` int NOT NULL,
	`userId` int NOT NULL,
	`createdAt` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
	CONSTRAINT `Review_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `Order` (
	`id` int AUTO_INCREMENT NOT NULL,
	`totalPrice` double NOT NULL,
	`paymentMethod` varchar(255) NOT NULL,
	`itemsPrice` double NOT NULL,
	`taxPrice` double NOT NULL DEFAULT 0,
	`shippingPrice` double NOT NULL DEFAULT 0,
	`isPaid` boolean NOT NULL DEFAULT false,
	`paidAt` timestamp,
	`isDelivered` boolean NOT NULL DEFAULT false,
	`deliveredAt` timestamp,
	`status` varchar(255) NOT NULL DEFAULT 'Pending',
	`street` varchar(255),
	`city` varchar(255),
	`state` varchar(255),
	`zipCode` varchar(255),
	`country` varchar(255) DEFAULT 'Bangladesh',
	`paymentId` varchar(255),
	`transactionId` varchar(255),
	`paymentStatus` varchar(255),
	`paymentEmail` varchar(255),
	`userId` int,
	`guestName` varchar(255),
	`guestEmail` varchar(255),
	`guestPhone` varchar(255),
	`phone` varchar(255),
	`shippingEmail` varchar(255),
	`shippingMethod` varchar(255),
	`createdAt` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
	`updatedAt` timestamp ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `Order_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `OrderItem` (
	`id` int AUTO_INCREMENT NOT NULL,
	`name` varchar(255) NOT NULL,
	`quantity` int NOT NULL,
	`image` longtext NOT NULL,
	`price` double NOT NULL,
	`variantId` int,
	`orderId` int NOT NULL,
	`productId` int NOT NULL,
	CONSTRAINT `OrderItem_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `ShippingMethod` (
	`id` int AUTO_INCREMENT NOT NULL,
	`name` varchar(255) NOT NULL,
	`price` double NOT NULL,
	`isActive` boolean NOT NULL DEFAULT true,
	`createdAt` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
	`updatedAt` timestamp ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `ShippingMethod_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `Coupon` (
	`id` int AUTO_INCREMENT NOT NULL,
	`code` varchar(255) NOT NULL,
	`discountType` varchar(255) NOT NULL,
	`discountValue` double NOT NULL,
	`expiryDate` timestamp,
	`isActive` boolean NOT NULL DEFAULT true,
	`maxUses` int,
	`usedCount` int NOT NULL DEFAULT 0,
	`createdAt` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
	`updatedAt` timestamp ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `Coupon_id` PRIMARY KEY(`id`),
	CONSTRAINT `Coupon_code_unique` UNIQUE(`code`)
);
--> statement-breakpoint
CREATE TABLE `Settings` (
	`id` int AUTO_INCREMENT NOT NULL,
	`key` varchar(255) NOT NULL,
	`value` text,
	`updatedAt` timestamp ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `Settings_id` PRIMARY KEY(`id`),
	CONSTRAINT `Settings_key_unique` UNIQUE(`key`)
);
--> statement-breakpoint
CREATE TABLE `Banner` (
	`id` int AUTO_INCREMENT NOT NULL,
	`title` varchar(255),
	`subtitle` varchar(255),
	`image` longtext NOT NULL,
	`link` varchar(255),
	`isActive` boolean NOT NULL DEFAULT true,
	`order` int NOT NULL DEFAULT 0,
	`createdAt` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
	`updatedAt` timestamp ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `Banner_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE INDEX `email_idx` ON `User` (`email`);--> statement-breakpoint
CREATE INDEX `category_slug_idx` ON `Category` (`slug`);--> statement-breakpoint
CREATE INDEX `product_slug_idx` ON `Product` (`slug`);--> statement-breakpoint
CREATE INDEX `product_category_idx` ON `Product` (`categoryId`);--> statement-breakpoint
CREATE INDEX `product_deleted_idx` ON `Product` (`isDeleted`);--> statement-breakpoint
CREATE INDEX `product_price_idx` ON `Product` (`price`);--> statement-breakpoint
CREATE INDEX `product_created_at_idx` ON `Product` (`createdAt`);--> statement-breakpoint
CREATE INDEX `attr_product_idx` ON `ProductAttribute` (`productId`);--> statement-breakpoint
CREATE INDEX `variant_product_idx` ON `ProductVariant` (`productId`);--> statement-breakpoint
CREATE INDEX `variant_sku_idx` ON `ProductVariant` (`sku`);--> statement-breakpoint
CREATE INDEX `review_product_idx` ON `Review` (`productId`);--> statement-breakpoint
CREATE INDEX `review_user_idx` ON `Review` (`userId`);--> statement-breakpoint
CREATE INDEX `order_user_idx` ON `Order` (`userId`);--> statement-breakpoint
CREATE INDEX `order_status_idx` ON `Order` (`status`);--> statement-breakpoint
CREATE INDEX `order_created_at_idx` ON `Order` (`createdAt`);--> statement-breakpoint
CREATE INDEX `item_order_idx` ON `OrderItem` (`orderId`);--> statement-breakpoint
CREATE INDEX `item_product_idx` ON `OrderItem` (`productId`);--> statement-breakpoint
CREATE INDEX `coupon_code_idx` ON `Coupon` (`code`);