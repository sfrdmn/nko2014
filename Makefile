deploy:
	./dropbox_uploader.sh download nko2013/final/sound client/public/
	cd client && npm install --production

publish:
	git subtree split -P client/public/ -b gh-pages
	git push origin gh-pages


.PHONY: deploy
