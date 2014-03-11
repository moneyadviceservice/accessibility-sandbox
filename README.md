# Frontend Sandbox

This is a repository to try out markup patterns and components - etc.  Examples
are published on GitHub Pages to can be reviewed/teest by our accessibility partner.


[http://moneyadviceservice.github.io/frontend-sandbox/](http://moneyadviceservice.github.io/frontend-sandbox/)


##Running files locally

Clone the repository:

```
git clone git@github.com:moneyadviceservice/frontend-sandbox.git
```

Install middleman:
	
```
gem install middleman
```

Navigate to the project folder

```
cd frontend-sandox
```

Make sure all dependencies are available to the application:

```
bundle install
```

Run middleman server

```
middleman server
```

You can view the site at: [http://0.0.0.0:4567/](http://0.0.0.0:4567/)


##To deploy to github pages

Commit your changes to master

```
    git add .
    git commit "{insert commit message}"
    git push
```

Run rake task to publish to the gh-pages branch

    rake publish

(note: if you have not commited changes to master you will get an error message!)


You can now view on GitHub Pages:

[http://moneyadviceservice.github.io/frontend-sandbox/](http://moneyadviceservice.github.io/frontend-sandbox/)