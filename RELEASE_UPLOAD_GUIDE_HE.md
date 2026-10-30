# מדריך פרסום MINI ADAM — אתר + Setup

יש שתי פעולות נפרדות: פרסום אתר GitHub Pages והעלאת קובץ המתקין ל־GitHub Release.

## א. הפעלת האתר (פעם אחת)

1. פתח את [הגדרות Pages במאגר](https://github.com/pref1x-1/MiniAdam-AI/settings/pages).
2. תחת **Build and deployment → Source**, בחר **Deploy from a branch**.
3. בשדה Branch בחר `main`.
4. בשדה Folder בחר `/docs`.
5. לחץ **Save**.

קובצי האתר כבר נמצאים במאגר בתיקיית `docs/`. הסרתי את ה־workflow הקודם שנכשל, כי הוא ניסה לפרוס Pages לפני שהאתר הופעל. בשיטת branch publishing אין צורך ב־workflow מותאם.

כתובת האתר לאחר הפרסום:

https://pref1x-1.github.io/MiniAdam-AI/

GitHub Pages עשוי להזדקק לכמה דקות לפרסום הראשוני. אפשר לבדוק את מצב הפרסום באותו מסך Settings → Pages.

## ב. העלאת ה־Setup ל־Release

האתר מחפש ב־GitHub Release האחרון קובץ מצורף בשם המדויק `MiniAdam-Setup.exe`. הוא לא מוריד את ה־EXE העצמאי.

### אפשרות 1 — העלאה ידנית באתר GitHub

1. פתח https://github.com/pref1x-1/MiniAdam-AI/releases
2. לחץ **Draft a new release**.
3. צור תגית `v3.5.0` על branch `main`.
4. כותרת: `MINI ADAM 3.5.0 — Nordic Aurora`.
5. העלה **רק** את קובץ המתקין `MiniAdam-Setup-Nordic-Aurora-3.5.0.exe`.
6. לפני הפרסום, שנה את שם הקובץ במחשב ל־`MiniAdam-Setup.exe` וצרף אותו כך.
7. פרסם את ה־Release כ־Latest release.

אין להעלות את `MiniAdam-Nordic-Aurora-3.5.0.exe`; זהו קובץ האפליקציה העצמאי ולא המתקין.

### אפשרות 2 — העלאה אוטומטית עם GitHub CLI (מומלץ)

הכנתי חבילת פרסום שכוללת את קובץ המתקין ואת הסקריפט:

1. הורד וחלץ את [MiniAdam-Publish-Kit-3.5.0.zip](sandbox:/mnt/data/MiniAdam-Publish-Kit-3.5.0.zip).
2. התקן [GitHub CLI](https://cli.github.com/).
3. פתח PowerShell בתוך התיקייה שחילצת.
4. התחבר לחשבון GitHub שיש לו הרשאת כתיבה למאגר:

```powershell
gh auth login
```

5. הרץ:

```powershell
.\\scripts\\Publish-Setup-Release.ps1 -SetupPath .\\MiniAdam-Setup-Nordic-Aurora-3.5.0.exe
```

הסקריפט מאמת את SHA-256. אם הוא תואם, הוא יוצר את Release `v3.5.0` אם הוא עדיין לא קיים, ומעלה **רק** את קובץ המתקין תחת השם `MiniAdam-Setup.exe`. אם ה־Release כבר קיים, הוא מחליף רק את נכס ה־Setup.

## SHA-256 של Setup 3.5.0

```text
f2eea32333e97af4d879c9b27296f7a80332a1d20b9feb2cd7d16df248dd357d
```

בדיקה ידנית:

```powershell
Get-FileHash .\\MiniAdam-Setup-Nordic-Aurora-3.5.0.exe -Algorithm SHA256
```

קישור ההורדה שהאתר ישתמש בו אחרי פרסום ה־Release:

https://github.com/pref1x-1/MiniAdam-AI/releases/latest/download/MiniAdam-Setup.exe

## אבטחה

המתקין אינו חתום דיגיטלית. אין לעקוף אזהרות Microsoft Defender או SmartScreen. יש לאמת SHA-256 ולברר כל זיהוי מול Microsoft לפני הפצה רחבה.
