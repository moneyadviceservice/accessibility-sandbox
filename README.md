accessibility-sandbox
=====================

1. Check out the repository
2. Install middleman

    gem install middleman

3. Bundle install

    bundle install

4. Navigate to the project folder

    cd accessibility-sandox

5. Run middleman server

    middleman server

6. You can view the site at: http://0.0.0.0:4567/


** To deploy to github pages

1. Commit your changes to master

    git add .
    git commit "{insert commit message}"
    git push

2. Run rake task to publish to the gh-pages branch

    rake publish

[note: if you have not commited changes to master you will get an error message!]


3. You can now view on github pages: http://moneyadviceservice.github.io/accessibility-sandbox/