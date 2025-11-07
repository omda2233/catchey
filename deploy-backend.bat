@echo off
echo 🚀 Preparing Catchy Fabric Market Backend for Railway Deployment...

echo.
echo 📋 Step 1: Creating backend-updates branch...
git checkout -b backend-updates 2>nul || git checkout backend-updates

echo.
echo 📋 Step 2: Staging backend files and firestore rules...
git add backend/
git add firestore.rules
git add DEPLOY_REPORT.md
git add README.md

echo.
echo 📋 Step 3: Committing changes...
git commit -m "feat(backend): finalize Express API + Firebase integration + logging + role rules + Railway config"

echo.
echo 📋 Step 4: Pushing to GitHub...
git push -u origin backend-updates

echo.
echo ✅ Backend finalized and pushed — ready for Railway connection!
echo.
echo 🔗 Repository: https://github.com/omda2233/catchey
echo 📁 Root Directory: backend
echo 🚀 Start Command: npm start
echo.
pause