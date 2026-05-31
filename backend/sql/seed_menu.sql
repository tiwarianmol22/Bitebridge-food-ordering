-- Additional Menu Items (30-40 items across different cuisines)

-- Italian
INSERT INTO MENU (item_name, description, price, category, availability) VALUES 
('Margherita Pizza', 'Classic pizza with San Marzano tomatoes, fresh mozzarella, and basil.', 14.99, 'Italian', TRUE),
('Pepperoni Pizza', 'New York style pizza with spicy pepperoni and mozzarella.', 16.99, 'Italian', TRUE),
('Truffle Mushroom Risotto', 'Creamy Arborio rice with wild mushrooms and truffle oil.', 22.50, 'Italian', TRUE),
('Spaghetti Carbonara', 'Traditional Roman pasta with pancetta, egg yolk, and pecorino.', 18.99, 'Italian', TRUE),
('Lasagna al Forno', 'Layers of fresh pasta, rich meat ragu, bechamel, and parmesan.', 20.00, 'Italian', TRUE),
('Tiramisu', 'Classic Italian dessert with espresso-soaked ladyfingers and mascarpone.', 8.50, 'Italian', TRUE);

-- Lebanese / Middle Eastern
INSERT INTO MENU (item_name, description, price, category, availability) VALUES 
('Classic Hummus', 'Creamy chickpea puree with tahini, olive oil, and warm pita.', 7.99, 'Lebanese', TRUE),
('Chicken Shawarma Wrap', 'Spiced grilled chicken, garlic sauce, pickles, wrapped in flatbread.', 12.50, 'Lebanese', TRUE),
('Lamb Kofta Kebab', 'Grilled minced lamb skewers with herbs and spices, served with rice.', 19.99, 'Lebanese', TRUE),
('Falafel Plate', 'Crispy chickpea fritters served with tahini sauce and salad.', 14.00, 'Lebanese', TRUE),
('Moutabal (Baba Ghanoush)', 'Smoky roasted eggplant dip with tahini and pomegranate seeds.', 8.50, 'Lebanese', TRUE),
('Baklava', 'Sweet layered pastry with chopped nuts and honey syrup.', 6.99, 'Lebanese', TRUE);

-- Indian
INSERT INTO MENU (item_name, description, price, category, availability) VALUES 
('Butter Chicken', 'Tender chicken simmered in a rich tomato-butter gravy.', 18.99, 'Indian', TRUE),
('Paneer Tikka Masala', 'Grilled cottage cheese cubes in a spiced tomato gravy.', 16.50, 'Indian', TRUE),
('Lamb Biryani', 'Aromatic basmati rice cooked with tender lamb, saffron, and spices.', 21.00, 'Indian', TRUE),
('Garlic Naan', 'Soft traditional Indian flatbread baked in a tandoor, topped with garlic.', 3.99, 'Indian', TRUE),
('Dal Makhani', 'Slow-cooked black lentils in a creamy, buttery sauce.', 14.00, 'Indian', TRUE),
('Gulab Jamun', 'Deep-fried milk dumplings soaked in cardamom-flavored sugar syrup.', 5.50, 'Indian', TRUE);

-- Mexican
INSERT INTO MENU (item_name, description, price, category, availability) VALUES 
('Al Pastor Tacos', 'Three soft corn tortillas with marinated pork, pineapple, and onions.', 13.99, 'Mexican', TRUE),
('Beef Barbacoa Burrito', 'Large flour tortilla stuffed with slow-cooked beef, rice, beans, and cheese.', 15.50, 'Mexican', TRUE),
('Chicken Quesadilla', 'Grilled tortilla filled with melted cheese and seasoned chicken.', 12.00, 'Mexican', TRUE),
('Guacamole & Chips', 'Freshly mashed avocados with lime, cilantro, jalapeños, and tortilla chips.', 9.50, 'Mexican', TRUE),
('Churros with Chocolate', 'Crispy fried dough dusted with cinnamon sugar, served with chocolate dip.', 7.00, 'Mexican', TRUE);

-- Asian / Japanese / Thai
INSERT INTO MENU (item_name, description, price, category, availability) VALUES 
('Spicy Tuna Roll', 'Fresh tuna mixed with spicy mayo, rolled in sushi rice and seaweed.', 14.00, 'Asian', TRUE),
('Salmon Nigiri', 'Two pieces of fresh salmon over seasoned sushi rice.', 8.50, 'Asian', TRUE),
('Pad Thai', 'Stir-fried rice noodles with shrimp, peanuts, bean sprouts, and tamarind.', 16.99, 'Asian', TRUE),
('Green Curry', 'Thai curry with chicken, bamboo shoots, coconut milk, and basil.', 17.50, 'Asian', TRUE),
('Chicken Teriyaki Bowl', 'Grilled chicken glazed with teriyaki sauce over steamed rice.', 14.50, 'Asian', TRUE),
('Miso Soup', 'Traditional Japanese soup with tofu, seaweed, and scallions.', 4.50, 'Asian', TRUE);

-- American / Burgers
INSERT INTO MENU (item_name, description, price, category, availability) VALUES 
('Classic Cheeseburger', 'Angus beef patty with cheddar, lettuce, tomato, and house sauce.', 13.50, 'American', TRUE),
('Bacon BBQ Burger', 'Beef patty topped with crispy bacon, onion rings, and BBQ sauce.', 15.99, 'American', TRUE),
('Crispy Chicken Sandwich', 'Buttermilk fried chicken breast with pickles and spicy mayo.', 14.00, 'American', TRUE),
('Loaded Fries', 'French fries topped with melted cheese, bacon bits, and jalapeños.', 8.99, 'American', TRUE),
('New York Cheesecake', 'Rich and creamy vanilla cheesecake with a graham cracker crust.', 7.50, 'American', TRUE);
