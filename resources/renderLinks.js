// Function to render links
async function renderLinks() {
    const response = await fetch("resources/links.json");
    const links = await response.json();
    const linksColumn = document.getElementById("links-column");

    links.forEach((linkObj) => {  // Add index as a parameter
        const { images } = linkObj;

        // Create anchor element
        const anchor = document.createElement("div");
        anchor.target = "_blank";
        anchor.className = `block w-full flex justify-center items-center relative overflow-hidden`;

        // Handle images in anchor element
        if (images && images.length > 0) {
            // Create a grid layout for the images in the "album" style
            const gridContainer = document.createElement("div");
            gridContainer.className = `grid grid-cols-3 xl:grid-cols-6 w-full gap-0.5`;

            images.forEach((image, imageIndex) => {
                const imganchor = document.createElement("a");
                imganchor.href = "#"; // Prevent navigation

                imganchor.addEventListener("click", (event) => {
                    event.preventDefault(); // Prevent the link from navigating
                    
                    // Disable page scrolling
                    document.body.style.overflow = 'scroll'; // Keep the scrollbar visible

                    // Create the overlay div if it doesn't exist
                    let overlay = document.getElementById("image-overlay");
                    if (!overlay) {
                        overlay = document.createElement("div");
                        overlay.id = "image-overlay";
                        overlay.style.position = "fixed";
                        overlay.style.top = "0";
                        overlay.style.left = "0";
                        overlay.style.width = "100vw";
                        overlay.style.height = "100vh";
                        overlay.style.backgroundColor = "rgba(0, 0, 0, 0.7)";
                        overlay.style.zIndex = "1000";
                        overlay.style.display = "flex";
                        overlay.style.justifyContent = "center";
                        overlay.style.alignItems = "center";
                        overlay.style.cursor = "pointer";
                        
                        // Close the overlay on click
                        overlay.addEventListener("click", () => {
                            overlay.style.display = "none";
                            overlay.innerHTML = ""; // Clear the content when closing
                            document.body.style.overflow = 'auto'; // Enable scrolling again
                        });
                        document.body.appendChild(overlay);
                    }
                    
                    // Clear previous content and set the image inside the overlay
                    overlay.innerHTML = ""; // Clear the previous content
                    const img = document.createElement("img");
                    img.src = image;
                    img.style.maxWidth = "90%";
                    img.style.maxHeight = "90%";
                    img.style.objectFit = "contain";
                    
                    // Append the new image to the overlay
                    overlay.appendChild(img);

                    // Show the overlay
                    overlay.style.display = "flex";
                });

                const img = document.createElement("img");
                img.src = image;
                img.alt = `Image ${imageIndex + 1}`;
                img.className = `w-full h-auto object-cover aspect-4/5]`;  // Apply aspect to the image

                imganchor.appendChild(img);
                gridContainer.appendChild(imganchor);
            });

            anchor.appendChild(gridContainer);
        }

        linksColumn.appendChild(anchor);
    });
}