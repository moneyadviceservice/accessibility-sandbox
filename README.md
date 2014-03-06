# accessibility-sandbox

This is a repository to try out and pusblish solutions to accessibility challenges.  Examples are published on github pages to can be reviewed by our accessibility partner.


[http://moneyadviceservice.github.io/accessibility-sandbox/](http://moneyadviceservice.github.io/accessibility-sandbox/)


##Running files locally

Clone the repository:

```
git clone git@github.com:moneyadviceservice/accessibility-sandbox.git
```

Install middleman:
	
```
gem install middleman
```

Make sure all dependencies are available to the application:

```
bundle install
```

Navigate to the project folder

```
cd accessibility-sandox
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


You can now view on github pages: 

[http://moneyadviceservice.github.io/accessibility-sandbox/](http://moneyadviceservice.github.io/accessibility-sandbox/)