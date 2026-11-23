# Данные и хранение в Android

**Уровень:** Junior  
**Категория:** Data & Storage Basics  
**Язык:** Kotlin  
**Кратко:** Где и как Android-приложение хранит данные: настройки, файлы, SQLite, Room и подготовка данных к отправке в сеть.

## 1. SharedPreferences и DataStore Basics {#sharedpreferences-i-datastore}

Любое приложение хранит данные: имя пользователя, флаг «первый запуск», выбранный язык, токен авторизации, кэш настроек. Для небольших пар «ключ — значение» в Android исторически использовали SharedPreferences. Сегодня рекомендуемый подход — Preferences DataStore: он асинхронный, типобезопасный и не блокирует главный поток. SharedPreferences остаётся legacy-механизмом для старого кода и сторонних библиотек.

:::cards
- **DataStore** — современный способ хранения настроек: асинхронный, на корутинах и Flow.
- **SharedPreferences** — устаревший, но всё ещё встречающийся key-value API.
- **Ключи** — типизированные `Preferences.Key`, а не строки.
- **Чтение** — всегда через `Flow`, данные приходят асинхронно.
- **Запись** — через `edit { }`, транзакционно.
- **Миграция** — DataStore умеет перенести старые SharedPreferences.
:::

> **Ключевая идея:** для новых проектов используйте Preferences DataStore. SharedPreferences оставляйте только там, где он уже есть и перенос неоправдан.

### 1.1. Preferences DataStore как основной современный подход {#preferences-datastore-kak-osnovnoy-sovremennyy-podhod}

Preferences DataStore — это часть библиотеки Jetpack DataStore. Он хранит данные в файле на диске в формате key-value, но работает поверх корутин и `Flow`. Чтение возвращает поток данных, который обновляется при каждом изменении; запись выполняется в транзакции.

Подключение в `build.gradle`:

```gradle
dependencies {
    // подставьте актуальную версию androidx.datastore:datastore-preferences
    implementation "androidx.datastore:datastore-preferences:<version>"
}
```

Создание хранилища. Чаще всего используют делегат расширения `preferencesDataStore` на `Context`:

```kotlin
import androidx.datastore.core.DataStore
import androidx.datastore.preferences.core.Preferences
import androidx.datastore.preferences.preferencesDataStore

private val Context.dataStore: DataStore<Preferences> by preferencesDataStore(
    name = "settings"
)
```

Делегат создаёт один экземпляр `DataStore` на процесс для данного имени файла. Это важно: создавайте хранилище один раз, обычно на уровне приложения или через DI, и переиспользуйте.

Чтение данных:

```kotlin
val darkModeFlow: Flow<Boolean> = context.dataStore.data.map { prefs ->
    prefs[DARK_MODE_KEY] ?: false
}
```

Запись данных:

```kotlin
suspend fun setDarkMode(enabled: Boolean) {
    context.dataStore.edit { prefs ->
        prefs[DARK_MODE_KEY] = enabled
    }
}
```

Метод `edit` принимает лямбду, в которой можно изменить `MutablePreferences`. Изменения применяются атомарно: либо все, либо ни одного. Ошибки ввода-вывода пробрасываются как исключения, их можно перехватить через `catch` на потоке `data`.

### 1.2. Preferences.Key, чтение через data Flow и запись через edit {#preferences-key-chtenie-cherez-data-flow-i-zapis-cherez-edit}

Ключи в DataStore типизированы. Вместо строк используют фабричные функции, которые создают `Preferences.Key<T>`:

```kotlin
import androidx.datastore.preferences.core.booleanPreferencesKey
import androidx.datastore.preferences.core.stringPreferencesKey
import androidx.datastore.preferences.core.intPreferencesKey
import androidx.datastore.preferences.core.longPreferencesKey
import androidx.datastore.preferences.core.floatPreferencesKey
import androidx.datastore.preferences.core.doublePreferencesKey
import androidx.datastore.preferences.core.stringSetPreferencesKey

object SettingsKeys {
    val DARK_MODE = booleanPreferencesKey("dark_mode")
    val USER_NAME = stringPreferencesKey("user_name")
    val LAUNCH_COUNT = intPreferencesKey("launch_count")
    val LAST_SYNC = longPreferencesKey("last_sync")
    val FONT_SCALE = floatPreferencesKey("font_scale")
    val RATING = doublePreferencesKey("rating")
    val TAGS = stringSetPreferencesKey("tags")
}
```

Тип ключа определяет, какие значения можно хранить. Компилятор не даст записать `String` в `intPreferencesKey`.

Чтение через `Flow`. Поток `dataStore.data` эмитит текущие `Preferences` при каждом изменении. Обычно его мапят в нужный тип:

```kotlin
class SettingsRepository(private val dataStore: DataStore<Preferences>) {
    val userName: Flow<String> = dataStore.data.map { prefs ->
        prefs[SettingsKeys.USER_NAME] ?: "Гость"
    }

    val launchCount: Flow<Int> = dataStore.data.map { prefs ->
        prefs[SettingsKeys.LAUNCH_COUNT] ?: 0
    }
}
```

В Compose данные читаются через `collectAsState`:

```kotlin
@Composable
fun SettingsScreen(viewModel: SettingsViewModel) {
    val userName by viewModel.userName.collectAsState(initial = "Гость")
    Text(text = "Привет, $userName")
}
```

Запись через `edit`. Метод `edit` — `suspend`-функция, поэтому вызывать её нужно из корутины:

```kotlin
class SettingsRepository(private val dataStore: DataStore<Preferences>) {
    suspend fun setUserName(name: String) {
        dataStore.edit { prefs ->
            prefs[SettingsKeys.USER_NAME] = name
        }
    }

    suspend fun incrementLaunchCount() {
        dataStore.edit { prefs ->
            val current = prefs[SettingsKeys.LAUNCH_COUNT] ?: 0
            prefs[SettingsKeys.LAUNCH_COUNT] = current + 1
        }
    }

    suspend fun clearAll() {
        dataStore.edit { prefs ->
            prefs.clear()
        }
    }
}
```

Важно: внутри `edit` нельзя вызывать другие `edit` того же DataStore — это приведёт к дедлоку. Все изменения в одной транзакции делайте в одной лямбде.

### 1.3. Преимущества DataStore перед SharedPreferences {#preimuschestva-datastore-pered-sharedpreferences}

| Критерий | SharedPreferences | Preferences DataStore |
| --- | --- | --- |
| Асинхронность | `apply` асинхронный, но чтение синхронное | Полностью асинхронный |
| Главный поток | Чтение/запись могут блокировать UI | Не блокирует UI |
| Транзакции | Нет | Атомарные изменения |
| Типобезопасность | Строковые ключи | Типизированные `Preferences.Key` |
| Обработка ошибок | Ошибки I/O теряются | Исключения пробрасываются |
| Согласованность | Возможны рассинхроны | Единый источник правды через Flow |
| Миграция | Ручная | Встроенная `SharedPreferencesMigration` |

Главная причина перехода — безопасность главного потока. SharedPreferences при чтении обращается к диску (или к кэшу в памяти, но первый вызов и запись всё равно связаны с I/O). На слабых устройствах это приводит к ANR. DataStore читает данные один раз при старте и дальше отдаёт их через `Flow` из памяти.

Дополнительно DataStore поддерживает обработку ошибок:

```kotlin
context.dataStore.data
    .catch { exception ->
        if (exception is IOException) emit(emptyPreferences())
        else throw exception
    }
    .map { prefs -> prefs[SettingsKeys.USER_NAME] ?: "Гость" }
```

### 1.4. SharedPreferences в существующих и legacy-проектах {#sharedpreferences-v-suschestvuyuschih-i-legacy-proektah}

SharedPreferences никуда не делся: он встречается в старом коде, в сторонних SDK и в миграционных сценариях. Задача разработчика — не писать новый код на SharedPreferences, но уметь его читать и аккуратно мигрировать.

Типичные места, где вы встретите SharedPreferences:

- старые проекты, написанные до появления DataStore;
- библиотеки, которые хранят свои настройки через `getSharedPreferences`;
- код, где DataStore ещё не подключён, а зависимость тянуть не хотят.

Если проект уже использует SharedPreferences, миграцию делают постепенно: сначала оборачивают чтение в репозиторий, затем заменяют реализацию на DataStore с `SharedPreferencesMigration`, затем удаляют старый код. DataStore умеет автоматически перенести данные:

```kotlin
private val Context.dataStore: DataStore<Preferences> by preferencesDataStore(
    name = "settings",
    produceMigrations = { context ->
        listOf(SharedPreferencesMigration(context, "old_settings"))
    }
)
```

После миграции старый файл SharedPreferences остаётся на диске, но DataStore его больше не читает. Удалять файл вручную не нужно, но и рассчитывать на него нельзя.

### 1.5. Чтение и запись в SharedPreferences (edit, apply и commit) {#chtenie-i-zapis-v-sharedpreferences-edit-apply-i-commit}

Получение экземпляра:

```kotlin
val prefs = context.getSharedPreferences("app_settings", Context.MODE_PRIVATE)
```

`MODE_PRIVATE` — единственный рекомендуемый режим; остальные помечены устаревшими и небезопасны.

Чтение:

```kotlin
val userName = prefs.getString("user_name", "Гость") ?: "Гость"
val darkMode = prefs.getBoolean("dark_mode", false)
val launchCount = prefs.getInt("launch_count", 0)
```

Запись через `edit()`:

```kotlin
prefs.edit().apply {
    putString("user_name", "Анна")
    putBoolean("dark_mode", true)
    putInt("launch_count", 5)
    apply() // или commit()
}
```

Разница `apply` и `commit`:

- `apply()` — асинхронно записывает на диск в фоне, не возвращает результат, не блокирует вызывающий поток. Предпочтительный вариант.
- `commit()` — синхронно записывает на диск и возвращает `Boolean` об успехе. Блокирует поток до завершения записи.

Используйте `apply()` почти всегда. `commit()` оправдан только когда нужно гарантировать, что данные записаны до продолжения (например, перед завершением процесса).

### 1.6. Ограничения и блокировки главного потока в SharedPreferences {#ogranicheniya-i-blokirovki-glavnogo-potoka-v-sharedpreferences}

SharedPreferences загружает весь файл в память при первом обращении. Это чтение с диска происходит на том потоке, где вызван первый `getSharedPreferences` или `get*`. Если это главный поток, возможна задержка и ANR на больших файлах.

Дополнительные проблемы:

- нет транзакций: два потока могут перезаписать друг друга;
- нет типобезопасности: ключи — строки, ошибки в имени ключа обнаружатся только в рантайме;
- `commit()` на главном потоке блокирует UI до записи на диск;
- данные не версионируются и не мигрируют автоматически;
- при удалении приложения данные удаляются — это ожидаемо, но иногда путают с «вечным» хранилищем.

Для диагностики блокировок используют `StrictMode`:

```kotlin
StrictMode.setThreadPolicy(
    StrictMode.ThreadPolicy.Builder()
        .detectDiskReads()
        .detectDiskWrites()
        .penaltyLog()
        .build()
)
```

Если в логах появляются `StrictMode policy violation`, значит SharedPreferences (или другой код) трогает диск на главном потоке.

### 1.7. Поддерживаемые типы данных {#podderzhivaemye-tipy-dannyh}

Preferences DataStore и SharedPreferences поддерживают одинаковый набор примитивов:

- `Boolean`
- `Float`
- `Int`
- `Long`
- `Double` (только DataStore; в SharedPreferences нет)
- `String`
- `Set<String>`

Сложные объекты (data class, списки объектов) напрямую хранить нельзя. Варианты:

1. Сериализовать объект в JSON-строку и хранить как `String`:

```kotlin
val json = Json.encodeToString(user)
prefs.edit { it[USER_JSON] = json }
```

2. Использовать Proto DataStore — отдельный вариант DataStore, который хранит типизированные protobuf-объекты. Это следующий шаг после Preferences DataStore, когда настроек много и они структурированы.

3. Хранить сложные данные в Room (база данных), а в настройках держать только идентификаторы.

> [!WARNING]
> **Частая ошибка:** хранить в SharedPreferences/DataStore большие объёмы данных (списки из тысяч элементов, изображения). Для этого используйте файлы или базу данных.

### Практика: SharedPreferences и DataStore

1. Создайте `SettingsRepository` на Preferences DataStore с ключами `user_name` (String) и `dark_mode` (Boolean).
2. Реализуйте чтение `userName` как `Flow<String>` и запись через `suspend`-функцию.
3. Добавьте миграцию со старого SharedPreferences-файла.
4. Прочитайте старый код с `prefs.edit().putString(...).apply()` и перепишите его на DataStore.
5. Включите `StrictMode` и убедитесь, что на главном потоке нет дисковых операций.

### Самопроверка: SharedPreferences и DataStore

- [ ] Понимаю, почему DataStore предпочтительнее SharedPreferences.
- [ ] Умею создавать типизированные ключи `Preferences.Key`.
- [ ] Знаю, как читать данные через `Flow` и писать через `edit`.
- [ ] Могу объяснить разницу `apply` и `commit`.
- [ ] Понимаю, почему SharedPreferences может вызвать ANR.
- [ ] Знаю, какие типы данных поддерживаются и как хранить сложные объекты.

## 2. Files и Storage {#files-i-storage}

Файлы — основной способ хранения больших и бинарных данных: изображения, аудио, кэш ответов сервера, экспортированные документы. Android разделяет хранилище на внутреннее (приватное для приложения) и внешнее (общее или app-specific). С Android 10 действует Scoped Storage, ограничивающий прямой доступ к файлам других приложений.

:::cards
- **Internal storage** — приватные файлы приложения, удаляются при удалении приложения.
- **External storage** — общее хранилище или app-specific директория.
- **filesDir / cacheDir** — базовые директории внутреннего хранилища.
- **Scoped Storage** — модель доступа с Android 10, ограничивает прямой доступ.
- **URI** — адрес ресурса, через который обращаются к файлам.
- **SAF** — стандартный диалог выбора файлов пользователем.
:::

> **Ключевая идея:** для своих данных используйте внутреннее или app-specific внешнее хранилище — разрешения не нужны. К общим файлам обращайтесь через `MediaStore` и SAF.

### 2.1. Internal storage {#internal-storage}

Внутреннее хранилище — директория, привязанная к приложению. Файлы здесь доступны только вашему приложению (и root-пользователю). При удалении приложения данные удаляются. Разрешения не требуются.

Типичные сценарии: базы данных SQLite/Room, SharedPreferences/DataStore, приватные конфиги, кэш, файлы, которые не должны быть видны пользователю или другим приложениям.

Доступ к внутреннему хранилищу:

```kotlin
val file = File(context.filesDir, "notes.txt")
file.writeText("Первая заметка")
val text = file.readText()
```

Внутреннее хранилище ограничено размером, выделенным под приложение. Не храните там гигабайты данных.

### 2.2. App-specific external storage {#app-specific-external-storage}

Android позволяет приложению создавать файлы во внешнем хранилище в своей собственной директории. Эти файлы не требуют разрешений `READ_EXTERNAL_STORAGE`/`WRITE_EXTERNAL_STORAGE` и удаляются при удалении приложения. Другие приложения их не видят (на Android 11+).

Получение директорий:

```kotlin
val filesDir = context.getExternalFilesDir(null) // корень app-specific
val picturesDir = context.getExternalFilesDir(Environment.DIRECTORY_PICTURES)
val downloadsDir = context.getExternalFilesDir(Environment.DIRECTORY_DOWNLOADS)
val cacheDir = context.externalCacheDir
```

Перед использованием проверяйте доступность внешнего хранилища:

```kotlin
if (Environment.getExternalStorageState() == Environment.MEDIA_MOUNTED) {
    // можно писать
}
```

App-specific external storage подходит для больших файлов (видео, архивы), которые не помещаются во внутреннее хранилище, но не должны быть видны в галерее.

### 2.3. filesDir и cacheDir {#filesdir-i-cachedir}

`Context.filesDir` — директория для постоянных файлов приложения внутри внутреннего хранилища. Система не удаляет их автоматически, но пользователь может очистить данные приложения в настройках.

`Context.cacheDir` — директория для временных файлов. Система может удалить их при нехватке места. Не храните там важные данные.

Аналоги для внешнего хранилища: `context.externalCacheDir` и `context.getExternalFilesDir(...)`.

Рекомендации:

- постоянные данные → `filesDir` или `getExternalFilesDir`;
- временные/кэш → `cacheDir` или `externalCacheDir`;
- не смешивайте: очистка кэша не должна удалять пользовательские файлы.

Очистка кэша вручную:

```kotlin
fun clearCache(context: Context) {
    context.cacheDir.deleteRecursively()
    context.externalCacheDir?.deleteRecursively()
}
```

### 2.4. openFileInput и openFileOutput {#openfileinput-i-openfileoutput}

Это старый, но всё ещё рабочий API для работы с файлами внутреннего хранилища. Методы `Context` открывают потоки по имени файла:

```kotlin
// Запись
context.openFileOutput("notes.txt", Context.MODE_PRIVATE).use { output ->
    output.write("Привет, файл".toByteArray())
}

// Чтение
val text = context.openFileInput("notes.txt").use { input ->
    input.readBytes().toString(Charsets.UTF_8)
}
```

Режимы: `MODE_PRIVATE` (по умолчанию и рекомендуется), `MODE_APPEND` (добавление в конец). Другие режимы устарели.

`use` гарантирует закрытие потока. Без него файл может остаться открытым и заблокированным.

### 2.5. FileInputStream и FileOutputStream {#fileinputstream-i-fileoutputstream}

Для работы с произвольными путями используют стандартные потоки Java/Kotlin. Они удобны для копирования, буферизованного чтения, работы с большими файлами:

```kotlin
import java.io.File
import java.io.FileInputStream
import java.io.FileOutputStream

fun copyFile(source: File, target: File) {
    FileInputStream(source).use { input ->
        FileOutputStream(target).use { output ->
            input.copyTo(output, bufferSize = 8192)
        }
    }
}
```

Для текстовых файлов удобнее расширения Kotlin:

```kotlin
File(context.filesDir, "log.txt").appendText("новая строка\n")
val lines = File(context.filesDir, "log.txt").readLines()
```

Для бинарных данных (изображения, архивы) используйте потоки и буферы, а не строковые методы.

### 2.6. Scoped Storage {#scoped-storage}

Scoped Storage — модель доступа к хранилищу, введённая в Android 10 (API 29) и обязательная с Android 11 (API 30). Её цель — защитить данные пользователя: приложение не может произвольно читать/писать чужие файлы во внешнем хранилище.

Ключевые правила:

- приложение имеет прямой доступ только к своей app-specific директории и к файлам, которые оно создало;
- для доступа к медиафайлам (фото, видео, аудио) используют `MediaStore`;
- для доступа к документам других приложений — Storage Access Framework;
- разрешения `READ_EXTERNAL_STORAGE`/`WRITE_EXTERNAL_STORAGE` на Android 11+ не дают полного доступа (только к медиа с учётом области).

Последствия для кода:

- нельзя использовать абсолютные пути вроде `/sdcard/DCIM/...`;
- нельзя через `File` читать чужие файлы;
- нужно работать через `Uri` и `ContentResolver`.

При миграции старого кода, который напрямую обращался к файлам, придётся переписать логику на `MediaStore` или SAF.

### 2.7. URI и ContentResolver (назначение) {#uri-i-contentresolver-naznachenie}

`Uri` — унифицированный адрес ресурса. В Android файлы и данные других приложений адресуются через `content://` URI, а не через пути файловой системы.

```kotlin
val uri: Uri = Uri.parse("content://com.example.provider/files/report.pdf")
```

`ContentResolver` — объект, через который приложение обращается к контент-провайдерам по URI. Он умеет открывать потоки, запрашивать метаданные, вставлять и удалять записи:

```kotlin
val resolver = context.contentResolver

// Открыть поток для чтения
resolver.openInputStream(uri)?.use { input ->
    // прочитать данные
}

// Открыть поток для записи
resolver.openOutputStream(uri)?.use { output ->
    // записать данные
}

// Запросить метаданные
val cursor = resolver.query(uri, null, null, null, null)
```

`ContentResolver` — это шлюз между вашим приложением и данными, принадлежащими системе или другим приложениям. Прямые пути к файлам в Scoped Storage не работают, поэтому `Uri` + `ContentResolver` — основной способ.

### 2.8. Storage Access Framework (базовое понимание) {#storage-access-framework-bazovoe-ponimanie}

Storage Access Framework (SAF) — стандартный механизм Android, позволяющий пользователю выбрать файл или директорию через системный диалог. Приложение получает `Uri` с правами на чтение/запись, не требуя разрешений.

Типичные интенты:

```kotlin
// Выбрать файл для чтения
val openIntent = Intent(Intent.ACTION_OPEN_DOCUMENT).apply {
    addCategory(Intent.CATEGORY_OPENABLE)
    type = "application/pdf"
}

// Создать новый файл
val createIntent = Intent(Intent.ACTION_CREATE_DOCUMENT).apply {
    addCategory(Intent.CATEGORY_OPENABLE)
    type = "text/plain"
    putExtra(Intent.EXTRA_TITLE, "notes.txt")
}

// Выбрать директорию
val treeIntent = Intent(Intent.ACTION_OPEN_DOCUMENT_TREE)
```

Запуск через Activity Result API:

```kotlin
val launcher = registerForActivityResult(
    ActivityResultContracts.StartActivityForResult()
) { result ->
    val uri = result.data?.data
    uri?.let { persistUriPermission(it) }
}

fun persistUriPermission(uri: Uri) {
    val flags = Intent.FLAG_GRANT_READ_URI_PERMISSION or
        Intent.FLAG_GRANT_WRITE_URI_PERMISSION
    context.contentResolver.takePersistableUriPermission(uri, flags)
}
```

`takePersistableUriPermission` сохраняет права на URI между перезапусками приложения — без него доступ пропадёт после закрытия.

SAF — правильный путь, когда приложению нужно работать с файлами пользователя (документы, скачанные архивы), а не со своими внутренними данными.

### Практика: Files и Storage

1. Сохраните текстовую заметку во внутреннее хранилище через `openFileOutput`.
2. Прочитайте её обратно через `openFileInput`.
3. Скопируйте файл из внутреннего хранилища в app-specific внешнее через потоки.
4. Очистите кэш приложения программно.
5. Реализуйте выбор PDF-файла через SAF и прочитайте его содержимое через `ContentResolver`.

### Самопроверка: Files и Storage

- [ ] Понимаю разницу между внутренним и внешним хранилищем.
- [ ] Знаю назначение `filesDir` и `cacheDir`.
- [ ] Умею читать/писать файлы через `openFileInput`/`openFileOutput`.
- [ ] Понимаю, зачем нужен Scoped Storage.
- [ ] Знаю, как получить `Uri` и открыть поток через `ContentResolver`.
- [ ] Понимаю назначение Storage Access Framework.

## 3. SQLite и SQL Basics {#sqlite-i-sql}

SQLite — встроенная реляционная база данных, доступная в Android без отдельного сервера. Она хранит структурированные данные в таблицах и позволяет выполнять запросы на SQL. Понимание SQL необходимо для работы с Room, а также для чтения и отладки данных.

:::cards
- **Реляционная модель** — данные хранятся в таблицах со связями.
- **Таблица** — набор строк и столбцов с фиксированной схемой.
- **Ключ** — идентификатор строки (первичный) или ссылка на другую таблицу (внешний).
- **SQL** — язык запросов: SELECT, INSERT, UPDATE, DELETE.
- **Транзакция** — группа операций, выполняемых атомарно.
:::

> **Ключевая идея:** SQL описывает *что* нужно получить или изменить, а не *как*. База данных сама выбирает способ выполнения.

### 3.1. Реляционная модель данных {#relatsionnaya-model-dannyh}

Реляционная модель организует данные в таблицы (отношения). Каждая таблица описывает один тип сущностей: пользователи, заказы, товары. Связи между сущностями выражаются через ключи, а не через вложенность.

Преимущества:

- данные не дублируются: пользователь хранится один раз, а заказы ссылаются на него;
- целостность: внешние ключи запрещают ссылки на несуществующие записи;
- гибкие запросы: можно объединять таблицы и фильтровать по любым полям;
- транзакции: несколько изменений применяются атомарно.

В Android SQLite реализует реляционную модель локально. Нет сервера, нет сети — база живёт в файле внутри приложения.

### 3.2. Таблицы, строки и столбцы {#tablicy-stroki-i-stolbcy}

Таблица состоит из строк (записей) и столбцов (полей). Схема таблицы фиксирована: у каждого столбца есть имя и тип.

Создание таблицы:

```sql
CREATE TABLE users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    email TEXT UNIQUE,
    age INTEGER,
    created_at INTEGER NOT NULL
);
```

Типы SQLite (динамическая типизация, но рекомендуется объявлять):

- `INTEGER` — целые числа;
- `REAL` — числа с плавающей точкой;
- `TEXT` — строки;
- `BLOB` — бинарные данные;
- `NULL` — отсутствие значения.

Вставка строки:

```sql
INSERT INTO users (name, email, age, created_at)
VALUES ('Анна', 'anna@example.com', 25, 1700000000);
```

Каждая строка таблицы уникально идентифицируется первичным ключом.

### 3.3. Первичный и внешний ключ {#pervichnyy-i-vneshniy-klyuch}

Первичный ключ (`PRIMARY KEY`) — столбец (или набор столбцов), уникально идентифицирующий строку. В Android чаще всего используют `INTEGER PRIMARY KEY AUTOINCREMENT`.

Внешний ключ (`FOREIGN KEY`) — столбец, ссылающийся на первичный ключ другой таблицы. Он выражает связь «многие к одному».

```sql
CREATE TABLE orders (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id INTEGER NOT NULL,
    total REAL NOT NULL,
    status TEXT NOT NULL,
    FOREIGN KEY (user_id) REFERENCES users(id)
        ON DELETE CASCADE
);
```

`ON DELETE CASCADE` означает: при удалении пользователя удалятся и его заказы. Другие варианты: `SET NULL`, `RESTRICT`, `NO ACTION`.

Включение проверки внешних ключей в SQLite:

```sql
PRAGMA foreign_keys = ON;
```

Без этой команды SQLite не проверяет внешние ключи по умолчанию — частая причина «тихих» ошибок целостности.

### 3.4. SELECT и WHERE {#select-i-where}

`SELECT` извлекает данные. `WHERE` фильтрует строки по условию.

```sql
-- Все пользователи
SELECT id, name, email FROM users;

-- С фильтром
SELECT name, email FROM users WHERE age >= 18;

-- Несколько условий
SELECT * FROM users
WHERE age BETWEEN 18 AND 30
  AND email LIKE '%@example.com';

-- Поиск по шаблону
SELECT * FROM users WHERE name LIKE 'А%';

-- Проверка на NULL
SELECT * FROM users WHERE email IS NULL;
```

Операторы: `=`, `<>`, `<`, `>`, `<=`, `>=`, `BETWEEN`, `LIKE`, `IN`, `IS NULL`, `AND`, `OR`, `NOT`.

`SELECT DISTINCT` убирает дубликаты:

```sql
SELECT DISTINCT status FROM orders;
```

### 3.5. INSERT, UPDATE и DELETE {#insert-update-i-delete}

`INSERT` добавляет строку:

```sql
INSERT INTO users (name, email, age, created_at)
VALUES ('Иван', 'ivan@example.com', 30, 1700000001);
```

`INSERT OR REPLACE` (upsert) — вставить или заменить существующую строку по ключу:

```sql
INSERT OR REPLACE INTO users (id, name, email, age, created_at)
VALUES (1, 'Иван Петров', 'ivan@example.com', 31, 1700000002);
```

`UPDATE` изменяет существующие строки:

```sql
UPDATE users
SET age = 31, email = 'ivan.petrov@example.com'
WHERE id = 1;
```

Без `WHERE` обновятся все строки — частая ошибка.

`DELETE` удаляет строки:

```sql
DELETE FROM users WHERE id = 1;

-- Удалить всё (но таблица останется)
DELETE FROM users;
```

### 3.6. ORDER BY и LIMIT {#order-by-i-limit}

`ORDER BY` сортирует результат:

```sql
SELECT name, age FROM users
ORDER BY age DESC, name ASC;
```

`LIMIT` ограничивает количество строк, `OFFSET` пропускает первые N:

```sql
-- Топ-10 самых молодых
SELECT name, age FROM users
ORDER BY age ASC
LIMIT 10;

-- Вторая страница по 10 записей
SELECT name, age FROM users
ORDER BY id ASC
LIMIT 10 OFFSET 10;
```

Комбинация `ORDER BY` + `LIMIT` — основа пагинации. В Android для больших списков используют Paging 3, который генерирует такие запросы автоматически.

### 3.7. JOIN (назначение и базовое применение) {#join-naznachenie-i-bazovoe-primenenie}

`JOIN` объединяет строки из нескольких таблиц по условию связи. Основные виды:

- `INNER JOIN` — только строки, для которых есть совпадение в обеих таблицах;
- `LEFT JOIN` — все строки из левой таблицы плюс совпадения из правой (NULL, если нет);
- `CROSS JOIN` — декартово произведение (редко нужен).

Пример: получить заказы с именами пользователей:

```sql
SELECT orders.id, users.name, orders.total, orders.status
FROM orders
INNER JOIN users ON orders.user_id = users.id
WHERE orders.status = 'paid';
```

`LEFT JOIN` полезен, когда нужно показать всех пользователей, даже без заказов:

```sql
SELECT users.name, COUNT(orders.id) AS order_count
FROM users
LEFT JOIN orders ON users.id = orders.user_id
GROUP BY users.id;
```

JOIN позволяет не дублировать данные и получать связанные сущности одним запросом.

### 3.8. Транзакции (назначение) {#transaktsii-naznachenie}

Транзакция — группа SQL-операций, которая применяется атомарно: либо все изменения сохраняются, либо ни одно. Это защищает данные при ошибках и параллельном доступе.

```sql
BEGIN TRANSACTION;

UPDATE accounts SET balance = balance - 100 WHERE id = 1;
UPDATE accounts SET balance = balance + 100 WHERE id = 2;

COMMIT;
```

Если между `BEGIN` и `COMMIT` произойдёт ошибка, вызывают `ROLLBACK` — все изменения отменяются.

В Android транзакции используются в Room (аннотация `@Transaction`) и при прямой работе с `SQLiteDatabase`. Типичный сценарий: перенос средств между счетами, массовое обновление кэша, импорт данных.

Свойства ACID:

- **Atomicity** — атомарность: всё или ничего;
- **Consistency** — согласованность: данные остаются валидными;
- **Isolation** — изоляция: параллельные транзакции не мешают друг другу;
- **Durability** — долговечность: после COMMIT данные сохранены.

> [!WARNING]
> **Частая ошибка:** выполнять несколько связанных `INSERT`/`UPDATE` без транзакции. При сбое на середине данные окажутся в несогласованном состоянии.

### Практика: SQLite и SQL

1. Создайте таблицы `users` и `orders` с внешним ключом.
2. Вставьте несколько пользователей и заказов.
3. Напишите запрос: заказы со статусом `paid` с именем пользователя, отсортированные по сумме.
4. Оберните перевод средств между двумя счетами в транзакцию.
5. Проверьте, что внешние ключи включены (`PRAGMA foreign_keys`).

### Самопроверка: SQLite и SQL

- [ ] Понимаю реляционную модель и связи между таблицами.
- [ ] Умею создавать таблицы с первичным и внешним ключом.
- [ ] Пишу SELECT с WHERE, ORDER BY, LIMIT.
- [ ] Знаю разницу между INSERT, UPDATE, DELETE.
- [ ] Понимаю INNER JOIN и LEFT JOIN.
- [ ] Объясняю назначение транзакций и ACID.

## 4. Room Basics {#room-basics}

Room — библиотека Jetpack, которая оборачивает SQLite и даёт типобезопасный доступ к базе данных из Kotlin. Она проверяет SQL-запросы на этапе компиляции, генерирует шаблонный код и интегрируется с корутинами и Flow. Room — стандартный способ работы с локальной базой данных в современных Android-приложениях.

:::cards
- **@Entity** — класс, описывающий таблицу.
- **@PrimaryKey** — поле, уникально идентифицирующее строку.
- **@Dao** — интерфейс с методами доступа к данным.
- **@Query** — SQL-запрос, привязанный к методу.
- **@Database** — класс базы данных, объединяющий сущности и DAO.
- **Flow / suspend** — асинхронное получение данных.
:::

> **Ключевая идея:** Room генерирует реализацию DAO на этапе компиляции. Вы пишете интерфейс и SQL, Room пишет остальное.

### 4.1. @Entity {#entity}

`@Entity` помечает data class как таблицу базы данных. Каждое поле класса становится столбцом:

```kotlin
import androidx.room.Entity
import androidx.room.PrimaryKey

@Entity(tableName = "users")
data class User(
    @PrimaryKey val id: Long,
    val name: String,
    val email: String,
    val age: Int
)
```

Если `tableName` не указан, используется имя класса. Поля могут иметь значения по умолчанию. Вложенные объекты требуют `@Embedded` или отдельной таблицы.

Индексы и уникальность задаются через параметры `@Entity`:

```kotlin
@Entity(
    tableName = "users",
    indices = [Index(value = ["email"], unique = true)]
)
data class User(...)
```

### 4.2. @PrimaryKey {#primarykey}

`@PrimaryKey` отмечает поле первичного ключа. Часто ключ генерируется автоматически:

```kotlin
@Entity
data class User(
    @PrimaryKey(autoGenerate = true) val id: Long = 0,
    val name: String
)
```

`autoGenerate = true` создаёт `INTEGER PRIMARY KEY AUTOINCREMENT` в SQLite. При вставке передавайте `id = 0` (или не передавайте, если значение по умолчанию), Room подставит сгенерированное значение.

Составной ключ задаётся на уровне `@Entity`:

```kotlin
@Entity(primaryKeys = ["userId", "courseId"])
data class Enrollment(
    val userId: Long,
    val courseId: Long,
    val enrolledAt: Long
)
```

### 4.3. @Dao {#dao}

DAO (Data Access Object) — интерфейс, описывающий операции с таблицей. Room генерирует реализацию на этапе компиляции:

```kotlin
import androidx.room.Dao

@Dao
interface UserDao {
    @Query("SELECT * FROM users")
    fun getAll(): Flow<List<User>>

    @Query("SELECT * FROM users WHERE id = :id")
    suspend fun getById(id: Long): User?

    @Insert
    suspend fun insert(user: User): Long

    @Update
    suspend fun update(user: User)

    @Delete
    suspend fun delete(user: User)
}
```

DAO может быть интерфейсом или абстрактным классом. Методы могут быть `suspend` (для разовых операций) или возвращать `Flow` (для реактивного наблюдения).

### 4.4. @Query {#query}

`@Query` привязывает SQL-запрос к методу. Room проверяет запрос на этапе компиляции: если таблица или столбец не существует, сборка упадёт.

```kotlin
@Dao
interface UserDao {
    @Query("SELECT * FROM users ORDER BY name ASC")
    fun getAllSorted(): Flow<List<User>>

    @Query("SELECT * FROM users WHERE age >= :minAge")
    fun getUsersOlderThan(minAge: Int): Flow<List<User>>

    @Query("SELECT COUNT(*) FROM users")
    suspend fun count(): Int

    @Query("DELETE FROM users WHERE age < :minAge")
    suspend fun deleteYoungerThan(minAge: Int): Int
}
```

Параметры метода подставляются в запрос через `:paramName`. Поддерживаются примитивы, списки (для `IN (:ids)`), и объекты с `@Embedded`.

Возвращаемые типы: `List<T>`, `T?`, `Flow<List<T>>`, `Flow<T?>`, `LiveData`, `Cursor`, примитивы.

### 4.5. @Insert, @Update и @Delete {#insert-update-i-delete-room}

Эти аннотации генерируют SQL автоматически — писать запрос не нужно.

`@Insert`:

```kotlin
@Insert
suspend fun insert(user: User): Long // возвращает rowId

@Insert
suspend fun insertAll(users: List<User>): List<Long>

@Insert(onConflict = OnConflictStrategy.REPLACE)
suspend fun upsert(user: User)
```

Стратегии конфликта: `ABORT` (по умолчанию, ошибка), `REPLACE` (заменить), `IGNORE` (пропустить), `ROLLBACK`.

`@Update`:

```kotlin
@Update
suspend fun update(user: User): Int // количество изменённых строк
```

Обновляет строку по первичному ключу. Если объект изменился частично, обновятся все поля.

`@Delete`:

```kotlin
@Delete
suspend fun delete(user: User): Int
```

Удаляет строку по первичному ключу.

### 4.6. @Database {#database}

Класс базы данных объединяет сущности и DAO. Он абстрактный и наследует `RoomDatabase`:

```kotlin
import androidx.room.Database
import androidx.room.RoomDatabase

@Database(
    entities = [User::class, Order::class],
    version = 1,
    exportSchema = true
)
abstract class AppDatabase : RoomDatabase() {
    abstract fun userDao(): UserDao
    abstract fun orderDao(): OrderDao
}
```

Создание экземпляра (обычно через DI, один на приложение):

```kotlin
val db = Room.databaseBuilder(
    context.applicationContext,
    AppDatabase::class.java,
    "app.db"
).build()
```

`exportSchema = true` включает экспорт схемы в JSON — полезно для миграций и код-ревью, но файл реально пишется только при настроенном `room.schemaLocation` (или Room Gradle plugin); без этой настройки флаг ничего не сохраняет. Файлы схемы хранятся в `schemas/`.

Базу данных создают один раз и переиспользуют. Не создавайте её в каждом Activity.

### 4.7. Получение данных через suspend и Flow (базовое понимание) {#poluchenie-dannyh-cherez-suspend-i-flow-bazovoe-ponimanie}

Room поддерживает два стиля работы:

1. Разовые операции — `suspend`-функции. Вызываются из корутины, возвращают результат один раз:

```kotlin
suspend fun loadUser(id: Long): User? = userDao.getById(id)
```

2. Реактивное наблюдение — `Flow`. Room автоматически переэмитит данные при изменении таблицы:

```kotlin
fun observeUsers(): Flow<List<User>> = userDao.getAll()

// В ViewModel
val users: StateFlow<List<User>> = userDao.getAll()
    .stateIn(viewModelScope, SharingStarted.WhileSubscribed(5000), emptyList())
```

Flow-запросы Room выполняются на фоновом потоке (I/O dispatcher) автоматически. `suspend`-запросы тоже не блокируют вызывающий поток, если вызваны из корутины.

Выбор:

- нужны актуальные данные в UI → `Flow`;
- разовое действие (вставка, удаление, проверка) → `suspend`.

### 4.8. Версионирование базы данных {#versionirovanie-bazy-dannyh}

Поле `version` в `@Database` — номер версии схемы. При изменении структуры (добавление таблицы, столбца) увеличивайте версию:

```kotlin
@Database(
    entities = [User::class, Order::class, Tag::class],
    version = 2
)
abstract class AppDatabase : RoomDatabase() { ... }
```

При увеличении версии Room ожидает миграцию. Без неё приложение упадёт с `IllegalStateException` при открытии базы (если не использовать `fallbackToDestructiveMigration`).

Правила:

- увеличивайте версию при любом изменении схемы;
- не меняйте версию «просто так»;
- храните историю миграций в коде;
- экспортируйте схемы (`exportSchema = true`) для сравнения.

### 4.9. Назначение миграций {#naznachenie-migratsiy}

Миграция — код, который переводит базу данных с одной версии схемы на другую без потери данных пользователя. В Room миграция описывается как `Migration(startVersion, endVersion)`:

```kotlin
val MIGRATION_1_2 = object : Migration(1, 2) {
    override fun migrate(db: SupportSQLiteDatabase) {
        db.execSQL(
            "ALTER TABLE users ADD COLUMN phone TEXT"
        )
    }
}

val db = Room.databaseBuilder(context, AppDatabase::class.java, "app.db")
    .addMigrations(MIGRATION_1_2)
    .build()
```

Если миграции нет и версия выросла, Room бросит исключение. Альтернатива — `fallbackToDestructiveMigration()`: база пересоздаётся с нуля, данные теряются. Допустимо для кэша, недопустимо для пользовательских данных.

Сложные миграции (переименование таблицы, изменение типа столбца) требуют создания новой таблицы, копирования данных и удаления старой:

```kotlin
override fun migrate(db: SupportSQLiteDatabase) {
    db.execSQL("CREATE TABLE users_new (...)")
    db.execSQL("INSERT INTO users_new (...) SELECT ... FROM users")
    db.execSQL("DROP TABLE users")
    db.execSQL("ALTER TABLE users_new RENAME TO users")
}
```

> [!WARNING]
> **Частая ошибка:** использовать `fallbackToDestructiveMigration` в продакшене для базы с пользовательскими данными. Пользователь потеряет всё при обновлении приложения.

### Практика: Room Basics

1. Создайте `@Entity User` с автогенерируемым `id`.
2. Опишите `UserDao` с методами: получить всех (Flow), найти по id (suspend), вставить, обновить, удалить.
3. Создайте `AppDatabase` версии 1.
4. Добавьте второй `@Entity Tag` и миграцию 1→2, добавляющую таблицу.
5. Подключите базу через DI и прочитайте список пользователей в ViewModel как `StateFlow`.

### Самопроверка: Room Basics

- [ ] Понимаю назначение `@Entity`, `@PrimaryKey`, `@Dao`, `@Query`, `@Database`.
- [ ] Умею описать CRUD-методы через аннотации.
- [ ] Знаю разницу между `suspend` и `Flow` в DAO.
- [ ] Понимаю, зачем нужна версия базы данных.
- [ ] Могу написать простую миграцию через `Migration`.
- [ ] Знаю последствия `fallbackToDestructiveMigration`.

## 5. JSON и Serialization {#json-i-serialization}

JSON (JavaScript Object Notation) — текстовый формат обмена данными, который стал де-факто стандартом для REST API. Он лёгкий, читается человеком и поддерживается всеми языками и платформами. В Android данные с сервера приходят именно в JSON, и задача приложения — превратить этот текст в Kotlin-объекты (десериализация) и, при отправке на сервер, собрать объекты обратно в текст (сериализация). Ошибки на этом этапе — одна из частых причин крашей в продакшене: опечатка в имени поля, несовпадение типов, внезапный null.

:::cards
- **Формат** — текст, набор пар «ключ-значение» и массивов; легко читать и отлаживать.
- **Сериализация** — превращение Kotlin-объекта в JSON-строку для отправки.
- **Десериализация** — разбор JSON-строки в Kotlin-объект.
- **Gson** — legacy-библиотека от Google, работает через рефлексию.
- **Kotlinx Serialization** — рекомендуемый вариант, кодогенерация, null-safety.
- **Контракт** — имена полей и типы должны совпадать с тем, что присылает сервер.
:::

> **Ключевая идея:** JSON — это просто текст. Библиотека сериализации — мост между текстом и типобезопасными Kotlin-объектами. Выбирайте Kotlinx Serialization для новых проектов и оставляйте Gson только для поддержки legacy-кода.

### Структура JSON {#json-structure}

JSON состоит из двух базовых конструкций: объекта (набор пар «ключ: значение» в фигурных скобках) и массива (упорядоченный список значений в квадратных скобках). Значением может быть строка, число, булево значение, null, объект или массив. Ключи всегда строки в двойных кавычках. Комментарии в JSON не поддерживаются — это частая ловушка при ручном редактировании конфигов.

```json
{
  "id": 42,
  "name": "Алексей",
  "active": true,
  "rating": 4.5,
  "tags": ["android", "kotlin"],
  "profile": {
    "city": "Москва",
    "age": null
  }
}
```

Важные правила: запятые стоят между элементами, но не после последнего; строковые значения только в двойных кавычках (одинарные недопустимы); числа без кавычек. При парсинге любое нарушение синтаксиса приводит к ошибке — библиотека не «догадается», что вы имели в виду.

### JSON Object и JSON Array {#json-object-array}

JSON Object — неупорядоченная коллекция пар «ключ: значение», аналог Kotlin `Map<String, Any?>` или data class. JSON Array — упорядоченный список, аналог `List`. При десериализации объект маппится на класс с полями, массив — на `List<T>` или `Array<T>`.

Различие важно для моделирования: один пользователь — объект, список пользователей — массив объектов. Если сервер возвращает объект там, где ожидался массив (или наоборот), парсер бросит исключение. Поэтому всегда сверяйтесь с реальным ответом сервера, а не с документацией, которая может устареть.

```text
// объект
{ "id": 1, "title": "Kotlin" }

// массив объектов
[
  { "id": 1, "title": "Kotlin" },
  { "id": 2, "title": "Android" }
]

// массив примитивов
["kotlin", "java", "xml"]
```

Типичная ошибка — попытаться распарсить массив как один объект: `{"error":"not found"}` вместо `[]`. Проверяйте, что именно возвращает эндпоинт, особенно для пустых результатов.

### Сериализация и десериализация {#serialization-deserialization}

Сериализация — преобразование Kotlin-объекта в строку JSON. Десериализация — обратный процесс: строка JSON → объект. Библиотека использует метаданные класса (поля, типы, аннотации) для сопоставления.

```kotlin
// десериализация
val user: User = json.decodeFromString(jsonString)

// сериализация
val text: String = json.encodeToString(user)
```

Важно разделять два потока: входящие данные (ответ сервера) десериализуются, исходящие (тело запроса) сериализуются. Ошибки часто возникают при смешении: например, поле, которое сервер возвращает, но не принимает при создании, попадает в запрос и вызывает 400. Модели для чтения и записи иногда разделяют (Request/Response DTO).

### Gson Basics {#gson-basics}

Gson — библиотека Google, долгое время стандарт для Android. Работает через рефлексию: читает поля класса во время выполнения, не требует кодогенерации. Подключается одной зависимостью, прост в использовании.

```kotlin
val gson = Gson()
val user = gson.fromJson(jsonString, User::class.java)
val text = gson.toJson(user)
```

Плюсы Gson: минимум настройки, работает с любыми классами, включая без аннотаций. Минусы: рефлексия медленнее кодогенерации; хуже работает с Kotlin-null-safety (поля могут оказаться null без предупреждения компилятора); не поддерживает data class-конструкторы с значениями по умолчанию без дополнительных адаптеров; проблемы с ProGuard/R8 (нужны keep-правила). В новых проектах Gson считается legacy-вариантом.

### Kotlinx Serialization Basics {#kotlinx-serialization-basics}

Kotlinx Serialization — официальная библиотека JetBrains/Kotlin. Работает через кодогенерацию на этапе компиляции: компилятор генерирует сериализаторы для классов, помеченных `@Serializable`. Это быстрее рефлексии, типобезопасно и дружелюбно к R8.

```kotlin
@Serializable
data class User(
    val id: Int,
    val name: String
)

val json = Json { ignoreUnknownKeys = true }
val user = json.decodeFromString<User>(jsonString)
val text = json.encodeToString(user)
```

Класс должен быть помечен `@Serializable`, иначе компилятор не сгенерирует сериализатор. Поддерживаются значения по умолчанию, sealed-классы, полиморфизм, кастомные сериализаторы. Для Android подключается плагин Kotlin Serialization в Gradle.

### Аннотации сериализации {#serialization-annotations}

Аннотации управляют тем, как поля маппятся между Kotlin и JSON. Основные:

- `@SerialName("user_name")` — задаёт имя поля в JSON, отличное от имени свойства Kotlin.
- `@Serializable` — помечает класс как сериализуемый.
- `@Transient` — поле не участвует в сериализации.
- `@Optional` — experimental-аннотация; она не заменяет значение по умолчанию, поэтому отсутствующее необязательное поле объявляйте nullable и задавайте ему default.

```kotlin
@Serializable
data class User(
    @SerialName("user_id") val id: Int,
    val name: String,
    val email: String? = null,
    @Transient val cachedAt: Long = 0L
)
```

Имена полей на сервере часто в snake_case, а в Kotlin принято camelCase. `@SerialName` решает это без переименования свойств. Без него поле `userName` будет искать ключ `userName` в JSON и не найдёт `user_name`.

### Nullable и отсутствующие поля {#json-nullable-missing}

API часто возвращает не все поля или возвращает null. Модель должна это отражать: nullable-типы (`String?`) для полей, которые могут отсутствовать или быть null. Значения по умолчанию спасают от отсутствующих полей.

```kotlin
@Serializable
data class Profile(
    val id: Int,
    val name: String,
    val avatarUrl: String? = null,
    val bio: String = ""
)
```

Различайте «поле отсутствует» и «поле равно null»: оба случая Kotlinx Serialization обрабатывает корректно, если тип nullable или есть default. Если поле non-null без default и его нет в JSON — будет ошибка парсинга. Не делайте все поля nullable «на всякий случай»: это убивает типобезопасность и переносит проверки в runtime.

### Обработка ошибок парсинга {#json-parse-errors}

Парсинг внешних данных всегда может завершиться ошибкой: неверный JSON, несовпадение типов, отсутствие обязательного поля. Оборачивайте парсинг в `try/catch` или `runCatching` и возвращайте понятный результат.

```kotlin
fun parseUser(jsonString: String): Result<User> = runCatching {
    json.decodeFromString<User>(jsonString)
}
```

Типичные ошибки: `SerializationException` (несовпадение структуры), `JsonDecodingException` (синтаксис JSON), `IllegalArgumentException` при null в non-null поле. Логируйте исходный текст при ошибке (без чувствительных данных) — это сильно упрощает отладку. Не глотайте исключения молча: как минимум покажите пользователю сообщение и отправьте отчёт в краш-репортинг.

**Самопроверка:**
- [ ] Чем объект отличается от массива в JSON?
- [ ] Зачем нужен `@SerialName`?
- [ ] Как обработать отсутствующее поле?
- [ ] Почему Kotlinx Serialization предпочтительнее Gson в новых проектах?
- [ ] Как безопасно распарсить JSON и не упасть?

## 6. HTTP и REST Basics {#http-i-rest}

HTTP (HyperText Transfer Protocol) — протокол прикладного уровня для обмена данными между клиентом и сервером. REST (Representational State Transfer) — архитектурный стиль, использующий HTTP для работы с ресурсами. Понимание HTTP — фундамент сетевого слоя любого Android-приложения: без него невозможно правильно использовать Retrofit, OkHttp, диагностировать ошибки и общаться с бэкендом.

:::cards
- **Клиент-сервер** — клиент запрашивает, сервер отвечает.
- **Запрос/ответ** — структурированные сообщения со статусом и телом.
- **Методы** — GET, POST, PUT, PATCH, DELETE описывают действие.
- **Статусы** — 2xx успех, 4xx ошибка клиента, 5xx ошибка сервера.
- **REST** — ресурсы, адресуемые URL, операции через HTTP-методы.
- **HTTPS** — HTTP поверх TLS, шифрование и проверка подлинности.
:::

> **Ключевая идея:** HTTP — это просто текстовый диалог «запрос-ответ». REST накладывает на этот диалог правила: ресурсы имеют адреса (URL), а действия выражаются методами. Поняв этот диалог, вы понимаете любой API.

### Клиент-серверная модель {#client-server-model}

В клиент-серверной модели есть две стороны: клиент (ваше Android-приложение) инициирует запрос, сервер его обрабатывает и возвращает ответ. Сервер не «знает» о клиенте между запросами — HTTP по своей природе stateless: каждый запрос независим. Состояние (сессия, токен) передаётся в каждом запросе, чаще всего в заголовках.

Клиент может быть браузером, мобильным приложением, другим сервером. Сервер — любая программа, слушающая порт и отвечающая по протоколу. В Android клиентом выступает OkHttp/Retrofit, который открывает TCP-соединение, отправляет текст запроса и читает ответ.

### HTTP request и response {#http-request-response}

HTTP-сообщение состоит из стартовой строки, заголовков и тела. Запрос: метод + путь + версия протокола, затем заголовки, пустая строка, тело. Ответ: версия + статус-код + причина, заголовки, пустая строка, тело.

```text
GET /users/42 HTTP/1.1
Host: api.example.com
Accept: application/json
Authorization: Bearer <token>

HTTP/1.1 200 OK
Content-Type: application/json
Content-Length: 58

{"id":42,"name":"Алексей"}
```

Заголовки и тело разделяются пустой строкой — это важно при ручном разборе. Тело может быть пустым (например, для GET или 204 No Content).

### HTTP methods {#http-methods}

Метод указывает, что клиент хочет сделать с ресурсом:

- `GET` — получить ресурс (без тела запроса).
- `POST` — создать новый ресурс.
- `PUT` — полностью заменить ресурс.
- `PATCH` — частично обновить ресурс.
- `DELETE` — удалить ресурс.

Семантика методов важна: GET должен быть безопасным (не менять состояние) и идемпотентным; PUT и DELETE — идемпотентны. Неправильный выбор метода приводит к неожиданному поведению кэшей и прокси. На практике PUT и PATCH часто путают: PUT требует полное тело, PATCH — только изменяемые поля.

### HTTP status codes {#http-status-codes}

Статус-код — трёхзначное число в ответе, описывающее результат:

- `2xx` — успех: `200 OK`, `201 Created`, `204 No Content`.
- `3xx` — перенаправление: `301`, `302`, `304 Not Modified`.
- `4xx` — ошибка клиента: `400 Bad Request`, `401 Unauthorized`, `403 Forbidden`, `404 Not Found`, `422 Unprocessable Entity`, `429 Too Many Requests`.
- `5xx` — ошибка сервера: `500 Internal Server Error`, `502 Bad Gateway`, `503 Service Unavailable`.

Клиент должен реагировать по-разному: 401 — обновить токен/разлогинить, 404 — показать «не найдено», 5xx — предложить повторить. Не сводите все ошибки к «что-то пошло не так» — пользователь и отладка потеряют информацию.

### URL, path и query parameters {#url-path-query}

URL состоит из схемы, хоста, пути и query-строки: `https://api.example.com/users/42?include=profile&lang=ru`. Path-параметры (`/users/42`) идентифицируют ресурс; query-параметры (`?include=profile`) уточняют запрос (фильтрация, сортировка, пагинация).

Кодировать значения нужно через `URLEncoder` или доверять Retrofit/OkHttp, который кодирует автоматически. Ручная конкатенация строк с параметрами — источник багов с пробелами и спецсимволами.

### HTTP headers {#http-headers}

Заголовки — метаданные запроса/ответа. Ключевые для Android:

- `Content-Type` — формат тела (`application/json`).
- `Accept` — желаемый формат ответа.
- `Authorization` — токен (`Bearer <token>`).
- `Cache-Control` — правила кэширования.
- `User-Agent` — идентификация клиента.

Заголовки регистронезависимы по спецификации, но принято писать в Camel-Case. В OkHttp заголовки добавляются через `addHeader`/`header`; Retrofit — через `@Header` или interceptor.

### Request body и response body {#request-response-body}

Тело запроса несёт данные для POST/PUT/PATCH: обычно JSON. Тело ответа — данные от сервера. Тип контента согласуется через `Content-Type`/`Accept`. Размер тела влияет на трафик и батарею — не передавайте лишние поля.

Пустое тело (204 No Content) часто возвращается при DELETE. Парсер должен уметь обработать пустой ответ, иначе упадёт на пустой строке.

### REST API и ресурсы {#rest-api-resources}

REST строится вокруг ресурсов: `/users`, `/users/42`, `/users/42/orders`. URL идентифицирует ресурс, метод — действие. Ответы обычно JSON. Хороший API предсказуем: имена ресурсов во множественном числе, вложенность отражает связи.

Stateless-подход: сервер не хранит состояние клиента между запросами; аутентификация через токен в каждом запросе. Это упрощает масштабирование и кэширование.

### HTTPS и отличие от HTTP {#https}

HTTPS — HTTP поверх TLS. TLS шифрует трафик и проверяет подлинность сервера через сертификаты. В Android по умолчанию разрешены только HTTPS-соединения (cleartext отключён с Android 9). HTTP без шифрования передаёт данные открыто — любой в сети может их прочитать.

Для разработки иногда нужен HTTP (локальный сервер): разрешается через `network_security_config.xml` или `android:usesCleartextTraffic`. В продакшене — только HTTPS. Никогда не отключайте проверку сертификатов в продакшене (не используйте TrustAllCerts).

Типичные ошибки HTTP-слоя: считать любой не-2xx ответ «сетевой ошибкой» и показывать «нет интернета»; не обрабатывать 401 (токен устарел) и 429 (лимит запросов); строить URL конкатенацией строк без кодирования; игнорировать `Content-Type` и парсить ответ как текст; включать cleartext в релизной сборке. Помните, что HTTP stateless: сервер не помнит предыдущие запросы, поэтому токен/сессия передаются каждый раз в заголовках. Соединения переиспользуются через keep-alive и HTTP/2, что экономит батарею и время — OkHttp делает это автоматически.

**Самопроверка:**
- [ ] Чем GET отличается от POST?
- [ ] Что означает статус 401 и как на него реагировать?
- [ ] Чем path-параметр отличается от query-параметра?
- [ ] Зачем нужен HTTPS?
- [ ] Какие заголовки важны для JSON API?

## 7. Retrofit Basics {#retrofit-basics}

Retrofit — типобезопасный HTTP-клиент для Android/JVM от Square. Вы описываете API как Kotlin-интерфейс с аннотациями, а Retrofit генерирует реализацию, выполняющую запросы через OkHttp. Вместе с Kotlinx Serialization и корутинами это стандартный стек сетевого слоя современного Android-приложения.

:::cards
- **Интерфейс** — вы описываете методы и аннотации, Retrofit делает реализацию.
- **Аннотации** — @GET, @POST, @Path, @Query, @Body описывают запрос.
- **suspend** — запросы как корутины, без коллбэков.
- **Converter** — превращает JSON в Kotlin-объекты.
- **OkHttpClient** — транспорт, таймауты, логирование, интерсепторы.
- **Response** — обёртка с кодом, заголовками и телом.
:::

> **Ключевая идея:** Retrofit не выполняет сетевые запросы сам — он строит запрос и делегирует OkHttp. Ваша задача — описать контракт API интерфейсом и правильно обработать результат.

### Retrofit builder {#retrofit-builder}

Retrofit создаётся через builder: указываете базовый URL и converter factory. Базовый URL должен заканчиваться на `/`.

```kotlin
val retrofit = Retrofit.Builder()
    .baseUrl("https://api.example.com/")
    .addConverterFactory(Json.asConverterFactory("application/json".toMediaType()))
    .client(okHttpClient)
    .build()
```

`baseUrl` — корень всех эндпоинтов. Если эндпоинт начинается с `/`, он заменяет путь базового URL; если без `/` — дописывается. Это частый источник багов: `baseUrl("https://api.example.com/v1")` без завершающего слэша Retrofit не примет — он бросит `IllegalArgumentException`, поэтому корректно писать `https://api.example.com/v1/`.

### Создание API interface {#retrofit-api-interface}

API описывается интерфейсом. Каждый метод — один эндпоинт. Retrofit генерирует реализацию через динамический прокси.

```kotlin
interface UserApi {
    @GET("users/{id}")
    suspend fun getUser(@Path("id") id: Int): User

    @GET("users")
    suspend fun getUsers(@Query("page") page: Int): List<User>
}
```

Интерфейс получают через `retrofit.create(UserApi::class.java)`. Не создавайте реализацию руками. Держите интерфейсы узкими: один интерфейс — одна группа эндпоинтов (Users, Orders). Это упрощает тестирование и мокирование.

### @GET и @POST {#retrofit-get-post}

`@GET` и `@POST` задают HTTP-метод и относительный путь. Есть также `@PUT`, `@PATCH`, `@DELETE`, `@HEAD`, `@OPTIONS`.

```kotlin
@GET("users")
suspend fun getUsers(): List<User>

@POST("users")
suspend fun createUser(@Body user: CreateUserRequest): User
```

Путь может содержать параметры в фигурных скобках (`{id}`), которые заполняются через `@Path`. Относительный путь не должен начинаться со слэша, иначе базовый URL будет проигнорирован.

### @Path и @Query {#retrofit-path-query}

`@Path` подставляет значение в путь URL. `@Query` добавляет query-параметр. Несколько `@Query` объединяются в query-строку.

```kotlin
@GET("users/{id}/orders")
suspend fun getOrders(
    @Path("id") userId: Int,
    @Query("status") status: String?,
    @Query("page") page: Int = 1
): List<Order>
```

Nullable-параметр с null не добавляется в URL. Значения по умолчанию позволяют не передавать параметр. Для списков используйте `@QueryMap` или повторяющиеся `@Query`.

### @Body {#retrofit-body}

`@Body` помечает параметр, который сериализуется в тело запроса. Обычно это DTO. Тип контента определяется converter'ом (по умолчанию JSON).

```kotlin
@POST("users")
suspend fun createUser(@Body request: CreateUserRequest): User
```

Тело может быть только одно. Для multipart/form-data используют `@Multipart` и `@Part`. Не передавайте доменные модели напрямую — используйте Request DTO, чтобы не отправить лишние поля.

### Вызовы через suspend-функции {#retrofit-suspend}

Retrofit поддерживает `suspend`-функции: запрос выполняется в корутине, результат возвращается напрямую. Это самый современный и удобный способ.

```kotlin
@GET("users/{id}")
suspend fun getUser(@Path("id") id: Int): User
```

Вызов: `val user = api.getUser(42)` внутри корутины. При ошибке HTTP Retrofit бросает `HttpException`. При сетевой ошибке — `IOException`. Оборачивайте в try/catch или используйте `Response<T>`.

### Call и Response (назначение) {#retrofit-call-response}

`Call<T>` — обёртка асинхронного запроса в старом API (до корутин): `call.enqueue(callback)` или `call.execute()`. В современном коде с suspend-функциями не нужен, но встречается в legacy и в некоторых библиотеках.

`Response<T>` — обёртка результата с кодом, заголовками и телом. Возвращает и успех, и ошибку без исключений.

```kotlin
@GET("users/{id}")
suspend fun getUser(@Path("id") id: Int): Response<User>
```

Используйте `Response<T>`, когда нужно прочитать статус-код или заголовки ответа, а не только тело. Иначе проще возвращать сам объект.

### Обработка успешного и неуспешного HTTP-ответа {#retrofit-success-error}

Успешный ответ (2xx) десериализуется в объект. Неуспешный (4xx/5xx) бросает `HttpException` при возврате объекта, либо доступен через `Response.errorBody()` при возврате `Response<T>`.

```kotlin
try {
    val user = api.getUser(42)
} catch (e: HttpException) {
    val errorBody = e.response()?.errorBody()?.string()
    // обработка по коду e.code()
} catch (e: IOException) {
    // нет сети / таймаут
}
```

Разделяйте сетевые ошибки (IOException) и HTTP-ошибки (HttpException). Показывайте пользователю понятное сообщение: «Нет соединения» vs «Пользователь не найден». Не выводите сырой errorBody пользователю — он может содержать внутренности сервера.

### Подключение JSON Converter {#retrofit-converter}

Converter преобразует тело запроса/ответа между Kotlin-объектами и байтами. Для Kotlinx Serialization используют `kotlinx-serialization-converter` или `Json.asConverterFactory`.

```kotlin
val contentType = "application/json".toMediaType()
val retrofit = Retrofit.Builder()
    .baseUrl(BASE_URL)
    .addConverterFactory(Json.asConverterFactory(contentType))
    .build()
```

Без converter'а Retrofit вернёт `ResponseBody`/`RequestBody` — вам придётся парсить вручную. Подключайте ровно один converter для JSON. Несколько converter'ов пробуются по порядку — это может скрыть ошибки.

### OkHttpClient и базовая настройка клиента {#retrofit-okhttp}

OkHttpClient — транспортный слой Retrofit. Настраивается отдельно и передаётся в builder. Здесь задаются таймауты, интерсепторы, кэш.

```kotlin
val client = OkHttpClient.Builder()
    .connectTimeout(15, TimeUnit.SECONDS)
    .readTimeout(20, TimeUnit.SECONDS)
    .addInterceptor(loggingInterceptor)
    .build()

val retrofit = Retrofit.Builder()
    .baseUrl(BASE_URL)
    .client(client)
    .addConverterFactory(...)
    .build()
```

Создавайте один OkHttpClient на приложение (singleton) — он управляет пулом соединений. Несколько клиентов = несколько пулов = лишняя память и соединения.

### HttpLoggingInterceptor для отладки запросов {#retrofit-logging}

`HttpLoggingInterceptor` (из OkHttp) логирует запросы и ответы в Logcat. Незаменим при отладке API.

```kotlin
val logging = HttpLoggingInterceptor().apply {
    level = HttpLoggingInterceptor.Level.BODY
}

val client = OkHttpClient.Builder()
    .addInterceptor(logging)
    .build()
```

Уровни: `NONE`, `BASIC` (метод+URL+код), `HEADERS`, `BODY` (всё включая тело). В продакшене ставьте `NONE` или убирайте interceptor — логирование тел запросов с токенами в релизе — утечка данных. Включайте только в debug-сборках через `BuildConfig.DEBUG`.

### Таймауты подключения и чтения {#retrofit-timeouts}

Таймауты защищают от зависания при плохой сети:

- `connectTimeout` — время на установление соединения.
- `readTimeout` — время ожидания данных после соединения.
- `writeTimeout` — время отправки тела запроса.

```kotlin
OkHttpClient.Builder()
    .connectTimeout(10, TimeUnit.SECONDS)
    .readTimeout(30, TimeUnit.SECONDS)
    .writeTimeout(30, TimeUnit.SECONDS)
```

Значения по умолчанию (10 секунд) часто слишком малы для медленных сетей или больших файлов. Подбирайте под сценарий: для загрузки списка — 15–30 секунд, для скачивания файла — дольше или используйте отдельный клиент. При срабатывании таймаута бросается `SocketTimeoutException` (подкласс IOException).

Типичные ошибки Retrofit: baseUrl без завершающего `/`, из-за чего Retrofit бросает `IllegalArgumentException`; эндпоинт с ведущим `/`, из-за чего baseUrl игнорируется; возврат non-null объекта при ответе 204 (пустое тело) — краш парсера; смешение `Call` и suspend в одном интерфейсе без нужды; создание нового Retrofit/OkHttpClient на каждый запрос (утечка пулов соединений); логирование BODY в релизе (утечка токенов); отсутствие обработки `IOException` отдельно от `HttpException`. Держите интерфейсы узкими, один клиент на приложение, и всегда оборачивайте сетевой вызов в try/catch с раздельной обработкой сетевых и HTTP-ошибок. Тестируйте API-слой с помощью MockWebServer, подменяя ответы и проверяя, что маппинг и обработка кодов работают корректно.

**Самопроверка:**
- [ ] Как задать базовый URL и почему он должен оканчиваться на `/`?
- [ ] Чем `@Path` отличается от `@Query`?
- [ ] Как обработать 4xx/5xx при использовании suspend-функции?
- [ ] Зачем нужен HttpLoggingInterceptor и почему его отключают в релизе?
- [ ] Какие таймауты настраивают в OkHttpClient?

## 8. DTO и Data Mapping {#dto-i-data-mapping}

DTO (Data Transfer Object) — объект, представляющий данные в том виде, в котором они передаются по сети. Разделение сетевых моделей (DTO) и моделей приложения (Domain) — ключевой принцип чистой архитектуры. API меняется, поля добавляются и удаляются; если UI зависит напрямую от сетевой модели, любое изменение бэкенда ломает интерфейс. DTO изолирует эту нестабильность.

:::cards
- **DTO** — модель, повторяющая структуру ответа сервера.
- **Domain** — модель, удобная для UI и бизнес-логики.
- **Маппинг** — преобразование DTO → Domain и обратно.
- **Extension-функции** — удобный способ описать преобразование.
- **Nullable** — API часто возвращает неполные данные; модель должна это учитывать.
- **Изоляция** — UI зависит от Domain, а не от формы ответа сервера.
:::

> **Ключевая идея:** DTO — это «язык сервера», Domain — «язык приложения». Маппинг между ними — граница, которая позволяет менять API и UI независимо.

### Назначение DTO {#dto-purpose}

DTO существует для транспорта данных: он повторяет форму JSON-ответа, включая имена полей (через `@SerialName`) и типы. DTO не содержит бизнес-логики, вычисляемых свойств или методов, специфичных для UI. Его задача — точно описать, что присылает сервер, и не более того.

Использование DTO даёт: стабильный контракт с бэкендом, возможность версионировать модели, место для обработки особенностей API (nullable, алиасы полей). Без DTO сетевая модель «протекает» в UI и бизнес-логику.

### Сетевые модели и Domain-модели {#dto-network-vs-domain}

Сетевая модель (DTO) повторяет ответ сервера: поля могут быть nullable, имена в snake_case, есть технические поля (`created_at`, `etag`). Domain-модель описывает сущность предметной области: non-null где возможно, удобные типы (например, `LocalDate` вместо строки), без технических деталей.

```kotlin
// DTO — зеркало ответа сервера
@Serializable
data class UserDto(
    @SerialName("user_id") val userId: Int,
    @SerialName("full_name") val fullName: String?,
    @SerialName("created_at") val createdAt: String
)

// Domain — модель приложения
data class User(
    val id: Int,
    val name: String,
    val createdAt: Instant
)
```

Разница в том, что DTO зависит от формы API, а Domain — от потребностей приложения. Один Domain-объект может собираться из нескольких DTO; один DTO может маппиться в разные Domain-модели для разных экранов.

### Преобразование DTO в Domain {#dto-to-domain}

Маппинг — это функция, которая принимает DTO и возвращает Domain. Она должна обрабатывать null, значения по умолчанию, преобразование типов (строка даты → `Instant`).

```kotlin
fun UserDto.toDomain(): User = User(
    id = userId,
    name = fullName ?: "Без имени",
    createdAt = Instant.parse(createdAt)
)
```

`Instant` из `java.time` доступен на API 26+; на более старых версиях Android нужен core library desugaring.

Маппинг вызывается в репозитории: сетевой слой возвращает DTO, репозиторий — Domain. UI и ViewModel работают только с Domain. Это позволяет менять API (новое поле, переименование) без изменения UI — достаточно обновить DTO и маппинг.

### Extension-функции для маппинга {#dto-mapping-extensions}

Extension-функции — удобный и читаемый способ описать маппинг. Они живут рядом с моделями или в отдельном файле `*Mapper.kt`.

```kotlin
fun UserDto.toDomain(): User = ...
fun List<UserDto>.toDomain(): List<User> = map { it.toDomain() }

fun User.toDto(): UserDto = ...
```

Расширения на коллекции (`List<UserDto>.toDomain()`) избавляют от повторяющегося `map`. Держите маппинг в одном месте, не размазывайте по ViewModel. Тестируйте маппинг отдельно — это чистые функции без зависимостей.

### Обработка nullable-полей API {#dto-nullable}

API часто возвращает null или опускает поля. В DTO это отражается nullable-типами. При маппинге решайте, какое значение использовать по умолчанию и нужно ли вообще показывать сущность без обязательных данных.

```kotlin
fun UserDto.toDomainOrNull(): User? {
    val name = fullName ?: return null
    return User(id = userId, name = name, createdAt = Instant.parse(createdAt))
}
```

Не все nullable-поля должны стать non-null в Domain: если поле опционально по смыслу (аватар, описание), оставьте его nullable и обработайте в UI (placeholder). Если поле критично и без него сущность бессмысленна — фильтруйте такие элементы при маппинге списка.

### Отсутствующие и дополнительные поля ответа {#dto-missing-extra}

Отсутствующее обязательное поле → ошибка парсинга (если тип non-null без default). Отсутствующее опциональное поле → default или null. Дополнительные поля (которых нет в DTO) игнорируются при `ignoreUnknownKeys = true` — иначе парсер упадёт.

```kotlin
val json = Json { ignoreUnknownKeys = true }
```

`ignoreUnknownKeys = true` — почти всегда нужен в продакшене: бэкенд добавляет поля, и приложение не должно падать. Но не игнорируйте неизвестные поля молча в критичных местах — логируйте их, чтобы заметить изменения API. Отсутствие обязательного поля — повод вернуть ошибку и показать «данные устарели».

### Почему не следует напрямую использовать DTO в UI {#dto-not-in-ui}

Если UI зависит от DTO, то любое изменение API (переименование поля, новый обязательный параметр, смена типа) ломает экраны и бизнес-логику. DTO также тащит в UI технические детали (snake_case, null-поля, серверные идентификаторы), что усложняет код и тестирование.

Domain-модель стабильна: она описывает то, что нужно приложению, а не то, что присылает сервер. Маппинг — единственное место, где нужно реагировать на изменения API. Это снижает стоимость изменений и упрощает тестирование: ViewModel тестируется с чистыми Domain-объектами без JSON.

Типичные ошибки маппинга: использовать DTO напрямую в UI «чтобы сэкономить время» — потом любое изменение API ломает экраны; делать все поля nullable «на всякий случай» и терять типобезопасность; игнорировать неизвестные поля без логирования и не замечать изменений контракта; маппить дату-строку в `Long` без валидации и падать на неожиданном формате; забывать про default-значения для опциональных полей. Держите маппинг в одном файле рядом с моделями, покрывайте его unit-тестами на реальных ответах сервера (включая edge-кейсы: null, отсутствующие поля, лишние поля). При изменении API обновляйте только DTO и маппер — UI и бизнес-логика остаются нетронутыми.

**Самопроверка:**
- [ ] Чем DTO отличается от Domain-модели?
- [ ] Где должен происходить маппинг DTO → Domain?
- [ ] Как обработать nullable-поле при маппинге?
- [ ] Зачем нужен `ignoreUnknownKeys = true`?
- [ ] Почему UI не должен знать про DTO?

## Итоговая самопроверка категории {#itogovaya-samoproverka}

- [ ] Умею парсить JSON через Kotlinx Serialization и обрабатывать ошибки.
- [ ] Понимаю структуру HTTP-запроса и ответа, методы и статус-коды.
- [ ] Умею описать API через Retrofit-интерфейс и настроить OkHttpClient.
- [ ] Настраиваю HttpLoggingInterceptor и таймауты, отключаю логирование в релизе.
- [ ] Разделяю DTO и Domain-модели, пишу маппинг через extension-функции.
- [ ] Обрабатываю nullable и отсутствующие поля API без крашей.
- [ ] Понимаю разницу Gson (legacy) и Kotlinx Serialization (рекомендуемый).

## Источники и документация {#istochniki-i-dokumentaciya}

### Официальная документация

- [Kotlin Serialization](https://kotlinlang.org/docs/serialization.html)
- [Kotlinx Serialization GitHub](https://github.com/Kotlin/kotlinx.serialization)
- [Retrofit](https://square.github.io/retrofit/)
- [OkHttp](https://square.github.io/okhttp/)
- [Android — Network security config](https://developer.android.com/training/articles/security-config)
- [Android — Data and file storage overview](https://developer.android.com/training/data-storage)
- [MDN — HTTP](https://developer.mozilla.org/en-US/docs/Web/HTTP)

### Статьи

- [Gson User Guide](https://github.com/google/gson/blob/master/UserGuide.md)
- [Retrofit — converter factories](https://square.github.io/retrofit/#converters)
- [OkHttp — Interceptors](https://square.github.io/okhttp/interceptors/)
- [Android Developers — Security best practices](https://developer.android.com/privacy-and-security/security-best-practices)