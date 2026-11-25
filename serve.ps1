param(
    [int[]]$Ports = @(8080, 5173),
    [int]$Port = 0,
    [string]$Root = $PSScriptRoot,
    [switch]$OpenBrowser
)

if ($Port -gt 0) {
    $Ports = @($Port)
}

if ([string]::IsNullOrWhiteSpace($Root)) {
    $Root = (Get-Location).Path
}
$RootFull = [System.IO.Path]::GetFullPath($Root)

$mimeTypes = @{
    ".html" = "text/html; charset=utf-8"
    ".js"   = "application/javascript; charset=utf-8"
    ".mjs"  = "application/javascript; charset=utf-8"
    ".css"  = "text/css; charset=utf-8"
    ".json" = "application/json; charset=utf-8"
    ".svg"  = "image/svg+xml"
    ".png"  = "image/png"
    ".ico"  = "image/x-icon"
}

$listeners = @()
foreach ($p in $Ports) {
    try {
        $l = [System.Net.Sockets.TcpListener]::Create($p)
        $l.Start()
        $listeners += @{ Port = $p; Listener = $l }
        Write-Host "Serving $RootFull on http://localhost:$p (and http://127.0.0.1:$p)"
    } catch {
        Write-Warning "Could not bind port ${p}: $($_.Exception.Message)"
    }
}

if ($listeners.Count -eq 0) {
    throw "No ports could be bound."
}

if ($OpenBrowser) {
    $firstPort = $listeners[0].Port
    Start-Process "http://localhost:$firstPort"
}

function Handle-Client {
    param(
        [System.Net.Sockets.TcpClient]$Client,
        [string]$RootPath,
        [hashtable]$MimeMap
    )

    try {
        $Client.ReceiveTimeout = 2000
        $Client.SendTimeout = 2000
        $Client.NoDelay = $true

        # Avoid hanging indefinitely on idle browser preconnect sockets
        if (-not $Client.Client.Poll(300000, [System.Net.Sockets.SelectMode]::SelectRead)) {
            return
        }
        if ($Client.Available -eq 0) {
            return
        }

        $stream = $Client.GetStream()
        $reader = [System.IO.StreamReader]::new($stream, [System.Text.Encoding]::ASCII, $false, 1024, $true)
        $requestLine = $reader.ReadLine()
        if ([string]::IsNullOrWhiteSpace($requestLine)) { return }

        while ($true) {
            $headerLine = $reader.ReadLine()
            if ([string]::IsNullOrEmpty($headerLine)) { break }
        }

        $parts = $requestLine.Split(" ")
        $rawPath = if ($parts.Length -ge 2) { $parts[1] } else { "/" }
        $cleanPath = [System.Uri]::UnescapeDataString(($rawPath.Split("?")[0]).TrimStart("/"))
        if ([string]::IsNullOrEmpty($cleanPath)) { $cleanPath = "index.html" }

        $safePath = [System.IO.Path]::GetFullPath((Join-Path $RootPath $cleanPath))
        if (-not $safePath.StartsWith($RootPath, [System.StringComparison]::OrdinalIgnoreCase)) {
            $status = "403 Forbidden"
            $body = [System.Text.Encoding]::UTF8.GetBytes("Forbidden")
            $contentType = "text/plain; charset=utf-8"
        } elseif (Test-Path $safePath -PathType Leaf) {
            $status = "200 OK"
            $body = [System.IO.File]::ReadAllBytes($safePath)
            $ext = [System.IO.Path]::GetExtension($safePath).ToLowerInvariant()
            $contentType = if ($MimeMap.ContainsKey($ext)) { $MimeMap[$ext] } else { "application/octet-stream" }
        } else {
            $status = "404 Not Found"
            $body = [System.Text.Encoding]::UTF8.GetBytes("Not Found")
            $contentType = "text/plain; charset=utf-8"
        }

        $headers = "HTTP/1.1 $status`r`nContent-Type: $contentType`r`nContent-Length: $($body.Length)`r`nConnection: close`r`nCache-Control: no-cache`r`n`r`n"
        $headerBytes = [System.Text.Encoding]::ASCII.GetBytes($headers)
        $stream.Write($headerBytes, 0, $headerBytes.Length)
        $stream.Write($body, 0, $body.Length)
        $stream.Flush()
    } catch {
    } finally {
        $Client.Close()
    }
}

try {
    while ($true) {
        $handled = $false
        foreach ($entry in $listeners) {
            $listener = $entry.Listener
            while ($listener.Pending()) {
                $client = $listener.AcceptTcpClient()
                Handle-Client -Client $client -RootPath $RootFull -MimeMap $mimeTypes
                $handled = $true
            }
        }
        if (-not $handled) {
            Start-Sleep -Milliseconds 15
        }
    }
} finally {
    foreach ($entry in $listeners) {
        $entry.Listener.Stop()
    }
}
