/* ==================================================================
   [global-config.js] - v1.0.1
   الدستور المطور: المحرك المركزي + التنسيق الموحد + نبض الواي فاي
   ================================================================== */

const SB_URL = "https://jmalxvhumgygqxqislut.supabase.co".trim();
const SB_KEY = "sb_publishable_62y7dPN9SEc4U_8Lpu4ZNQ_H1PLDVv8".trim();
const _supabase = supabase.createClient(SB_URL, SB_KEY);

function bootSystem(pageTitle) {
    injectGlobalStyles();    
    renderGlobalLayout(pageTitle); 
    startPulseEngine();      
}

function injectGlobalStyles() {
    const style = document.createElement('style');
    style.textContent = `
        @import url('https://fonts.cdnfonts.com/css/digital-numbers');
        :root {
            --taxi-gold: #f1c40f;
            --taxi-dark: #121212;
            --status-green: #00ff41;
            --status-red: #ff3131;
            --card-bg: #ffffff;
        }
        
        body { 
            margin: 0; padding: 0; font-family: 'Segoe UI', Tahoma, sans-serif; 
            direction: rtl; background: #ececec; color: var(--taxi-dark);
        }

        .main-container { padding: 20px; max-width: 1200px; margin: auto; }

        .elegant-card {
            background: var(--card-bg); border-radius: 12px;
            box-shadow: 0 8px 30px rgba(0,0,0,0.05);
            margin-bottom: 25px; overflow: hidden; border: 1px solid #ddd;
        }

        .card-header {
            background: var(--taxi-dark); color: var(--taxi-gold);
            padding: 15px 25px; font-weight: bold; font-size: 1.1rem;
            border-bottom: 3px solid var(--taxi-gold);
        }

        .global-header {
            display: flex; justify-content: space-between; align-items: center;
            background: var(--taxi-dark); color: white; height: 80px; padding: 0 30px;
            position: sticky; top: 0; z-index: 1000; border-bottom: 3px solid var(--taxi-gold);
        }

        /* تنسيق نبض الوايفاي والساعة */
        .header-left { display: flex; align-items: center; gap: 15px; }
        .wifi-icon { width: 30px; height: 30px; fill: var(--status-green); transition: 0.5s; filter: drop-shadow(0 0 5px var(--status-green)); }

        .taxi-meter-clock {
            font-family: 'Digital Numbers', sans-serif; font-size: 2rem;
            background: #000; padding: 5px 15px; border-radius: 6px;
            color: var(--status-green); text-shadow: 0 0 10px var(--status-green);
        }

        .taxi-form { padding: 20px; }
        .input-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 15px; }
        .form-group { display: flex; flex-direction: column; gap: 5px; }
        .form-group label { font-size: 0.85rem; font-weight: bold; color: #555; }
        .form-group input, .form-group select, .form-group textarea {
            padding: 10px; border: 1px solid #ccc; border-radius: 6px; font-size: 0.9rem;
        }
        .form-group input:focus { border-color: var(--taxi-gold); outline: none; }

        .form-actions { margin-top: 20px; display: flex; gap: 10px; }
        .btn-main { background: var(--taxi-dark); color: var(--taxi-gold); padding: 10px 25px; border: 1px solid var(--taxi-gold); border-radius: 6px; cursor: pointer; font-weight: bold; }
        .btn-sub { background: #ddd; border: none; padding: 10px 20px; border-radius: 6px; cursor: pointer; }

        .table-responsive { padding: 15px; overflow-x: auto; }
        table { width: 100%; border-collapse: collapse; background: white; }
        table th { background: #f8f8f8; padding: 12px; border-bottom: 2px solid #eee; text-align: right; font-size: 0.85rem; }
        table td { padding: 12px; border-bottom: 1px solid #eee; font-size: 0.9rem; }
        
        .badge { padding: 4px 8px; border-radius: 4px; font-size: 0.75rem; font-weight: bold; }
        .bg-active { background: #e6ffed; color: #22863a; border: 1px solid #22863a; }
        .bg-inactive { background: #ffeef0; color: #cb2431; border: 1px solid #cb2431; }

        .sidebar {
            height: 100vh; width: 0; position: fixed; z-index: 2000;
            top: 0; right: 0; background: rgba(18,18,18,0.98);
            transition: 0.3s; overflow-x: hidden; padding-top: 60px;
        }
        .sidebar a { padding: 15px 25px; text-decoration: none; color: #ccc; display: block; transition: 0.3s; border-bottom: 1px solid #222; }
        .sidebar a:hover { background: var(--taxi-gold); color: #000; }
        .overlay { display: none; position: fixed; top: 0; left: 0; width: 100%; height: 100%; background: rgba(0,0,0,0.5); z-index: 1500; }
    `;
    document.head.appendChild(style);
}

function renderGlobalLayout(title) {
    const layout = `
        <header class="global-header">
            <div style="display:flex; align-items:center; gap:15px;">
                <button onclick="toggleNav(true)" style="background:none; border:none; color:var(--taxi-gold); font-size:30px; cursor:pointer;">☰</button>
                <h2 style="margin:0;">${title}</h2>
            </div>
            <div class="header-left">
                
<svg id="pulseSvg" class="wifi-icon" viewBox="0 0 24 24" style="width:30px; height:30px; fill:var(--status-green); transition:0.5s;">
    <path d="M12 21l-12-12c4.4-4.4 11.6-4.4 16 0l-12 12z"/>
    <path d="M12 17l-8-8c2.2-2.2 5.8-2.2 8 0l-8 8z" style="fill:inherit; opacity:0.6;"/>
    <path d="M12 13l-4-4c1.1-1.1 2.9-1.1 4 0l-4 4z" style="fill:inherit; opacity:0.3;"/>
</svg>
                <div id="meterClock" class="taxi-meter-clock">00:00:00</div>
            </div>
        </header>
        <div id="navOverlay" class="overlay" onclick="toggleNav(false)"></div>
        <nav id="sideNav" class="sidebar">
            <a href="t01-cars.html">🚖 السيارات</a>
            <a href="t02-drivers.html">👨‍✈️ السائقين</a>
        </nav>
    `;
    document.body.insertAdjacentHTML('afterbegin', layout);
}

function toggleNav(open) {
    document.getElementById("sideNav").style.width = open ? "280px" : "0";
    document.getElementById("navOverlay").style.display = open ? "block" : "none";
}

function startPulseEngine() {
    const clock = document.getElementById('meterClock');
    const svg = document.getElementById('pulseSvg');
    
    setInterval(async () => {
        // تحديث الساعة
        if (clock) clock.textContent = new Date().toLocaleTimeString('en-GB', { hour12: false });
        
        // فحص النبض (الاتصال)
        try {
            const res = await fetch(SB_URL, { method: 'HEAD' });
            const isOk = res.ok;
            const statusColor = isOk ? "var(--status-green)" : "var(--status-red)";
            if (svg) svg.style.fill = statusColor;
            if (clock) clock.style.color = statusColor;
        } catch (e) {
            if (svg) svg.style.fill = "var(--status-red)";
        }
    }, 1); // فحص النبض كل 5 ثواني
}