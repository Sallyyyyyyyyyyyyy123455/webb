const fallbackDishes = [
    { keyword: "royal_shawarma", name: "Шаурма «Королевская»", price: 450, category: "main", kind: "meat", count: "400 г", image: "pc1.png" },
    { keyword: "lula_kebab", name: "Люля-кебаб", price: 410, category: "main", kind: "meat", count: "300 г", image: "pc2.png" },
    { keyword: "salmon_steak", name: "Стейк из лосося", price: 650, category: "main", kind: "fish", count: "250 г", image: "pc3.png" },
    { keyword: "fish_and_chips", name: "Фиш энд чипс", price: 490, category: "main", kind: "fish", count: "350 г", image: "pc4.png" },
    { keyword: "falafel_roll", name: "Фалафель-ролл", price: 290, category: "main", kind: "veg", count: "280 г", image: "pc5.png" },
    { keyword: "veggie_burger", name: "Овощной бургер", price: 350, category: "main", kind: "veg", count: "300 г", image: "pc6.png" },

    { keyword: "caesar_shrimp", name: "Салат Цезарь с креветками", price: 450, category: "salads", kind: "fish", count: "200 г", image: "pc7.png" },
    { keyword: "tuna_salad", name: "Салат с тунцом", price: 400, category: "salads", kind: "fish", count: "180 г", image: "pc8.png" },
    { keyword: "caesar_chicken", name: "Салат Цезарь с курицей", price: 380, category: "salads", kind: "meat", count: "220 г", image: "pc9.png" },
    { keyword: "beef_salad", name: "Салат с говядиной", price: 420, category: "salads", kind: "meat", count: "200 г", image: "pc10.png" },
    { keyword: "greek_salad", name: "Греческий салат", price: 320, category: "salads", kind: "veg", count: "200 г", image: "pc11.png" },
    { keyword: "caprese", name: "Салат Капрезе", price: 350, category: "salads", kind: "veg", count: "180 г", image: "pc12.png" },

    { keyword: "nuggets", name: "Наггетсы", price: 180, category: "snacks", kind: "meat", count: "6 шт.", image: "pc13.png" },
    { keyword: "bbq_wings", name: "Крылья BBQ", price: 260, category: "snacks", kind: "meat", count: "6 шт.", image: "pc14.png" },
    { keyword: "fries", name: "Картофель фри", price: 150, category: "snacks", kind: "veg", count: "150 г", image: "pc15.png" },
    { keyword: "sweet_potato", name: "Картофель батат", price: 200, category: "snacks", kind: "veg", count: "150 г", image: "pc16.png" },
    { keyword: "cheese_sticks", name: "Сырные палочки", price: 220, category: "snacks", kind: "cheese", count: "5 шт.", image: "pc17.png" },
    { keyword: "onion_rings", name: "Луковые кольца", price: 160, category: "snacks", kind: "cheese", count: "120 г", image: "pc18.png" },

    { keyword: "cola", name: "Кола", price: 120, category: "drinks", kind: "cold", count: "0.5 л", image: "pc19.png" },
    { keyword: "lemonade", name: "Домашний лимонад", price: 150, category: "drinks", kind: "cold", count: "0.4 л", image: "pc20.png" },
    { keyword: "orange_juice", name: "Апельсиновый сок", price: 180, category: "drinks", kind: "cold", count: "0.3 л", image: "pc21.png" },
    { keyword: "tea", name: "Чай черный / зеленый", price: 90, category: "drinks", kind: "hot", count: "0.3 л", image: "pc22.png" },
    { keyword: "coffee", name: "Кофе американо", price: 140, category: "drinks", kind: "hot", count: "0.2 л", image: "pc23.png" },
    { keyword: "cappuccino", name: "Капучино", price: 180, category: "drinks", kind: "hot", count: "0.3 л", image: "pc24.png" },

    { keyword: "croissant", name: "Круассан с миндалем", price: 180, category: "desserts", kind: "pastry", count: "120 г", image: "pc25.png" },
    { keyword: "eclair", name: "Эклер шоколадный", price: 150, category: "desserts", kind: "pastry", count: "80 г", image: "pc26.png" },
    { keyword: "ice_cream_vanilla", name: "Мороженое ванильное", price: 120, category: "desserts", kind: "icecream", count: "100 г", image: "pc27.png" },
    { keyword: "ice_cream_choco", name: "Мороженое шоколадное", price: 130, category: "desserts", kind: "icecream", count: "100 г", image: "pc28.png" },
    { keyword: "cheesecake", name: "Чизкейк", price: 280, category: "desserts", kind: "cake", count: "150 г", image: "pc29.png" },
    { keyword: "tiramisu", name: "Тирамису", price: 320, category: "desserts", kind: "cake", count: "180 г", image: "pc30.png" }
];