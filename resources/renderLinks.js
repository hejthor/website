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
        }

        // If backgrounds are provided, stack them
        if (images && images.length > 0) {
            images.forEach((background, index) => {
                const bgDiv = document.createElement("div");
                bgDiv.className = "absolute top-0 left-0 w-full h-full bg-cover bg-center";
                bgDiv.style.backgroundImage = `url(${background})`;
                bgDiv.style.zIndex = index;  // Ensure that the second image is on top of the first
                if (scale) {
                    bgDiv.style.transform = `scale(${scale})`; // Apply scaling factor to the background images
                }
                bgDiv.style.transformOrigin = "center center";  // Ensure scaling happens from the center

                anchor.appendChild(bgDiv);
            });
        }

        // Create img element if icon exists
        if (icon) {
            const img = document.createElement("img");
            img.src = icon;
            img.alt = "Icon";
            img.className = "w-14 md:w-10 object-contain relative z-10"; // Make sure icon is on top
            anchor.appendChild(img);
        }

        linksColumn.appendChild(anchor);
    });
}