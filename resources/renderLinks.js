// Function to render links
async function renderLinks() {
    const response = await fetch("resources/links.json");
    const links = await response.json();
    const linksColumn = document.getElementById("links-column");

    links.forEach((linkObj, index) => {  // Add index as a parameter
        const { link, icon, color, images, aspect, scale } = linkObj;

        // Create anchor element
        const anchor = document.createElement("a");
        anchor.href = link;
        anchor.target = "_blank";
        anchor.className =linkObj.style == "album" ? `block w-full flex justify-center items-center relative overflow-hidden` : `block w-full aspect-[${aspect}] flex justify-center items-center relative overflow-hidden`;

        // Use background color if provided
        if (color) {
            anchor.style.backgroundColor = color;
        } else {
            // Alternate background classes based on index
            const lightBgClass = index % 2 === 0 ? 'bg-[#f5f5f5]' : 'bg-[#ededed]';
            const darkBgClass = index % 2 === 0 ? 'dark:bg-[#161616]' : 'dark:bg-[#1c1c1c]';
            anchor.classList.add(lightBgClass, darkBgClass);
        }

        // Handle images in anchor element
        if (images && images.length > 0) {
            if (linkObj.style === 'album') {
                // Create a grid layout for the images in the "album" style
                const columnCount = 2;
                const gridContainer = document.createElement("div");
                gridContainer.className = `grid grid-cols-${columnCount} w-full`;

                images.forEach((image, imageIndex) => {
                    const img = document.createElement("img");
                    img.src = image;
                    img.alt = `Image ${imageIndex + 1}`;
                    img.className = `w-full h-auto object-cover aspect-[${aspect}]`;  // Apply aspect to the image

                    gridContainer.appendChild(img);
                });

                anchor.appendChild(gridContainer);
            } else {
                // Layered style
                images.forEach((background, index) => {
                    const bgDiv = document.createElement("div");
                    bgDiv.className = "absolute top-0 left-0 w-full h-full bg-center bg-no-repeat";
                    bgDiv.style.backgroundImage = `url(${background})`;
                    bgDiv.style.zIndex = index;

                    bgDiv.style.backgroundSize = "contain";
                    bgDiv.style.backgroundPosition = "center center";

                    if (scale) {
                        const widthPercentage = scale;
                        const heightPercentage = (widthPercentage / aspect) * 100;

                        bgDiv.style.width = `${widthPercentage * 100}%`;
                        bgDiv.style.height = `${heightPercentage * 100}%`;
                        bgDiv.style.top = `${(100 - heightPercentage * 100) / 2}%`;
                        bgDiv.style.left = `${(100 - widthPercentage * 100) / 2}%`;
                    }

                    anchor.appendChild(bgDiv);
                });
            }
        }

        // Disable anchor if no link exists
        if (!link) {
            anchor.style.pointerEvents = "none";  // Disable clicks on anchor
        }

        // Create img element if icon exists
        if (icon) {
            const img = document.createElement("img");
            img.src = icon;
            img.alt = "Icon";
            // Check for icon-scale and apply it if present, default to 14 if not
            const iconScale = linkObj['icon-scale'] || 14; // Default to 14 if icon-scale is not provided
            const scaleDifference = (14 - iconScale) / 2;
            const marginRight = 3 + scaleDifference; // Subtract half the difference from 4

            img.className = `w-${iconScale} object-contain absolute top-0 right-0 mt-4 mr-${marginRight} z-10`; // Position icon bottom-right with margin
            anchor.appendChild(img);
        }

        linksColumn.appendChild(anchor);
    });
}