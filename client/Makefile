browserify:
	./node_modules/.bin/browserify -x three -o public/js/bundle.js \
			-r './lib/app.js:app'

three:
	./node_modules/.bin/browserify -r three -o public/js/three-bundle.js

deploy: three browserify

.PHONY: browserify three deploy
