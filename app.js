/* ==========================================================================
   FANTASY FROG FISHING - CORE GAME ENGINE (app.js)
   ========================================================================== */

// ==========================================================================
// 1. SYNTHETIC SOUND GENERATOR (Web Audio API)
// ==========================================================================
class SoundSynth {
    constructor() {
        this.ctx = null;
        this.enabled = true;
    }

    init() {
        if (!this.ctx) {
            this.ctx = new (window.AudioContext || window.webkitAudioContext)();
        }
        if (this.ctx.state === 'suspended') {
            this.ctx.resume();
        }
    }

    toggle() {
        this.enabled = !this.enabled;
        const icon = document.querySelector('#btn-toggle-sound i');
        if (this.enabled) {
            icon.className = 'fas fa-volume-up';
            this.init();
        } else {
            icon.className = 'fas fa-volume-mute';
        }
        return this.enabled;
    }

    playCast() {
        if (!this.enabled) return;
        this.init();
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        osc.type = 'triangle';
        osc.frequency.setValueAtTime(150, this.ctx.currentTime);
        osc.frequency.exponentialRampToValueAtTime(800, this.ctx.currentTime + 0.3);
        
        gain.gain.setValueAtTime(0.15, this.ctx.currentTime);
        gain.gain.linearRampToValueAtTime(0.01, this.ctx.currentTime + 0.3);
        
        osc.connect(gain);
        gain.connect(this.ctx.destination);
        
        osc.start();
        osc.stop(this.ctx.currentTime + 0.3);
    }

    playSplash() {
        if (!this.enabled) return;
        this.init();
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(200, this.ctx.currentTime);
        osc.frequency.exponentialRampToValueAtTime(50, this.ctx.currentTime + 0.4);
        
        gain.gain.setValueAtTime(0.3, this.ctx.currentTime);
        gain.gain.linearRampToValueAtTime(0.01, this.ctx.currentTime + 0.4);
        
        osc.connect(gain);
        gain.connect(this.ctx.destination);
        
        osc.start();
        osc.stop(this.ctx.currentTime + 0.4);
    }

    playCatch() {
        if (!this.enabled) return;
        this.init();
        const now = this.ctx.currentTime;
        const notes = [261.63, 329.63, 392.00, 523.25]; // C major chord
        notes.forEach((freq, index) => {
            const osc = this.ctx.createOscillator();
            const gain = this.ctx.createGain();
            osc.type = 'sine';
            osc.frequency.setValueAtTime(freq, now + index * 0.08);
            
            gain.gain.setValueAtTime(0.12, now + index * 0.08);
            gain.gain.linearRampToValueAtTime(0.01, now + index * 0.08 + 0.3);
            
            osc.connect(gain);
            gain.connect(this.ctx.destination);
            
            osc.start(now + index * 0.08);
            osc.stop(now + index * 0.08 + 0.3);
        });
    }

    playHurt() {
        if (!this.enabled) return;
        this.init();
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        osc.type = 'sawtooth';
        osc.frequency.setValueAtTime(220, this.ctx.currentTime);
        osc.frequency.linearRampToValueAtTime(80, this.ctx.currentTime + 0.4);
        
        gain.gain.setValueAtTime(0.15, this.ctx.currentTime);
        gain.gain.linearRampToValueAtTime(0.01, this.ctx.currentTime + 0.4);
        
        osc.connect(gain);
        gain.connect(this.ctx.destination);
        
        osc.start();
        osc.stop(this.ctx.currentTime + 0.4);
    }

    playSnap() {
        if (!this.enabled) return;
        this.init();
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        osc.type = 'triangle';
        osc.frequency.setValueAtTime(800, this.ctx.currentTime);
        osc.frequency.exponentialRampToValueAtTime(100, this.ctx.currentTime + 0.25);
        
        gain.gain.setValueAtTime(0.35, this.ctx.currentTime);
        gain.gain.linearRampToValueAtTime(0.01, this.ctx.currentTime + 0.25);
        
        osc.connect(gain);
        gain.connect(this.ctx.destination);
        
        osc.start();
        osc.stop(this.ctx.currentTime + 0.25);
    }

    playUpgrade() {
        if (!this.enabled) return;
        this.init();
        const now = this.ctx.currentTime;
        const notes = [440, 554, 659, 880]; // A Major chord
        notes.forEach((freq, index) => {
            const osc = this.ctx.createOscillator();
            const gain = this.ctx.createGain();
            osc.type = 'sine';
            osc.frequency.setValueAtTime(freq, now + index * 0.06);
            
            gain.gain.setValueAtTime(0.15, now + index * 0.06);
            gain.gain.linearRampToValueAtTime(0.01, now + index * 0.06 + 0.25);
            
            osc.connect(gain);
            gain.connect(this.ctx.destination);
            
            osc.start(now + index * 0.06);
            osc.stop(now + index * 0.06 + 0.25);
        });
    }
}

const sounds = new SoundSynth();

// Toggle sound element listener
document.getElementById('btn-toggle-sound').addEventListener('click', () => {
    sounds.toggle();
});

// ==========================================================================
// 2. OOP DESIGN MODULE (MATCHING UML DIAGRAM)
// ==========================================================================

/**
 * Lớp trừu tượng GameObject
 */
class GameObject {
    constructor(x, y, width, height) {
        if (this.constructor === GameObject) {
            throw new Error("Lớp GameObject là lớp trừu tượng và không thể khởi tạo trực tiếp.");
        }
        this.x = x;
        this.y = y;
        this.vx = 0;
        this.vy = 0;
        this.width = width;
        this.height = height;
        this.active = true;
    }

    /**
     * Cập nhật logic theo chu kỳ game loop (dt: delta time)
     */
    update(dt) {
        throw new Error("Phương thức 'update(dt)' phải được ghi đè.");
    }

    /**
     * Vẽ đối tượng lên canvas
     */
    draw(ctx) {
        throw new Error("Phương thức 'draw(ctx)' phải được ghi đè.");
    }
}

/**
 * Lớp Gió quản lý hướng gió và lực gió tĩnh/động
 */
class Wind {
    constructor() {
        this.direction = 1; // 1: Thổi sang phải, -1: Thổi sang trái
        this.strength = 0;   // Lực gió từ 0.0 đến 6.0 m/s
    }

    change() {
        // Thay đổi ngẫu nhiên sau mỗi lượt quăng mồi
        this.direction = Math.random() > 0.5 ? 1 : -1;
        this.strength = Number((Math.random() * 5.0).toFixed(1)); // Gió ngẫu nhiên từ 0 đến 5m/s
        
        // Cập nhật la bàn gió trên HUD
        const arrow = document.getElementById('wind-arrow');
        const text = document.getElementById('env-wind-text');
        
        if (arrow && text) {
            const rot = this.direction * this.strength * 18; // Góc xoay la bàn
            arrow.style.transform = `rotate(${rot}deg)`;
            text.innerHTML = `Gió: ${this.strength} m/s ${this.direction > 0 ? '➡' : '⬅'}`;
        }
    }
}

/**
 * Lớp Ếch (Frog) kế thừa GameObject
 */
class Frog extends GameObject {
    constructor(x, y, type) {
        super(x, y, 40, 30);
        this.type = type; // 'normal', 'rare', 'poison', 'magical', 'boss'
        
        // Thiết lập thuộc tính riêng theo chủng loại
        this.setupStats();

        // Biến trạng thái AI
        this.walkTimer = 0;
        this.diveTimer = Math.random() * 5 + 3; // Thời gian lặn ngẫu nhiên
        this.isDiving = false;
        this.diveProgress = 1; // 1: Nổi hoàn toàn, 0: Lặn mất tăm
        this.facing = Math.random() > 0.5 ? 1 : -1;
        this.hopProgress = 0;
        this.hopSpeed = 0.15;
        this.isHopping = false;
        this.glowPulse = 0;
    }

    setupStats() {
        switch (this.type) {
            case 'normal':
                this.width = 44;
                this.height = 34;
                this.speed = 40 + Math.random() * 20;
                this.value = 10; // Điểm cơ bản
                this.gold = 15;  // Vàng nhận được
                this.color = '#38b000'; // Xanh lá cây
                this.eyeColor = '#ffffff';
                break;
            case 'rare': // Ếch Ninja / Vàng
                this.width = 38;
                this.height = 30;
                this.speed = 120 + Math.random() * 60;
                this.value = 35;
                this.gold = 50;
                this.color = '#ffcc00'; // Vàng óng
                this.eyeColor = '#ff3333';
                this.isNinja = Math.random() > 0.5; // Đeo băng đô đỏ
                break;
            case 'poison': // Ếch Gai Độc
                this.width = 42;
                this.height = 36;
                this.speed = 25 + Math.random() * 15;
                this.value = -20; // Trừ điểm nếu câu nhầm!
                this.gold = -10;  // Trừ vàng
                this.color = '#7b2cbf'; // Tím gai góc
                this.eyeColor = '#39ff14'; // Mắt neon lá
                break;
            case 'magical': // Ếch phát sáng đêm
                this.width = 40;
                this.height = 32;
                this.speed = 60 + Math.random() * 30;
                this.value = 50;
                this.gold = 80;
                this.color = '#00f0ff'; // Xanh Cyan phát sáng
                this.eyeColor = '#ffffff';
                break;
            case 'boss': // Boss khổng lồ
                this.width = 96;
                this.height = 80;
                this.speed = 20;
                this.value = 150;
                this.gold = 250;
                this.color = '#2d004d'; // Tím đậm vương giả
                this.eyeColor = '#ffd700'; // Mắt vàng rực
                break;
        }
    }

    update(dt, waterY) {
        if (!this.active) return;

        // Chu kỳ lấp lánh (dành cho Ếch Ma Thuật/Boss)
        this.glowPulse += dt * 3;

        // Xử lý trạng thái Lặn/Nổi (Dive/Rise) của ếch (Trừ Boss không lặn)
        if (this.type !== 'boss') {
            this.diveTimer -= dt;
            if (this.diveTimer <= 0) {
                this.isDiving = !this.isDiving;
                this.diveTimer = this.isDiving ? (Math.random() * 3 + 2) : (Math.random() * 6 + 4);
            }

            if (this.isDiving) {
                this.diveProgress = Math.max(0, this.diveProgress - dt * 1.5);
            } else {
                this.diveProgress = Math.min(1, this.diveProgress + dt * 1.5);
            }
        }

        // Nếu lặn sâu mất tăm thì không di chuyển hay kích hoạt va chạm
        if (this.diveProgress <= 0.1) return;

        // AI di chuyển ngẫu nhiên (Random Walk)
        this.walkTimer -= dt;
        if (this.walkTimer <= 0) {
            this.walkTimer = Math.random() * 3 + 1.5;
            this.facing = Math.random() > 0.5 ? 1 : -1;
            // Kích hoạt nhảy lò cò
            if (Math.random() > 0.25) {
                this.isHopping = true;
                this.hopProgress = 0;
            }
        }

        if (this.isHopping) {
            this.hopProgress += dt * 5;
            if (this.hopProgress >= Math.PI) {
                this.hopProgress = 0;
                this.isHopping = false;
                this.spawnFrogLandRipple = true; // Đáp đất tạo gợn sóng
            }
            // Di chuyển x dựa trên hướng quay mặt
            this.x += this.facing * this.speed * dt * 1.2;
            
            // Xử lý nếu ếch đụng biên hồ
            if (this.x < 50) {
                this.x = 50;
                this.facing = 1;
            } else if (this.x > 820 - this.width) {
                this.x = 820 - this.width;
                this.facing = -1;
            }
        }
    }

    draw(ctx) {
        if (!this.active) return;
        
        ctx.save();
        ctx.globalAlpha = this.diveProgress; // Làm mờ khi lặn

        // Tính độ nảy lên của ếch khi đang nhảy lò cò
        let hopYOffset = 0;
        if (this.isHopping) {
            hopYOffset = -Math.sin(this.hopProgress) * 16;
        }

        const fx = this.x;
        const fy = this.y + hopYOffset;
        const fw = this.width;
        const fh = this.height;
        const squash = this.isHopping ? 1 - Math.sin(this.hopProgress) * 0.08 : 1;

        ctx.save();
        ctx.globalAlpha *= 0.34;
        ctx.fillStyle = '#02040a';
        ctx.beginPath();
        ctx.ellipse(fx + fw / 2, this.y + fh + 7, fw * 0.44, fh * 0.16, 0, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();

        // VẼ HIỆU ỨNG PHÁT SÁNG CHO CÁC LOẠI ẾCH QUÝ HIẾM
        if (this.type === 'magical' || this.type === 'boss' || this.type === 'rare') {
            ctx.shadowBlur = 10 + Math.sin(this.glowPulse) * 5;
            ctx.shadowColor = this.type === 'magical' ? '#00f0ff' : (this.type === 'boss' ? '#bd00ff' : '#ffcc00');
        }

        // Vẽ thân ếch (Dạng Vector mượt mà chất lượng cao)
        const bodyGradient = ctx.createRadialGradient(
            fx + fw * 0.32,
            fy + fh * 0.28,
            2,
            fx + fw * 0.5,
            fy + fh * 0.55,
            Math.max(fw, fh) * 0.55
        );
        bodyGradient.addColorStop(0, '#d8ff9b');
        bodyGradient.addColorStop(0.24, this.color);
        bodyGradient.addColorStop(1, this.type === 'poison' ? '#40105f' : '#06472e');
        ctx.fillStyle = bodyGradient;
        
        // Thân chính (Bầu dục dẹt)
        ctx.beginPath();
        ctx.ellipse(fx + fw/2, fy + fh/2 + 2, fw/2, (fh/2 - 2) * squash, 0, 0, Math.PI * 2);
        ctx.fill();

        ctx.globalAlpha *= 0.55;
        ctx.fillStyle = this.type === 'poison' ? '#ff7ad9' : '#b8ff7d';
        for (let i = 0; i < 4; i++) {
            const spotX = fx + fw * (0.25 + i * 0.16);
            const spotY = fy + fh * (0.32 + (i % 2) * 0.22);
            ctx.beginPath();
            ctx.ellipse(spotX, spotY, fw * 0.055, fh * 0.05, 0.4, 0, Math.PI * 2);
            ctx.fill();
        }
        ctx.globalAlpha = this.diveProgress;

        // Ếch độc thì vẽ gai nhọn màu hồng neon phát sáng
        if (this.type === 'poison') {
            ctx.fillStyle = '#ff007f';
            // Gai trái
            ctx.beginPath();
            ctx.moveTo(fx + 6, fy + 8);
            ctx.lineTo(fx - 2, fy + 2);
            ctx.lineTo(fx + 10, fy + 12);
            ctx.fill();
            // Gai phải
            ctx.beginPath();
            ctx.moveTo(fx + fw - 6, fy + 8);
            ctx.lineTo(fx + fw + 2, fy + 2);
            ctx.lineTo(fx + fw - 10, fy + 12);
            ctx.fill();
            // Gai đỉnh đầu
            ctx.beginPath();
            ctx.moveTo(fx + fw/2, fy + 2);
            ctx.lineTo(fx + fw/2 - 4, fy - 6);
            ctx.lineTo(fx + fw/2 + 4, fy - 6);
            ctx.closePath();
            ctx.fill();
            ctx.fillStyle = this.color;
        }

        // Hai đùi ếch
        ctx.beginPath();
        // Đùi trái
        ctx.fillStyle = bodyGradient;
        ctx.ellipse(fx + 6, fy + fh - 8, 8, 12, -Math.PI / 4, 0, Math.PI * 2);
        // Đùi phải
        ctx.ellipse(fx + fw - 6, fy + fh - 8, 8, 12, Math.PI / 4, 0, Math.PI * 2);
        ctx.fill();

        // Hai mắt to lồi
        ctx.fillStyle = this.color;
        ctx.beginPath();
        ctx.arc(fx + fw * 0.28, fy + 4, 6 * (fw/44), 0, Math.PI * 2);
        ctx.arc(fx + fw * 0.72, fy + 4, 6 * (fw/44), 0, Math.PI * 2);
        ctx.fill();

        // Tròng trắng mắt
        ctx.fillStyle = this.eyeColor;
        ctx.beginPath();
        ctx.arc(fx + fw * 0.28, fy + 3, 4 * (fw/44), 0, Math.PI * 2);
        ctx.arc(fx + fw * 0.72, fy + 3, 4 * (fw/44), 0, Math.PI * 2);
        ctx.fill();

        // Đồng tử đen (Có hướng nhìn theo facing)
        ctx.fillStyle = '#000000';
        ctx.beginPath();
        ctx.arc(fx + fw * 0.28 + this.facing * 1.5, fy + 3, 2 * (fw/44), 0, Math.PI * 2);
        ctx.arc(fx + fw * 0.72 + this.facing * 1.5, fy + 3, 2 * (fw/44), 0, Math.PI * 2);
        ctx.fill();

        // Bụng màu vàng nhạt / kem
        ctx.fillStyle = this.type === 'poison' ? '#5a189a' : '#e2ecc8';
        ctx.beginPath();
        ctx.ellipse(fx + fw/2, fy + fh/2 + 6, fw * 0.3, fh * 0.25, 0, 0, Math.PI * 2);
        ctx.fill();

        // Miệng cười
        ctx.strokeStyle = '#000000';
        ctx.lineWidth = 1.5;
        ctx.beginPath();
        ctx.arc(fx + fw/2, fy + fh/2 + 2, 4 * (fw/44), 0, Math.PI);
        ctx.stroke();

        // Đồ trang trí đặc thù:
        if (this.type === 'rare' && this.isNinja) {
            // Đeo băng đô màu đỏ của Ninja
            ctx.fillStyle = '#ff3333';
            ctx.fillRect(fx + 2, fy + 5, fw - 4, 3);
            // Nơ buộc đằng sau đầu
            ctx.beginPath();
            ctx.moveTo(fx + 2, fy + 6);
            ctx.lineTo(fx - 4, fy + 3);
            ctx.lineTo(fx - 2, fy + 9);
            ctx.closePath();
            ctx.fill();
        }

        if (this.type === 'normal') {
            // Vẽ lá sen nhỏ đội đầu
            ctx.fillStyle = '#1e5f13';
            ctx.beginPath();
            ctx.ellipse(fx + fw/2, fy - 1, 10, 3, 0, 0, Math.PI * 2);
            ctx.fill();
            // Cuống lá sen đứng thẳng
            ctx.strokeStyle = '#1e5f13';
            ctx.lineWidth = 1.5;
            ctx.beginPath();
            ctx.moveTo(fx + fw/2, fy - 1);
            ctx.lineTo(fx + fw/2, fy + 3);
            ctx.stroke();
        }

        if (this.type === 'boss') {
            // Vẽ vương miện rực rỡ lấp lánh cho Boss
            ctx.fillStyle = '#ffd700';
            ctx.beginPath();
            ctx.moveTo(fx + fw/2 - 20, fy - 4);
            ctx.lineTo(fx + fw/2 - 25, fy - 22);
            ctx.lineTo(fx + fw/2 - 10, fy - 14);
            ctx.lineTo(fx + fw/2, fy - 28); // Đỉnh vương miện giữa
            ctx.lineTo(fx + fw/2 + 10, fy - 14);
            ctx.lineTo(fx + fw/2 + 25, fy - 22);
            ctx.lineTo(fx + fw/2 + 20, fy - 4);
            ctx.closePath();
            ctx.fill();

            // Ngọc ruby đỏ đính giữa vương miện
            ctx.fillStyle = '#ff0033';
            ctx.beginPath();
            ctx.arc(fx + fw/2, fy - 12, 3, 0, Math.PI * 2);
            ctx.fill();
        }

        ctx.restore();
    }
}

/**
 * Lớp Lưỡi Câu (Hook) kế thừa GameObject
 */
class Hook extends GameObject {
    constructor(x, y) {
        super(x, y, 16, 20);
        // Các trạng thái của lưỡi câu:
        // 'idle': Chờ ném tại ngọn cần câu
        // 'flying': Đang bay theo quỹ đạo parabol trên trời
        // 'sinking': Rơi xuống nước và chìm dần
        // 'reeling': Đang kéo dây câu về
        // 'caught': Đã đớp trúng ếch và đang kéo về cần
        // 'snapped': Đứt dây câu
        this.state = 'idle';
        this.startPos = { x: x, y: y }; // Ngọn cần câu
        this.angle = -Math.PI / 4; // Góc quăng mặc định
        this.power = 300; // Lực ném cơ bản
        this.time = 0; // Biến đếm thời gian bay vật lý
        this.caughtObject = null; // Đối tượng ếch bị câu trúng
        this.savedCaughtObject = null; // Lưu tạm đối tượng khi thành công câu
        this.targetRadius = 14; // Bán kính va chạm mặc định
        
        // Physics stats
        this.frictionWater = 1.8; // Lực cản nước
        this.tension = 0; // Sức căng hiện tại của dây
    }

    reset(rodTipX, rodTipY) {
        this.state = 'idle';
        this.x = rodTipX;
        this.y = rodTipY;
        this.vx = 0;
        this.vy = 0;
        this.time = 0;
        this.caughtObject = null;
        this.tension = 0;
    }

    launch(angle, power) {
        this.state = 'flying';
        this.angle = angle;
        this.power = power;
        this.time = 0;
        
        // Tốc độ ban đầu phân tích vectơ
        this.vx = Math.cos(angle) * power;
        this.vy = Math.sin(angle) * power;
        
        this.startPos.x = this.x;
        this.startPos.y = this.y;
        sounds.playCast();
    }

    update(dt, wind, rodTip, waterY, lineLimit, netBonusRadius) {
        const netRadius = this.targetRadius + netBonusRadius; // Bán kính vợt mở rộng
        
        switch (this.state) {
            case 'idle':
                // Đóng đinh ở đầu cần câu
                this.x = rodTip.x;
                this.y = rodTip.y;
                this.tension = 0;
                break;
                
            case 'flying':
                this.time += dt;
                // PHƯƠNG TRÌNH VẬT LÝ DI CHUYỂN DỰA TRÊN TRỌNG LỰC VÀ SỨC GIÓ
                // x(t) = x0 + vx0 * t + 0.5 * (wind_force) * t^2
                // y(t) = y0 + vy0 * t + 0.5 * g * t^2
                const gravity = 550; // Trọng lực ảo
                const windForce = wind.direction * wind.strength * 45; // Lực đẩy của gió
                
                this.x = this.startPos.x + this.vx * this.time + 0.5 * windForce * this.time * this.time;
                this.y = this.startPos.y + this.vy * this.time + 0.5 * gravity * this.time * this.time;

                // Kiểm tra va chạm mặt nước
                if (this.y >= waterY) {
                    this.state = 'sinking';
                    this.vx = this.vx * 0.15; // Giảm mạnh vận tốc ngang khi chạm nước
                    this.vy = 120; // Vận tốc chìm nước mặc định chậm hơn
                    sounds.playSplash();
                    
                    // Tạo hiệu ứng bọt nước vỡ oà (particle) được quản lý trong Game
                    this.createSplashEffect = true;
                }
                
                // Giới hạn biên bản đồ
                if (this.x < 0 || this.x > 960 || this.y > 540) {
                    this.state = 'reeling';
                }
                break;
                
            case 'sinking':
                // Vật lý chuyển động dưới nước: Lực cản nước lớn hơn
                // Chìm từ từ xuống đáy hồ
                this.y += this.vy * dt;
                this.x += this.vx * dt;
                
                // Giảm tốc ngang dần về 0
                this.vx *= 0.92;
                
                // Chìm tới đáy hồ
                if (this.y >= 510) {
                    this.y = 510;
                    this.state = 'reeling';
                }
                break;
                
            case 'reeling':
            case 'caught':
                // Kéo cần về phía đầu cần câu (rodTip)
                const dx = rodTip.x - this.x;
                const dy = rodTip.y - this.y;
                const dist = Math.sqrt(dx * dx + dy * dy);
                
                if (dist < 20) {
                    // Đã thu cần xong!
                    if (this.state === 'caught' && this.caughtObject) {
                        this.caughtObject.active = false; // Thu giữ ếch thành công
                        this.successfulCatch = true;
                        this.savedCaughtObject = this.caughtObject; // Lưu lại trước khi reset dọn dẹp
                    }
                    this.reset(rodTip.x, rodTip.y);
                } else {
                    // Tốc độ kéo dây cơ bản
                    let reelSpeed = 240;
                    
                    // TÍNH LỰC CĂNG DÂY VÀ SỨC KÉO CỦA DÂY CÂU
                    if (this.state === 'caught' && this.caughtObject) {
                        // Sức cản tăng dựa trên khối lượng từng loại ếch
                        let weight = 1.0;
                        if (this.caughtObject.type === 'rare') weight = 1.4;
                        if (this.caughtObject.type === 'poison') weight = 1.8; // Gai độc bám nước rất nặng
                        if (this.caughtObject.type === 'magical') weight = 1.2;
                        if (this.caughtObject.type === 'boss') weight = 4.5;
                        
                        // Sức căng dây tỉ lệ thuận với lực kéo ngược của ếch + nước cản
                        const pullTension = (weight * 40) * (this.y > waterY ? 1.5 : 1.0);
                        this.tension = Math.min(100, this.tension + pullTension * dt);
                        
                        // Giảm tốc độ thu dây tương ứng vì ếch nặng trì kéo
                        reelSpeed = Math.max(70, 240 - (weight * 35));
                    } else {
                        // Kéo trơn không ếch, xả căng dây dần
                        this.tension = Math.max(0, this.tension - dt * 90);
                    }

                    // Di chuyển lưỡi câu hướng về ngọn cần
                    this.x += (dx / dist) * reelSpeed * dt;
                    this.y += (dy / dist) * reelSpeed * dt;
                    
                    // Cập nhật vị trí của ếch đang dính câu
                    if (this.caughtObject) {
                        this.caughtObject.x = this.x - this.caughtObject.width/2;
                        this.caughtObject.y = this.y - 2;
                    }

                    // KIỂM TRA ĐỨT DÂY (Tension quá tải)
                    if (this.tension >= lineLimit) {
                        this.state = 'snapped';
                        sounds.playSnap();
                        if (this.caughtObject) {
                            this.caughtObject.active = false; // Ếch tuột mất
                            this.caughtObject = null;
                        }
                        this.snappedTimer = 1.0; // Hiện chữ đứt dây trong 1 giây
                    }
                }
                break;
                
            case 'snapped':
                // Rơi tự do thẳng xuống đáy hồ trước khi tự hồi lại cần sau 1.2 giây
                this.y += 200 * dt;
                this.snappedTimer -= dt;
                if (this.snappedTimer <= 0) {
                    this.reset(rodTip.x, rodTip.y);
                }
                break;
        }
    }

    draw(ctx, rodTip) {
        // 1. Vẽ dây câu siêu mảnh nối từ ngọn cần (rodTip) tới lưỡi câu
        if (this.state !== 'idle' && this.state !== 'snapped') {
            ctx.save();
            ctx.strokeStyle = this.state === 'caught' ? `rgba(255, ${255 - this.tension*2.5}, 0, 0.7)` : 'rgba(255, 255, 255, 0.4)';
            ctx.lineWidth = this.state === 'caught' ? 1.5 : 0.8;
            ctx.beginPath();
            ctx.moveTo(rodTip.x, rodTip.y);
            
            // Vẽ dây cong nhẹ dưới nước nếu lưỡi câu chìm sâu
            if (this.y > 330) {
                const midX = (rodTip.x + this.x) / 2 + 10;
                const midY = (rodTip.y + this.y) / 2 + 5;
                ctx.quadraticCurveTo(midX, midY, this.x, this.y);
            } else {
                ctx.lineTo(this.x, this.y);
            }
            ctx.stroke();
            ctx.restore();
        }

        // 2. Vẽ Lưỡi câu thực tế bằng Canvas (Dạng hình móc neo cổ điển)
        if (this.state !== 'idle') {
            ctx.save();
            ctx.translate(this.x, this.y);
            ctx.strokeStyle = '#cccccc';
            ctx.lineWidth = 2.0;
            
            if (this.state === 'snapped') {
                ctx.strokeStyle = '#ff3333';
                // Vẽ chữ cảnh báo ĐỨT DÂY!
                ctx.fillStyle = '#ff3333';
                ctx.font = 'bold 12px Outfit';
                ctx.fillText("ĐỨT DÂY!", -24, -15);
            }
            
            // Trục dọc móc câu
            ctx.beginPath();
            ctx.moveTo(0, -8);
            ctx.lineTo(0, 4);
            // Vòng cong lưỡi câu
            ctx.arc(4, 4, 4, Math.PI, Math.PI / 2, true);
            ctx.lineTo(8, 0);
            // Ngạnh nhọn của lưỡi
            ctx.lineTo(6, -2);
            ctx.stroke();
            
            // Mồi câu đính vào móc neo dựa theo mồi đang dùng
            ctx.font = '10px Arial';
            ctx.restore();
        }
    }
}

/**
 * Lớp Cá nhảy nhảy cướp mồi (Obstacle - Fish)
 */
class Fish extends GameObject {
    constructor() {
        // Spawns randomly at bottom, leaps in arc
        super(Math.random() * 600 + 100, 360, 24, 16);
        this.vy = -280 - Math.random() * 120; // Nhảy vọt lên trên
        this.vx = (Math.random() > 0.5 ? 1 : -1) * (40 + Math.random() * 50);
        this.gravity = 400;
        this.color = '#3a86c8'; // Cá lam ma thuật
    }

    update(dt, waterY) {
        if (!this.active) return;
        
        // Chuyển động parabol bay lên rồi rơi xuống
        this.vy += this.gravity * dt;
        this.x += this.vx * dt;
        this.y += this.vy * dt;

        // Rơi lại xuống sâu dưới mặt nước -> Biến mất
        if (this.vy > 0 && this.y >= 450) {
            this.active = false;
        }
    }

    draw(ctx) {
        if (!this.active) return;
        ctx.save();
        ctx.fillStyle = this.color;
        
        // Vẽ thân cá hình thoi thon thả
        ctx.translate(this.x, this.y);
        // Xoay đầu cá theo hướng di chuyển
        const angle = Math.atan2(this.vy, this.vx);
        ctx.rotate(angle);

        ctx.beginPath();
        ctx.ellipse(0, 0, 14, 6, 0, 0, Math.PI * 2);
        ctx.fill();

        // Đuôi cá nhỏ xinh
        ctx.beginPath();
        ctx.moveTo(-12, 0);
        ctx.lineTo(-20, -5);
        ctx.lineTo(-18, 0);
        ctx.lineTo(-20, 5);
        ctx.closePath();
        ctx.fill();

        // Mắt vàng nhỏ
        ctx.fillStyle = '#ffd700';
        ctx.beginPath();
        ctx.arc(8, -2, 1.5, 0, Math.PI * 2);
        ctx.fill();

        ctx.restore();
    }
}

/**
 * Lớp Chim Quắp Mồi Trên Trời (Obstacle - Bird)
 */
class Bird extends GameObject {
    constructor() {
        super(-50, Math.random() * 120 + 30, 32, 20); // Spawns left, flies right
        this.vx = 90 + Math.random() * 60;
        this.wingFlap = 0;
    }

    update(dt) {
        if (!this.active) return;
        this.x += this.vx * dt;
        this.wingFlap += dt * 12;

        // Bay ra khỏi màn hình bên phải
        if (this.x > 1010) {
            this.active = false;
        }
    }

    draw(ctx) {
        if (!this.active) return;
        ctx.save();
        ctx.fillStyle = '#100f24';
        ctx.strokeStyle = '#8b5cf6';
        ctx.lineWidth = 1.5;

        const bx = this.x;
        const by = this.y;
        
        // Nhấp nháy vỗ cánh chim ảo diệu
        const flap = Math.sin(this.wingFlap) * 12;

        ctx.beginPath();
        // Cánh trái
        ctx.moveTo(bx, by);
        ctx.quadraticCurveTo(bx + 10, by - 15 + flap, bx + 20, by);
        // Cánh phải
        ctx.moveTo(bx + 20, by);
        ctx.quadraticCurveTo(bx + 30, by - 15 + flap, bx + 40, by);
        ctx.stroke();

        // Đầu chim nhỏ
        ctx.fillStyle = '#a78bfa';
        ctx.beginPath();
        ctx.arc(bx + 20, by + 1, 3, 0, Math.PI * 2);
        ctx.fill();

        ctx.restore();
    }
}

// ==========================================================================
// 3. MAIN GAME CORE ENGINE (LỚP GAME - QUẢN LÝ VÒNG LẶP CHÍNH)
// ==========================================================================
class Game {
    constructor() {
        this.canvas = document.getElementById('gameCanvas');
        this.ctx = this.canvas.getContext('2d');
        
        // Môi trường nước và cần câu
        this.waterY = 320; // Tọa độ mặt nước
        this.rodTip = { x: 860, y: 150 }; // Vị trí đầu cần câu (nơi ném mồi)

        // Các thực thể game
        this.hook = new Hook(this.rodTip.x, this.rodTip.y);
        this.objects = []; // Chứa Ếch, Cá và Chim
        this.wind = new Wind();
        this.particles = []; // Quản lý hiệu ứng bong bóng nước/đom đóm phát sáng
        this.ripples = []; // Gợn sóng nước lan tỏa elip
        
        // Cần khởi tạo mặc định cho bờ cỏ sườn dốc
        this.rodTip = { x: 810, y: 120 };

        // Trạng thái chơi & Nâng cấp
        this.score = 0;
        this.gold = 0;
        this.level = 1;
        this.gameMode = 'time'; // 'time' or 'survival'
        this.gameState = 'menu'; // 'menu', 'playing', 'paused', 'gameover'
        this.timeRemaining = 90; // 90 giây
        
        // Hàng tồn kho Mồi câu
        this.baits = {
            worm: Infinity,
            fly: 5,
            spider: 3,
            firefly: 2
        };
        this.currentBait = 'worm';

        // Chỉ số Cấp độ Nâng cấp Trang bị
        this.upgrades = {
            rod: 1,  // Max: 5. Mỗi cấp tăng 20% lực quăng tối đa
            line: 1, // Max: 5. Mỗi cấp tăng 20% giới hạn sức chịu căng đứt dây
            net: 1   // Max: 5. Mỗi cấp tăng bán kính snag mồi câu 4px
        };

        // Biến điều khiển tương tác (Kéo quăng cần)
        this.isDragging = false;
        this.dragStart = { x: 0, y: 0 };
        this.dragCurrent = { x: 0, y: 0 };
        this.dragForce = 0;
        this.dragAngle = 0;

        // Chu kỳ thời gian Ngày/Đêm & Thời tiết
        this.weather = 'sunny'; // 'sunny', 'rainy'
        this.timeOfDay = 'morning'; // 'morning', 'evening', 'night'
        this.dayNightTimer = 30; // 30s chuyển đổi một lần
        this.weatherTimer = 40;  // 40s đổi thời tiết
        this.rainDrops = [];
        this.scenery = {
            farStars: Array.from({ length: 54 }, () => ({
                x: Math.random() * this.canvas.width,
                y: Math.random() * 190 + 12,
                r: Math.random() * 1.4 + 0.35,
                twinkle: Math.random() * Math.PI * 2
            })),
            clouds: Array.from({ length: 5 }, (_, i) => ({
                x: 70 + i * 190 + Math.random() * 60,
                y: 36 + Math.random() * 95,
                scale: 0.75 + Math.random() * 0.55,
                speed: 0.018 + Math.random() * 0.018
            })),
            reeds: Array.from({ length: 42 }, (_, i) => ({
                x: i < 21 ? 8 + i * 9 : 760 + (i - 21) * 10,
                h: 30 + Math.random() * 56,
                lean: (Math.random() - 0.5) * 18,
                phase: Math.random() * Math.PI * 2
            })),
            pebbles: Array.from({ length: 36 }, () => ({
                x: Math.random() * this.canvas.width,
                y: this.waterY + 74 + Math.random() * 128,
                r: 1.2 + Math.random() * 3.8,
                tone: Math.random()
            }))
        };

        // Hệ thống Minigame câu Boss
        this.activeBossBattle = false;
        this.bossObject = null;
        this.bossTension = 50; // 0 - 100%
        this.bossSafeZone = { min: 40, max: 70 };
        this.bossSafeZoneDir = 1; // Hướng dịch chuyển safe zone
        this.bossHP = 100; // Thể lực Boss giảm khi tension nằm trong safe zone

        // Quản lý hiệu năng 120 FPS
        this.lastTime = 0;
        this.fps = 120;
        this.fpsCounter = 0;
        this.fpsTimer = 0;

        // Tránh trôi trang khi nhấn phím số trên Windows
        this.setupInput();
    }

    setupInput() {
        // Tương tác chuột trái quăng cần
        this.canvas.addEventListener('mousedown', (e) => this.handleMouseDown(e));
        this.canvas.addEventListener('mousemove', (e) => this.handleMouseMove(e));
        window.addEventListener('mouseup', (e) => this.handleMouseUp(e));

        // Tương tác bàn phím chuyển đổi mồi câu nhanh
        window.addEventListener('keydown', (e) => {
            if (this.gameState !== 'playing') return;
            
            if (e.key === '1' || e.key === 'a' || e.key === 'A') this.selectBait('worm');
            if (e.key === '2' || e.key === 's' || e.key === 'S') this.selectBait('fly');
            if (e.key === '3' || e.key === 'd' || e.key === 'D') this.selectBait('spider');
            if (e.key === '4' || e.key === 'f' || e.key === 'F') this.selectBait('firefly');
        });
    }

    selectBait(type) {
        if (this.baits[type] > 0) {
            this.currentBait = type;
            // Cập nhật giao diện hoạt động mồi
            document.querySelectorAll('.bait-item').forEach(item => {
                item.classList.remove('active');
            });
            document.getElementById(`bait-${type}`).classList.add('active');
        }
    }

    start(mode) {
        this.gameMode = mode;
        this.score = 0;
        this.gold = 50; // Cho trước 50 vàng làm vốn
        this.level = 1;
        this.gameState = 'playing';
        
        this.timeRemaining = mode === 'time' ? 90 : 60; // Survival bắt đầu với 60s
        
        // Reset Baits
        this.baits = {
            worm: Infinity,
            fly: 5,
            spider: 3,
            firefly: 2
        };
        this.currentBait = 'worm';
        this.selectBait('worm');

        // Reset Upgrades
        this.upgrades = {
            rod: 1,
            line: 1,
            net: 1
        };

        // Dọn sạch thực thể cũ
        this.objects = [];
        this.particles = [];
        this.hook.reset(this.rodTip.x, this.rodTip.y);
        
        // Khởi động gió đầu tiên
        this.wind.change();

        // Đổ đầy ếch ban đầu
        this.spawnFrogs();

        // Ẩn màn hình menu chính, hiện gameplay HUD
        document.getElementById('menu-screen').classList.remove('active');
        document.getElementById('gameplay-screen').classList.add('active');
        
        // Cập nhật chỉ số HUD
        this.updateHUDValues();
        this.updateUpgradeShopUI();

        // Khởi tạo mưa ảo
        this.rainDrops = [];
        for (let i = 0; i < 80; i++) {
            this.rainDrops.push({
                x: Math.random() * 960,
                y: Math.random() * 540,
                len: Math.random() * 15 + 10,
                speed: Math.random() * 400 + 400
            });
        }

        // Bắt đầu vòng lặp game loop
        this.lastTime = performance.now();
        requestAnimationFrame((time) => this.loop(time));
    }

    spawnFrogs() {
        // Dọn dẹp ếch cũ không hoạt động
        this.objects = this.objects.filter(obj => obj.active);

        // Đếm số lượng ếch hiện có
        const currentFrogs = this.objects.filter(obj => obj instanceof Frog).length;
        const maxFrogs = 8 + this.level * 2; // Nhiều ếch hơn ở level cao
        
        const countToSpawn = maxFrogs - currentFrogs;

        for (let i = 0; i < countToSpawn; i++) {
            // Xác định loại ếch dựa trên tỉ lệ ngẫu nhiên và chu kỳ
            let type = 'normal';
            const r = Math.random();

            if (this.timeOfDay === 'night' && r < 0.3) {
                // Đêm tối: 30% cơ hội xuất hiện Ếch phát sáng ma thuật
                type = 'magical';
            } else if (r < 0.15) {
                // 15% Ếch Ninja cực nhanh
                type = 'rare';
            } else if (r < 0.25) {
                // 10% Ếch gai độc gây hại
                type = 'poison';
            }

            // Đáy ao sen y từ 360 đến 510
            const rx = Math.random() * 700 + 50;
            const ry = Math.random() * 130 + 380;
            
            this.objects.push(new Frog(rx, ry, type));
        }

        // Thi thoảng xuất hiện 1 chú Boss Khổng lồ ở Cấp độ cao hoặc ngẫu nhiên chu kỳ 15%
        const hasBoss = this.objects.some(obj => obj instanceof Frog && obj.type === 'boss');
        if (!hasBoss && (this.level >= 2 || Math.random() < 0.15)) {
            const bx = Math.random() * 500 + 100;
            const by = 420; // Boss ở tầng đáy
            this.objects.push(new Frog(bx, by, 'boss'));
        }
    }

    loop(time) {
        if (this.gameState !== 'playing') return;

        // Tính Delta Time để tối ưu tần số quét 120 FPS
        let dt = (time - this.lastTime) / 1000;
        this.lastTime = time;

        // Bảo vệ FPS tránh trường hợp tab chạy ngầm bị lag đột ngột
        if (dt > 0.1) dt = 0.1;

        // Tính toán khung hình FPS thực tế
        this.fpsTimer += dt;
        this.fpsCounter++;
        if (this.fpsTimer >= 1.0) {
            this.fps = this.fpsCounter;
            this.fpsCounter = 0;
            this.fpsTimer = 0;
            document.getElementById('perf-fps').innerText = this.fps;
        }

        // Cập nhật logic các thành phần
        this.update(dt);

        // Vẽ các thành phần lên canvas
        this.draw();

        // Lặp lại vòng lặp game loop tiếp theo
        requestAnimationFrame((time) => this.loop(time));
    }

    // ==========================================================================
    // 4. LOGIC ENGINE UPDATE
    // ==========================================================================
    update(dt) {
        // 1. Quản lý chu kỳ môi trường (Ngày/Đêm & Thời tiết)
        this.updateEnvironment(dt);

        // 2. Cập nhật Lưỡi Câu
        // Line limit based on Line Upgrade level: Lvl 1: 100, Lvl 5: 200
        const lineLimit = 100 + (this.upgrades.line - 1) * 25;
        const netBonusRadius = (this.upgrades.net - 1) * 3.5; // Tăng bán kính vợt
        
        // Gọi cập nhật vật lý di chuyển lưỡi câu
        this.hook.update(dt, this.wind, this.rodTip, this.waterY, lineLimit, netBonusRadius);

        // Kiểm tra lưỡi câu bắt ếch thành công
        if (this.hook.successfulCatch) {
            this.hook.successfulCatch = false;
            this.handleSuccessfulCatch(this.hook.savedCaughtObject);
            this.hook.savedCaughtObject = null;
        }

        // 3. Sinh thêm thực thể tự động nếu thiếu
        if (this.objects.filter(obj => obj instanceof Frog).length < 5) {
            this.spawnFrogs();
        }

        // 4. Thỉnh thoảng spawn Vật cản bay qua (Chim, Cá nhảy)
        this.updateObstacleSpawns(dt);

        // 5. Cập nhật tất cả các thực thể (Ếch, Vật cản)
        this.objects.forEach(obj => {
            if (obj instanceof Frog) {
                obj.update(dt, this.waterY);
                if (obj.spawnFrogLandRipple) {
                    obj.spawnFrogLandRipple = false;
                    this.ripples.push({
                        x: obj.x + obj.width/2,
                        y: obj.y + obj.height - 4,
                        r: 4,
                        maxR: 25,
                        life: 0.8,
                        speed: 25
                    });
                }
            } else {
                obj.update(dt, this.waterY);
            }
        });

        // Loại bỏ thực thể chết / không hoạt động
        this.objects = this.objects.filter(obj => obj.active);

        // 6. Cập nhật hiệu ứng hạt ma thuật và gợn sóng nước lan tỏa
        this.particles.forEach(p => {
            p.x += p.vx * dt;
            p.y += p.vy * dt;
            p.life -= dt;
        });
        this.particles = this.particles.filter(p => p.life > 0);

        this.ripples.forEach(r => {
            r.r += r.speed * dt;
            r.life -= dt * 1.2;
        });
        this.ripples = this.ripples.filter(r => r.life > 0);

        // Tạo gợn sóng lăn tăn tự nhiên ngẫu nhiên
        if (Math.random() < 0.15 * dt * 60) {
            this.ripples.push({
                x: Math.random() * 800 + 50,
                y: Math.random() * 150 + 350,
                r: 2,
                maxR: Math.random() * 25 + 10,
                life: 0.65,
                speed: 12 + Math.random() * 8
            });
        }

        // Tạo gợn sóng khi lưỡi câu chạm nước
        if (this.hook.createSplashEffect) {
            this.hook.createSplashEffect = false;
            this.ripples.push({
                x: this.hook.x,
                y: this.waterY,
                r: 4,
                maxR: 60,
                life: 1.0,
                speed: 45
            });
            this.createBubbles(this.hook.x, this.waterY, '#00f0ff', 12);
        }

        // 7. Xử lý va chạm va quẹt lưỡi câu (Khi đang chìm dưới nước 'sinking' hoặc bay trên trời 'flying')
        this.handleCollisions();

        // 8. Nếu đang diễn ra đấu tranh Boss kéo-giật
        if (this.activeBossBattle) {
            this.updateBossBattle(dt);
        }

        // 9. Giảm thời gian chơi game
        this.timeRemaining -= dt;
        if (this.timeRemaining <= 0) {
            this.timeRemaining = 0;
            this.endGame();
        }

        // Cập nhật hiển thị HUD
        document.getElementById('hud-timer').innerText = `${Math.ceil(this.timeRemaining)}s`;
        document.getElementById('perf-entities').innerText = this.objects.length + this.particles.length;
        
        const lineLimitText = document.getElementById('perf-line-lvl');
        if (lineLimitText) {
            document.getElementById('perf-rod-lvl').innerText = `Lvl ${this.upgrades.rod}`;
            document.getElementById('perf-line-lvl').innerText = `Lvl ${this.upgrades.line}`;
        }
    }

    updateEnvironment(dt) {
        // Chu kỳ Ngày/Đêm đổi sau mỗi 30 giây
        this.dayNightTimer -= dt;
        if (this.dayNightTimer <= 0) {
            this.dayNightTimer = 30;
            
            const timeIcon = document.getElementById('env-time-icon');
            const timeText = document.getElementById('env-time-text');
            
            if (this.timeOfDay === 'morning') {
                this.timeOfDay = 'evening';
                timeIcon.innerText = '🌅';
                timeText.innerText = 'Hoàng Hôn';
            } else if (this.timeOfDay === 'evening') {
                this.timeOfDay = 'night';
                timeIcon.innerText = '🌙';
                timeText.innerText = 'Đêm Huyền Bí';
                // Đêm xuống tạo đom đóm rực rỡ lơ lửng
                for (let i = 0; i < 15; i++) {
                    this.particles.push({
                        x: Math.random() * 960,
                        y: Math.random() * 300 + 50,
                        vx: (Math.random() - 0.5) * 20,
                        vy: (Math.random() - 0.5) * 15,
                        life: Math.random() * 5 + 3,
                        maxLife: 5,
                        color: 'rgba(57, 255, 20, 0.65)',
                        size: Math.random() * 3 + 1
                    });
                }
            } else {
                this.timeOfDay = 'morning';
                timeIcon.innerText = '☀️';
                timeText.innerText = 'Bình Minh';
            }
            this.spawnFrogs(); // Thay đổi ếch phù hợp ngày đêm
        }

        // Chu kỳ Thời tiết thay đổi mỗi 45 giây
        this.weatherTimer -= dt;
        if (this.weatherTimer <= 0) {
            this.weatherTimer = 45;
            
            const weatherIcon = document.getElementById('env-weather-icon');
            const weatherText = document.getElementById('env-weather-text');
            
            if (this.weather === 'sunny') {
                this.weather = 'rainy';
                weatherIcon.innerText = '🌧️';
                weatherText.innerText = 'Trời Mưa';
            } else {
                this.weather = 'sunny';
                weatherIcon.innerText = '☀️';
                weatherText.innerText = 'Trời Nắng';
            }
        }

        // Cập nhật hạt nước mưa rơi
        if (this.weather === 'rainy') {
            this.rainDrops.forEach(drop => {
                drop.y += drop.speed * dt;
                drop.x -= 80 * dt; // Rơi chéo do gió nhẹ
                
                if (drop.y > 540) {
                    drop.y = -20;
                    drop.x = Math.random() * 1050;
                }
            });
        }
    }

    updateObstacleSpawns(dt) {
        // 1. Chim bay trên trời (2.5% cơ hội spawn mỗi giây)
        if (Math.random() < 0.02 * dt * 60) {
            const hasBird = this.objects.some(obj => obj instanceof Bird);
            if (!hasBird) {
                this.objects.push(new Bird());
            }
        }

        // 2. Cá nhảy dưới nước (3% cơ hội spawn mỗi giây)
        if (Math.random() < 0.03 * dt * 60) {
            const hasFish = this.objects.some(obj => obj instanceof Fish);
            if (!hasFish && this.objects.filter(obj => obj instanceof Frog).length > 2) {
                this.objects.push(new Fish());
            }
        }
    }

    handleCollisions() {
        if (this.hook.state !== 'sinking' && this.hook.state !== 'flying') return;

        const netBonusRadius = (this.upgrades.net - 1) * 3.5;
        const hookRadius = this.hook.targetRadius + netBonusRadius;

        for (let i = 0; i < this.objects.length; i++) {
            let obj = this.objects[i];
            if (!obj.active) continue;

            // 1. Kiểm tra va chạm với Chim (Đang bay parabol trên trời)
            if (obj instanceof Bird && this.hook.state === 'flying') {
                const dist = Math.sqrt(Math.pow((this.hook.x - (obj.x + 20)), 2) + Math.pow((this.hook.y - obj.y), 2));
                if (dist < hookRadius + 15) {
                    // Chim cướp mất mồi! Snaps hook
                    this.triggerSnapping("Bị Chim Quắp Mất Mồi!");
                    obj.active = false;
                    return;
                }
            }

            // 2. Kiểm tra va chạm với Cá nhảy (Đang bay/chìm gần mặt nước)
            if (obj instanceof Fish && (this.hook.state === 'flying' || this.hook.state === 'sinking')) {
                const dist = Math.sqrt(Math.pow((this.hook.x - obj.x), 2) + Math.pow((this.hook.y - obj.y), 2));
                if (dist < hookRadius + 12) {
                    // Cá đớp mất mồi câu!
                    this.triggerSnapping("Cá Nhảy Đớp Mất Mồi!");
                    obj.active = false;
                    return;
                }
            }

            // 3. Kiểm tra va chạm với ẾCH (Đang chìm dưới hồ)
            if (obj instanceof Frog && this.hook.state === 'sinking') {
                // Kiểm tra ếch lặn quá sâu thì không đớp câu
                if (obj.diveProgress < 0.4) continue;

                // Tính khoảng cách tâm hình học
                const frogCenterX = obj.x + obj.width/2;
                const frogCenterY = obj.y + obj.height/2;
                const dist = Math.sqrt(Math.pow((this.hook.x - frogCenterX), 2) + Math.pow((this.hook.y - frogCenterY), 2));

                if (dist < hookRadius + Math.max(obj.width, obj.height)/2.2) {
                    // PHẢN XẠ TRỐN THOÁT CỦA ẾCH NINJA/HIẾM:
                    if (obj.type === 'rare' && Math.random() < 0.45) {
                        // 45% ếch Ninja sẽ nhảy vọt trốn thoát khi lưỡi câu vừa chạm!
                        obj.facing = Math.random() > 0.5 ? 1 : -1;
                        obj.isHopping = true;
                        obj.hopProgress = 0.1; // Bật nhảy trốn thoát
                        
                        // Tạo bọt nước giật mình
                        this.createBubbles(obj.x + obj.width/2, obj.y + obj.height/2, '#ffffff', 8);
                        continue; // Bỏ qua va chạm lần này
                    }

                    // KIỂM TRA MỒI CÂU ĐẶC BIỆT KÍCH THÍCH DỤ ẾCH
                    if (this.weather === 'sunny' && obj.type !== 'boss' && Math.random() < 0.6) {
                        // Trời nắng gắt ếch trốn ẩn nấp dưới sen lớn, khó bắt bằng mồi thường
                        if (this.currentBait === 'worm' && Math.random() > 0.3) {
                            // 70% tuột lưỡi câu nếu dùng mồi giun thường
                            continue;
                        }
                    }

                    // BẮT BUỘC dùng mồi Đom Đóm khi câu Ếch Ma Thuật ban đêm
                    if (this.timeOfDay === 'night' && obj.type === 'magical' && this.currentBait !== 'firefly') {
                        // Ếch ma thuật từ chối đớp nếu mồi không phát sáng
                        continue;
                    }

                    // Tóm được Ếch!
                    // Trừ mồi đã sử dụng (chỉ trừ mồi hữu hạn)
                    if (this.currentBait !== 'worm') {
                        this.baits[this.currentBait]--;
                        document.getElementById(`count-${this.currentBait}`).innerText = this.baits[this.currentBait];
                        if (this.baits[this.currentBait] <= 0) {
                            this.selectBait('worm'); // Hết mồi tự chuyển về mồi giun đất
                        }
                    }

                    if (obj.type === 'boss') {
                        // Kích hoạt mini-game Tug-of-war kéo giằng co với Boss
                        this.startBossBattle(obj);
                    } else {
                        // Ếch thường/Hiếm dính câu
                        this.hook.state = 'caught';
                        this.hook.caughtObject = obj;
                        sounds.playCatch();
                    }
                    return;
                }
            }
        }
    }

    triggerSnapping(reason) {
        this.hook.state = 'snapped';
        this.hook.snappedTimer = 1.0;
        sounds.playSnap();
        
        // Trừ mồi câu của lượt câu vừa quăng
        if (this.currentBait !== 'worm') {
            this.baits[this.currentBait]--;
            document.getElementById(`count-${this.currentBait}`).innerText = this.baits[this.currentBait];
            if (this.baits[this.currentBait] <= 0) {
                this.selectBait('worm');
            }
        }

        // Tạo hiệu ứng hạt nổ vỡ tan mồi câu
        this.createBubbles(this.hook.x, this.hook.y, '#ff4c4c', 12);

        // Hiển thị một tin nhắn log nhanh
        if (this.gameMode === 'survival') {
            // Chế độ sinh tồn bị mất 1 mồi
            this.timeRemaining = Math.max(0, this.timeRemaining - 5); // Phạt trừ 5 giây
        }
    }

    handleSuccessfulCatch(frog) {
        // TÍNH ĐIỂM VÀ THƯỞNG PHẠT DỰA TRÊN LOẠI ẾCH
        let pointGained = frog.value;
        let goldGained = frog.gold;

        // Trời mưa khiến bùn lầy trơn trượt có 20% tuột mất ếch lúc thu sát bờ
        if (this.weather === 'rainy' && Math.random() < 0.22) {
            pointGained = 0;
            goldGained = 0;
            this.createBubbles(this.rodTip.x, this.rodTip.y, '#ffffff', 10);
            sounds.playHurt();
            // Hiện log hụt ếch
            this.spawnFloatingText("TRƠN TRƯỢT SẨY MẤT!", this.rodTip.x - 50, this.rodTip.y - 20, '#ffbb00');
            return;
        }

        this.score = Math.max(0, this.score + pointGained);
        this.gold = Math.max(0, this.gold + goldGained);

        if (pointGained > 0) {
            this.spawnFloatingText(`+${pointGained} Điểm (+${goldGained} Vàng)`, this.rodTip.x - 80, this.rodTip.y - 30, '#39ff14');
            sounds.playCatch();
            
            // Chế độ sinh tồn Survival: câu trúng được hồi cộng 8 giây thời gian
            if (this.gameMode === 'survival') {
                this.timeRemaining = Math.min(120, this.timeRemaining + 8);
            }
        } else {
            // Ếch độc trừ điểm, trừ máu độ bền cần câu
            this.spawnFloatingText(`${pointGained} Điểm Độc hại!`, this.rodTip.x - 80, this.rodTip.y - 30, '#ff3333');
            sounds.playHurt();
            
            // Lực căng dâng cao gây hại cần câu
            this.hook.tension = Math.min(100, this.hook.tension + 35);
        }

        this.updateHUDValues();
        this.spawnFrogs();

        // Nâng cấp Level nếu đạt cột mốc điểm số tích luỹ
        const targetScore = this.level * 100;
        if (this.score >= targetScore) {
            this.level++;
            sounds.playUpgrade();
            this.spawnFloatingText(`LEVEL UP: CẤP ${this.level}!`, 480, 200, '#ffd700', 32);
            this.wind.change(); // Gió giật đổi cấp độ mới
            this.spawnFrogs();
        }
    }

    updateHUDValues() {
        document.getElementById('hud-score').innerText = String(this.score).padStart(3, '0');
        document.getElementById('hud-gold').innerHTML = `<i class="fas fa-coins text-gold"></i> ${this.gold}`;
        document.getElementById('shop-gold-val').innerHTML = `<i class="fas fa-coins text-gold"></i> ${this.gold}`;
    }

    // ==========================================================================
    // 5. MINI-GAME TUG-OF-WAR (GIẰNG CO BOSS KHỔNG LỒ)
    // ==========================================================================
    startBossBattle(boss) {
        this.activeBossBattle = true;
        this.bossObject = boss;
        this.bossTension = 50;
        this.bossHP = 100;

        // Vùng an toàn ngẫu nhiên ở giữa 40-70%
        this.bossSafeZone = { min: 38, max: 68 };
        this.bossSafeZoneDir = Math.random() > 0.5 ? 1 : -1;

        // Hiển thị Overlay Minigame kéo cá
        document.getElementById('boss-battle-overlay').classList.remove('hidden');
        document.getElementById('tension-meter-container').classList.add('hidden'); // Ẩn thanh cơ bản

        // Lắng nghe phím Space hoặc click liên tục để giằng co
        this.bossSpaceHandler = (e) => {
            if (e.key === ' ' || e.code === 'Space') {
                e.preventDefault();
                this.bossTension = Math.min(100, this.bossTension + 6.5); // Tăng lực căng dây khi giật cần
                sounds.playSplash();
            }
        };
        window.addEventListener('keydown', this.bossSpaceHandler);

        // Click chuột trái vào canvas cũng làm tăng lực căng kéo Boss
        this.bossClickHandler = (e) => {
            this.bossTension = Math.min(100, this.bossTension + 5.5);
            sounds.playSplash();
        };
        this.canvas.addEventListener('click', this.bossClickHandler);
    }

    updateBossBattle(dt) {
        // 1. Boss khổng lồ vùng vẫy liên tục kéo lùi lực căng xuống dưới (hoặc giật kéo)
        // Lực kéo giật ngẫu nhiên của Boss
        const bossPull = (35 + Math.sin(performance.now() / 200) * 15);
        this.bossTension = Math.max(0, this.bossTension - bossPull * dt);

        // 2. Dịch chuyển vùng an toàn Safe-Zone liên tục để tăng độ thử thách
        const zoneSpeed = 15; // Vận tốc trượt
        this.bossSafeZone.min += this.bossSafeZoneDir * zoneSpeed * dt;
        this.bossSafeZone.max += this.bossSafeZoneDir * zoneSpeed * dt;

        if (this.bossSafeZone.min <= 10) {
            this.bossSafeZone.min = 10;
            this.bossSafeZone.max = 40;
            this.bossSafeZoneDir = 1;
        } else if (this.bossSafeZone.max >= 90) {
            this.bossSafeZone.max = 90;
            this.bossSafeZone.min = 60;
            this.bossSafeZoneDir = -1;
        }

        // Cập nhật giao diện Safe Zone
        const safeZoneEl = document.getElementById('boss-safe-zone');
        safeZoneEl.style.left = `${this.bossSafeZone.min}%`;
        safeZoneEl.style.width = `${this.bossSafeZone.max - this.bossSafeZone.min}%`;

        // Cập nhật vị trí kim lực căng
        const markerEl = document.getElementById('boss-tension-marker');
        markerEl.style.left = `${this.bossTension}%`;

        // 3. Kiểm tra xem lực căng dây có nằm trong Safe Zone không
        const isSafe = this.bossTension >= this.bossSafeZone.min && this.bossTension <= this.bossSafeZone.max;
        
        if (isSafe) {
            // Giảm sinh lực của Boss
            this.bossHP = Math.max(0, this.bossHP - dt * 25); // Mất 4 giây giằng co chuẩn xác để tóm Boss
            safeZoneEl.style.background = 'rgba(57, 255, 20, 0.45)';
        } else {
            // Boss tự hồi máu hoặc dây câu gặp nguy hiểm
            safeZoneEl.style.background = 'rgba(255, 51, 51, 0.2)';
            
            // Phạt nếu lực căng cạn sạch 0% hoặc ngút trời 100% -> Sẩy boss / Đứt dây ngay
            if (this.bossTension <= 2 || this.bossTension >= 98) {
                this.endBossBattle(false, this.bossTension >= 98 ? "ĐỨT DÂY VÌ CĂNG TỘT ĐỘ!" : "BOSS TỰ THOÁT VÌ LỎNG DÂY!");
                return;
            }
        }

        // Cập nhật thanh hiển thị thể lực và sức căng Boss
        document.getElementById('boss-hp').innerText = `${Math.ceil(this.bossHP)}%`;
        document.getElementById('boss-tension-val').innerText = `${Math.ceil(this.bossTension)}%`;

        // KHI TIÊU DIỆT BOSS THÀNH CÔNG
        if (this.bossHP <= 0) {
            this.endBossBattle(true);
        }
    }

    endBossBattle(success, reason = "") {
        this.activeBossBattle = false;
        
        // Gỡ bỏ trình lắng nghe sự kiện giằng co
        window.removeEventListener('keydown', this.bossSpaceHandler);
        this.canvas.removeEventListener('click', this.bossClickHandler);

        // Ẩn bảng Overlay
        document.getElementById('boss-battle-overlay').classList.add('hidden');

        if (success) {
            // Câu thành công Boss!
            this.hook.state = 'caught';
            this.hook.caughtObject = this.bossObject;
            sounds.playCatch();
            this.spawnFloatingText("KÉO BOSS THÀNH CÔNG!", 480, 200, '#ffd700', 28);
        } else {
            // Thất bại
            this.hook.state = 'snapped';
            this.hook.snappedTimer = 1.2;
            sounds.playSnap();

            if (this.bossObject) {
                this.bossObject.active = false;
            }
            this.bossObject = null;

            this.spawnFloatingText(reason, 480, 200, '#ff3333', 24);
        }
    }

    // ==========================================================================
    // 6. GIAO DIỆN KÉO THẢ QUĂNG CẦN CHUỘT
    // ==========================================================================
    handleMouseDown(e) {
        if (this.gameState !== 'playing' || this.hook.state !== 'idle' || this.activeBossBattle) return;

        const rect = this.canvas.getBoundingClientRect();
        const mouseX = e.clientX - rect.left;
        const mouseY = e.clientY - rect.top;

        // Chỉ được kéo quăng cần từ khu vực gần Cần câu (rodTip)
        const dist = Math.sqrt(Math.pow((mouseX - this.rodTip.x), 2) + Math.pow((mouseY - this.rodTip.y), 2));
        
        // Nhấp chuột bất kỳ đâu cũng kích hoạt bắt đầu căn quăng mồi từ ngọn cần
        this.isDragging = true;
        this.dragStart.x = mouseX;
        this.dragStart.y = mouseY;
        this.dragCurrent.x = mouseX;
        this.dragCurrent.y = mouseY;
    }

    handleMouseMove(e) {
        if (!this.isDragging) return;

        const rect = this.canvas.getBoundingClientRect();
        this.dragCurrent.x = e.clientX - rect.left;
        this.dragCurrent.y = e.clientY - rect.top;

        // Tính lực và góc kéo lùi (tương tự Angry Birds quăng đá)
        const dx = this.dragStart.x - this.dragCurrent.x;
        const dy = this.dragStart.y - this.dragCurrent.y;
        
        // Giới hạn lực ném cực đại dựa theo Rod Upgrade (Tăng cao lực ném và độ nhạy để câu được góc xa trái)
        const maxForce = 580 + (this.upgrades.rod - 1) * 80;
        this.dragForce = Math.min(maxForce, Math.sqrt(dx * dx + dy * dy) * 3.4);

        // Góc ném ngược hướng kéo chuột
        this.dragAngle = Math.atan2(dy, dx);
    }

    handleMouseUp(e) {
        if (!this.isDragging) return;
        this.isDragging = false;

        // Chỉ quăng cần nếu có lực ném tối thiểu để tránh nhấp nhầm
        if (this.dragForce > 45 && this.hook.state === 'idle') {
            this.hook.launch(this.dragAngle, this.dragForce);
            this.wind.change(); // Đổi hướng gió giật mỗi lượt quăng
        }
    }

    // ==========================================================================
    // 7. CANVAS GRAPHICS RENDER ENGINE (VẼ GIAO DIỆN ĐỒ HOẠ FANTASY LUNG LINH)
    // ==========================================================================
    draw() {
        const ctx = this.ctx;
        const w = this.canvas.width;
        const h = this.canvas.height;

        ctx.clearRect(0, 0, w, h);

        // 1. VẼ NỀN KHÔNG TRUNG & CẢNH VẬT THEO CHU KỲ NGÀY ĐÊM
        this.drawEnvironmentBackground(ctx, w, h);

        // 2. VẼ CÁC GỢN SÓNG NƯỚC ELIP LAN TỎA
        ctx.save();
        this.ripples.forEach(r => {
            ctx.strokeStyle = `rgba(0, 229, 255, ${r.life * 0.45})`;
            ctx.lineWidth = 1.5;
            ctx.beginPath();
            ctx.ellipse(r.x, r.y, r.r, r.r * 0.25, 0, 0, Math.PI * 2);
            ctx.stroke();
        });
        ctx.restore();

        // 3. VẼ HOA SEN, LÁ SEN NỔI TRÊN MẶT NƯỚC (Dụ ếch ẩn nấp)
        this.drawLilliesAndNature(ctx);

        // 4. VẼ DÂY VÀ LƯỠI CÂU THỰC TẾ
        this.hook.draw(ctx, this.rodTip);

        // 5. VẼ ĐƯỜNG CONG DỰ BÁO VẬT LÝ PARABOL KHI ĐANG KÉO CHUỘT
        if (this.isDragging && this.hook.state === 'idle') {
            this.drawTrajectoryPreview(ctx);
        }

        // 6. VẼ CÁC THỰC THỂ GAME (Ếch, Vật cản Chim/Cá)
        this.objects.forEach(obj => {
            obj.draw(ctx);
        });

        // 7. VẼ HIỆU ỨNG HẠT MA THUẬT VÀ BỌT NƯỚC BẬT TUNG
        this.drawParticles(ctx);

        // 8. VẼ NGƯỜI CẦM CẦN CÂU MA THUẬT VÀ BỜ CỎ FANTASY
        this.drawFisherman(ctx);

        // 9. VẼ CẦN CÂU CỦA NGƯỜI CHƠI (Tọa lạc góc phải màn hình)
        this.drawFishingRodGraphic(ctx);

        // 10. PHỦ BỘ LỌC ÁNH SÁNG THỜI TIẾT & CHU KỲ (Ambient Lighting overlay)
        this.drawLightingEffectsOverlay(ctx, w, h);
    }

    drawEnvironmentBackground(ctx, w, h) {
        ctx.save();
        const now = performance.now();
        
        // A. Nền bầu trời theo Ngày/Đêm
        let skyGradient = ctx.createLinearGradient(0, 0, 0, this.waterY);
        if (this.timeOfDay === 'morning') {
            skyGradient.addColorStop(0, '#0f172a'); // Đậm sâu
            skyGradient.addColorStop(0.6, '#1e293b');
            skyGradient.addColorStop(1, '#ffedd5'); // Chân trời cam ấm áp bình minh
        } else if (this.timeOfDay === 'evening') {
            skyGradient.addColorStop(0, '#3b0764'); // Tím sậm hoàng hôn
            skyGradient.addColorStop(0.6, '#701a75');
            skyGradient.addColorStop(1, '#fbcfe8'); // Hồng dịu
        } else { // Ban đêm
            skyGradient.addColorStop(0, '#020205');
            skyGradient.addColorStop(0.7, '#090514');
            skyGradient.addColorStop(1, '#1e1b4b'); // Tím xanh chàm
        }
        ctx.fillStyle = skyGradient;
        ctx.fillRect(0, 0, w, this.waterY);
        this.drawSkyDetails(ctx, w, now);
        this.drawDistantBanks(ctx, w, now);

        // Vẽ Mặt Trăng hoặc Mặt Trời huyền bí
        if (this.timeOfDay === 'night') {
            // Mặt trăng tròn tỏa hào quang huyền dịu
            ctx.shadowBlur = 30;
            ctx.shadowColor = '#00f0ff';
            ctx.fillStyle = 'rgba(255, 255, 255, 0.85)';
            ctx.beginPath();
            ctx.arc(150, 70, 24, 0, Math.PI * 2);
            ctx.fill();
            ctx.shadowBlur = 0; // Tắt shadow
        } else {
            // Mặt trời rực rỡ buổi chiều/sáng
            ctx.shadowBlur = 20;
            ctx.shadowColor = '#ffd700';
            ctx.fillStyle = this.timeOfDay === 'morning' ? '#ffcc00' : '#ff7700';
            ctx.beginPath();
            ctx.arc(150, 70, 20, 0, Math.PI * 2);
            ctx.fill();
            ctx.shadowBlur = 0;
        }

        // B. NỀN NƯỚC HỒ SEN FANTASY
        let waterGradient = ctx.createLinearGradient(0, this.waterY, 0, h);
        if (this.timeOfDay === 'night') {
            waterGradient.addColorStop(0, 'rgba(6, 12, 40, 0.95)'); // Thủy cung tối sâu thẳm
            waterGradient.addColorStop(1, 'rgba(2, 4, 15, 0.98)');
        } else if (this.timeOfDay === 'evening') {
            waterGradient.addColorStop(0, 'rgba(24, 8, 48, 0.95)');
            waterGradient.addColorStop(1, 'rgba(10, 2, 20, 0.98)');
        } else {
            waterGradient.addColorStop(0, 'rgba(11, 37, 43, 0.95)'); // Xanh ngọc sậm lục bảo
            waterGradient.addColorStop(1, 'rgba(4, 18, 22, 0.98)');
        }
        ctx.fillStyle = waterGradient;
        ctx.fillRect(0, this.waterY, w, h - this.waterY);
        this.drawUnderwaterDetails(ctx, w, h, now);

        // C. Vẽ các gợn sóng nước phát sáng động
        ctx.strokeStyle = this.timeOfDay === 'night' ? 'rgba(0, 240, 255, 0.08)' : 'rgba(255, 255, 255, 0.06)';
        ctx.lineWidth = 1.0;
        for (let i = 0; i < 6; i++) {
            const waveY = this.waterY + 30 + i * 35;
            const waveOffset = Math.sin(now / 1000 + i) * 20;
            ctx.beginPath();
            ctx.moveTo(0, waveY);
            ctx.bezierCurveTo(180 + waveOffset, waveY - 5, 520 - waveOffset, waveY + 6, 960, waveY);
            ctx.stroke();
        }

        ctx.strokeStyle = this.timeOfDay === 'night' ? 'rgba(90, 244, 255, 0.36)' : 'rgba(255, 255, 255, 0.26)';
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.moveTo(0, this.waterY + 2);
        for (let x = 0; x <= w; x += 48) {
            const y = this.waterY + Math.sin(now / 420 + x * 0.035) * 2.4;
            ctx.lineTo(x, y);
        }
        ctx.stroke();

        ctx.restore();
    }

    drawSkyDetails(ctx, w, now) {
        ctx.save();

        if (this.timeOfDay === 'night') {
            this.scenery.farStars.forEach(star => {
                const alpha = 0.35 + Math.sin(now / 700 + star.twinkle) * 0.28;
                ctx.fillStyle = `rgba(220, 250, 255, ${Math.max(0.12, alpha)})`;
                ctx.beginPath();
                ctx.arc(star.x, star.y, star.r, 0, Math.PI * 2);
                ctx.fill();
            });
        } else {
            this.scenery.clouds.forEach(cloud => {
                const driftX = (cloud.x + now * cloud.speed) % (w + 180) - 90;
                const shade = this.timeOfDay === 'evening' ? 'rgba(255, 202, 213, 0.23)' : 'rgba(255, 255, 255, 0.18)';
                ctx.fillStyle = shade;
                ctx.beginPath();
                ctx.ellipse(driftX, cloud.y, 46 * cloud.scale, 14 * cloud.scale, 0, 0, Math.PI * 2);
                ctx.ellipse(driftX + 34 * cloud.scale, cloud.y + 4, 34 * cloud.scale, 11 * cloud.scale, 0, 0, Math.PI * 2);
                ctx.ellipse(driftX - 34 * cloud.scale, cloud.y + 3, 28 * cloud.scale, 10 * cloud.scale, 0, 0, Math.PI * 2);
                ctx.fill();
            });
        }

        ctx.restore();
    }

    drawDistantBanks(ctx, w, now) {
        ctx.save();
        const bankTop = this.waterY - 92;

        ctx.fillStyle = this.timeOfDay === 'night' ? 'rgba(6, 20, 33, 0.9)' : 'rgba(19, 56, 47, 0.82)';
        ctx.beginPath();
        ctx.moveTo(0, this.waterY);
        ctx.lineTo(0, bankTop + 30);
        ctx.bezierCurveTo(150, bankTop - 18, 310, bankTop + 38, 470, bankTop - 6);
        ctx.bezierCurveTo(640, bankTop - 50, 780, bankTop + 30, w, bankTop - 18);
        ctx.lineTo(w, this.waterY);
        ctx.closePath();
        ctx.fill();

        ctx.fillStyle = this.timeOfDay === 'night' ? 'rgba(9, 44, 39, 0.95)' : 'rgba(27, 85, 51, 0.92)';
        ctx.beginPath();
        ctx.moveTo(0, this.waterY);
        ctx.bezierCurveTo(120, this.waterY - 42, 270, this.waterY - 18, 390, this.waterY - 54);
        ctx.bezierCurveTo(550, this.waterY - 102, 700, this.waterY - 14, w, this.waterY - 58);
        ctx.lineTo(w, this.waterY + 12);
        ctx.lineTo(0, this.waterY + 12);
        ctx.closePath();
        ctx.fill();

        ctx.strokeStyle = 'rgba(143, 255, 190, 0.18)';
        ctx.lineWidth = 1.1;
        this.scenery.reeds.forEach(reed => {
            const sway = Math.sin(now / 900 + reed.phase) * 4;
            ctx.beginPath();
            ctx.moveTo(reed.x, this.waterY + 4);
            ctx.quadraticCurveTo(reed.x + reed.lean * 0.25 + sway, this.waterY - reed.h * 0.55, reed.x + reed.lean + sway, this.waterY - reed.h);
            ctx.stroke();
        });

        ctx.restore();
    }

    drawUnderwaterDetails(ctx, w, h, now) {
        ctx.save();

        const depthGlow = ctx.createRadialGradient(w * 0.5, this.waterY + 35, 30, w * 0.5, h, w * 0.72);
        depthGlow.addColorStop(0, this.timeOfDay === 'night' ? 'rgba(34, 234, 255, 0.12)' : 'rgba(100, 255, 205, 0.14)');
        depthGlow.addColorStop(1, 'rgba(0, 0, 0, 0)');
        ctx.fillStyle = depthGlow;
        ctx.fillRect(0, this.waterY, w, h - this.waterY);

        ctx.globalAlpha = this.timeOfDay === 'night' ? 0.13 : 0.2;
        ctx.strokeStyle = '#9fffe3';
        ctx.lineWidth = 1;
        for (let i = 0; i < 7; i++) {
            const x = 80 + i * 135 + Math.sin(now / 1300 + i) * 22;
            ctx.beginPath();
            ctx.moveTo(x, this.waterY + 4);
            ctx.lineTo(x - 62, h);
            ctx.stroke();
        }

        ctx.globalAlpha = 0.45;
        this.scenery.pebbles.forEach(pebble => {
            const tone = Math.floor(52 + pebble.tone * 38);
            ctx.fillStyle = `rgb(${tone}, ${tone + 12}, ${tone + 18})`;
            ctx.beginPath();
            ctx.ellipse(pebble.x, pebble.y, pebble.r * 1.8, pebble.r, 0, 0, Math.PI * 2);
            ctx.fill();
        });

        ctx.restore();
    }

    drawLilliesAndNature(ctx) {
        ctx.save();
        // Vẽ 5 lá sen to nhỏ bồng bềnh xếp lớp tạo chiều sâu trường cảnh
        const lilyPads = [
            { x: 140, y: 320, r: 35 },
            { x: 300, y: 323, r: 40 },
            { x: 450, y: 321, r: 52 },
            { x: 620, y: 324, r: 38 },
            { x: 760, y: 319, r: 44 }
        ];

        lilyPads.forEach((pad, index) => {
            const pulse = Math.sin(performance.now() / 1200 + pad.x) * 1.5;
            
            // Vẽ lá sen tròn bị khuyết hình quạt
            ctx.fillStyle = '#113c19'; // Lục sậm cỏ sen
            ctx.beginPath();
            ctx.arc(pad.x, pad.y + pulse, pad.r, 0.15 * Math.PI, 1.85 * Math.PI);
            ctx.lineTo(pad.x, pad.y + pulse);
            ctx.closePath();
            ctx.fill();

            // Vẽ gân sen sắc sảo hơn
            ctx.strokeStyle = '#1e5f2e';
            ctx.lineWidth = 1.2;
            ctx.beginPath();
            ctx.moveTo(pad.x, pad.y + pulse);
            ctx.lineTo(pad.x + pad.r * 0.75 * Math.cos(0.2), pad.y + pulse + pad.r * 0.75 * Math.sin(0.2));
            ctx.moveTo(pad.x, pad.y + pulse);
            ctx.lineTo(pad.x + pad.r * 0.6 * Math.cos(2.8), pad.y + pulse + pad.r * 0.6 * Math.sin(2.8));
            ctx.moveTo(pad.x, pad.y + pulse);
            ctx.lineTo(pad.x + pad.r * 0.7 * Math.cos(4.8), pad.y + pulse + pad.r * 0.7 * Math.sin(4.8));
            ctx.stroke();

            // Thêm hoa sen hồng nở rực rỡ lấp lánh (vẽ xen kẽ ở các lá sen lẻ)
            if (index % 2 === 0) {
                this.drawLotusFlower(ctx, pad.x - 8, pad.y - 4, pad.r * 0.42);
            }
        });

        ctx.restore();
    }

    drawLotusFlower(ctx, x, y, size) {
        ctx.save();
        const pulse = Math.sin(performance.now() / 1000 + x) * 1.5;
        ctx.translate(x, y + pulse);
        
        // Cuống hoa sen lục bảo đứng dưới nước
        ctx.strokeStyle = '#1e5f13';
        ctx.lineWidth = 2.0;
        ctx.beginPath();
        ctx.moveTo(0, 0);
        ctx.lineTo(-2, 35);
        ctx.stroke();

        // Vẽ đài xanh bao bọc
        ctx.fillStyle = '#1b4d22';
        ctx.beginPath();
        ctx.ellipse(0, 4, size * 0.5, size * 0.18, 0, 0, Math.PI * 2);
        ctx.fill();

        // Vẽ 8 cánh hoa sen hồng phấn thạch anh xếp chéo
        // Lớp ngoài nhạt
        ctx.fillStyle = '#ff85a2';
        for (let i = 0; i < 6; i++) {
            const angle = (i / 6) * Math.PI - Math.PI / 2;
            ctx.save();
            ctx.rotate(angle);
            ctx.beginPath();
            ctx.ellipse(0, -size * 0.65, size * 0.28, size * 0.48, 0, 0, Math.PI * 2);
            ctx.fill();
            ctx.restore();
        }

        // Lớp cánh hoa chính ở trong đậm đà hơn
        ctx.fillStyle = '#ff5c8a';
        for (let i = 0; i < 4; i++) {
            const angle = (i / 4) * Math.PI / 2 - Math.PI / 4;
            ctx.save();
            ctx.rotate(angle);
            ctx.beginPath();
            ctx.ellipse(0, -size * 0.52, size * 0.32, size * 0.52, 0, 0, Math.PI * 2);
            ctx.fill();
            ctx.restore();
        }

        // Nhị sen màu vàng hoàng kim lấp lánh ở trung tâm
        ctx.fillStyle = '#ffd700';
        if (this.timeOfDay === 'night') {
            ctx.shadowBlur = 12;
            ctx.shadowColor = '#ffd700';
        }
        ctx.beginPath();
        ctx.arc(0, -size * 0.1, size * 0.2, 0, Math.PI * 2);
        ctx.fill();
        ctx.shadowBlur = 0;

        // Các hạt hạt nhị sen nhỏ li ti xung quanh đài vàng
        ctx.fillStyle = '#ffb300';
        for (let i = 0; i < 8; i++) {
            const rAngle = (i / 8) * Math.PI * 2;
            const rx = Math.cos(rAngle) * (size * 0.25);
            const ry = Math.sin(rAngle) * (size * 0.25) - size * 0.1;
            ctx.beginPath();
            ctx.arc(rx, ry, 1.2, 0, Math.PI * 2);
            ctx.fill();
        }

        ctx.restore();
    }

    drawTrajectoryPreview(ctx) {
        // DỰ BÁO QUỸ ĐẠO BẰNG ĐƯỜNG NÉT ĐỨT VẬT LÝ PARABOL THỰC TẾ
        ctx.save();
        ctx.strokeStyle = 'rgba(0, 229, 255, 0.6)';
        ctx.fillStyle = 'rgba(0, 229, 255, 0.8)';
        ctx.lineWidth = 2.0;
        ctx.setLineDash([4, 4]);

        const gravity = 550; // Trọng lực tương đồng trong Hook
        const windForce = this.wind.direction * this.wind.strength * 45;
        
        const vx0 = Math.cos(this.dragAngle) * this.dragForce;
        const vy0 = Math.sin(this.dragAngle) * this.dragForce;

        ctx.beginPath();
        ctx.moveTo(this.rodTip.x, this.rodTip.y);

        // Vẽ 30 điểm dự báo dọc đường bay của Parabol vật lý
        for (let i = 1; i <= 30; i++) {
            const t = i * 0.045; // Khoảng thời gian ước lượng
            const px = this.rodTip.x + vx0 * t + 0.5 * windForce * t * t;
            const py = this.rodTip.y + vy0 * t + 0.5 * gravity * t * t;

            ctx.lineTo(px, py);
            
            // Nếu đụng mặt nước hoặc quá tầm biên thì dừng vẽ
            if (py >= this.waterY) {
                // Vẽ một điểm hồng tâm nhỏ lấp lánh tại nơi tiếp nước
                ctx.stroke();
                ctx.shadowBlur = 10;
                ctx.shadowColor = '#00f0ff';
                ctx.fillStyle = '#00f0ff';
                ctx.beginPath();
                ctx.arc(px, py, 5, 0, Math.PI * 2);
                ctx.fill();
                break;
            }
        }
        ctx.stroke();
        ctx.restore();
    }

    drawFisherman(ctx) {
        ctx.save();
        
        // 1. Vẽ bờ đất cỏ mọc màu xanh lục sậm óng ánh thạch anh ở góc phải bờ ao
        ctx.fillStyle = '#0a1d0d'; // Bờ cỏ tối màu
        ctx.strokeStyle = '#122c15';
        ctx.lineWidth = 3.5;
        ctx.beginPath();
        ctx.moveTo(820, 320); // Điểm sườn dốc giáp nước
        ctx.quadraticCurveTo(870, 195, 960, 180);
        ctx.lineTo(960, 540);
        ctx.lineTo(820, 540);
        ctx.closePath();
        ctx.fill();
        ctx.stroke();

        // Vẽ các bụi cỏ nhỏ nhô lên dọc theo mép sườn dốc
        ctx.fillStyle = '#1c4d25';
        for (let i = 0; i < 18; i++) {
            const cx = 825 + i * 7.5;
            const cy = 320 - (cx - 820) * 1.05; // Theo dọc dốc
            ctx.beginPath();
            ctx.moveTo(cx, cy);
            ctx.lineTo(cx - 3, cy - 7);
            ctx.lineTo(cx + 1, cy - 3);
            ctx.lineTo(cx + 3, cy - 8);
            ctx.closePath();
            ctx.fill();
        }

        // Vẽ tảng đá rêu phong người câu ngồi lên
        ctx.fillStyle = '#3f3f46';
        ctx.beginPath();
        ctx.ellipse(895, 232, 22, 10, 0, 0, Math.PI * 2);
        ctx.fill();
        ctx.fillStyle = '#142c16'; // Lớp rêu ẩm
        ctx.beginPath();
        ctx.ellipse(895, 226, 18, 5, 0, 0, Math.PI * 2);
        ctx.fill();

        // 2. Tính toán độ rung lắc (Shaking) và độ nghiêng (Leaning) khi quăng / giằng co
        let bodyX = 895;
        let bodyY = 202;
        let shakeX = 0;
        let shakeY = 0;
        let leanAngle = 0;

        if (this.isDragging) {
            // Ngả người ra sau khi kéo cần câu lấy đà ném
            leanAngle = (this.dragForce / 660) * 0.26;
        } else if (this.hook.state === 'caught' || this.activeBossBattle) {
            // Giằng co cá nặng / Boss: Rung giật bần bật cực ngầu
            shakeX = (Math.random() - 0.5) * 4.0;
            shakeY = (Math.random() - 0.5) * 2.0;
            leanAngle = 0.08 + Math.sin(performance.now() / 80) * 0.04;
        }

        ctx.translate(bodyX + shakeX, bodyY + shakeY);
        ctx.rotate(leanAngle);

        // A. Áo khoác dài ma thuật của Người câu (Màu xanh chàm huyền bí)
        ctx.fillStyle = '#4f46e5';
        ctx.beginPath();
        ctx.moveTo(-10, 14);
        ctx.lineTo(10, 14);
        ctx.lineTo(12, 33);
        ctx.lineTo(-12, 33);
        ctx.closePath();
        ctx.fill();

        // B. Đầu người câu màu hồng da nhạt
        ctx.fillStyle = '#fbcfe8';
        ctx.beginPath();
        ctx.arc(0, 0, 9, 0, Math.PI * 2);
        ctx.fill();

        // Tóc bồng bềnh tiên tộc
        ctx.fillStyle = '#ffd700'; // Tóc vàng óng phát sáng nhẹ
        ctx.beginPath();
        ctx.arc(0, -4, 10, Math.PI, 0);
        ctx.fill();

        // C. Chiếc nón rơm nón lá rộng vành che nắng gió
        ctx.fillStyle = '#d4b27a'; // Màu cói rơm
        ctx.strokeStyle = '#a1783f';
        ctx.lineWidth = 1.5;
        ctx.beginPath();
        ctx.moveTo(-22, -5);
        ctx.lineTo(0, -21); // Đỉnh chóp nón
        ctx.lineTo(22, -5);
        ctx.closePath();
        ctx.fill();
        ctx.stroke();

        // Quai nón màu đỏ thắt nút
        ctx.fillStyle = '#ef4444';
        ctx.fillRect(-6, -6, 12, 2.0);

        // Mắt cười tít mắt hiền từ
        ctx.strokeStyle = '#000000';
        ctx.lineWidth = 1.2;
        ctx.beginPath();
        ctx.arc(-3, 0, 1.8, Math.PI, 0, true);
        ctx.arc(3, 0, 1.8, Math.PI, 0, true);
        ctx.stroke();

        // D. Cánh tay cầm lấy cần câu
        ctx.strokeStyle = '#4f46e5';
        ctx.lineWidth = 4.5;
        ctx.lineCap = 'round';
        ctx.beginPath();
        ctx.moveTo(0, 13);
        ctx.lineTo(-18, 9);
        ctx.stroke();

        // Bàn tay
        ctx.strokeStyle = '#fbcfe8';
        ctx.lineWidth = 3.5;
        ctx.beginPath();
        ctx.moveTo(-18, 9);
        ctx.lineTo(-22, 7);
        ctx.stroke();

        ctx.restore();
    }

    drawFishingRodGraphic(ctx) {
        ctx.save();
        
        // 1. Tính toán tọa độ gốc đặt cần câu dựa theo vị trí tay của Fisherman
        let bodyX = 895;
        let bodyY = 202;
        let shakeX = 0;
        let shakeY = 0;
        let leanAngle = 0;

        if (this.isDragging) {
            leanAngle = (this.dragForce / 660) * 0.26;
        } else if (this.hook.state === 'caught' || this.activeBossBattle) {
            shakeX = (Math.random() - 0.5) * 4.0;
            shakeY = (Math.random() - 0.5) * 2.0;
            leanAngle = 0.08 + Math.sin(performance.now() / 80) * 0.04;
        }

        // Tọa độ bàn tay cầm cần câu thực tế:
        const relHandX = -22;
        const relHandY = 7;
        const cosL = Math.cos(leanAngle);
        const sinL = Math.sin(leanAngle);
        
        const handX = bodyX + shakeX + (relHandX * cosL - relHandY * sinL);
        const handY = bodyY + shakeY + (relHandX * sinL + relHandY * cosL);

        // 2. Vẽ Cần câu (Thanh carbon thon dài ngả nghiêng) xuất phát từ tay người câu kéo nghiêng lên trên trái
        ctx.strokeStyle = '#5c4033'; // Nâu gụ cổ điển
        ctx.lineWidth = 3.6;
        ctx.lineCap = 'round';
        
        const rodLength = 80 + (this.upgrades.rod - 1) * 8; // Dài hơn khi nâng cấp cần
        const rodAngle = -Math.PI * 0.72 + leanAngle * 0.65; // Góc ném nghiêng lên trên trái
        
        this.rodTip.x = handX + Math.cos(rodAngle) * rodLength;
        this.rodTip.y = handY + Math.sin(rodAngle) * rodLength;

        ctx.beginPath();
        ctx.moveTo(handX, handY);
        ctx.lineTo(this.rodTip.x, this.rodTip.y);
        ctx.stroke();

        // 3. Cuộn máy câu cuộn dây tròn nhỏ màu bạc
        ctx.fillStyle = '#8a8d91';
        ctx.beginPath();
        ctx.arc(handX + 2, handY + 2, 5.5, 0, Math.PI * 2);
        ctx.fill();

        ctx.restore();
    }

    drawParticles(ctx) {
        ctx.save();
        this.particles.forEach(p => {
            if (p.draw) {
                p.draw(ctx);
            } else {
                ctx.fillStyle = p.color || 'rgba(255,255,255,0.7)';
                
                // Hạt nhấp nháy alpha theo tuổi thọ
                ctx.globalAlpha = p.life / p.maxLife;
                ctx.beginPath();
                ctx.arc(p.x, p.y, p.size || 2, 0, Math.PI * 2);
                ctx.fill();
            }
        });
        ctx.restore();
    }

    drawLightingEffectsOverlay(ctx, w, h) {
        ctx.save();
        // Áp dụng bộ lọc phủ màu môi trường tạo không khí huyền ảo sâu sắc
        if (this.timeOfDay === 'night') {
            ctx.fillStyle = 'rgba(0, 10, 45, 0.28)'; // Tông xanh lam thẫm ban đêm
            ctx.fillRect(0, 0, w, h);
        } else if (this.timeOfDay === 'evening') {
            ctx.fillStyle = 'rgba(240, 80, 0, 0.08)'; // Nắng chiều tà nhuộm đỏ nhẹ
            ctx.fillRect(0, 0, w, h);
        }

        // VẼ MƯA RƠI THỰC TẾ TRÊN MÀN HÌNH NẾU CÓ THỜI TIẾT MƯA
        if (this.weather === 'rainy') {
            ctx.strokeStyle = 'rgba(156, 163, 175, 0.4)';
            ctx.lineWidth = 1.0;
            this.rainDrops.forEach(drop => {
                ctx.beginPath();
                ctx.moveTo(drop.x, drop.y);
                ctx.lineTo(drop.x - 3, drop.y + drop.len); // Rơi xiên chéo nhẹ
                ctx.stroke();
            });
        }
        ctx.restore();
    }

    createBubbles(x, y, color = '#ffffff', count = 8) {
        for (let i = 0; i < count; i++) {
            this.particles.push({
                x: x,
                y: y,
                vx: (Math.random() - 0.5) * 80,
                vy: (Math.random() - 0.5) * 60 - 20, // Ưu tiên bay vọt lên trên
                life: 0.6 + Math.random() * 0.4,
                maxLife: 1.0,
                color: color,
                size: Math.random() * 4 + 1.5
            });
        }
    }

    spawnFloatingText(text, x, y, color = '#ffffff', fontSize = 16) {
        // Tạo hiệu ứng chữ bay lên rực rỡ lấp lánh (dùng hạt particle chữ)
        this.particles.push({
            x: x,
            y: y,
            vx: 0,
            vy: -40, // Bay lên đều đặn
            life: 1.2,
            maxLife: 1.2,
            color: color,
            size: 1, // Dùng vẽ text
            draw: function(ctx) {
                ctx.save();
                ctx.fillStyle = this.color;
                ctx.font = `bold ${fontSize}px Outfit`;
                ctx.shadowBlur = 6;
                ctx.shadowColor = this.color;
                ctx.globalAlpha = this.life / this.maxLife;
                ctx.fillText(text, this.x, this.y);
                ctx.restore();
            }
        });
    }

    // ==========================================================================
    // 8. CỬA HÀNG NÂNG CẤP DỤNG CỤ
    // ==========================================================================
    buyBait(type, cost) {
        if (this.gold >= cost) {
            this.gold -= cost;
            const countBuy = type === 'fly' ? 5 : (type === 'spider' ? 3 : 2);
            this.baits[type] += countBuy;
            
            document.getElementById(`count-${type}`).innerText = this.baits[type];
            sounds.playUpgrade();
            this.updateHUDValues();
            this.spawnFloatingText(`ĐÃ MUA +${countBuy} MỒI ${type.toUpperCase()}`, 480, 100, '#ffd700');
        } else {
            sounds.playHurt();
            this.spawnFloatingText("KHÔNG ĐỦ CỔ VẬT VÀNG!", 480, 100, '#ff3333');
        }
    }

    upgradeEquipment(type) {
        if (this.upgrades[type] >= 5) {
            sounds.playHurt();
            return; // Đã đạt cấp tối đa
        }

        const cost = this.upgrades[type] * 80; // Cấp càng cao càng đắt: 80, 160, 240, 320 vàng
        if (this.gold >= cost) {
            this.gold -= cost;
            this.upgrades[type]++;
            
            sounds.playUpgrade();
            this.updateHUDValues();
            this.updateUpgradeShopUI();
            
            this.spawnFloatingText(`NÂNG CẤP THÀNH CÔNG ${type.toUpperCase()} LVL ${this.upgrades[type]}!`, 480, 100, '#ffd700');
        } else {
            sounds.playHurt();
            this.spawnFloatingText("KHÔNG ĐỦ CỔ VẬT VÀNG!", 480, 100, '#ff3333');
        }
    }

    updateUpgradeShopUI() {
        // Cập nhật mô tả trạng thái hiện tại các món đồ nâng cấp
        // 1. Cần câu
        const rodLvl = this.upgrades.rod;
        document.getElementById('shop-rod-stat').innerText = `${100 + (rodLvl-1)*20}% lực ném`;
        if (rodLvl < 5) {
            document.getElementById('rod-next-lvl').innerText = rodLvl + 1;
            document.getElementById('rod-cost').innerText = rodLvl * 80;
        } else {
            document.getElementById('btn-upgrade-rod').innerText = "ĐẠT CẤP TỐI ĐA";
            document.getElementById('btn-upgrade-rod').disabled = true;
        }

        // 2. Dây câu
        const lineLvl = this.upgrades.line;
        document.getElementById('shop-line-stat').innerText = `${100 + (lineLvl-1)*25}% sức tải`;
        if (lineLvl < 5) {
            document.getElementById('line-next-lvl').innerText = lineLvl + 1;
            document.getElementById('line-cost').innerText = lineLvl * 80;
        } else {
            document.getElementById('btn-upgrade-line').innerText = "ĐẠT CẤP TỐI ĐA";
            document.getElementById('btn-upgrade-line').disabled = true;
        }

        // 3. Vợt hỗ trợ
        const netLvl = this.upgrades.net;
        document.getElementById('shop-net-stat').innerText = `+${(netLvl-1)*4}px Bán kính`;
        if (netLvl < 5) {
            document.getElementById('net-next-lvl').innerText = netLvl + 1;
            document.getElementById('net-cost').innerText = netLvl * 80;
        } else {
            document.getElementById('btn-upgrade-net').innerText = "ĐẠT CẤP TỐI ĐA";
            document.getElementById('btn-upgrade-net').disabled = true;
        }
    }

    // ==========================================================================
    // 9. QUẢN LÝ KẾT THÚC VÀ ĐIỀU KHIỂN CHUNG
    // ==========================================================================
    pause() {
        this.gameState = 'paused';
        document.getElementById('pause-overlay').classList.add('active');
    }

    resume() {
        this.gameState = 'playing';
        document.getElementById('pause-overlay').classList.remove('active');
        this.lastTime = performance.now();
        requestAnimationFrame((time) => this.loop(time));
    }

    endGame() {
        this.gameState = 'gameover';
        sounds.playHurt();

        // Cập nhật thông số kết thúc màn chơi
        document.getElementById('over-mode').innerText = this.gameMode === 'time' ? "Chạy Đua Thời Gian" : "Thử Thách Sinh Tồn";
        document.getElementById('over-score').innerText = this.score;
        document.getElementById('over-gold').innerText = this.gold;

        // Hiện overlay kết thúc game
        document.getElementById('gameover-overlay').classList.add('active');
    }
}

// Khởi tạo đối tượng Game lõi toàn cục
const game = new Game();

// ==========================================================================
// 10. LIÊN KẾT SỰ KIỆN GIAO DIỆN NGƯỜI DÙNG (UI DOM ACTIONS)
// ==========================================================================

// Click chuyển đổi chế độ chơi ở Main Menu
document.querySelectorAll('.mode-btn').forEach(btn => {
    btn.addEventListener('click', () => {
        document.querySelectorAll('.mode-btn').forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
    });
});

// Click Nút bắt đầu chơi game ở Menu
document.getElementById('btn-start-game').addEventListener('click', () => {
    const activeModeBtn = document.querySelector('.mode-btn.active');
    const selectedMode = activeModeBtn.getAttribute('data-mode');
    sounds.init(); // Kích hoạt Web Audio
    game.start(selectedMode);
});

// Click Chọn mồi nhanh trên HUD
document.querySelectorAll('.bait-item').forEach(item => {
    item.addEventListener('click', () => {
        const baitType = item.getAttribute('data-bait');
        game.selectBait(baitType);
    });
});

// Mở Cửa Hàng Trang Bị
document.getElementById('btn-open-shop').addEventListener('click', () => {
    game.gameState = 'paused';
    document.getElementById('shop-overlay').classList.add('active');
});

// Đóng Cửa Hàng
document.getElementById('btn-close-shop').addEventListener('click', () => {
    document.getElementById('shop-overlay').classList.remove('active');
    game.resume();
});

// Click Tạm Dừng
document.getElementById('btn-pause-game').addEventListener('click', () => {
    game.pause();
});

// Tiếp Tục Game từ màn hình tạm dừng
document.getElementById('btn-resume-game').addEventListener('click', () => {
    game.resume();
});

// Thoát Ra Menu từ màn hình tạm dừng
document.getElementById('btn-exit-to-menu').addEventListener('click', () => {
    document.getElementById('pause-overlay').classList.remove('active');
    document.getElementById('gameplay-screen').classList.remove('active');
    document.getElementById('menu-screen').classList.add('active');
    game.gameState = 'menu';
});

// Chơi lại từ màn hình Game Over
document.getElementById('btn-restart-dead').addEventListener('click', () => {
    document.getElementById('gameover-overlay').classList.remove('active');
    game.start(game.gameMode);
});

// Trở về Menu từ màn hình Game Over
document.getElementById('btn-exit-dead').addEventListener('click', () => {
    document.getElementById('gameover-overlay').classList.remove('active');
    document.getElementById('gameplay-screen').classList.remove('active');
    document.getElementById('menu-screen').classList.add('active');
    game.gameState = 'menu';
});

// ==========================================================================
// CÁC SỰ KIỆN MUA SẮM VÀ NÂNG CẤP TRONG SHOP
// ==========================================================================

// Mua các loại mồi đặc sản
document.getElementById('btn-buy-fly').addEventListener('click', () => {
    game.buyBait('fly', 30);
});
document.getElementById('btn-buy-spider').addEventListener('click', () => {
    game.buyBait('spider', 40);
});
document.getElementById('btn-buy-firefly').addEventListener('click', () => {
    game.buyBait('firefly', 50);
});

// Nâng cấp cần - dây - vợt
document.getElementById('btn-upgrade-rod').addEventListener('click', () => {
    game.upgradeEquipment('rod');
});
document.getElementById('btn-upgrade-line').addEventListener('click', () => {
    game.upgradeEquipment('line');
});
document.getElementById('btn-upgrade-net').addEventListener('click', () => {
    game.upgradeEquipment('net');
});
