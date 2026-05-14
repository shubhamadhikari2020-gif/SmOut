$port = 8080
$listener = New-Object System.Net.HttpListener
$listener.Prefixes.Add("http://localhost:$port/")
$listener.Prefixes.Add("http://127.0.0.1:$port/")
$listener.Start()
Write-Host "Server running at http://localhost:$port/"
Write-Host "Press Ctrl+C to stop."

try {
    while ($listener.IsListening) {
        $context = $listener.GetContext()
        $request = $context.Request
        $response = $context.Response
        
        $path = $request.Url.LocalPath
        if ($path -eq "/") { $path = "/index.html" }
        $path = $path.Replace("..", "").TrimStart('/')
        
        $localPath = Join-Path $PWD $path
        
        if (Test-Path $localPath -PathType Leaf) {
            $stream = [System.IO.File]::OpenRead($localPath)
            $response.ContentLength64 = $stream.Length
            
            if ($path.EndsWith(".html")) { $response.ContentType = "text/html" }
            elseif ($path.EndsWith(".js")) { $response.ContentType = "application/javascript" }
            elseif ($path.EndsWith(".css")) { $response.ContentType = "text/css" }
            
            $stream.CopyTo($response.OutputStream)
            $stream.Close()
        } else {
            $response.StatusCode = 404
        }
        $response.Close()
    }
} catch {
    Write-Host "Server error: $_"
} finally {
    $listener.Stop()
    $listener.Close()
}
