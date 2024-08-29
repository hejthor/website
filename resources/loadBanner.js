function resizeImage(url, newHeight, callback, errorCallback) {
    const img = new Image();
    img.src = url;
    img.crossOrigin = "Anonymous"; // To avoid CORS issues

    img.onload = function () {
        // Get the original dimensions of the image
        const originalWidth = img.width;
        const originalHeight = img.height;

        // Calculate the aspect ratio
        const aspectRatio = originalWidth / originalHeight;

        // Calculate the new width based on the new height
        const newWidth = newHeight * aspectRatio;

        // Create a canvas and set its dimensions
        const canvas = document.createElement('canvas');
        canvas.width = newWidth;
        canvas.height = newHeight;

        // Draw the image on the canvas
        const ctx = canvas.getContext('2d');
        ctx.drawImage(img, 0, 0, newWidth, newHeight);

        // Get the resized image as a data URL
        const dataURL = canvas.toDataURL('image/jpeg');
        callback(dataURL);
    };
    img.onerror = function () {
        // Handle errors, e.g., image not found
        errorCallback();
    };
}

function rgbToHex(rgb) {
    const rgbArray = rgb.match(/\d+/g); // Extract the numbers from the RGB string
    return rgbArray ? `#${rgbArray.map(x => parseInt(x).toString(16).padStart(2, '0')).join('')}` : null;
}

// Fetch the banners from the JSON file
fetch('resources/banners.json')
    .then(response => response.json())
    .then(banners => {
        function loadImageWithFallback(imageData, onSuccess, onFailure) {
            resizeImage(imageData.image, 400, function (resizedImageDataUrl) {
                document.getElementById('banner-image').src = resizedImageDataUrl;
                document.getElementById('banner-label').style.backgroundColor = imageData.color;
                const hexColor = rgbToHex(imageData.color);
                document.getElementById('banner-border').classList.add(
                    `border-[${hexColor}]/10`,
                    `dark:border-[${hexColor}]/40`
                );
                setTimeout(function () {
                    document.getElementById('banner').classList.remove('hidden');
                    const children = document.getElementById('content').children;
                    for (let i = 0; i < children.length; i++) {
                        children[i].classList.remove('hidden');
                    }
                }, 200);
                onSuccess();
            }, onFailure);
        }

        function attemptToLoadBanner(indexes, onSuccess, onFailure) {
            if (indexes.length === 0) {
                // If no indexes left to try, fail the whole process
                onFailure();
                return;
            }

            var randomIndex = indexes[Math.floor(Math.random() * indexes.length)];
            loadImageWithFallback(banners[randomIndex], function () {
                // Image loaded successfully
                onSuccess();
            }, function () {
                // Remove the failed index and try another
                indexes.splice(indexes.indexOf(randomIndex), 1);
                attemptToLoadBanner(indexes, onSuccess, onFailure);
            });
        }

        // Initial random index
        var allIndexes = Array.from(banners.keys());
        var fallbackIndex = 0;  // The index of the first element to use as a fallback

        // Attempt to load any banner first
        attemptToLoadBanner(allIndexes, function () {
            // Success callback, no further action needed
        }, function () {
            // Initial attempt failed
            if (allIndexes.includes(fallbackIndex)) {
                // Try loading a non-first element
                var nonFirstIndexes = allIndexes.filter(index => index !== fallbackIndex);
                attemptToLoadBanner(nonFirstIndexes, function () {
                    // Success callback for non-first element
                }, function () {
                    // Non-first attempt failed, try the first element as fallback
                    console.error('Failed to load non-first banners, attempting fallback:', fallbackIndex);
                    loadImageWithFallback(banners[fallbackIndex], function () {
                        // Fallback image loaded successfully
                    }, function () {
                        // If the fallback also fails, only remove the hidden class from the content
                        console.error('Failed to load fallback image:', banners[fallbackIndex].image);
                        const children = document.getElementById('content').children;
                        for (let i = 0; i < children.length; i++) {
                            children[i].classList.remove('hidden');
                        }
                    });
                });
            } else {
                // If fallbackIndex is not included, fail directly
                const children = document.getElementById('content').children;
                for (let i = 0; i < children.length; i++) {
                    children[i].classList.remove('hidden');
                }
            }
        });
    })
    .catch(error => {
        // Handle errors in fetching the JSON file
        console.error('Error fetching banners.json:', error);
        const children = document.getElementById('content').children;
        for (let i = 0; i < children.length; i++) {
            children[i].classList.remove('hidden');
        }
    });