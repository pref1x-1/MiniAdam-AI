# מדריך פרסום MINI ADAM — אתר + Setup

יש שתי פעולות נפרדות: פרסום אתר GitHub Pages והעלאת קובץ המתקין ל־GitHub Release.

## א. פרסום האתר (פעם אחת)

1. פתח את המאגר: https://github.com/pref1x-1/MiniAdam-AI
2. היכנס אל **Settings → Pages**.
3. תחת **Build and deployment → Source**, בחר **Deploy from a branch**.
4. בשדה Branch בחר `main`.
5. בשדה Folder בחר `/docs`.
6. לחץ **Save**.

קובצי האתר כבר נמצאים במאגר בתיקיית `docs/`. אין צורך ב־workflow מותאם ל־GitHub Actions עבור שיטת פרסום זו. אחרי שמירת ההגדרה, GitHub Pages יפרסם את האתר בכתובת:

https://pref1x-1.github.io/MiniAdam-AI/

אם האתר עדיין לא נפתח מיד, בדוק את **Settings → Pages** ואת ה־Pages build/deployment האחרון במאגר.

## ב. פרסום קובץ ה־Setup ב־Release

האתר מחפש ב־GitHub Release האחרון קובץ מצורף בשם המדויק `MiniAdam-Setup.exe`. הוא לא יוריד את ה־EXE העצמאי.

### דרך GitHub באתר

1. פתח https://github.com/pref1x-1/MiniAdam-AI/releases
2. לחץ **Draft a new release**.
3. צור תגית `v3.5.0` על branch `main`.
4. כותרת: `MINI ADAM 3.5.0 — Nordic Aurora`.
5. העלה **רק** את קובץ המתקין `MiniAdam-Setup-Nordic-Aurora-3.5.0.exe`.
6. לפני פרסום, שנה את שם הנכס המצורף ל־`MiniAdam-Setup.exe` (אפשר לשנות את שם הקובץ במחשב ל־`MiniAdam-Setup.exe` לפני הגרירה).
7. פרסם את ה־Release כ־Latest release.

אין להעלות את `MiniAdam-Nordic-Aurora-3.5.0.exe`; זהו קובץ האפליקציה העצמאי ולא המתקין.

### דרך GitHub CLI (אוטומטית)

1. הורד את קובץ ה־Setup מהקישור המצורף לשיחה ושמור אותו במחשב.
2. התקן [GitHub CLI](https://cli.github.com/).
3. פתח PowerShell והריץ:

```powershell
gh auth login
git clone https://github.com/pref1x-1/MiniAdam-AI.git
cd MiniAdam-AI
.\\scripts\\Publish-Setup-Release.ps1 -SetupPath "$env:USERPROFILE\\Downloads\\MiniAdam-Setup-Nordic-Aurora-3.5.0.exe"
```

אם שמרת את המתקין במקום אחר, החלף את הנתיב אחרי `-SetupPath`. הסקריפט בודק את SHA-256, יוצר את Release `v3.5.0` אם הוא עדיין לא קיים, ומעלה רק את המתקין תחת השם `MiniAdam-Setup.exe`.

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
