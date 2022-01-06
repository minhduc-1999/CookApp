setup-deploy:
	./deploy/setup.sh

deploy-api:
	git subtree push --prefix=CookApp-BE tastify-be main