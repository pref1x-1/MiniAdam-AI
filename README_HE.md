# MINI ADAM

**סביבת AI מקומית ל־Windows.**

MINI ADAM מתחבר למודלים מקומיים דרך [Ollama](https://ollama.com), עם ממשק Desktop לשיחות, ניהול מודלים, זיכרון מקומי ועבודה עם קבצים.

- **אתר ומדריך הורדה:** https://pref1x-1.github.io/MiniAdam-AI/
- **גרסאות GitHub:** https://github.com/pref1x-1/MiniAdam-AI/releases
- **Ollama:** https://ollama.com/download
- **גרסה:** 3.5.0 — Nordic Aurora
- **מערכת:** Windows 10/11 · x64

## הורדה

יש להוריד את **קובץ המתקין Setup**, ולא את קובץ האפליקציה העצמאי:

[הורדת MINI ADAM Setup](https://github.com/pref1x-1/MiniAdam-AI/releases/latest/download/MiniAdam-Setup.exe)

האתר בודק את ה־GitHub Release האחרון ומפעיל את כפתור ההורדה רק כאשר מצורף אליו קובץ בשם `MiniAdam-Setup.exe`. עד אז האתר מפנה לעמוד הגרסאות, ולא מציג קישור הורדה שבור.

## התקנה

1. הורד את `MiniAdam-Setup.exe` מעמוד Releases הרשמי.
2. הפעל את המתקין, קרא ואשר את התקנון, בחר תיקיית התקנה ואפשרויות קיצורי הדרך.
3. התקן והפעל את [Ollama](https://ollama.com/download) בנפרד.
4. פתח את MINI ADAM, השלם את שאלות ההיכרות, בדוק חומרה ובחר מודל מתאים.

המתקין **אינו כולל את Ollama או מודלי AI**. הורדת מודלים דורשת חיבור לאינטרנט ונפח אחסון.

## יכולות

- צ'אט מקומי עם מודלי Ollama ותשובות בזרימה.
- היסטוריית שיחות, חיפוש, עריכה, שכפול, ייצוא, נקודות שחזור וסימניות.
- Adam Mode אופציונלי, בחירת שפה וזיכרונות מקומיים מתמשכים.
- גילוי מודלים, הורדה, בחירה, רענון, פריקה ומחיקה.
- צירוף קבצים ותמונות; ניתוח תמונות דורש מודל Vision תואם.
- פעולות Agent לקבצים בתוך אזור עבודה מאושר, עם בקשת אישור.
- Windows System Tray, מצב ריכוז, קיצורי מקלדת ועיצוב Nordic Aurora.

יכולות כמו ראייה ממוחשבת, הצגת חשיבה ואיכות התשובות תלויות במודל שנבחר. MINI ADAM הוא ממשק Desktop עם שכבת אישיות אופציונלית, ולא מודל בסיס שעבר Fine-tuning חדש.

## פרטיות ואבטחה

- שיחות וזיכרונות נשמרים מקומית תחת `%APPDATA%\\MiniAdam\\`.
- כאשר משתמשים במודל Ollama מקומי, העיבוד מתבצע במחשב. הורדת מודלים ועדכונים דורשת אינטרנט.
- המתקין **אינו חתום דיגיטלית**. ייתכן ש־Windows יציג אזהרת אבטחה או מוניטין.
- אין לכבות את Microsoft Defender, להוסיף חריגות או לעקוף זיהוי איום. הורד רק מה־Releases של המאגר ואמת את checksum.
- גרסת פיתוח קודמת קיבלה זיהוי אנטי־וירוס. המתקין הנוכחי עדיין לא קיבל אישור עצמאי של Microsoft; אין להפיץ אותו בהיקף רחב לפני סריקה ובירור זיהויים.

## אימות הקובץ — Setup 3.5.0

SHA-256 הצפוי לקובץ המתקין בשם `MiniAdam-Setup.exe`:

```text
f2eea32333e97af4d879c9b27296f7a80332a1d20b9feb2cd7d16df248dd357d
```

בדיקה ב־PowerShell:

```powershell
Get-FileHash .\\MiniAdam-Setup.exe -Algorithm SHA256
```

ה־checksum הזה מתאים רק לבניית MINI ADAM 3.5.0 המסוימת.

## פרסום האתר

- קובצי האתר נמצאים בתיקיית `docs/` ונפרסים באמצעות GitHub Actions.
- בהגדרות המאגר, **Settings → Pages → Build and deployment**, יש לבחור **GitHub Actions** כמקור.
- ה־Release האחרון חייב להכיל את קובץ המתקין בשם המדויק `MiniAdam-Setup.exe`.
- הוראות נוספות נמצאות ב־[מדריך העלאת ה־Setup ל־Release](./RELEASE_UPLOAD_GUIDE_HE.md) ובקובץ `scripts/Publish-Setup-Release.ps1`.

## אודות

נוצר על ידי [Adam Marhasin (Pref1x)](https://github.com/pref1x-1). MINI ADAM הוא פרויקט עצמאי ואינו קשור ל־Ollama, Hugging Face, Microsoft או לספקי מודלים.
