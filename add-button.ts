type Site = "imdb" | "filmweb";

(() => {
    let title: string, year: string, site: Site, isSeries: boolean;
    
    const SELECTORS: Record<Site, Record<string, string>> = {
        filmweb: {
            title: ".filmCoverSection__title",
            originalTitle: ".filmCoverSection__originalTitle",
            year:  ".filmCoverSection__year",
            whereToAppend: ".filmPosterSection__plot"
        },
        imdb: {
            title: ".sc-afe43def-1.fDTGTb",
            originalTitle: ".sc-afe43def-3.EpHJp",
            year: ".sc-afe43def-4.kdXikI a",
            whereToAppend: ".sc-6a7933c5-3.cTFejI",
            isSeries: ".sc-385ac629-3.kRUqXl ul li"
        }
    } as const;
    
    if (window.location.host === "www.imdb.com") {
        site = "imdb";
        isSeries = document.querySelector(SELECTORS.imdb.isSeries)?.textContent === "TV Series";
    } else if (window.location.host === "www.filmweb.pl") {
        site = "filmweb";
        isSeries = window.location.href.includes("serial");
    }
    else return;

    let titleElement = document.querySelector(SELECTORS[site].originalTitle);
    if (!titleElement) {
        // in case original title is just title
        titleElement = document.querySelector(SELECTORS[site].title);
    }
    const yearElement = document.querySelector(SELECTORS[site].year);

    if (!titleElement?.textContent || !yearElement?.textContent) return;

    title = site === "filmweb" ? titleElement.textContent : titleElement.textContent.replace("Original title: ", "");
    [year] = yearElement.textContent.split(/[-–]/);

    const query = [...title.split(/\s+/), year].join("-").toLowerCase();

    const UPFLIX_URL = `https://upflix.pl/${isSeries ? "serial" : "film"}/zobacz/${query}`;
    const upflix_link = document.createElement("a");
    upflix_link.href = UPFLIX_URL;
    upflix_link.target = "_blank";
    upflix_link.style.background = 'url("https://upflix.pl/assets/dist/images/logo-dark.png") no-repeat center';
    upflix_link.style.width = "150px";
    upflix_link.style.height = "50px";
    upflix_link.style.borderRadius = "3px";
    upflix_link.style.display = "block";

    document.querySelector(SELECTORS[site].whereToAppend)?.appendChild(upflix_link);
})();