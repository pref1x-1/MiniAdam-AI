# העלאת MINI ADAM Setup ל־GitHub Releases

האתר מחפש ב־GitHub Release האחרון קובץ בשם המדויק `MiniAdam-Setup.exe`.

## העלאה דרך GitHub

1. פתח את המאגר: https://github.com/pref1x-1/MiniAdam-AI
2. היכנס ל־**Releases** ולחץ **Draft a new release**.
3. צור תגית `v3.5.0` והגדר אותה על `main`.
4. כותרת מומלצת: `MINI ADAM 3.5.0 — Nordic Aurora`.
5. העלה **רק** את קובץ המתקין ושנה את שמו המצורף ל־`MiniAdam-Setup.exe`.
6. פרסם את ה־Release.

קובץ המתקין שנוצר בסביבת הבנייה נקרא `MiniAdam-Setup-Nordic-Aurora-3.5.0.exe`. זהו הקובץ שיש לשנות את שמו לפני ההעלאה. אין להעלות את `MiniAdam-Nordic-Aurora-3.5.0.exe`, שהוא קובץ האפליקציה העצמאי.

## העלאה עם GitHub CLI

הורד את ה־Setup, שמור אותו בשם `MiniAdam-Setup.exe` לצד הסקריפט, התקן [GitHub CLI](https://cli.github.com/) והתחבר באמצעות `gh auth login`. לאחר מכן הרץ:

```powershell
.\\scripts\\Publish-Setup-Release.ps1
```

## SHA-256 של Setup 3.5.0

```text
f2eea32333e97af4d879c9b27296f7a80332a1d20b9feb2cd7d16df248dd357d
```

בדיקה:

```powershell
Get-FileHash .\\MiniAdam-Setup.exe -Algorithm SHA256
```

קישור ההורדה היציב שבו משתמש האתר לאחר פרסום ה־Release:

```text
https://github.com/pref1x-1/MiniAdam-AI/releases/latest/download/MiniAdam-Setup.exe
```

## הפעלת GitHub Pages

1. פתח **Settings** במאגר.
2. בחר **Pages**.
3. תחת **Build and deployment**, בחר **Source: GitHub Actions**.
4. שמור. ה־workflow `Deploy MINI ADAM download site` יפרוס את תיקיית `docs/` בכל עדכון.

כתובת האתר הצפויה: https://pref1x-1.github.io/MiniAdam-AI/

## אבטחה

המתקין אינו חתום דיגיטלית. אין לעקוף אזהרות Microsoft Defender או SmartScreen. יש לאמת SHA-256 ולהגיש זיהויים לבדיקה מול Microsoft לפני הפצה רחבה.
