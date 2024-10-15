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
        anchor.className = `block w-full aspect-[${aspect}] flex justify-center items-center relative overflow-hidden`;

        // Use background color if provided
        if (color) {
            anchor.style.backgroundColor = color;
        } else {
            // Alternate background classes based on index
            const lightBgClass = index % 2 === 0 ? 'bg-[#f5f5f5]' : 'bg-[#ededed]';
            const darkBgClass = index % 2 === 0 ? 'dark:bg-[#161616]' : 'dark:bg-[#1c1c1c]';
            anchor.classList.add(lightBgClass, darkBgClass);
        }

        // If backgrounds are provided, stack them
        if (images && images.length > 0) {
            images.forEach((background, index) => {
                const bgDiv = document.createElement("div");
                bgDiv.className = "absolute top-0 left-0 w-full h-full bg-center bg-no-repeat";
                bgDiv.style.backgroundImage = `url(${background})`;
                bgDiv.style.zIndex = index;  // Ensure that the second image is on top of the first
                
                // Maintain aspect ratio and scale image based on container width
                bgDiv.style.backgroundSize = "contain";  // Ensure the image maintains its aspect ratio
                bgDiv.style.backgroundPosition = "center center";  // Center the image

                // Apply scaling based on percentage of container width
                if (scale) {
                    const widthPercentage = scale;  // Scale width as a percentage of container width
                    const heightPercentage = (widthPercentage / aspect) * 100;  // Calculate height based on aspect ratio

                    bgDiv.style.width = `${widthPercentage * 100}%`;  // Set width as percentage of container width
                    bgDiv.style.height = `${heightPercentage * 100}%`;  // Set height based on aspect ratio
                    bgDiv.style.top = `${(100 - heightPercentage * 100) / 2}%`;  // Adjust top position to center vertically
                    bgDiv.style.left = `${(100 - widthPercentage * 100) / 2}%`;  // Adjust left position to center horizontally
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