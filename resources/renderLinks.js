// Function to render links
async function renderLinks() {
    const response = await fetch("resources/links.json");
    const links = await response.json();
    const linksColumn = document.getElementById("links-column");

    links.forEach(linkObj => {
        const { link, icon, color, images, aspect, scale } = linkObj;

        // Create anchor element
        const anchor = document.createElement("a");
        anchor.href = link;
        anchor.target = "_blank";
        anchor.className = `block w-full aspect-[${aspect}] flex justify-center items-center relative overflow-hidden`;

        // Use background color if provided
        if (color) {
            anchor.style.backgroundColor = color;
        } else {
            anchor.classList.add('bg-neutral-200', 'dark:bg-neutral-900');
        }

        // If backgrounds are provided, stack them
        if (images && images.length > 0) {
            images.forEach((background, index) => {
                const bgDiv = document.createElement("div");
                bgDiv.className = "absolute top-0 left-0 w-full h-full bg-center bg-no-repeat";
                bgDiv.style.backgroundImage = `url(${background})`;
                bgDiv.style.zIndex = index;  // Ensure that the second image is on top of the first
                
                // Maintain aspect ratio and scale image
                bgDiv.style.backgroundSize = "contain";  // Ensure the image maintains its aspect ratio
                bgDiv.style.backgroundPosition = "center center";  // Center the image

                // Apply scaling without distorting aspect ratio
                if (scale) {
                    bgDiv.style.width = `${100 * scale}%`;  // Scale width based on the scale factor
                    bgDiv.style.height = `${100 * scale}%`;  // Scale height based on the scale factor
                    bgDiv.style.top = `${(100 - 100 * scale) / 2}%`;  // Adjust top position to center vertically
                    bgDiv.style.left = `${(100 - 100 * scale) / 2}%`;  // Adjust left position to center horizontally
                }

                anchor.appendChild(bgDiv);
            });
        }

        // Create img element if icon exists
        if (icon) {
            const img = document.createElement("img");
            img.src = icon;
            img.alt = "Icon";
            img.className = "w-14 md:w-12 object-contain relative z-10"; // Make sure icon is on top
            anchor.appendChild(img);
        }

        linksColumn.appendChild(anchor);
    });
}