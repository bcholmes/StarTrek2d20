$date = Get-Date -format "yyMd"
$version = "var version = 'v1." + $date + "';"
Set-Content -Path "version.js" -Value $version