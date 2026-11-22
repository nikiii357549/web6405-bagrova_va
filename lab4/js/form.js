class ContactFormData {
    constructor({ name, email, topic, message, agree }) {
        this.name = name;
        this.email = email;
        this.topic = topic;
        this.message = message;
        this.agree = agree;
        this.createdAt = new Date().toLocaleString('ru-RU');
    }

    print() {
        console.log('%c===== ДАННЫЕ ФОРМЫ =====', 'color:#00ff41;font-weight:bold;');
        console.log(`Имя:        ${this.name}`);
        console.log(`Email:      ${this.email}`);
        console.log(`Тема:       ${this.topic}`);
        console.log(`Сообщение:  ${this.message || '(пусто)'}`);
        console.log(`Согласие:   ${this.agree ? 'да' : 'нет'}`);
        console.log(`Отправлено: ${this.createdAt}`);
        console.log('%c=========================', 'color:#00ff41;font-weight:bold;');
    }
}

function startMatrixRain(canvasElement) {
    const ctx = canvasElement.getContext('2d');
    let width, height, columns, drops;
    const chars = '01';
    const fontSize = 14;
    let intervalId;

    function resize() {
        width = canvasElement.width = canvasElement.offsetWidth;
        height = canvasElement.height = canvasElement.offsetHeight;
        columns = Math.floor(width / fontSize);
        drops = new Array(columns).fill(1);
    }

    function draw() {
        ctx.fillStyle = 'rgba(0, 17, 0, 0.1)';
        ctx.fillRect(0, 0, width, height);
        ctx.fillStyle = '#00ff41';
        ctx.font = fontSize + 'px monospace';

        for (let i = 0; i < drops.length; i++) {
            const text = chars[Math.floor(Math.random() * chars.length)];
            ctx.fillText(text, i * fontSize, drops[i] * fontSize);
            if (drops[i] * fontSize > height && Math.random() > 0.975) drops[i] = 0;
            drops[i]++;
        }
    }

    resize();
    intervalId = setInterval(draw, 50);

    return () => {
        clearInterval(intervalId);
    };
}

document.addEventListener('DOMContentLoaded', () => {
    const form = document.getElementById('contactForm');
    const modal = document.getElementById('matrixModal');
    const closeBtn = document.getElementById('matrixClose');
    const modalInfo = document.getElementById('matrixInfo');
    const canvas = document.getElementById('matrixCanvas');

    if (!form || !modal) return;

    let stopRain = null;

    form.addEventListener('submit', (event) => {
        event.preventDefault();

        const data = new ContactFormData({
            name:    form.name.value.trim(),
            email:   form.email.value.trim(),
            topic:   form.topic.value,
            message: form.message.value.trim(),
            agree:   form.agree.checked
        });

        if (!data.name || !data.email || !data.agree) {
            alert('Заполните имя, email и подтвердите согласие на обработку данных.');
            return;
        }

        data.print();

        modalInfo.innerHTML = `
            <h3 class="matrix-modal__title">ДАННЫЕ В МАТРИЦЕ</h3>
            <p><strong>Имя:</strong> ${data.name}</p>
            <p><strong>Email:</strong> ${data.email}</p>
            <p><strong>Тема:</strong> ${data.topic}</p>
            <p><strong>Сообщение:</strong> ${data.message || '(пусто)'}</p>
            <p><strong>Отправлено:</strong> ${data.createdAt}</p>
        `;

        modal.classList.add('matrix-modal--active');

        setTimeout(() => {
            if (stopRain) stopRain();
            stopRain = startMatrixRain(canvas);
        }, 50);

        form.reset();
    });

    function closeModal() {
        modal.classList.remove('matrix-modal--active');
        if (stopRain) {
            stopRain();
            stopRain = null;
        }
    }

    closeBtn.addEventListener('click', closeModal);
    modal.addEventListener('click', (e) => {
        if (e.target === modal) closeModal();
    });
});