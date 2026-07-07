-- Seed: Levels
INSERT INTO levels (name, slug, min_score, max_score, level_order, required_project_count, description) VALUES
('Junior', 'junior', 0, 290, 1, 0, 'Разработчик способен создавать простые Android-приложения и понимает основные механизмы платформы.'),
('Middle', 'middle', 232, 645, 2, 2, 'Разработчик уверенно решает типовые задачи, работает с API и базами данных. Самостоятельно разрабатывает production-ready приложения.'),
('Strong Middle', 'strong-middle', 574, 885, 3, 3, 'Проектирует архитектуру, работает с многомодульностью и производительностью.'),
('Senior', 'senior', 837, 1210, 4, 5, 'Способен проектировать архитектуру продукта и принимать технические решения масштаба компании.');

-- Junior categories
WITH l AS (SELECT id FROM levels WHERE slug = 'junior')
INSERT INTO categories (level_id, name, max_score, sort_order) VALUES
((SELECT id FROM l), 'Основы программирования', 40, 1),
((SELECT id FROM l), 'Kotlin Basics', 40, 2),
((SELECT id FROM l), 'Android Basics', 50, 3),
((SELECT id FROM l), 'UI Basics (XML)', 30, 4),
((SELECT id FROM l), 'Data & Storage Basics', 30, 5),
((SELECT id FROM l), 'Асинхронность', 25, 6),
((SELECT id FROM l), 'Архитектура', 25, 7),
((SELECT id FROM l), 'Навигация и компоненты', 20, 8),
((SELECT id FROM l), 'Тестирование', 15, 9),
((SELECT id FROM l), 'Инструменты', 15, 10);

-- Junior skills
WITH cat AS (
  SELECT c.id AS cid, c.name AS cname FROM categories c JOIN levels l ON l.id = c.level_id WHERE l.slug = 'junior'
)
INSERT INTO skills (category_id, name, max_weight, sort_order, required_for_level_up)
SELECT cid, s.name, s.weight, s.ord, s.req::boolean FROM cat, (VALUES
  ('Основы программирования', 'Переменные', 5, 1, false),
  ('Основы программирования', 'Типы данных', 5, 2, false),
  ('Основы программирования', 'Условные конструкции', 5, 3, false),
  ('Основы программирования', 'Циклы', 5, 4, false),
  ('Основы программирования', 'Функции', 5, 5, false),
  ('Основы программирования', 'ООП основы', 5, 6, false),
  ('Основы программирования', 'Коллекции', 5, 7, false),
  ('Основы программирования', 'Обработка ошибок', 5, 8, false),
  ('Kotlin Basics', 'Синтаксис Kotlin', 5, 1, true),
  ('Kotlin Basics', 'Null Safety', 5, 2, true),
  ('Kotlin Basics', 'Data Class', 5, 3, true),
  ('Kotlin Basics', 'Extension Functions', 5, 4, false),
  ('Kotlin Basics', 'Lambda', 5, 5, false),
  ('Kotlin Basics', 'Higher Order Functions', 5, 6, false),
  ('Kotlin Basics', 'Scope Functions', 5, 7, false),
  ('Kotlin Basics', 'Enum', 5, 8, false),
  ('Kotlin Basics', 'Sealed Class', 5, 9, false),
  ('Kotlin Basics', 'Packages', 5, 10, false),
  ('Android Basics', 'Android Studio', 5, 1, true),
  ('Android Basics', 'Проект и модули', 5, 2, true),
  ('Android Basics', 'Gradle', 5, 3, true),
  ('Android Basics', 'AndroidManifest', 5, 4, true),
  ('Android Basics', 'Resources', 5, 5, true),
  ('Android Basics', 'Layouts XML', 5, 6, true),
  ('Android Basics', 'View/ViewGroup', 5, 7, false),
  ('Android Basics', 'Activity Lifecycle', 5, 8, true),
  ('Android Basics', 'Intent', 5, 9, false),
  ('Android Basics', 'Toast/Dialog/Snackbar', 5, 10, false),
  ('UI Basics (XML)', 'TextView', 5, 1, true),
  ('UI Basics (XML)', 'Button', 5, 2, true),
  ('UI Basics (XML)', 'ImageView', 5, 3, true),
  ('UI Basics (XML)', 'EditText', 5, 4, true),
  ('UI Basics (XML)', 'LinearLayout', 5, 5, true),
  ('UI Basics (XML)', 'ConstraintLayout', 5, 6, true),
  ('Data & Storage Basics', 'SharedPreferences', 5, 1, true),
  ('Data & Storage Basics', 'Files', 5, 2, false),
  ('Data & Storage Basics', 'SQLite', 5, 3, false),
  ('Data & Storage Basics', 'Room Basics', 5, 4, false),
  ('Data & Storage Basics', 'JSON', 5, 5, false),
  ('Data & Storage Basics', 'Retrofit GET', 5, 6, false),
  ('Асинхронность', 'Thread', 5, 1, false),
  ('Асинхронность', 'Handler', 5, 2, false),
  ('Асинхронность', 'Looper', 5, 3, false),
  ('Асинхронность', 'Coroutines Basics', 5, 4, false),
  ('Асинхронность', 'Dispatchers', 5, 5, false),
  ('Асинхронность', 'Suspend Functions', 5, 6, false),
  ('Архитектура', 'MVC', 5, 1, false),
  ('Архитектура', 'MVP', 5, 2, false),
  ('Архитектура', 'MVVM', 5, 3, false),
  ('Архитектура', 'LiveData', 5, 4, false),
  ('Архитектура', 'ViewModel', 5, 5, false),
  ('Архитектура', 'Repository', 5, 6, false),
  ('Архитектура', 'Односторонний поток данных', 5, 7, false),
  ('Навигация и компоненты', 'Fragment', 5, 1, false),
  ('Навигация и компоненты', 'Navigation Component', 5, 2, false),
  ('Навигация и компоненты', 'Service', 5, 3, false),
  ('Навигация и компоненты', 'BroadcastReceiver', 5, 4, false),
  ('Тестирование', 'JUnit', 5, 1, false),
  ('Тестирование', 'Espresso', 5, 2, false),
  ('Тестирование', 'MockK Basics', 5, 3, false),
  ('Инструменты', 'Git', 5, 1, true),
  ('Инструменты', 'Logcat', 5, 2, true),
  ('Инструменты', 'Build Variants', 5, 3, false)
) AS s(cname, name, weight, ord, req)
WHERE cat.cname = s.cname;

-- Junior projects
WITH l AS (SELECT id FROM levels WHERE slug = 'junior')
INSERT INTO projects (level_id, name, description, required_technologies, sort_order) VALUES
((SELECT id FROM l), 'ToDo List', 'Приложение для заметок с Room и MVVM', '["Room", "MVVM", "RecyclerView"]', 1),
((SELECT id FROM l), 'Movie Browser', 'Браузер фильмов с Retrofit и навигацией', '["Retrofit", "Navigation", "Detail Screen"]', 2),
((SELECT id FROM l), 'Notes App', 'CRUD приложение с поиском', '["CRUD", "Room", "Search"]', 3),
((SELECT id FROM l), 'Weather App', 'Погодное приложение с API', '["API", "Retrofit", "State Handling"]', 4),
((SELECT id FROM l), 'Calculator', 'Калькулятор с сохранением состояния', '["UI", "State", "Persistence"]', 5);

-- Middle level
WITH l AS (SELECT id FROM levels WHERE slug = 'middle')
INSERT INTO categories (level_id, name, max_score, sort_order) VALUES
((SELECT id FROM l), 'Kotlin', 35, 1),
((SELECT id FROM l), 'Coroutines & Flow', 50, 2),
((SELECT id FROM l), 'Android Components', 25, 3),
((SELECT id FROM l), 'UI (Views + Compose)', 40, 4),
((SELECT id FROM l), 'Architecture', 35, 5),
((SELECT id FROM l), 'Data Layer', 40, 6),
((SELECT id FROM l), 'Networking', 40, 7),
((SELECT id FROM l), 'Dependency Injection', 40, 8),
((SELECT id FROM l), 'Testing', 25, 9),
((SELECT id FROM l), 'Tools', 25, 10);

-- Middle skills
WITH cat AS (
  SELECT c.id AS cid, c.name AS cname FROM categories c JOIN levels l ON l.id = c.level_id WHERE l.slug = 'middle'
)
INSERT INTO skills (category_id, name, max_weight, sort_order, required_for_level_up)
SELECT cid, s.name, s.weight, s.ord, s.req::boolean FROM cat, (VALUES
  ('Kotlin', 'Generics', 5, 1, false),
  ('Kotlin', 'Collections Deep Dive', 5, 2, false),
  ('Kotlin', 'Delegation', 5, 3, false),
  ('Kotlin', 'Inline', 5, 4, false),
  ('Kotlin', 'Reified', 5, 5, false),
  ('Kotlin', 'DSL Basics', 5, 6, false),
  ('Kotlin', 'Contracts Basics', 5, 7, false),
  ('Coroutines & Flow', 'CoroutineScope', 5, 1, true),
  ('Coroutines & Flow', 'Structured Concurrency', 5, 2, true),
  ('Coroutines & Flow', 'SupervisorJob', 5, 3, false),
  ('Coroutines & Flow', 'Exception Handling', 5, 4, true),
  ('Coroutines & Flow', 'Flow', 5, 5, true),
  ('Coroutines & Flow', 'StateFlow', 5, 6, true),
  ('Coroutines & Flow', 'SharedFlow', 5, 7, false),
  ('Coroutines & Flow', 'Channels', 5, 8, false),
  ('Coroutines & Flow', 'repeatOnLifecycle', 5, 9, false),
  ('Android Components', 'Lifecycle', 5, 1, false),
  ('Android Components', 'Fragment Lifecycle', 5, 2, false),
  ('Android Components', 'Process Death', 5, 3, false),
  ('Android Components', 'Services', 5, 4, false),
  ('Android Components', 'BroadcastReceiver', 5, 5, false),
  ('Android Components', 'ContentProvider', 5, 6, false),
  ('UI (Views + Compose)', 'Measure/Layout/Draw', 5, 1, false),
  ('UI (Views + Compose)', 'RecyclerView Deep Dive', 5, 2, false),
  ('UI (Views + Compose)', 'Animations', 5, 3, false),
  ('UI (Views + Compose)', 'Jetpack Compose', 5, 4, true),
  ('UI (Views + Compose)', 'State', 5, 5, true),
  ('UI (Views + Compose)', 'Remember', 5, 6, false),
  ('UI (Views + Compose)', 'Side Effects', 5, 7, false),
  ('UI (Views + Compose)', 'Navigation Compose', 5, 8, false),
  ('Architecture', 'MVVM', 5, 1, true),
  ('Architecture', 'MVI', 5, 2, false),
  ('Architecture', 'UDF', 5, 3, false),
  ('Architecture', 'State Management', 5, 4, false),
  ('Architecture', 'UseCase', 5, 5, false),
  ('Architecture', 'Repository', 5, 6, true),
  ('Data Layer', 'Room', 5, 1, true),
  ('Data Layer', 'Migration', 5, 2, false),
  ('Data Layer', 'Paging3', 5, 3, true),
  ('Data Layer', 'DataStore', 5, 4, false),
  ('Data Layer', 'Caching', 5, 5, false),
  ('Data Layer', 'Offline First', 5, 6, true),
  ('Data Layer', 'WorkManager', 5, 7, true),
  ('Networking', 'OkHttp', 5, 1, false),
  ('Networking', 'Retrofit', 5, 2, true),
  ('Networking', 'Converters', 5, 3, false),
  ('Networking', 'Error Handling', 5, 4, true),
  ('Networking', 'Upload', 5, 5, false),
  ('Networking', 'Download', 5, 6, false),
  ('Networking', 'WebSocket', 5, 7, false),
  ('Networking', 'Certificate Pinning', 5, 8, false),
  ('Dependency Injection', 'Hilt', 5, 1, true),
  ('Dependency Injection', 'Dagger', 5, 2, false),
  ('Dependency Injection', 'Modules', 5, 3, false),
  ('Dependency Injection', 'Scopes', 5, 4, false),
  ('Dependency Injection', '@Inject', 5, 5, false),
  ('Dependency Injection', '@Provides', 5, 6, false),
  ('Dependency Injection', '@Binds', 5, 7, false),
  ('Testing', 'Unit Tests', 5, 1, false),
  ('Testing', 'Coroutine Tests', 5, 2, false),
  ('Testing', 'Repository Tests', 5, 3, false),
  ('Testing', 'ViewModel Tests', 5, 4, false),
  ('Testing', 'UI Tests', 5, 5, false),
  ('Tools', 'Git Flow', 5, 1, false),
  ('Tools', 'Gradle KTS', 5, 2, false),
  ('Tools', 'R8', 5, 3, false),
  ('Tools', 'Proguard', 5, 4, false),
  ('Tools', 'Profiler', 5, 5, false),
  ('Tools', 'Firebase Crashlytics', 5, 6, false)
) AS s(cname, name, weight, ord, req)
WHERE cat.cname = s.cname;

-- Middle projects
WITH l AS (SELECT id FROM levels WHERE slug = 'middle')
INSERT INTO projects (level_id, name, description, required_technologies, sort_order) VALUES
((SELECT id FROM l), 'News App', 'Новостное приложение с пагинацией и офлайн режимом', '["Retrofit", "Paging3", "Room", "Offline First", "Dark Theme"]', 1),
((SELECT id FROM l), 'ToDo Pro', 'Продвинутый туду-лист на Compose', '["Compose", "Room", "DataStore", "WorkManager", "Hilt"]', 2),
((SELECT id FROM l), 'Chat App', 'Чат с WebSocket и кешированием', '["WebSocket", "Local Cache", "Realtime"]', 3),
((SELECT id FROM l), 'Movie Browser Pro', 'Браузер фильмов с кешированием и пагинацией', '["Caching", "Pagination", "Image Loading"]', 4),
((SELECT id FROM l), 'Habit Tracker', 'Трекер привычек со статистикой', '["Statistics", "Notifications", "Background Tasks"]', 5);

-- Strong Middle level
WITH l AS (SELECT id FROM levels WHERE slug = 'strong-middle')
INSERT INTO categories (level_id, name, max_score, sort_order) VALUES
((SELECT id FROM l), 'Kotlin Advanced', 35, 1),
((SELECT id FROM l), 'Flow Deep Dive', 35, 2),
((SELECT id FROM l), 'Compose Advanced', 35, 3),
((SELECT id FROM l), 'Architecture', 40, 4),
((SELECT id FROM l), 'Data', 35, 5),
((SELECT id FROM l), 'Security', 30, 6),
((SELECT id FROM l), 'Performance', 30, 7);

-- Strong Middle skills
WITH cat AS (
  SELECT c.id AS cid, c.name AS cname FROM categories c JOIN levels l ON l.id = c.level_id WHERE l.slug = 'strong-middle'
)
INSERT INTO skills (category_id, name, max_weight, sort_order, required_for_level_up)
SELECT cid, s.name, s.weight, s.ord, s.req::boolean FROM cat, (VALUES
  ('Kotlin Advanced', 'Inline', 5, 1, false),
  ('Kotlin Advanced', 'Reified', 5, 2, false),
  ('Kotlin Advanced', 'Contracts', 5, 3, false),
  ('Kotlin Advanced', 'Delegation', 5, 4, false),
  ('Kotlin Advanced', 'DSL', 5, 5, false),
  ('Kotlin Advanced', 'Reflection', 5, 6, false),
  ('Kotlin Advanced', 'KClass', 5, 7, false),
  ('Kotlin Advanced', 'Value Classes', 5, 8, false),
  ('Flow Deep Dive', 'SharedFlow', 5, 1, false),
  ('Flow Deep Dive', 'StateFlow', 5, 2, false),
  ('Flow Deep Dive', 'Buffer', 5, 3, false),
  ('Flow Deep Dive', 'Conflate', 5, 4, false),
  ('Flow Deep Dive', 'Select', 5, 5, false),
  ('Flow Deep Dive', 'Channels', 5, 6, false),
  ('Flow Deep Dive', 'Actor Model', 5, 7, false),
  ('Compose Advanced', 'Composition', 5, 1, false),
  ('Compose Advanced', 'Recomposition', 5, 2, false),
  ('Compose Advanced', 'Snapshot System', 5, 3, false),
  ('Compose Advanced', 'Stability', 5, 4, false),
  ('Compose Advanced', 'DerivedStateOf', 5, 5, false),
  ('Compose Advanced', 'Custom Layouts', 5, 6, false),
  ('Architecture', 'Clean Architecture', 5, 1, true),
  ('Architecture', 'Feature Modules', 5, 2, false),
  ('Architecture', 'Multi Module', 5, 3, true),
  ('Architecture', 'SOLID', 5, 4, false),
  ('Architecture', 'DDD Basics', 5, 5, false),
  ('Data', 'RemoteMediator', 5, 1, false),
  ('Data', 'Proto DataStore', 5, 2, false),
  ('Data', 'Sync', 5, 3, false),
  ('Data', 'Conflict Resolution', 5, 4, false),
  ('Security', 'Keystore', 5, 1, false),
  ('Security', 'Encryption', 5, 2, false),
  ('Security', 'SSL Pinning', 5, 3, false),
  ('Security', 'BiometricPrompt', 5, 4, false),
  ('Performance', 'Jank', 5, 1, false),
  ('Performance', 'Startup Time', 5, 2, false),
  ('Performance', 'Memory Leaks', 5, 3, false),
  ('Performance', 'Macrobenchmark', 5, 4, false),
  ('Performance', 'Baseline Profiles', 5, 5, false)
) AS s(cname, name, weight, ord, req)
WHERE cat.cname = s.cname;

-- Strong Middle projects
WITH l AS (SELECT id FROM levels WHERE slug = 'strong-middle')
INSERT INTO projects (level_id, name, description, required_technologies, sort_order) VALUES
((SELECT id FROM l), 'News Reader Pro', 'Новостной ридер с офлайн и мультимодульностью', '["Offline First", "Push", "Multi Module"]', 1),
((SELECT id FROM l), 'Tasks Manager', 'Менеджер задач с WorkManager', '["WorkManager", "Compose", "Sync"]', 2),
((SELECT id FROM l), 'Secure Chat', 'Защищённый чат с шифрованием', '["Encryption", "WebSocket", "Offline Cache"]', 3),
((SELECT id FROM l), 'Media Player', 'Медиа плеер с ExoPlayer', '["ExoPlayer", "Audio Focus", "Background Playback"]', 4),
((SELECT id FROM l), 'E-Commerce Mini', 'Мини e-commerce с корзиной', '["Cart", "Offline", "Caching", "Analytics"]', 5);

-- Senior level
WITH l AS (SELECT id FROM levels WHERE slug = 'senior')
INSERT INTO categories (level_id, name, max_score, sort_order) VALUES
((SELECT id FROM l), 'Kotlin Expert', 30, 1),
((SELECT id FROM l), 'Concurrency Expert', 30, 2),
((SELECT id FROM l), 'Android Platform Expert', 30, 3),
((SELECT id FROM l), 'Compose Advanced', 25, 4),
((SELECT id FROM l), 'Architecture & Design', 30, 5),
((SELECT id FROM l), 'Data Layer', 25, 6),
((SELECT id FROM l), 'Networking', 25, 7),
((SELECT id FROM l), 'Dependency Injection', 20, 8),
((SELECT id FROM l), 'Performance', 25, 9),
((SELECT id FROM l), 'Testing', 25, 10),
((SELECT id FROM l), 'CI/CD', 30, 11),
((SELECT id FROM l), 'Security', 30, 12);

-- Senior skills
WITH cat AS (
  SELECT c.id AS cid, c.name AS cname FROM categories c JOIN levels l ON l.id = c.level_id WHERE l.slug = 'senior'
)
INSERT INTO skills (category_id, name, max_weight, sort_order, required_for_level_up)
SELECT cid, s.name, s.weight, s.ord, s.req::boolean FROM cat, (VALUES
  ('Kotlin Expert', 'Compiler', 5, 1, false),
  ('Kotlin Expert', 'Memory Model', 5, 2, false),
  ('Kotlin Expert', 'Multiplatform', 5, 3, false),
  ('Kotlin Expert', 'Performance', 5, 4, false),
  ('Kotlin Expert', 'Reflection', 5, 5, false),
  ('Kotlin Expert', 'Annotations', 5, 6, false),
  ('Concurrency Expert', 'Coroutine Internals', 5, 1, false),
  ('Concurrency Expert', 'Dispatchers Internals', 5, 2, false),
  ('Concurrency Expert', 'State Machine', 5, 3, false),
  ('Concurrency Expert', 'Atomic Operations', 5, 4, false),
  ('Concurrency Expert', 'SharedFlow Internals', 5, 5, false),
  ('Android Platform Expert', 'ART', 5, 1, false),
  ('Android Platform Expert', 'Binder', 5, 2, false),
  ('Android Platform Expert', 'Zygote', 5, 3, false),
  ('Android Platform Expert', 'AMS', 5, 4, false),
  ('Android Platform Expert', 'WMS', 5, 5, false),
  ('Android Platform Expert', 'PackageManager', 5, 6, false),
  ('Android Platform Expert', 'Looper Internals', 5, 7, false),
  ('Compose Advanced', 'Compiler', 5, 1, false),
  ('Compose Advanced', 'Slot Table', 5, 2, false),
  ('Compose Advanced', 'Recomposer', 5, 3, false),
  ('Compose Advanced', 'Snapshot System', 5, 4, false),
  ('Architecture & Design', 'DDD', 5, 1, false),
  ('Architecture & Design', 'Event Driven', 5, 2, false),
  ('Architecture & Design', 'CQRS Basics', 5, 3, false),
  ('Architecture & Design', 'Scalability', 5, 4, false),
  ('Architecture & Design', 'Bounded Context', 5, 5, false),
  ('Data Layer', 'Room Internals', 5, 1, false),
  ('Data Layer', 'Query Optimization', 5, 2, false),
  ('Data Layer', 'Multi Source Data', 5, 3, false),
  ('Data Layer', 'Sync Engines', 5, 4, false),
  ('Networking', 'HTTP2', 5, 1, false),
  ('Networking', 'HTTP3', 5, 2, false),
  ('Networking', 'gRPC', 5, 3, false),
  ('Networking', 'TLS', 5, 4, false),
  ('Networking', 'Certificate Management', 5, 5, false),
  ('Dependency Injection', 'Dagger Internals', 5, 1, false),
  ('Dependency Injection', 'Graph Resolution', 5, 2, false),
  ('Dependency Injection', 'Scopes Deep Dive', 5, 3, false),
  ('Performance', 'ANR', 5, 1, false),
  ('Performance', 'FrameMetrics', 5, 2, false),
  ('Performance', 'Memory Profiling', 5, 3, false),
  ('Performance', 'Battery Optimization', 5, 4, false),
  ('Testing', 'Contract Tests', 5, 1, false),
  ('Testing', 'Integration Tests', 5, 2, false),
  ('Testing', 'Mutation Tests', 5, 3, false),
  ('Testing', 'Snapshot Tests', 5, 4, false),
  ('CI/CD', 'GitHub Actions', 5, 1, false),
  ('CI/CD', 'Fastlane', 5, 2, false),
  ('CI/CD', 'Firebase Distribution', 5, 3, false),
  ('CI/CD', 'Play Publishing', 5, 4, false),
  ('Security', 'OWASP Mobile Top 10', 5, 1, false),
  ('Security', 'Encryption', 5, 2, false),
  ('Security', 'Root Detection', 5, 3, false),
  ('Security', 'Tamper Detection', 5, 4, false),
  ('Security', 'Data Leak Prevention', 5, 5, false)
) AS s(cname, name, weight, ord, req)
WHERE cat.cname = s.cname;

-- Senior projects
WITH l AS (SELECT id FROM levels WHERE slug = 'senior')
INSERT INTO projects (level_id, name, description, required_technologies, sort_order) VALUES
((SELECT id FROM l), 'Super App', 'Мультимодульное приложение с feature flags', '["Multi Module", "Feature Flags", "Analytics", "Offline First"]', 1),
((SELECT id FROM l), 'Social Network', 'Социальная сеть с realtime', '["Paging3", "Realtime", "Media", "Comments"]', 2),
((SELECT id FROM l), 'Finance App', 'Финансовое приложение с биометрией', '["Biometrics", "Encryption", "Security", "Offline"]', 3),
((SELECT id FROM l), 'Messenger', 'Мессенджер с шифрованием', '["XMPP/WebSocket", "Push", "Encryption", "Background Services"]', 4),
((SELECT id FROM l), 'Media Platform', 'Медиа платформа с DRM', '["Streaming", "Downloads", "DRM", "Picture in Picture"]', 5),
((SELECT id FROM l), 'Kotlin Multiplatform Product', 'KMP проект с общим доменом', '["Android", "iOS", "Shared Domain", "Compose Multiplatform"]', 6);
