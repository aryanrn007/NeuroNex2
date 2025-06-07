$htmlFiles = Get-ChildItem -Path "." -Filter "*.html"

foreach ($file in $htmlFiles) {
    $content = Get-Content -Path $file.FullName -Raw
    $updated = $false
    
    # Check if the file already contains the remove-dark-mode.js script
    if ($content -notmatch "remove-dark-mode\.js") {
        Write-Host "Adding remove-dark-mode.js to $($file.Name)"
        
        # Replace the head closing tag to add our script before it
        if ($content -match "</head>") {
            $content = $content -replace "</head>", "    <script src=`"remove-dark-mode.js`"></script>`n</head>"
            $updated = $true
        }
    } else {
        Write-Host "$($file.Name) already contains remove-dark-mode.js"
    }
    
    # Remove dark theme option if it exists
    if ($content -match 'class="theme-option" data-theme="dark"') {
        Write-Host "Removing dark theme option from $($file.Name)"
        $content = $content -replace '<button class="theme-option" data-theme="dark">\s*<i class="fas fa-moon"></i>\s*<span>Dark</span>\s*</button>', ''
        $updated = $true
    }
    
    # Remove system theme option if it exists
    if ($content -match 'class="theme-option" data-theme="system"') {
        Write-Host "Removing system theme option from $($file.Name)"
        $content = $content -replace '<button class="theme-option" data-theme="system">\s*<i class="fas fa-desktop"></i>\s*<span>System</span>\s*</button>', ''
        $updated = $true
    }
    
    # Save the updated content if changes were made
    if ($updated) {
        Set-Content -Path $file.FullName -Value $content
    }
}

Write-Host "All HTML files have been updated!"
