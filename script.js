document.addEventListener('DOMContentLoaded', () => {
    // 1. DATA VOZIDEL
    let vozidla = JSON.parse(localStorage.getItem('fleet_dosi_v15_data')) || [
        { id: 1, kateg: "Tahače", spz: "1TP 1013", znacka: "SCANIA R450", vin: "XLR445566", typ: "Tahač" },
        { id: 6, kateg: "Návěsy", spz: "1TP 1945", znacka: "BERGER", vin: "BER990011", typ: "Plachtový" }
    ];

    // 2. DATA ZAMĚSTNANCŮ
    let zamestnanci = JSON.parse(localStorage.getItem('staff_dosi_data')) || [
        { id: 101, jmeno: "Jan", prijmeni: "Novák", pozice: "Řidič", tel: "+420 777 111 222", nastup: "01.01.2020" },
        { id: 102, jmeno: "Petr", prijmeni: "Svoboda", pozice: "Mechanik", tel: "+420 606 333 444", nastup: "15.05.2021" }
    ];

    function saveAll() {
        localStorage.setItem('fleet_dosi_v15_data', JSON.stringify(vozidla));
        localStorage.setItem('staff_dosi_data', JSON.stringify(zamestnanci));
    }

    // 3. VYKRESLOVÁNÍ SEKCI
    
    // --- ÚVODNÍ STRANA ---
    window.vykresliUvod = function() {
        const mainArea = document.getElementById('main-area');
        mainArea.innerHTML = `
            <div class="welcome-card">
                <h1>Dobrý den,</h1>
                <p>Vítejte v interním systému DOSI Transport s.r.o. Vyberte sekci v menu pro správu dat.</p>
                <div class="stats-grid">
                    <div class="stat-box"><div class="stat-number">${vozidla.length}</div><div>Vozidel v evidenci</div></div>
                    <div class="stat-box"><div class="stat-number">${zamestnanci.length}</div><div>Zaměstnanců</div></div>
                    <div class="stat-box"><div class="stat-number">Aktivní</div><div>Systém běží</div></div>
                </div>
            </div>`;
    };

    // --- AUTOPARK ---
    window.vykresliAutopark = function() {
        const mainArea = document.getElementById('main-area');
        const kategorie = ["Tahače", "Návěsy", "Osobní automobily", "Technické vozidla", "Vyřazené auta"];
        let html = '';

        kategorie.forEach(kat => {
            const filtr = vozidla.filter(v => v.kateg === kat);
            html += `<div class="category-block"><div class="category-title">${kat}</div><div class="category-count">${filtr.length} VOZIDEL</div><div class="item-list">`;
            filtr.forEach(vuz => {
                html += `
                    <div class="rounded-box" onclick="toggleView('v-${vuz.id}')">
                        <span class="box-main-text">${vuz.spz} -</span>
                        <span class="box-sub-text">${vuz.znacka}</span>
                        <span style="font-size:10px; color:#aaa;">DETAIL</span>
                    </div>
                    <div class="details-panel" id="panel-v-${vuz.id}">
                        <table class="info-table">
                            <tr><td class="info-label">VIN:</td><td>${vuz.vin || '-'}</td></tr>
                            <tr><td class="info-label">Typ:</td><td>${vuz.typ || '-'}</td></tr>
                        </table>
                        <div class="btn-row"><button class="action-btn-main btn-delete" onclick="smazatVozidlo(${vuz.id})">SMAZAT</button></div>
                    </div>`;
            });
            html += `<div class="add-box-small" onclick="addVehicle('${kat}')">+</div></div></div>`;
        });
        mainArea.innerHTML = html;
    };

    // --- ZAMĚSTNANCI ---
    window.vykresliZamestnance = function() {
        const mainArea = document.getElementById('main-area');
        let html = `<div class="category-block"><div class="category-title">Seznam zaměstnanců</div><div class="category-count">${zamestnanci.length} OSOB</div><div class="item-list">`;
        
        zamestnanci.forEach(osoba => {
            html += `
                <div class="rounded-box" onclick="toggleView('z-${osoba.id}')">
                    <span class="box-main-text">${osoba.prijmeni}</span>
                    <span class="box-sub-text">${osoba.jmeno}</span>
                    <span style="font-size:10px; color:#aaa;">INFO</span>
                </div>
                <div class="details-panel" id="panel-z-${osoba.id}">
                    <table class="info-table">
                        <tr><td class="info-label">Pozice:</td><td>${osoba.pozice}</td></tr>
                        <tr><td class="info-label">Telefon:</td><td>${osoba.tel}</td></tr>
                        <tr><td class="info-label">Datum nástupu:</td><td>${osoba.nastup}</td></tr>
                    </table>
                    <div class="btn-row"><button class="action-btn-main btn-delete" onclick="smazatZamestnance(${osoba.id})">PROPUSTIT / SMAZAT</button></div>
                </div>`;
        });
        html += `<div class="add-box-small" onclick="addZamestnanec()">+</div></div></div>`;
        mainArea.innerHTML = html;
    };

    // 4. POMOCNÉ FUNKCE
    window.toggleView = (id) => {
        const p = document.getElementById(`panel-${id}`);
        p.style.display = (p.style.display === 'block') ? 'none' : 'block';
    };

    window.smazatVozidlo = (id) => { vozidla = vozidla.filter(v => v.id !== id); saveAll(); vykresliAutopark(); };
    window.smazatZamestnance = (id) => { zamestnanci = zamestnanci.filter(z => z.id !== id); saveAll(); vykresliZamestnance(); };

    window.addVehicle = (kat) => {
        vozidla.push({ id: Date.now(), kateg: kat, spz: "NOVÁ", znacka: "ZNAČKA" });
        saveAll(); vykresliAutopark();
    };

    window.addZamestnanec = () => {
        zamestnanci.push({ id: Date.now(), jmeno: "Nové", prijmeni: "Jméno", pozice: "-", tel: "-", nastup: "-" });
        saveAll(); vykresliZamestnance();
    };

    // 5. NAVIGACE
    document.getElementById('menu-toggle').onclick = () => document.getElementById('side-panel').classList.toggle('collapsed');
    
    document.querySelectorAll('.sheet-item').forEach(item => {
        item.onclick = () => {
            document.querySelectorAll('.sheet-item').forEach(i => i.classList.remove('active'));
            item.classList.add('active');
            const section = item.getAttribute('data-section');
            document.getElementById('current-page-title').innerText = section;

            if (section === "Úvodní strana") vykresliUvod();
            else if (section === "Autopark") vykresliAutopark();
            else if (section === "Zaměstnanci") vykresliZamestnance();
            else document.getElementById('main-area').innerHTML = `<h1 style="padding:20px; color:#eee;">Sekce ${section}</h1>`;
        };
    });

    // START: Po zapnutí načteme Úvodní stranu
    vykresliUvod();
});
