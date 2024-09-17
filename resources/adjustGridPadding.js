// Function to adjust the grid padding based on the image height and viewport height
function adjustGridPadding() {
    const image = document.getElementById("thor-image");
    const gridContainer = document.getElementById("grid-container");
    
    // Only apply the padding on desktop (md and larger screens)
    if (window.innerWidth >= 768) {
        if (image && gridContainer) {
            const imageHeight = image.offsetHeight;
            const viewportHeight = window.innerHeight;

            // Calculate padding as (viewport height - image height) / 2
            const paddingTop = (viewportHeight - imageHeight) / 2;

            // Apply the calculated padding to the grid container
            gridContainer.style.paddingTop = `${paddingTop}px`;
            gridContainer.style.paddingBottom = `${paddingTop}px`;

            image.classList.add("sticky");
            image.classList.add(`top-[${paddingTop}px]`);
        }
    } else {
        // Remove padding on smaller screens
        gridContainer.style.paddingTop = null;
        gridContainer.style.paddingBottom = null;
    }
}