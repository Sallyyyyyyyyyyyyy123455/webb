'use strict';

document.addEventListener('DOMContentLoaded', () => {
    let dishes = []; 
    let selectedDishes = JSON.parse(localStorage.getItem('selectedDishes')) || {}; 
    const activeFilters = {}; 

    // 1. Загрузка данных
    const loadDishes = async () => {
        try {
            const response = await fetch('api.json');
            const data = await response.json();
            dishes = data.map(item => {
                let cat = item.category;
                if (cat === 'main_course') cat = 'main';
                if (cat === 'salad') cat = 'salads';
                if (cat === 'drink') cat = 'drinks';
                if (cat === 'dessert') cat = 'desserts';
                if (cat === 'snack') cat = 'snacks';
                return { ...item, category: cat };
            });
        } catch (error) {
            dishes = fallbackDishes; 
        } finally {
            renderCards();
            updateCheckoutPanel();
            initVariantScroll(); // Запускаем прокрутку
        }
    };

    // 2. Отрисовка карточек
    const renderCards = () => {
        const categories = ['main', 'salads', 'snacks', 'drinks', 'desserts'];
        categories.forEach((cat) => {
            const container = document.getElementById(`category-${cat}`);
            if (!container) return;
            let filtered = dishes.filter((d) => d.category === cat);
            if (activeFilters[cat]) filtered = filtered.filter((d) => d.kind === activeFilters[cat]);
            filtered.sort((a, b) => a.name.localeCompare(b.name));
            container.innerHTML = '';

            filtered.forEach((dish) => {
                const card = document.createElement('div');
                const isSelected = selectedDishes[cat] && selectedDishes[cat].keyword === dish.keyword;
                card.className = isSelected ? 'dish-card selected' : 'dish-card';
                card.innerHTML = `
                    <img src="${dish.image}" alt="${dish.name}">
                    <p class="price">${dish.price}₽</p>
                    <p class="name">${dish.name}</p>
                    <p class="weight">${dish.count}</p>
                    <button class="add-btn" data-keyword="${dish.keyword}">${isSelected ? 'Убрать' : 'Добавить'}</button>
                `;
                container.appendChild(card);
            });
        });
    };

    // 3. Обновление панели
    const updateCheckoutPanel = () => {
        const panel = document.getElementById('checkout-panel');
        const totalEl = document.getElementById('total-price');
        const hasItems = Object.keys(selectedDishes).length > 0;
        
        if (!hasItems) { panel.classList.add('hidden'); return; }
        
        panel.classList.remove('hidden');
        let total = 0;
        Object.values(selectedDishes).forEach(d => total += d.price);
        totalEl.textContent = total;
    };

    // 4. Клики по кнопкам "Добавить/Убрать"
    document.body.addEventListener('click', (e) => {
        if (e.target.classList.contains('add-btn')) {
            const keyword = e.target.dataset.keyword;
            const dish = dishes.find((d) => d.keyword === keyword);
            const cat = dish.category;

            if (selectedDishes[cat] && selectedDishes[cat].keyword === keyword) {
                delete selectedDishes[cat];
            } else {
                selectedDishes[cat] = dish;
            }

            localStorage.setItem('selectedDishes', JSON.stringify(selectedDishes));
            renderCards();
            updateCheckoutPanel();
        }
    });

    // 5. Работа фильтров
    document.querySelectorAll('.filter-btn').forEach(btn => {
        btn.addEventListener('click', (e) => {
            const category = e.target.dataset.category;
            const kind = e.target.dataset.kind;
            if (activeFilters[category] === kind) {
                delete activeFilters[category];
                e.target.classList.remove('active');
            } else {
                document.querySelectorAll(`.filter-btn[data-category="${category}"]`).forEach(b => b.classList.remove('active'));
                e.target.classList.add('active');
                activeFilters[category] = kind;
            }
            renderCards();
        });
    });

    // 6. Прокрутка к секциям при клике на комбо
    const initVariantScroll = () => {
        document.querySelectorAll('.variant-dish').forEach(item => {
            item.addEventListener('click', (e) => {
                const text = e.currentTarget.querySelector('p').textContent.toLowerCase();
                let sectionId = '';

                if (text.includes('главное')) sectionId = 'section-main';
                if (text.includes('салат')) sectionId = 'section-salads';
                if (text.includes('напиток')) sectionId = 'section-drinks';
                if (text.includes('десерт')) sectionId = 'section-desserts';

                if (sectionId) {
                    const section = document.getElementById(sectionId);
                    if (section) {
                        section.scrollIntoView({ behavior: 'smooth', block: 'start' });
                    }
                }
            });
        });
    };

    loadDishes();
});