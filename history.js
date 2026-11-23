'use strict';

document.addEventListener('DOMContentLoaded', () => {
    const API_KEY = '123e4567-e89b-12d3-a456-426655440000'; 
    const BASE_URL = 'https://edu.std-900.ist.mospolytech.ru/labs/api';
    
    const ordersList = document.getElementById('orders-list');
    const modalOverlay = document.getElementById('modal-overlay');
    const modalBody = document.getElementById('modal-body');
    const modalClose = document.getElementById('modal-close');

    let allOrders = [];
    let allDishes = [];

    const loadDishes = async () => {
        try {
            const response = await fetch('api.json');
            allDishes = await response.json();
        } catch (e) {
            console.warn('Не удалось загрузить блюда из api.json');
        }
    };

    const loadOrders = async () => {
        ordersList.innerHTML = '<p class="loading">Загрузка заказов...</p>';
        try {
            const response = await fetch(`${BASE_URL}/orders?api_key=${API_KEY}`);
            
            if (!response.ok) {
                const err = await response.json().catch(() => ({}));
                throw new Error(err.error || `Ошибка: ${response.status}`);
            }
            
            allOrders = await response.json();
            allOrders.sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
            renderOrders();
            
        } catch (error) {
            ordersList.innerHTML = `<p class="error" style="color: tomato; text-align: center; font-family: 'Dela Gothic One';">Ошибка загрузки: ${error.message}</p>`;
        }
    };

    const renderOrders = () => {
        ordersList.innerHTML = '';
        if (allOrders.length === 0) {
            ordersList.innerHTML = '<p class="empty-orders" style="color: #888; text-align: center; font-family: \'Dela Gothic One\';">У вас пока нет заказов.</p>';
            return;
        }

        allOrders.forEach((order, index) => {
            const dishesNames = [];
            if (order.main_course_id) {
                const dish = allDishes.find(d => d.keyword === order.main_course_id || d.id == order.main_course_id);
                if (dish) dishesNames.push(dish.name);
            }
            if (order.salad_id) {
                const dish = allDishes.find(d => d.keyword === order.salad_id || d.id == order.salad_id);
                if (dish) dishesNames.push(dish.name);
            }
            if (order.drink_id) {
                const dish = allDishes.find(d => d.keyword === order.drink_id || d.id == order.drink_id);
                if (dish) dishesNames.push(dish.name);
            }

            const date = new Date(order.created_at).toLocaleString('ru-RU');
            const deliveryTime = order.delivery_type === 'by_time' ? `Ко времени: ${order.delivery_time}` : 'Как можно скорее (с 7:00 до 23:00)';

            const item = document.createElement('div');
            item.className = 'order-item';
            item.innerHTML = `
                <div class="order-info">
                    <div class="order-header">
                        <span>Заказ №${index + 1}</span>
                    </div>
                    <div class="order-dishes">${dishesNames.join(', ') || 'Блюда не указаны'}</div>
                    <div class="order-details">${date} • ${deliveryTime}</div>
                </div>
                <div class="order-actions">
                    <button class="btn-view" data-id="${order.id}">Подробнее</button>
                    <button class="btn-edit" data-id="${order.id}">Редактировать</button>
                    <button class="btn-delete" data-id="${order.id}">Удалить</button>
                </div>
            `;
            ordersList.appendChild(item);
        });
    };

    ordersList.addEventListener('click', (e) => {
        const btn = e.target.closest('button');
        if (!btn) return;
        const orderId = btn.dataset.id;
        const order = allOrders.find(o => o.id == orderId);
        if (!order) return;

        if (btn.classList.contains('btn-view')) showDetails(order);
        if (btn.classList.contains('btn-edit')) showEditForm(order);
        if (btn.classList.contains('btn-delete')) showDeleteConfirm(order);
    });

    const closeModal = () => {
        modalOverlay.classList.add('hidden');
        modalBody.innerHTML = '';
    };

    modalClose.addEventListener('click', closeModal);
    modalOverlay.addEventListener('click', (e) => {
        if (e.target === modalOverlay) closeModal();
    });

    const showDetails = (order) => {
        const date = new Date(order.created_at).toLocaleString('ru-RU');
        modalBody.innerHTML = `
            <h3>Детали заказа</h3>
            <p><strong>Дата:</strong> ${date}</p>
            <p><strong>Имя:</strong> ${order.full_name}</p>
            <p><strong>Телефон:</strong> ${order.phone}</p>
            <p><strong>Email:</strong> ${order.email}</p>
            <p><strong>Адрес:</strong> ${order.delivery_address}</p>
            <p><strong>Время:</strong> ${order.delivery_type === 'by_time' ? order.delivery_time : 'Как можно скорее'}</p>
            <p><strong>Комментарий:</strong> ${order.comment || 'Нет'}</p>
            <div class="modal-buttons">
                <button class="btn-save" onclick="document.getElementById('modal-close').click()">Ок</button>
            </div>
        `;
        modalOverlay.classList.remove('hidden');
    };

    const showEditForm = (order) => {
        modalBody.innerHTML = `
            <h3>Редактировать заказ</h3>
            <form id="edit-form" class="modal-form">
                <div class="form-group">
                    <label>Имя *</label>
                    <input type="text" name="full_name" value="${order.full_name}" required>
                </div>
                <div class="form-group">
                    <label>Email *</label>
                    <input type="email" name="email" value="${order.email}" required>
                </div>
                <div class="form-group">
                    <label>Телефон *</label>
                    <input type="tel" name="phone" value="${order.phone}" required>
                </div>
                <div class="form-group">
                    <label>Адрес *</label>
                    <input type="text" name="delivery_address" value="${order.delivery_address}" required>
                </div>
                <div class="form-group">
                    <label>Тип доставки</label>
                    <select name="delivery_type">
                        <option value="now" ${order.delivery_type === 'now' ? 'selected' : ''}>Как можно скорее</option>
                        <option value="by_time" ${order.delivery_type === 'by_time' ? 'selected' : ''}>Ко времени</option>
                    </select>
                </div>
                <div class="form-group">
                    <label>Время</label>
                    <input type="time" name="delivery_time" value="${order.delivery_time || ''}">
                </div>
                <div class="form-group">
                    <label>Комментарий</label>
                    <textarea name="comment" rows="3">${order.comment || ''}</textarea>
                </div>
                <div class="modal-buttons">
                    <button type="submit" class="btn-save">Сохранить</button>
                    <button type="button" class="btn-cancel" onclick="document.getElementById('modal-close').click()">Отмена</button>
                </div>
            </form>
        `;
        modalOverlay.classList.remove('hidden');

        document.getElementById('edit-form').addEventListener('submit', async (e) => {
            e.preventDefault();
            const formData = new FormData(e.target);
            const data = Object.fromEntries(formData.entries());

            try {
                const response = await fetch(`${BASE_URL}/orders/${order.id}?api_key=${API_KEY}`, {
                    method: 'PUT',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(data)
                });
                
                if (!response.ok) {
                    const err = await response.json().catch(() => ({}));
                    throw new Error(err.error || 'Ошибка сервера');
                }
                
                alert('Заказ изменён!');
                closeModal();
                loadOrders();
            } catch (error) {
                alert('Ошибка при изменении: ' + error.message);
            }
        });
    };

    const showDeleteConfirm = (order) => {
        modalBody.innerHTML = `
            <h3>Удалить заказ?</h3>
            <p>Вы уверены, что хотите удалить этот заказ?</p>
            <div class="modal-buttons">
                <button class="btn-yes" id="confirm-delete">Да</button>
                <button class="btn-cancel" onclick="document.getElementById('modal-close').click()">Отмена</button>
            </div>
        `;
        modalOverlay.classList.remove('hidden');

        document.getElementById('confirm-delete').addEventListener('click', async () => {
            try {
                const response = await fetch(`${BASE_URL}/orders/${order.id}?api_key=${API_KEY}`, {
                    method: 'DELETE'
                });
                
                if (!response.ok) {
                    const err = await response.json().catch(() => ({}));
                    throw new Error(err.error || 'Ошибка сервера');
                }
                
                alert('Заказ удалён!');
                closeModal();
                loadOrders();
            } catch (error) {
                alert('Ошибка при удалении: ' + error.message);
            }
        });
    };

    loadDishes().then(loadOrders);
});