// Function to render links
async function renderLinks() {
    const response = await fetch("resources/links.json");
    const links = await response.json();
    const linksColumn = document.getElementById("links-column");

    links.forEach(linkObj => {
        const { link, icon, color } = linkObj;

        // Create anchor element
        const anchor = document.createElement("a");
        anchor.href = link;
        anchor.target = "_blank";
        anchor.className = "block w-full aspect-[3/1] md:aspect-[4/1] flex justify-center items-center";
        anchor.style.backgroundColor = color;

        // Create img element if icon exists
        if (icon) {
            const img = document.createElement("img");
            img.src = icon;
            img.alt = "Icon";
            img.className = "w-12 object-contain";
            anchor.appendChild(img);
        }

        linksColumn.appendChild(anchor);
    });
}