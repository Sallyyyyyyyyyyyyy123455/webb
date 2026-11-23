'use strict';

document.addEventListener('DOMContentLoaded', () => {
    let dishes = [];
    let selectedDishes = JSON.parse(localStorage.getItem('selectedDishes')) || {};
    
    // ВАШ API-КЛЮЧ (Тот самый ключ-заглушка, который принимает сервер)
    const API_KEY = '123e4567-e89b-12d3-a456-426655440000'; 
    const API_URL = `https://edu.std-900.ist.mospolytech.ru/labs/api/orders?api_key=${API_KEY}`;

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
            renderOrder();
        }
    };

    const renderOrder = () => {
        const list = document.getElementById('order-items-list');
        const emptyMsg = document.getElementById('empty-order-msg');
        const form = document.getElementById('checkout-form');
        const formSummary = document.getElementById('form-summary');
        
        list.innerHTML = '';
        formSummary.innerHTML = '';

        const keys = Object.keys(selectedDishes);

        if (keys.length === 0) {
            emptyMsg.classList.remove('hidden');
            form.classList.add('hidden');
            return;
        }

        emptyMsg.classList.add('hidden');
        form.classList.remove('hidden');

        let total = 0;
        let summaryHTML = '';
        const catNames = { main: 'Главное', salads: 'Салат', snacks: 'Снеки', drinks: 'Напиток', desserts: 'Десерт' };

        ['main', 'salads', 'snacks', 'drinks', 'desserts'].forEach(cat => {
            const dish = selectedDishes[cat];
            if (dish) {
                const card = document.createElement('div');
                card.className = 'order-card';
                card.innerHTML = `
                    <img src="${dish.image}" alt="${dish.name}">
                    <p class="name">${dish.name}</p>
                    <p class="price">${dish.price}₽</p>
                    <button class="remove-btn" data-cat="${cat}">Удалить</button>
                `;
                list.appendChild(card);
                
                summaryHTML += `<p>${catNames[cat]}: <b>${dish.name}</b> <span>${dish.price}₽</span></p>`;
                total += dish.price;
            } else {
                summaryHTML += `<p>${catNames[cat]}: <i>Не выбран</i> <span>0₽</span></p>`;
            }
        });

        summaryHTML += `<div class="summary-total"><h4>Итого:</h4><p>${total}₽</p></div>`;
        formSummary.innerHTML = summaryHTML;

        document.querySelectorAll('.remove-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const cat = e.target.dataset.cat;
                delete selectedDishes[cat];
                localStorage.setItem('selectedDishes', JSON.stringify(selectedDishes));
                renderOrder();
            });
        });
    };

    document.getElementById('checkout-form').addEventListener('submit', async (e) => {
        e.preventDefault();
        
        const hasMain = !!selectedDishes['main'];
        const hasSalad = !!selectedDishes['salads'];
        const hasDrink = !!selectedDishes['drinks'];

        if (!hasMain && !hasSalad) { alert('Выберите главное блюдо или салат'); return; }
        if (!hasDrink) { alert('Выберите напиток'); return; }

        const formData = new FormData(e.target);
        const data = Object.fromEntries(formData.entries());
        
        if (selectedDishes['main']) data.main_course_id = selectedDishes['main'].keyword;
        if (selectedDishes['salads']) data.salad_id = selectedDishes['salads'].keyword;
        if (selectedDishes['drinks']) data.drink_id = selectedDishes['drinks'].keyword;
        if (selectedDishes['snacks']) data.soup_id = selectedDishes['snacks'].keyword; 

        try {
            const response = await fetch(API_URL, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(data)
            });

            if (!response.ok) {
                // Если сервер вернул ошибку (например, 401 или 500)
                const errorData = await response.json().catch(() => ({}));
                throw new Error(errorData.error || `Ошибка сервера: ${response.status}`);
            }
            
            alert('Заказ успешно оформлен!');
            localStorage.removeItem('selectedDishes');
            window.location.href = 'history.html'; // Перекидываем на историю
            
        } catch (error) {
            // Выводим реальную ошибку, если запрос не прошел
            console.error('Ошибка отправки:', error);
            alert('Не удалось оформить заказ: ' + error.message);
        }
    });

    loadDishes();
});