# Patronage 2021 recrutation - task no.1

This respository contains code for intive first task to get into patronage project.

# Deployed, working app

is available on githubPages here: https://justyna-bodurka.github.io/patronage-rekru-1/
# Structure

```
 - README.md (this file :-))
 - index.html (main app html file)
 - css 
   - main.css (main file used to import other css parts)
   - normalize.css (from: github.com/necolas/normalize.css)
   - ...partials... (group styles)

 - img 
   - bg.jpg (background for header)

 - js 
   - main.js (all js functions, not as modules but grouped in responsibility)
```
## Commits convention

I was trying to follow conventional commits approach: https://www.conventionalcommits.org/en/v1.0.0/

## Remarks to project

- due to not consistant image data, instead of using IMG tag with transformations, background-image has been used
- as bundler is not available, css files are atomized and imported natively by the browser
- JavaScript modules was not used and all script code has been grouped
- One of demands in the task was to make list in 'center' of the page. Two views was introduced into application using "zmień widok" button in header.
- basic error handling for adding to basket and error during fetch is added