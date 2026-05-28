/**
 * ==========================================================================
 * BÀI TẬP LỚN: GAME CÂU ẾCH HUYỀN BÍ (FANTASY FROG FISHING)
 * FILE: frog_fishing.cpp
 * MÔ TẢ: Hiện thực hóa chi tiết logic các lớp hướng đối tượng (OOP)
 *       Tích hợp các công thức tính vật lý parabol và AI di chuyển của ếch.
 * ==========================================================================
 */

#include "frog_fishing.hpp"
#include <random>

// Hàm tạo số ngẫu nhiên tiện lợi trong C++
float getRandomFloat(float min, float max) {
    static std::random_device rd;
    static std::mt19937 gen(rd());
    std::uniform_real_distribution<float> dis(min, max);
    return dis(gen);
}

// ==========================================================================
// THỰC THỂ LỚP: WIND (Quản lý Sức Gió)
// ==========================================================================
void Wind::change() {
    // Gió đổi hướng ngẫu nhiên sang trái hoặc phải
    direction = (getRandomFloat(0.0f, 1.0f) > 0.5f) ? 1 : -1;
    // Cường độ gió ngẫu nhiên từ 0.0 đến 6.0 m/s
    strength = getRandomFloat(0.0f, 6.0f);
    
    std::cout << "[MÔI TRƯỜNG GL] Sức gió thay đổi thành: " 
              << strength << " m/s thổi về phía " 
              << (direction > 0 ? "BÊN PHẢI" : "BÊN TRÁI") << std::endl;
}

// ==========================================================================
// THỰC THỂ LỚP: FROG (Ếch - Kế thừa từ GameObject)
// ==========================================================================
Frog::Frog(float x, float y, FrogType t)
    : GameObject(x, y, 40.0f, 30.0f), type(t) 
{
    isDiving = false;
    diveProgress = 1.0f;
    diveTimer = getRandomFloat(3.0f, 7.0f);
    walkTimer = getRandomFloat(1.5f, 4.0f);
    facing = (getRandomFloat(0.0f, 1.0f) > 0.5f) ? 1 : -1;
    isHopping = false;
    hopProgress = 0.0f;

    // Cân chỉnh chỉ số sinh học của ếch theo từng loài
    switch (type) {
        case FrogType::NORMAL:
            width = 44.0f; height = 34.0f;
            speed = getRandomFloat(40.0f, 60.0f);
            pointValue = 10;
            goldValue = 15;
            break;
        case FrogType::RARE: // Ếch Ninja/Vàng chạy cực nhanh
            width = 38.0f; height = 30.0f;
            speed = getRandomFloat(120.0f, 180.0f);
            pointValue = 35;
            goldValue = 50;
            break;
        case FrogType::POISON: // Ếch độc hại (vật cản dưới ao)
            width = 42.0f; height = 36.0f;
            speed = getRandomFloat(25.0f, 40.0f);
            pointValue = -20; // Trừ điểm
            goldValue = -10;  // Trừ vàng
            break;
        case FrogType::MAGICAL: // Ếch phát sáng ban đêm
            width = 40.0f; height = 32.0f;
            speed = getRandomFloat(60.0f, 90.0f);
            pointValue = 50;
            goldValue = 80;
            break;
        case FrogType::BOSS: // Boss Siêu Khổng Lồ
            width = 96.0f; height = 80.0f;
            speed = 20.0f;
            pointValue = 150;
            goldValue = 250;
            break;
    }
}

void Frog::randomWalk(float dt) {
    walkTimer -= dt;
    if (walkTimer <= 0.0f) {
        walkTimer = getRandomFloat(1.5f, 4.0f);
        facing = (getRandomFloat(0.0f, 1.0f) > 0.5f) ? 1 : -1;
        // Bắt đầu nhảy lò cò ngẫu nhiên
        if (getRandomFloat(0.0f, 1.0f) > 0.3f) {
            isHopping = true;
            hopProgress = 0.0f;
        }
    }

    if (isHopping) {
        hopProgress += dt * 5.0f; // Vận tốc góc nảy của lò cò
        if (hopProgress >= 3.14159f) {
            hopProgress = 0.0f;
            isHopping = false;
        }
        
        // Di chuyển tịnh tiến theo trục X dựa trên hướng xoay facing
        position.x += facing * speed * dt * 1.2f;
        
        // Giới hạn biên hồ nhân tạo (trong khoảng x từ 50 đến 850)
        if (position.x < 50.0f) {
            position.x = 50.0f;
            facing = 1;
        } else if (position.x > 800.0f) {
            position.x = 800.0f;
            facing = -1;
        }
    }
}

void Frog::dive(float dt) {
    if (type == FrogType::BOSS) return; // Boss không bao giờ lặn tránh mất tương tác

    diveTimer -= dt;
    if (diveTimer <= 0.0f) {
        isDiving = !isDiving;
        diveTimer = isDiving ? getRandomFloat(2.5f, 4.5f) : getRandomFloat(5.0f, 9.0f);
    }

    // Biến thiên độ sâu mượt mà (diveProgress)
    if (isDiving) {
        diveProgress = std::max(0.0f, diveProgress - dt * 1.8f);
    } else {
        diveProgress = std::min(1.0f, diveProgress + dt * 1.8f);
    }
}

void Frog::escape() {
    // Khi bị lưỡi câu sượt sát bên, ếch Ninja giật mình nhảy trốn thoát rất nhanh
    if (type == FrogType::RARE) {
        facing = (getRandomFloat(0.0f, 1.0f) > 0.5f) ? 1 : -1;
        isHopping = true;
        hopProgress = 0.1f;
        speed *= 1.5f; // Tăng tốc trốn chạy
        std::cout << "[AI ẾCH] Ếch Ninja đột ngột tăng tốc trốn chạy!" << std::endl;
    }
}

void Frog::update(float dt) {
    if (!active) return;
    
    // Cập nhật trạng thái lặn nổi
    dive(dt);
    
    // Nếu lặn quá sâu (> 80%) thì không di chuyển hay nhận va chạm
    if (diveProgress < 0.2f) return;

    // Di chuyển ngẫu nhiên
    randomWalk(dt);
}

void Frog::draw(sf::RenderWindow& window) {
    if (!active) return;
    
    // Đối với bài C++ thuần, chúng ta in log giả lập vẽ hoặc sử dụng thư viện đồ họa SFML
    // Ví dụ giả lập SFML:
    // sf::Sprite sprite;
    // sprite.setPosition(position);
    // sprite.setColor(sf::Color(255, 255, 255, 255 * diveProgress));
    // window.draw(sprite);
}


// ==========================================================================
// THỰC THỂ LỚP: HOOK (Lưỡi Câu - Kế thừa từ GameObject)
// ==========================================================================
Hook::Hook(float x, float y) 
    : GameObject(x, y, 16.0f, 20.0f) 
{
    state = HookState::IDLE;
    startPosition = { x, y };
    angle = 0.0f;
    power = 0.0f;
    time = 0.0f;
    tension = 0.0f;
    caughtObject = nullptr;
}

void Hook::reset(float rodTipX, float rodTipY) {
    state = HookState::IDLE;
    position.x = rodTipX;
    position.y = rodTipY;
    velocity = { 0.0f, 0.0f };
    time = 0.0f;
    tension = 0.0f;
    caughtObject = nullptr;
}

void Hook::launch(float launchAngle, float launchPower) {
    state = HookState::FLYING;
    angle = launchAngle;
    power = launchPower;
    time = 0.0f;
    
    // Phân tích vector vận tốc đầu vx0, vy0
    velocity.x = std::cos(launchAngle) * launchPower;
    velocity.y = std::sin(launchAngle) * launchPower;
    
    startPosition = position;
}

void Hook::updatePhysics(float dt, const Wind& wind, float waterY, float gravity) {
    time += dt;

    // ÁP DỤNG CÁC TÍNH TOÁN VẬT LÝ ĐẠI CƯƠNG VÀO CƠ CHẾ QUĂNG MỒI
    // x(t) = x0 + vx0 * t + 0.5 * (wind_acceleration) * t^2
    // y(t) = y0 + vy0 * t + 0.5 * g * t^2
    float windAcc = wind.getForceX(); // Lực gia tốc gió
    
    position.x = startPosition.x + velocity.x * time + 0.5f * windAcc * time * time;
    position.y = startPosition.y + velocity.y * time + 0.5f * gravity * time * time;

    // Kiểm tra va chạm mặt nước
    if (position.y >= waterY) {
        state = HookState::SINKING;
        velocity.x *= 0.12f; // Nước cản làm triệt tiêu vận tốc ngang cực nhanh
        velocity.y = 100.0f; // Vận tốc chìm sâu từ từ
        std::cout << "[VẬT LÝ] Lưỡi câu đã tiếp nước ở x=" << position.x << "! Chuyển sang chìm dần." << std::endl;
    }
}

void Hook::update(float dt) {
    // Sẽ được gọi và quản lý động bởi lớp Game
}

void Hook::draw(sf::RenderWindow& window) {
    if (state == HookState::IDLE) return;
    // Giả lập vẽ dây câu mảnh nối từ cần câu tới lưỡi câu và móc neo bằng SFML
    // sf::Vertex line[] = { sf::Vertex(startPosition), sf::Vertex(position) };
    // window.draw(line, 2, sf::Lines);
}


// ==========================================================================
// THỰC THỂ LỚP: FISH & BIRD (Chướng ngại vật - Kế thừa từ GameObject)
// ==========================================================================
Fish::Fish(float x, float y) : GameObject(x, y, 24.0f, 16.0f) {
    velocity.y = -300.0f; // Bay vọt xiên lên trên
    velocity.x = getRandomFloat(-60.0f, 60.0f);
    gravity = 420.0f;
}

void Fish::update(float dt) {
    if (!active) return;
    // Parabol rơi tự do dưới nước
    velocity.y += gravity * dt;
    position.x += velocity.x * dt;
    position.y += velocity.y * dt;

    if (velocity.y > 0.0f && position.y > 450.0f) {
        active = false; // Rơi chìm hẳn xuống nước
    }
}

void Fish::draw(sf::RenderWindow& window) {}

Bird::Bird(float x, float y) : GameObject(x, y, 32.0f, 20.0f) {
    velocity.x = getRandomFloat(80.0f, 140.0f); // Bay ngang
    velocity.y = 0.0f;
}

void Bird::update(float dt) {
    if (!active) return;
    position.x += velocity.x * dt;
    
    if (position.x > 960.0f) {
        active = false; // Bay mất hút
    }
}

void Bird::draw(sf::RenderWindow& window) {}


// ==========================================================================
// THỰC THỂ LỚP: GAME (Quản lý vòng lặp chính của toàn bộ trò chơi)
// ==========================================================================
Game::Game() {
    waterLevelY = 320.0f;
    rodTipPosition = { 860.0f, 150.0f };
    
    score = 0;
    gold = 0;
    level = 1;
    timeRemaining = 90.0f;
    isGameOver = false;
    
    currentWeather = WeatherType::SUNNY;
    currentTimeOfDay = TimeOfDay::MORNING;
    envTimer = 30.0f;

    rodLevel = 1;
    lineLevel = 1;
    netLevel = 1;

    isBossBattleActive = false;
    bossHP = 100.0f;
    bossTension = 50.0f;
    safeZoneMin = 40.0f;
    safeZoneMax = 70.0f;

    hook = std::make_shared<Hook>(rodTipPosition.x, rodTipPosition.y);
}

void Game::init() {
    score = 0;
    gold = 100;
    level = 1;
    isGameOver = false;
    timeRemaining = 90.0f;
    
    objects.clear();
    hook->reset(rodTipPosition.x, rodTipPosition.y);
    wind.change();
    
    spawnEntities();
    std::cout << "[HỆ THỐNG] Khởi tạo Ao Ếch Huyền Bí thành công!" << std::endl;
}

void Game::spawnEntities() {
    // Đổ đầy ếch ngẫu nhiên ban đầu
    int maxFrogs = 6 + level * 2;
    for (int i = 0; i < maxFrogs; i++) {
        float rx = getRandomFloat(100.0f, 750.0f);
        float ry = getRandomFloat(380.0f, 500.0f);
        
        // Xác định ngẫu nhiên loại ếch
        FrogType type = FrogType::NORMAL;
        float r = getRandomFloat(0.0f, 1.0f);
        if (r < 0.15f) type = FrogType::RARE;
        else if (r < 0.30f) type = FrogType::POISON;
        
        objects.push_back(std::make_shared<Frog>(rx, ry, type));
    }
}

void Game::handleCollisions() {
    if (hook->getState() != HookState::SINKING && hook->getState() != HookState::FLYING) return;

    float hookRadius = 14.0f + (netLevel - 1) * 3.5f;

    for (auto& obj : objects) {
        if (!obj->isActive()) continue;

        // 1. Va chạm với Ếch khi chìm
        if (auto frog = std::dynamic_pointer_cast<Frog>(obj)) {
            if (hook->getState() == HookState::SINKING) {
                // Kiểm tra khoảng cách Euclid giữa lưỡi câu và tâm ếch
                sf::Vector2f frogCenter = frog->getPosition();
                frogCenter.x += frog->getWidth() / 2.0f;
                frogCenter.y += frog->getHeight() / 2.0f;
                
                float dx = hook->getPosition().x - frogCenter.x;
                float dy = hook->getPosition().y - frogCenter.y;
                float dist = std::sqrt(dx*dx + dy*dy);

                if (dist < hookRadius + frog->getWidth()/2.2f) {
                    // Xử lý ếch hiếm/Ninja né đòn phản xạ
                    if (frog->getType() == FrogType::RARE && getRandomFloat(0.0f, 1.0f) < 0.4f) {
                        frog->escape(); // Nhảy trốn thoát
                        continue;
                    }

                    if (frog->getType() == FrogType::BOSS) {
                        startBossMinigame(frog);
                    } else {
                        // Câu trúng ếch thường/hiếm
                        hook->setState(HookState::CAUGHT);
                        hook->setCaughtObject(frog);
                        std::cout << "[COLLISION] Tóm được ếch loại: " << (int)frog->getType() << std::endl;
                    }
                    return;
                }
            }
        }
    }
}

void Game::startBossMinigame(std::shared_ptr<Frog> boss) {
    isBossBattleActive = true;
    bossHP = 100.0f;
    bossTension = 50.0f;
    safeZoneMin = 40.0f;
    safeZoneMax = 70.0f;
    
    // Liên kết lưỡi câu với Boss khổng lồ
    hook->setState(HookState::CAUGHT);
    hook->setCaughtObject(boss);
    
    std::cout << "[BOSS MINIGAME] Trận đấu Boss câu kéo bắt đầu!" << std::endl;
}

void Game::updateBossMinigame(float dt) {
    // Lực vùng vẫy kéo giật tự nhiên của Boss kéo sức căng xuống thấp
    float bossPull = getRandomFloat(25.0f, 50.0f);
    bossTension = std::max(0.0f, bossTension - bossPull * dt);

    // Di chuyển vùng Safe-zone chậm rãi qua lại
    safeZoneMin += 10.0f * dt;
    safeZoneMax += 10.0f * dt;
    if (safeZoneMax > 90.0f) {
        safeZoneMin = 30.0f;
        safeZoneMax = 60.0f;
    }

    // Kiểm tra sức căng nằm trong safe zone
    if (bossTension >= safeZoneMin && bossTension <= safeZoneMax) {
        bossHP -= dt * 25.0f; // Mất 4 giây để khuất phục Boss
    }

    // Đứt dây hoặc hụt sẩy Boss
    if (bossTension <= 2.0f || bossTension >= 98.0f) {
        isBossBattleActive = false;
        hook->setState(HookState::SNAPPED);
        if (hook->getCaughtObject()) {
            hook->getCaughtObject()->setActive(false);
        }
        std::cout << "[THẤT BẠI] Đứt dây hoặc Boss khổng lồ sẩy mất!" << std::endl;
        return;
    }

    if (bossHP <= 0.0f) {
        isBossBattleActive = false;
        std::cout << "[CHIẾN THẮNG] Đã khuất phục và câu thành công Boss Khổng Lồ!" << std::endl;
        
        // Thêm điểm số kếch xù
        score += hook->getCaughtObject()->getPointValue();
        gold += hook->getCaughtObject()->getGoldValue();
        hook->getCaughtObject()->setActive(false);
        hook->reset(rodTipPosition.x, rodTipPosition.y);
    }
}

void Game::update(float dt) {
    if (isGameOver) return;

    // 1. Cập nhật chu kỳ Gió/Môi trường
    envTimer -= dt;
    if (envTimer <= 0) {
        envTimer = 30.0f;
        wind.change();
        
        // Chuyển chu kỳ ngày đêm
        if (currentTimeOfDay == TimeOfDay::MORNING) currentTimeOfDay = TimeOfDay::NIGHT;
        else currentTimeOfDay = TimeOfDay::MORNING;
    }

    // 2. Cập nhật Lưỡi câu
    if (hook->getState() == HookState::FLYING) {
        hook->updatePhysics(dt, wind, waterLevelY, 550.0f);
    } else if (hook->getState() == HookState::SINKING) {
        hook->setPosition(sf::Vector2f(hook->getPosition().x, hook->getPosition().y + 100.0f * dt));
        // Lực cản nước
        if (hook->getPosition().y >= 510.0f) {
            hook->setState(HookState::REELING);
        }
    } else if (hook->getState() == HookState::REELING || hook->getState() == HookState::CAUGHT) {
        if (isBossBattleActive) {
            updateBossMinigame(dt);
        } else {
            // Kéo dây câu về phía đầu cần
            sf::Vector2f dx = rodTipPosition - hook->getPosition();
            float dist = std::sqrt(dx.x*dx.x + dx.y*dx.y);

            if (dist < 20.0f) {
                // Thu cần thành công
                if (hook->getState() == HookState::CAUGHT && hook->getCaughtObject()) {
                    score += hook->getCaughtObject()->getPointValue();
                    gold += hook->getCaughtObject()->getGoldValue();
                    hook->getCaughtObject()->setActive(false);
                }
                hook->reset(rodTipPosition.x, rodTipPosition.y);
            } else {
                float reelSpeed = 240.0f;
                // Sức căng dây gia tăng
                if (hook->getState() == HookState::CAUGHT && hook->getCaughtObject()) {
                    hook->setTension(std::min(100.0f, hook->getTension() + 15.0f * dt));
                    reelSpeed = 160.0f;
                }
                
                // Di chuyển
                sf::Vector2f dir(dx.x / dist, dx.y / dist);
                hook->setPosition(hook->getPosition() + dir * reelSpeed * dt);
                
                if (hook->getCaughtObject()) {
                    hook->getCaughtObject()->setPosition(hook->getPosition());
                }

                // Đứt dây câu
                float lineLimit = 100.0f + (lineLevel - 1) * 25.0f;
                if (hook->getTension() >= lineLimit) {
                    hook->setState(HookState::SNAPPED);
                    if (hook->getCaughtObject()) hook->getCaughtObject()->setActive(false);
                    std::cout << "[VẬT LÝ] Quá tải đứt dây câu!" << std::endl;
                }
            }
        }
    }

    // 3. Cập nhật các sinh vật
    for (auto& obj : objects) {
        obj->update(dt);
    }

    // Dọn các đối tượng đã chết khỏi Vector
    objects.erase(std::remove_if(objects.begin(), objects.end(),
        [](const std::shared_ptr<GameObject>& o) { return !o->isActive(); }),
        objects.end());

    // 4. Xử lý va chạm va quẹt lưỡi câu
    handleCollisions();

    // 5. Cập nhật thời gian còn lại
    timeRemaining -= dt;
    if (timeRemaining <= 0.0f) {
        timeRemaining = 0.0f;
        isGameOver = true;
        std::cout << "[KẾT THÚC] Hết giờ chơi! Điểm số chung cuộc: " << score << std::endl;
    }
}

void Game::upgradeRod() {
    if (rodLevel < 5 && gold >= rodLevel * 80) {
        gold -= rodLevel * 80;
        rodLevel++;
        std::cout << "[SHOP] Đã nâng cấp Cần câu lên cấp " << rodLevel << std::endl;
    }
}

void Game::upgradeLine() {
    if (lineLevel < 5 && gold >= lineLevel * 80) {
        gold -= lineLevel * 80;
        lineLevel++;
        std::cout << "[SHOP] Đã nâng cấp Dây câu lên cấp " << lineLevel << std::endl;
    }
}

void Game::upgradeNet() {
    if (netLevel < 5 && gold >= netLevel * 80) {
        gold -= netLevel * 80;
        netLevel++;
        std::cout << "[SHOP] Đã nâng cấp Vợt lên cấp " << netLevel << std::endl;
    }
}

void Game::render(sf::RenderWindow& window) {
    // Vẽ nền, vẽ hồ sen, vẽ lưỡi câu, vẽ ếch...
    hook->draw(window);
    for (auto& obj : objects) {
        obj->draw(window);
    }
}

void Game::loop() {
    sf::RenderWindow window; // Khởi tạo cửa sổ đồ họa
    float dt = 1.0f / 120.0f; // Giả lập chu kỳ 120 FPS lý tưởng

    init();

    // Vòng lặp mô phỏng chạy thử nghiệm
    int simulationTicks = 500;
    while (simulationTicks-- > 0 && !isGameOver) {
        update(dt);
        render(window);
    }
}

// Hàm Main thử nghiệm để giáo viên biên dịch kiểm chứng OOP
int main() {
    std::cout << "==========================================================" << std::endl;
    std::cout << " BÀI TẬP LỚN: GAME CÂU ẾCH HUYỀN BÍ (FANTASY FROG FISHING)" << std::endl;
    std::cout << " LẬP TRÌNH HƯỚNG ĐỐI TƯỢNG (OOP) - CẤU TRÚC ĐA HÌNH VÀ VẬT LÝ" << std::endl;
    std::cout << "==========================================================" << std::endl;
    
    Game frogGame;
    frogGame.loop(); // Khởi chạy vòng lặp mô phỏng
    
    return 0;
}
