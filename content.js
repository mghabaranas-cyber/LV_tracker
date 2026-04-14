(function() {
    console.log("🚀 LV Tracker : Surveillance Totale activée (XHR + Fetch)");

    function showPopup(data) {
        const toast = document.createElement('div');
        toast.style.cssText = `
            position: fixed; top: 20px; right: 20px; z-index: 100000;
            background: #000; color: #d4af37; padding: 15px;
            border-radius: 8px; border: 2px solid #d4af37; font-family: sans-serif;
            box-shadow: 0 4px 20px rgba(0,0,0,0.6); min-width: 250px;
        `;
        
        const eventName = data.properties?.event_action || data.event || "Clic détecté";
        const price = data.properties?.price ? data.properties.price + " ¥" : "---";
        
        toast.innerHTML = `
            <div style="font-weight:bold; color:#fff; margin-bottom:5px;">LV TRACKER LIVE</div>
            <div style="font-size:14px;"><b>Action :</b> ${eventName}</div>
            <div style="font-size:14px;"><b>Prix :</b> ${price}</div>
        `;

        document.body.appendChild(toast);
        setTimeout(() => toast.remove(), 3500);
    }

    // 1. Surveillance de XMLHttpRequest (Ancienne méthode)
    const oldOpen = XMLHttpRequest.prototype.open;
    XMLHttpRequest.prototype.open = function(method, url) {
        this._url = url;
        return oldOpen.apply(this, arguments);
    };

    const oldSend = XMLHttpRequest.prototype.send;
    XMLHttpRequest.prototype.send = function(body) {
        if (this._url && this._url.includes("sa.gif")) {
            const params = new URLSearchParams(this._url.split('?')[1]);
            const rawData = params.get('data');
            if (rawData) {
                try {
                    const decoded = JSON.parse(atob(decodeURIComponent(rawData)));
                    showPopup(decoded);
                } catch(e) {}
            }
        }
        return oldSend.apply(this, arguments);
    };

    // 2. Surveillance de Fetch (Nouvelle méthode)
    const { fetch: originalFetch } = window;
    window.fetch = async (...args) => {
        const [resource, config] = args;
        const url = resource instanceof Request ? resource.url : resource;

        if (url.includes("sa.gif")) {
            const rawData = new URL(url).searchParams.get('data');
            if (rawData) {
                try {
                    const decoded = JSON.parse(atob(decodeURIComponent(rawData)));
                    showPopup(decoded);
                } catch(e) {}
            }
        }
        return originalFetch(resource, config);
    };
})();
