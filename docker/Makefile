VERSION=2.0.0
IMAGE_NAME="blackchip/scorebored"

docker :
	if [ -d ./html ]; then rm -rf ./html; fi
	cp -r ../web html
	docker build -t $(IMAGE_NAME):v$(VERSION) -t $(IMAGE_NAME):latest .

clean :
	rm -rf ./html
