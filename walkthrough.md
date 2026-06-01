# Walkthrough

## Cach chay nhanh

1. Mo `index.html` bang trinh duyet de choi ban web.
2. Bien dich ban C++ mau:

```bash
g++ -std=c++11 frog_fishing.cpp -o frog_fishing_game
./frog_fishing_game
```

3. Neu co CMake:

```bash
cmake -S . -B build
cmake --build build
```

## Cac diem da dong bo

- UML va code deu dung `startPosition` cho diem xuat phat cua hook.
- Boss safe zone trong UML duoc mo ta la object `{min, max}`, khop voi `app.js`.
- `Bird` co `wingFlap` trong JavaScript, UML, va C++ header/source.
- Chu ky thoi gian C++ di qua du 3 pha: `MORNING -> EVENING -> NIGHT -> MORNING`.
- Trang thai `SNAPPED` cua hook duoc reset, tranh ket hook vinh vien.
- `MAGICAL` frog duoc spawn vao ban dem.
