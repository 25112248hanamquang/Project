/**
 * ==========================================================================
 * BÀI TẬP LỚN: GAME CÂU ẾCH HUYỀN BÍ (FANTASY FROG FISHING)
 * FILE: frog_fishing.hpp
 * MÔ TẢ: Khai báo cấu trúc các lớp lập trình hướng đối tượng (OOP)
 *       Tuân thủ sơ đồ thiết kế UML và các lớp kế thừa trừu tượng đa hình.
 * ==========================================================================
 */

#ifndef FROG_FISHING_HPP
#define FROG_FISHING_HPP

#include <iostream>
#include <vector>
#include <string>
#include <cmath>
#include <memory>
#include <algorithm>

// Lưu ý: Đối với bài tập lớn đồ hoạ, thư viện phổ biến là SFML (Simple and Fast Multimedia Library)
// Chúng ta sẽ khai báo các lớp tương thích hoặc mô phỏng lại cấu trúc đồ họa của SFML.
namespace sf {
    struct Vector2f {
        float x;
        float y;
        Vector2f(float _x = 0.0f, float _y = 0.0f) : x(_x), y(_y) {}
    };

    inline Vector2f operator+(const Vector2f& a, const Vector2f& b) {
        return Vector2f(a.x + b.x, a.y + b.y);
    }

    inline Vector2f operator-(const Vector2f& a, const Vector2f& b) {
        return Vector2f(a.x - b.x, a.y - b.y);
    }

    inline Vector2f operator*(const Vector2f& v, float scalar) {
        return Vector2f(v.x * scalar, v.y * scalar);
    }

    inline Vector2f operator*(float scalar, const Vector2f& v) {
        return v * scalar;
    }

    class RenderWindow {}; // Giả lập lớp cửa sổ vẽ của SFML
}

// Định nghĩa các loại Ếch trong game
enum class FrogType {
    NORMAL,  // Ếch thường: di chuyển chậm, dễ câu
    RARE,    // Ếch vàng/Ninja: trốn thoát nhanh, nhiều điểm thưởng
    POISON,  // Ếch độc/Ếch gai: chướng ngại vật dưới nước, câu nhầm trừ điểm/máu
    MAGICAL, // Ếch ma thuật: phát sáng trong đêm, giá trị rất cao
    BOSS     // Boss Khổng Lồ: xuất hiện chu kỳ, yêu cầu kéo giằng co
};

// Định nghĩa các trạng thái của Lưỡi Câu
enum class HookState {
    IDLE,     // Đang chờ ở đầu cần câu
    FLYING,   // Đang bay trong không trung (chịu ảnh hưởng gió + trọng lực)
    SINKING,  // Đang chìm dần dưới nước (chịu lực cản nước)
    REELING,  // Đang được kéo về (không câu trúng gì)
    CAUGHT,   // Đang kéo ếch dính câu về
    SNAPPED   // Đứt dây câu do quá căng
};

// Định nghĩa các loại Mồi Câu
enum class BaitType {
    WORM,     // Giun đất: cơ bản, vô hạn
    FLY,      // Ruồi bay: thu hút ếch Ninja
    SPIDER,   // Nhện giả: dụ ếch dưới lá sen
    FIREFLY   // Đom đóm: phát sáng ban đêm
};

// Định nghĩa Thời tiết trong game
enum class WeatherType {
    SUNNY,    // Trời nắng gắt: ếch trốn dưới lá sen lớn
    RAINY     // Trời mưa: ếch xuất hiện nhiều hơn nhưng trơn trượt, dễ sẩy
};

// Định nghĩa Chu kỳ Ngày/Đêm
enum class TimeOfDay {
    MORNING,  // Bình minh / Ban ngày
    EVENING,  // Hoàng hôn
    NIGHT     // Ban đêm: kích hoạt xuất hiện ếch phát sáng ma thuật
};

/**
 * LỚP TRỪU TƯỢNG GameObject (Lớp cơ sở gốc)
 * Áp dụng tính trừu tượng (Abstraction) và là nền tảng cho đa hình (Polymorphism).
 */
class GameObject {
protected:
    sf::Vector2f position; // Tọa độ (x, y)
    sf::Vector2f velocity; // Vận tốc (vx, vy)
    float width;           // Chiều rộng thực thể
    float height;          // Chiều cao thực thể
    bool active;           // Trạng thái còn hoạt động hay không

public:
    GameObject(float x, float y, float w, float h) 
        : position(x, y), velocity(0, 0), width(w), height(h), active(true) {}

    virtual ~GameObject() = default;

    // Phương thức thuần ảo (Pure Virtual Functions) bắt buộc lớp con ghi đè
    virtual void update(float dt) = 0;
    virtual void draw(sf::RenderWindow& window) = 0;

    // Các phương thức Getter / Setter cơ bản
    sf::Vector2f getPosition() const { return position; }
    void setPosition(sf::Vector2f pos) { position = pos; }
    
    sf::Vector2f getVelocity() const { return velocity; }
    void setVelocity(sf::Vector2f vel) { velocity = vel; }

    float getWidth() const { return width; }
    float getHeight() const { return height; }
    
    bool isActive() const { return active; }
    void setActive(bool status) { active = status; }
};

/**
 * LỚP GIÓ (Wind) - Quản lý hướng gió và lực gió
 * Thay đổi ngẫu nhiên sau mỗi lượt quăng cần để tạo thử thách vật lý.
 */
class Wind {
private:
    int direction;  // 1: Thổi sang phải, -1: Thổi sang trái
    float strength; // Cường độ gió (m/s)

public:
    Wind() : direction(1), strength(0.0f) {}

    void change(); // Hàm thay đổi sức gió ngẫu nhiên
    
    int getDirection() const { return direction; }
    float getStrength() const { return strength; }
    float getForceX() const { return direction * strength * 15.0f; } // Lực gió tác động trục X
};

/**
 * LỚP ẾCH (Frog) - Kế thừa từ GameObject
 * Triển khai các hành vi di chuyển ngẫu nhiên, lặn/nổi và bỏ chạy.
 */
class Frog : public GameObject {
private:
    FrogType type;
    float speed;
    int pointValue;
    int goldValue;
    bool isDiving;
    float diveProgress; // Tỉ lệ lặn (1.0: nổi hẳn, 0.0: chìm hẳn)
    float diveTimer;
    float walkTimer;
    int facing;        // Hướng quay mặt (1 hoặc -1)
    bool isHopping;
    float hopProgress;

public:
    Frog(float x, float y, FrogType t);

    void update(float dt) override;
    void draw(sf::RenderWindow& window) override;

    // Các hành vi đặc trưng của lớp Frog
    void randomWalk(float dt);
    void dive(float dt);
    void escape(); // Bỏ chạy nhanh khi lưỡi câu tiếp cận sát bên

    // Getter đặc chủng
    FrogType getType() const { return type; }
    int getPointValue() const { return pointValue; }
    int getGoldValue() const { return goldValue; }
    float getDiveProgress() const { return diveProgress; }
};

/**
 * LỚP LƯỠI CÂU (Hook) - Kế thừa từ GameObject
 * Tính toán chuyển động vật lý parabol, sức cản nước và độ căng dây câu.
 */
class Hook : public GameObject {
private:
    HookState state;
    sf::Vector2f startPosition; // Điểm xuất phát ném mồi
    float angle;                // Góc ném (radians)
    float power;                // Lực ném ban đầu
    float time;                 // Thời gian bay (vật lý)
    float tension;              // Lực căng dây câu (0 - 100)
    std::shared_ptr<Frog> caughtObject; // Đối tượng ếch đang bị dính câu

public:
    Hook(float x, float y);

    void update(float dt) override;
    void draw(sf::RenderWindow& window) override;

    void reset(float rodTipX, float rodTipY);
    void launch(float angle, float power);
    
    // Tích hợp vật lý ném Parabol thực tế kết hợp Gió và Trọng lực
    void updatePhysics(float dt, const Wind& wind, float waterY, float gravity);

    HookState getState() const { return state; }
    void setState(HookState s) { state = s; }
    
    float getTension() const { return tension; }
    void setTension(float t) { tension = t; }

    std::shared_ptr<Frog> getCaughtObject() const { return caughtObject; }
    void setCaughtObject(std::shared_ptr<Frog> frog) { caughtObject = frog; }
};

/**
 * LỚP VẬT CẢN CÁ NHẢY (Fish) - Kế thừa từ GameObject
 * Chướng ngại vật nhảy vọt lên phá lưỡi câu đang bay hoặc đớp mất mồi câu.
 */
class Fish : public GameObject {
private:
    float gravity;

public:
    Fish(float x, float y);
    void update(float dt) override;
    void draw(sf::RenderWindow& window) override;
};

/**
 * LỚP VẬT CẢN CHIM BAY (Bird) - Kế thừa từ GameObject
 * Chướng ngại vật bay ngang bầu trời cướp mất mồi câu.
 */
class Bird : public GameObject {
private:
    float wingFlap;

public:
    Bird(float x, float y);
    void update(float dt) override;
    void draw(sf::RenderWindow& window) override;
};

/**
 * LỚP GAME (Quản lý cốt lõi)
 * Chứa vòng lặp loop(), danh sách GameObject, điểm số, và cơ chế chuyển đổi màn.
 */
class Game {
private:
    std::vector<std::shared_ptr<GameObject>> objects; // Sử dụng con trỏ thông minh đa hình
    std::shared_ptr<Hook> hook;
    Wind wind;
    
    int score;
    int gold;
    int level;
    float timeRemaining;
    bool isGameOver;
    
    // Môi trường
    float waterLevelY;
    sf::Vector2f rodTipPosition;
    WeatherType currentWeather;
    TimeOfDay currentTimeOfDay;
    float envTimer;

    // Upgrades
    int rodLevel;
    int lineLevel;
    int netLevel;

    // Boss Battle minigame
    bool isBossBattleActive;
    float bossHP;
    float bossTension;
    float safeZoneMin;
    float safeZoneMax;

public:
    Game();
    ~Game() = default;

    void init();
    void processEvents();
    void update(float dt);
    void render(sf::RenderWindow& window);
    void loop(); // Vòng lặp game cốt lõi

    // Logic Quản lý Gameplay
    void handleCollisions();
    void spawnEntities();
    void startBossMinigame(std::shared_ptr<Frog> boss);
    void updateBossMinigame(float dt);
    
    // Nâng cấp trang bị
    void upgradeRod();
    void upgradeLine();
    void upgradeNet();

    // Setters / Getters
    int getScore() const { return score; }
    int getGold() const { return gold; }
    int getLevel() const { return level; }
    bool checkGameOver() const { return isGameOver; }
};

#endif // FROG_FISHING_HPP
