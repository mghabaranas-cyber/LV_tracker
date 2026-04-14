(function() {
    console.log("🚀 LV Tracker : Système d'écoute activé.");

    // Fonction pour afficher la petite bulle sur le site
    function showPopup(data) {
        const toast = document.createElement('div');
        toast.style.cssText = `
            position: fixed; top: 20px; right: 20px; z-index: 10000;
            background: rgba(0,0,0,0.9); color: #d4af37; padding: 15px;
            border-radius: 4px; border: 1px solid #d4af37; font-family: 'Arial', sans-serif;
            box-shadow: 0 4px 20px rgba(0,0,0,0.5); min-width: 250px;
            transition: all 0.5s ease;
        `;
        
        const eventName = data.properties?.event_action || data.event || "Action";
        const price = data.properties?.price ? data.properties.price + " ¥" : "N/A";
        const item = data.properties?.product_sku || "Navigation";

        toast.innerHTML = `
            <div style="font-weight:bold; border-bottom:1px solid #444; margin-bottom:8px; padding-bottom:5px;">LV ANALYTICS</div>
            <div style="font-size:14px;"><b>Evénement :</b> ${eventName}</div>
            <div style="font-size:13px;"><b>Produit :</b> ${item}</div>
            <div style="font-size:13px; color:#fff;"><b>Prix :</b> ${price}</div>
        `;

        document.body.appendChild(toast);
        setTimeout(() => { 
            toast.style.opacity = '0'; 
            toast.style.transform = 'translateX(20px)';
            setTimeout(() => toast.remove(), 500); 
        }, 4000);
    }

    // Capture des requêtes réseau sortantes (sa.gif)
    const oldOpen = XMLHttpRequest.prototype.open;
    XMLHttpRequest.prototype.open = function(method, url) {
        if (url.includes("data=")) {
            try {
                const encodedData = url.split("data=")[1].split("&")[0];
                const decodedData = JSON.parse(atob(decodeURIComponent(encodedData)));
                showPopup(decodedData);
            } catch (e) {
                console.error("Erreur de décodage LV:", e);
            }
        }
        return oldOpen.apply(this, arguments);
    };
})();
