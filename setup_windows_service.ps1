<#
.SYNOPSIS
    Registers GovJobPulse as an automated Windows background task that runs
    silently on user login so you never have to remember to start it manually.
#>

$ScriptPath = Split-Path -Parent $MyInvocation.MyCommand.Path
$Action = New-ScheduledTaskAction -Execute "python.exe" -Argument "-m uvicorn app.main:app --host 127.0.0.1 --port 8000" -WorkingDirectory "$ScriptPath\backend"
$Trigger = New-ScheduledTaskTrigger -AtLogOn
$Settings = New-ScheduledTaskSettingsSet -AllowStartIfOnBatteries -DontStopIfGoingOnBatteries -StartWhenAvailable

Register-ScheduledTask -TaskName "GovJobPulseBackgroundWorker" -Action $Action -Trigger $Trigger -Settings $Settings -Description "Runs GovJobPulse 12-hour government job aggregator silently in background"

Write-Host "✅ GovJobPulse successfully registered as a Windows background task!" -ForegroundColor Green
Write-Host "The job sync engine will now run silently whenever you log into Windows." -ForegroundColor Cyan
