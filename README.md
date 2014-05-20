

## On OSX - with grunt build

    brew install node
    npm install -G grunt-cli
    git clone https://github.com/dustingetz/react-workshop.git
    cd react-workshop/form-master-detail
    npm install
    grunt
    python2: python -m SimpleHTTPServer
    python3: python -m http.server
    browse to http://localhost:8000/form-master-detail/webapp/index.html
    
## No grunt build (windows and osx)

    download and install python3 from python.org
    put python.exe on your path
    git clone https://github.com/dustingetz/react-workshop.git
    cd react-workshop/form-master-detail-nobuild
    python -m http.server
    browse to http://localhost:8000/form-master-detail-nobuild/webapp/index.html
    