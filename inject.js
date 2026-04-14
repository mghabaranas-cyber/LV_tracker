(function() {
    console.log("💎 LV TRACKER INJECTÉ");

    function notify(decoded) {
        const div = document.createElement('div');
        div.style.cssText = "position:fixed;top:10px;right:10px;background:black;color:#d4af37;padding:20px;z-index:999999;border:2px solid #d4af37;font-family:monospace;box-shadow:0 0 20px rgba(0,0,0,0.8);";
        const action = decoded.properties?.event_action || decoded.event || "Clic";
        const price = decoded.properties?.price || "---";
        div.innerHTML = `<b>LV LIVE DATA</b><br>ACTION: ${action}<br>PRIX: ${price} ¥`;
        document.body.appendChild(div);
        setTimeout(() => div.remove(), 4000);
    }

    // Capture des images (sa.gif est souvent une image de 1px)
    const oldImage = window.Image;
    window.Image = function() {
        const img = new oldImage();
        Object.defineProperty(img, 'src', {
            set: function(url) {
                if (url.includes('sa.gif') && url.includes('data=')) {
                    try {
                        const raw = url.split('data=')[1].split('&')[0];
                        const data = JSON.parse(atob(decodeURIComponent(raw)));
                        notify(data);
                    } catch(e) {}
                }
                this.setAttribute('src', url);
            }
        });
        return img;
    };
})();
