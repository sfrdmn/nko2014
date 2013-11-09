deploy:
	./dropbox_uploader.sh download nko2013/final/sound client/public/audio
	cd client && npm install --production

.PHONY: deploy
