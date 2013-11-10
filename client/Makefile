browserify:
	./node_modules/.bin/browserify -x three -x 'tween.js' -o public/js/bundle.js \
			-r './lib/app.js:app'

three:
	./node_modules/.bin/browserify -r three -r 'tween.js' -o public/js/three-bundle.js

deploy: three browserify

.PHONY: browserify three deploy
