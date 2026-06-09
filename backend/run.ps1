$mavenVersion = "3.9.9"
$mavenZip = "apache-maven-$mavenVersion-bin.zip"
$mavenDir = "apache-maven-$mavenVersion"
$mavenUrl = "https://repo.maven.apache.org/maven2/org/apache/maven/apache-maven/$mavenVersion/apache-maven-$mavenVersion-bin.zip"
$mvnCmd = Join-Path $PSScriptRoot "$mavenDir\bin\mvn.cmd"

if (-Not (Test-Path $mvnCmd)) {
    curl.exe -s -L -o $mavenZip $mavenUrl
    Expand-Archive -Path $mavenZip -DestinationPath . -Force
    Remove-Item -Path $mavenZip -Force
}

$port = 8080
$processes = Get-NetTCPConnection -LocalPort $port -ErrorAction SilentlyContinue 
if ($processes) {
    foreach ($p in $processes) {
        if ($p.OwningProcess -gt 0) {
            Write-Host "Port $port is in use by PID $($p.OwningProcess). Terminating..."
            Stop-Process -Id $p.OwningProcess -Force -ErrorAction SilentlyContinue
        }
    }
    Start-Sleep -Seconds 2
}

Write-Host "Running Spring Boot project..."
& "$mvnCmd" clean spring-boot:run
