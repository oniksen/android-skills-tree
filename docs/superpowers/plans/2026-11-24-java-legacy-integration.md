# Plan: интеграция Java и legacy-навыков в курс Android Skills Tree

**Статус:** согласовано и реализовано (суженный скоуп).  
**Ветка:** `feat/java-legacy-skills`  
**Дата:** 2026-11-24  
**Детализация:** `/Users/oniksen/.opencode/plan/java-legacy-detailed.md`

## Решение

Java включается **не как параллельный языковой трек**, а как кросс-срезовая
компетенция «JVM interop + legacy-код». Для современной Android/KMP-разработки
обязателен только Middle interop; остальное — optional распознавание и миграция.
Глубокое изучение мёртвых библиотек и Java-конкурентности в курс не вводится.

KMP-ограничение зафиксировано явно: Java interop применим только к JVM/Android-
таргетам, не к common-коду.

## Итоговый скоуп

| Грейд | Добавлено | required? |
|---|---|---|
| Junior | ничего (оставлена подтема «Платформенные типы при взаимодействии с Java») | — |
| Middle | `middle-kotlin-java-interop`, `middle-legacy-android-code` | interop — yes |
| Strong Middle | `strong-arch-java-migration` | no |
| Senior | подтемы в существующие скиллы (без новых скиллов) | no |

## Реализованные изменения

### Новые скиллы

- `middle-kotlin-java-interop` (`middle-kotlin`, sortOrder 8, required) — вызовы
  в обе стороны, `@Jvm*`, платформенные типы, checked exceptions, коллекции, SAM,
  KMP-ограничение.
- `middle-legacy-android-code` (`middle-components`, sortOrder 7, optional) —
  распознавание AsyncTask/Loader/support→AndroidX/MVP/Dagger2 + recognition list
  мёртвых библиотек.
- `strong-arch-java-migration` (`strong-arch`, sortOrder 7, optional) — playbook
  миграции Java → Kotlin.

### Подтемы в существующие скиллы

- `middle-tools-kts`: Groovy Gradle, старые AGP, `annotationProcessor` vs kapt/ksp.
- `strong-flow-channels`: распознавание legacy-потоков и план замены на корутины/Flow.
- `senior-arch-scalability`: strangler fig, API-контракты Java/Kotlin, ABI, метрики
  покрытия Kotlin, финальная чистка.
- `senior-platform-art`: ProGuard/R8 для смешанного кода, сохранение имён interop-API.

### Roadmap

В `src/data/roadmap-links.ts` добавлены рекомендательные рёбра:
`middle-kotlin-collections → middle-kotlin-java-interop`,
`middle-kotlin-java-interop → middle-legacy-android-code`,
`strong-arch-multi → strong-arch-java-migration`.

## Что НЕ делали (сознательно)

- Основы Java (переменные, ООП, коллекции) — дублируют Kotlin-трек.
- Глубокое изучение мёртвых библиотек и Java-concurrency — только recognition.
- Junior-скиллы по Java.
- Отдельные study-materials: Middle-категории в курсе не имеют материалов, поэтому
  новый материал не создавался (пункт был опциональным).
- Изменения UI/маршрутов — категории появляются автоматически.

## Проверки

- `src/data/skills.test.ts`: ≥30% required на грейд и ≥1 required в категории.
- `src/data/roadmap-links.test.ts`: существующие id, уникальность, ацикличность,
  same-grade.
- `npm run lint`, `npm run typecheck`, `npm test`.
