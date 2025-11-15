// 表單處理邏輯
document.addEventListener('DOMContentLoaded', function() {
    const form = document.getElementById('weddingForm');
    const hasCompanionRadios = document.querySelectorAll('input[name="hasCompanion"]');
    const guestCountGroup = document.getElementById('guestCountGroup');
    const guestCountSelect = document.getElementById('guestCount');
    const successMessage = document.getElementById('successMessage');
    const scrollTriggers = document.querySelectorAll('[data-scroll-to]');
    const countdownTargets = {
        days: document.getElementById('days'),
        hours: document.getElementById('hours'),
        minutes: document.getElementById('minutes'),
        seconds: document.getElementById('seconds'),
    };

    // 根據是否攜伴顯示/隱藏參加人數欄位
    hasCompanionRadios.forEach(radio => {
        radio.addEventListener('change', function() {
            if (this.value === 'yes') {
                guestCountGroup.style.display = 'block';
                guestCountSelect.setAttribute('required', 'required');
            } else {
                guestCountGroup.style.display = 'none';
                guestCountSelect.removeAttribute('required');
                guestCountSelect.value = '';
            }
        });
    });

    // 表單提交處理
    form.addEventListener('submit', function(e) {
        e.preventDefault();

        // 表單驗證
        if (!form.checkValidity()) {
            form.reportValidity();
            return;
        }

        // 處理複選框數據 - 將多個選項組合成字符串
        const dietaryChecked = Array.from(document.querySelectorAll('input[name="dietary"]:checked')).map(cb => {
            const labels = {
                'vegetarian': '素食',
                'vegan': '全素',
                'allergy': '過敏'
            };
            return labels[cb.value] || cb.value;
        });
        
        const optionalActivitiesChecked = Array.from(document.querySelectorAll('input[name="optionalActivities"]:checked')).map(cb => {
            const labels = {
                'pasta-class': 'Pasta Class',
                'tiramisu-class': 'Tiramisu Class',
                'wine-tasting': 'Wine Tasting'
            };
            return labels[cb.value] || cb.value;
        });

        // 確保單選按鈕的值被正確包含
        const hasCompanionChecked = document.querySelector('input[name="hasCompanion"]:checked');
        const stayAtVillaChecked = document.querySelector('input[name="stayAtVilla"]:checked');
        
        if (!hasCompanionChecked || !stayAtVillaChecked) {
            alert('請完成所有必填欄位');
            return;
        }

        // 為 Formspree 添加格式化的數據
        if (dietaryChecked.length > 0) {
            const dietaryInput = document.createElement('input');
            dietaryInput.type = 'hidden';
            dietaryInput.name = 'dietary';
            dietaryInput.value = dietaryChecked.join('、');
            form.appendChild(dietaryInput);
        } else {
            // 即使沒有選擇，也添加空值
            const dietaryInput = document.createElement('input');
            dietaryInput.type = 'hidden';
            dietaryInput.name = 'dietary';
            dietaryInput.value = '';
            form.appendChild(dietaryInput);
        }

        if (optionalActivitiesChecked.length > 0) {
            const activitiesInput = document.createElement('input');
            activitiesInput.type = 'hidden';
            activitiesInput.name = 'optionalActivities';
            activitiesInput.value = optionalActivitiesChecked.join('、');
            form.appendChild(activitiesInput);
        } else {
            const activitiesInput = document.createElement('input');
            activitiesInput.type = 'hidden';
            activitiesInput.name = 'optionalActivities';
            activitiesInput.value = '';
            form.appendChild(activitiesInput);
        }

        // 添加提交時間
        const submittedAtInput = document.createElement('input');
        submittedAtInput.type = 'hidden';
        submittedAtInput.name = 'submittedAt';
        submittedAtInput.value = new Date().toLocaleString('zh-TW', { timeZone: 'Asia/Taipei' });
        form.appendChild(submittedAtInput);

        // 格式化單選按鈕的值（用於更清晰的顯示）
        const hasCompanionFormatted = document.createElement('input');
        hasCompanionFormatted.type = 'hidden';
        hasCompanionFormatted.name = '是否攜伴';
        hasCompanionFormatted.value = hasCompanionChecked.value === 'yes' ? '是，我會攜伴' : '否，我一個人參加';
        form.appendChild(hasCompanionFormatted);

        const stayAtVillaFormatted = document.createElement('input');
        stayAtVillaFormatted.type = 'hidden';
        stayAtVillaFormatted.name = '是否同住Villa';
        stayAtVillaFormatted.value = stayAtVillaChecked.value === 'yes' ? '是，我會與你們同住' : '否，我會自行安排住宿';
        form.appendChild(stayAtVillaFormatted);

        // 創建 FormData 並提交到 Formspree
        const formData = new FormData(form);
        
        // 調試：顯示將要提交的數據
        console.log('準備提交的表單數據:');
        for (let [key, value] of formData.entries()) {
            console.log(key + ':', value);
        }
        
        // 提交到 Formspree
        fetch(form.action, {
            method: 'POST',
            body: formData,
            headers: {
                'Accept': 'application/json'
            }
        })
        .then(response => {
            console.log('Formspree 回應狀態:', response.status);
            if (response.ok) {
                return response.json().then(data => {
                    console.log('Formspree 回應數據:', data);
                    // 顯示成功訊息
                    form.style.display = 'none';
                    successMessage.style.display = 'block';
                });
            } else {
                return response.json().then(data => {
                    console.error('Formspree 錯誤回應:', data);
                    if (data.errors) {
                        console.error('表單錯誤:', data.errors);
                        alert('表單提交失敗：' + JSON.stringify(data.errors));
                    } else {
                        alert('表單提交失敗，狀態碼：' + response.status);
                    }
                }).catch(err => {
                    console.error('解析錯誤回應失敗:', err);
                    alert('表單提交失敗，請檢查控制台');
                });
            }
        })
        .catch(error => {
            console.error('提交錯誤:', error);
            console.error('錯誤詳情:', error.message);
            alert('表單提交失敗，請檢查瀏覽器控制台（F12）查看詳細錯誤');
        });
    });

    // 重置表單時隱藏成功訊息
    form.addEventListener('reset', function() {
        successMessage.style.display = 'none';
        form.style.display = 'block';
        guestCountGroup.style.display = 'none';
        guestCountSelect.removeAttribute('required');
    });

    // 平滑滑動效果
    scrollTriggers.forEach(trigger => {
        trigger.addEventListener('click', () => {
            const targetSelector = trigger.getAttribute('data-scroll-to');
            const target = document.querySelector(targetSelector);
            if (target) {
                target.scrollIntoView({ behavior: 'smooth' });
            }
        });
    });

    // 倒數計時
    const weddingDate = new Date('2026-05-18T12:00:00+02:00');
    const countdownInterval = setInterval(() => {
        const now = new Date();
        const diff = weddingDate - now;

        if (diff <= 0) {
            clearInterval(countdownInterval);
            Object.values(countdownTargets).forEach(el => {
                if (el) el.textContent = '00';
            });
            return;
        }

        const days = Math.floor(diff / (1000 * 60 * 60 * 24));
        const hours = Math.floor((diff / (1000 * 60 * 60)) % 24);
        const minutes = Math.floor((diff / (1000 * 60)) % 60);
        const seconds = Math.floor((diff / 1000) % 60);

        if (countdownTargets.days) countdownTargets.days.textContent = String(days).padStart(2, '0');
        if (countdownTargets.hours) countdownTargets.hours.textContent = String(hours).padStart(2, '0');
        if (countdownTargets.minutes) countdownTargets.minutes.textContent = String(minutes).padStart(2, '0');
        if (countdownTargets.seconds) countdownTargets.seconds.textContent = String(seconds).padStart(2, '0');
    }, 1000);

    // 圖片滑動效果
    const galleryTrack = document.querySelector('.gallery-track');
    const galleryWrapper = document.querySelector('.gallery-track-wrapper');
    const galleryCards = document.querySelectorAll('.gallery-card');
    const galleryDotsContainer = document.querySelector('.gallery-dots');
    const prevBtn = document.querySelector('.gallery-btn.prev');
    const nextBtn = document.querySelector('.gallery-btn.next');
    let currentSlide = 0;

    if (galleryTrack && galleryWrapper && galleryCards.length > 0) {
        let slideWidth = galleryWrapper.offsetWidth;

        const updateDots = () => {
            const dots = galleryDotsContainer?.querySelectorAll('button');
            dots?.forEach((dot, index) => {
                dot.classList.toggle('active', index === currentSlide);
            });
        };

        const goToSlide = (targetIndex) => {
            const total = galleryCards.length;
            currentSlide = (targetIndex + total) % total;
            const offset = currentSlide * slideWidth;
            galleryTrack.style.transform = `translateX(-${offset}px)`;
            updateDots();
        };

        const createDots = () => {
            if (!galleryDotsContainer) return;
            galleryDotsContainer.innerHTML = '';
            galleryCards.forEach((_, index) => {
                const dot = document.createElement('button');
                dot.type = 'button';
                dot.setAttribute('aria-label', `前往第 ${index + 1} 張照片`);
                dot.addEventListener('click', () => {
                    goToSlide(index);
                    resetAutoPlay();
                });
                if (index === 0) dot.classList.add('active');
                galleryDotsContainer.appendChild(dot);
            });
        };

        createDots();

        function nextSlide() {
            goToSlide(currentSlide + 1);
        }

        function prevSlide() {
            goToSlide(currentSlide - 1);
        }

        nextBtn?.addEventListener('click', () => {
            nextSlide();
            resetAutoPlay();
        });
        prevBtn?.addEventListener('click', () => {
            prevSlide();
            resetAutoPlay();
        });

        window.addEventListener('resize', () => {
            slideWidth = galleryWrapper.offsetWidth;
            goToSlide(currentSlide);
        });

        let autoPlay = setInterval(nextSlide, 6000);

        function resetAutoPlay() {
            clearInterval(autoPlay);
            autoPlay = setInterval(nextSlide, 6000);
        }

        galleryTrack.addEventListener('touchstart', resetAutoPlay, { passive: true });
        galleryTrack.addEventListener('mouseenter', () => clearInterval(autoPlay));
        galleryTrack.addEventListener('mouseleave', resetAutoPlay);

        goToSlide(0);
    }


    // 可以添加更多驗證邏輯
    function validateForm() {
        const name = document.getElementById('name').value.trim();
        const email = document.getElementById('email').value.trim();
        const hasCompanion = document.querySelector('input[name="hasCompanion"]:checked');
        const stayAtVilla = document.querySelector('input[name="stayAtVilla"]:checked');

        if (!name) {
            alert('請輸入姓名');
            return false;
        }

        if (!email) {
            alert('請輸入電子郵件');
            return false;
        }

        if (!hasCompanion) {
            alert('請選擇是否攜伴');
            return false;
        }

        if (hasCompanion.value === 'yes' && !guestCountSelect.value) {
            alert('請選擇參加人數');
            return false;
        }

        if (!stayAtVilla) {
            alert('請選擇是否與我們同住 Villa');
            return false;
        }

        return true;
    }
});

// 如果需要發送到服務器，可以使用這個函數
function sendToServer(formData) {
    // 範例：使用 fetch API 發送到後端
    /*
    fetch('/api/wedding-rsvp', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData)
    })
    .then(response => response.json())
    .then(data => {
        console.log('成功:', data);
    })
    .catch((error) => {
        console.error('錯誤:', error);
        alert('表單提交失敗，請稍後再試');
    });
    */
}

