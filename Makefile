setup-deploy:
	./deploy/setup.sh

deploy-api:
	git subtree push --prefix=CookApp-BE tastify-be main

deploy-api-force:
	git push tastify-be `git subtree split --prefix=CookApp-BE main`:main --force
