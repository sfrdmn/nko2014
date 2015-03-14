THREE = public/js/three-bundle.js

browserify:
	./node_modules/.bin/browserify -x three -x 'tween.js' -o public/js/bundle.js \
			-r './lib/app.js:app'

$(THREE):
	./node_modules/.bin/browserify -r three -r 'tween.js' -o public/js/three-bundle.js

deploy: $(THREE) browserify

serve: deploy
	node server.js

.PHONY: browserify three deploy
