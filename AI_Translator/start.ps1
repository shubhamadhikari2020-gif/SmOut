# Start the backend API
Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd C:\Users\BSR\Desktop\SmOut\SmOut\AI_Translator\backend; ..\venv\Scripts\Activate.ps1; python -m uvicorn main:app --host 0.0.0.0 --port 8000 --reload"

# Start a simple HTTP server for the frontend
Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd C:\Users\BSR\Desktop\SmOut\SmOut\AI_Translator\frontend; python -m http.server 3000"

Write-Host "Backend is running at http://localhost:8000"
Write-Host "Frontend is running at http://localhost:3000"
Write-Host "Press any key to exit this script..."
$Host.UI.RawUI.ReadKey("NoEcho,IncludeKeyDown")
