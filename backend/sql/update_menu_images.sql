-- Update images for Italian
UPDATE MENU SET image_url = 'https://images.unsplash.com/photo-1513104890138-7c749659a591?q=80&w=800&auto=format&fit=crop' WHERE item_name LIKE '%Pizza%';
UPDATE MENU SET image_url = 'https://images.unsplash.com/photo-1473093295043-cdd812d0e601?q=80&w=800&auto=format&fit=crop' WHERE item_name LIKE '%Spaghetti%' OR item_name LIKE '%Pasta%' OR item_name LIKE '%Lasagna%';
UPDATE MENU SET image_url = 'https://images.unsplash.com/photo-1571115177098-24de438df366?q=80&w=800&auto=format&fit=crop' WHERE item_name LIKE '%Tiramisu%';

-- Update images for American
UPDATE MENU SET image_url = 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?q=80&w=800&auto=format&fit=crop' WHERE item_name LIKE '%Burger%';
UPDATE MENU SET image_url = 'https://images.unsplash.com/photo-1576107232684-1279f390859f?q=80&w=800&auto=format&fit=crop' WHERE item_name LIKE '%Fries%';
UPDATE MENU SET image_url = 'https://images.unsplash.com/photo-1626200419199-391ae4be7a41?q=80&w=800&auto=format&fit=crop' WHERE item_name LIKE '%Chicken Sandwich%';

-- Update images for Asian
UPDATE MENU SET image_url = 'https://images.unsplash.com/photo-1579871494447-9811cf80d66c?q=80&w=800&auto=format&fit=crop' WHERE item_name LIKE '%Roll%' OR item_name LIKE '%Nigiri%';
UPDATE MENU SET image_url = 'https://images.unsplash.com/photo-1559314809-0d155014e29e?q=80&w=800&auto=format&fit=crop' WHERE item_name LIKE '%Pad Thai%';

-- Update images for Mexican
UPDATE MENU SET image_url = 'https://images.unsplash.com/photo-1551504734-5ee1c4a1479b?q=80&w=800&auto=format&fit=crop' WHERE item_name LIKE '%Tacos%';
UPDATE MENU SET image_url = 'https://images.unsplash.com/photo-1626700051175-6818013e1d4f?q=80&w=800&auto=format&fit=crop' WHERE item_name LIKE '%Burrito%';

-- Update images for Indian
UPDATE MENU SET image_url = 'https://images.unsplash.com/photo-1603894584373-5ac82b2ae398?q=80&w=800&auto=format&fit=crop' WHERE item_name LIKE '%Butter Chicken%' OR item_name LIKE '%Tikka%';
UPDATE MENU SET image_url = 'https://images.unsplash.com/photo-1563379091339-03b2184f4f4d?q=80&w=800&auto=format&fit=crop' WHERE item_name LIKE '%Biryani%';

-- Update images for Lebanese
UPDATE MENU SET image_url = 'https://images.unsplash.com/photo-1585238341210-b4131af66649?q=80&w=800&auto=format&fit=crop' WHERE item_name LIKE '%Hummus%';
UPDATE MENU SET image_url = 'https://images.unsplash.com/photo-1529006557810-274b9b2fc783?q=80&w=800&auto=format&fit=crop' WHERE item_name LIKE '%Shawarma%';
