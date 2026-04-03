(function() {
  'use strict';
  
  // ⚙️ CONFIGURATION
  const COMMIT_HASH = 'f7197465783e208c122f82290e2b888c0170ffb9'; // ⚠️ REMPLACE PAR TON HASH !
  const JSON_URL = `https://cdn.jsdelivr.net/gh/TheClow22/htlm-pages-supp@${COMMIT_HASH}/races-vanes.json`;
  
  let racesData = {};
  
  // 📥 CHARGEMENT DU JSON
  fetch(JSON_URL)
    .then(res => res.json())
    .then(data => {
      racesData = data;
      genererCartes();
      genererPagesDetailees();
    })
    .catch(err => console.error('❌ Erreur chargement JSON:', err));
  
  // 🎴 GÉNÉRATION DES CARTES DANS LES GRILLES
  function genererCartes() {
    const categories = {
      'v-cd': 'Dominantes',
      'v-ci': 'Intermédiaires',
      'v-cm': 'Mineures'
    };
    
    Object.keys(categories).forEach(catId => {
      const grille = document.querySelector(`#${catId} .rg`);
      if (!grille) return;
      
      grille.innerHTML = ''; // Vide la grille
      
      Object.keys(racesData).forEach(raceKey => {
        const race = racesData[raceKey];
        if (race.categorie !== categories[catId]) return;
        
        const carte = document.createElement('div');
        carte.className = 'rc';
        carte.setAttribute('data-go', `v-${raceKey}`);
        
        carte.innerHTML = `
          <div class="rb" style="background-image:url('${race.cardImage}')"></div>
          <div class="ra">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M9 18l6-6-6-6"></path>
            </svg>
          </div>
          <div class="ry">
            <div class="rt">${race.tagline}</div>
            <div class="rn">${race.nom}</div>
            <div class="re">${race.accroche}</div>
          </div>
        `;
        
        grille.appendChild(carte);
      });
    });
  }
  
  // 📄 GÉNÉRATION DES PAGES DÉTAILLÉES
  function genererPagesDetailees() {
    const container = document.getElementById('va');
    if (!container) return;
    
    const raceKeys = Object.keys(racesData);
    
    raceKeys.forEach((raceKey, index) => {
      const race = racesData[raceKey];
      const page = document.createElement('div');
      page.id = `v-${raceKey}`;
      page.className = 'vw';
      
      // Images lightbox
      const imagesHTML = race.images.map(img => 
        `<img src="${img}" alt="" class="lbt" />`
      ).join('');
      
      // Description
      const descHTML = race.description.join('\n');
      
      // Pouvoirs flip
      const pouvoirsHTML = race.pouvoirs.map(p => `
        <div class="fc">
          <div class="fi">
            <div class="ff">
              <div class="pnm">${p.nom}</div>
              <div class="pds">${p.desc}</div>
              <div class="fh">survoler</div>
            </div>
            <div class="fk">
              <div class="pds">${p.phrase}</div>
            </div>
          </div>
        </div>
      `).join('');
      
      // Particularités
      const particularitesHTML = race.particularites.map(p => `
        <div class="tc">
          <div class="pnm">${p.nom}</div>
          <div class="pds">${p.desc}</div>
        </div>
      `).join('');
      
      // Navigation précédent/suivant
      const prevKey = index > 0 ? raceKeys[index - 1] : null;
      const nextKey = index < raceKeys.length - 1 ? raceKeys[index + 1] : null;
      const prevRace = prevKey ? racesData[prevKey] : null;
      const nextRace = nextKey ? racesData[nextKey] : null;
      
      const navPrevHTML = prevRace ? `
        <div class="fl" data-go="v-${prevKey}">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <path d="M15 18l-6-6 6-6"></path>
          </svg>
          <div>
            <div class="fll">Précédent</div>
            <div class="fln">${prevRace.nom}</div>
          </div>
        </div>
      ` : '<div></div>';
      
      const navNextHTML = nextRace ? `
        <div class="fl nx" data-go="v-${nextKey}">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <path d="M9 18l6-6-6-6"></path>
          </svg>
          <div>
            <div class="fll">Suivant</div>
            <div class="fln">${nextRace.nom}</div>
          </div>
        </div>
      ` : '<div></div>';
      
      // Bouton retour catégorie
      const retourCat = race.categorie === 'Dominantes' ? 'v-cd' : 
                        race.categorie === 'Intermédiaires' ? 'v-ci' : 'v-cm';
      
      page.innerHTML = `
        <div class="rh">
          <div class="rhi">${imagesHTML}</div>
          <div class="rhg"></div>
          <div class="rht">
            <div class="bc">Vanes <span>›</span> ${race.categorie} <span>›</span> ${race.nom}</div>
            <div class="rtg">${race.tagline}</div>
            <h1 class="rti">${race.nom}</h1>
            <div class="rln"></div>
          </div>
        </div>
        
        <div class="rbdy">
          <button class="bb" data-go="${retourCat}">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M19 12H5M12 19l-7-7 7-7"></path>
            </svg> Vanes ${race.categorie}
          </button>
          
          <div class="rdsc">${descHTML}</div>
          
          <div class="sh">
            <h2>Pouvoirs & Caractéristiques</h2>
          </div>
          
          <div class="pg">
            <div class="pcl">
              <h3>✧ Pouvoirs & Capacités ✧</h3>
              ${pouvoirsHTML}
            </div>
            
            <div class="pcl">
              <h3>✧ Particularités Physiques ✧</h3>
              ${particularitesHTML}
            </div>
          </div>
          
          <div class="rf">
            ${navPrevHTML}
            ${navNextHTML}
          </div>
        </div>
      `;
      
      container.appendChild(page);
    });
  }
})();
