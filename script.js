// Core diff engine logic
const compareBtn = document.getElementById('compare-btn');
const clearBtn = document.getElementById('clear-btn');
const leftText = document.getElementById('left-text');
const rightText = document.getElementById('right-text');
const output = document.getElementById('output');

const DEV_CAMPAIGNS = [
    {
        title: 'Snyk: Security Scanner',
        desc: 'Automatically scan your code for security flaws as you write. Save 45% on enterprise licenses.',
        promo: 'CODE "SNYK45" FOR 45% DISCOUNT',
        img: 'https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?auto=format&fit=crop&w=200&h=200&q=80'
    },
    {
        title: 'ShipIt DevOps CI/CD',
        desc: 'Deploy absolute serverless nodes from Git commits to production with zero pipelines scripts.',
        promo: 'CODE "SHIPITFREE" FOR 14 DAYS',
        img: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=200&h=200&q=80'
    },
    {
        title: 'MongoDB Atlas Cloud',
        desc: 'Scale JSON database sharding instances globally with premium automated security triggers.',
        promo: 'CLAIM Atlas Code: ATLASMONGO26',
        img: 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&w=200&h=200&q=80'
    },
    {
        title: 'Datadog Performance Trace',
        desc: 'Observe microservices bottleneck calls and optimize cloud infrastructure loads.',
        promo: 'FREE T-SHIRT WITH TRACING: DATADOG100',
        img: 'https://images.unsplash.com/photo-1614741118887-7a4ee193a5fa?auto=format&fit=crop&w=200&h=200&q=80'
    },
    {
        title: 'JetBrains IDE Suite',
        desc: 'Access WebStorm, IntelliJ, and PyCharm with custom code refactoring AI helpers.',
        promo: 'CLAIM 25% DISCOUNT: JETBRAINS25',
        img: 'https://images.unsplash.com/photo-1542744094-3a31f103e35f?auto=format&fit=crop&w=200&h=200&q=80'
    },
    {
        title: 'Retool: Internal Admin Hub',
        desc: 'Assemble premium drag-and-drop admin layouts connected straight to DB/APIs.',
        promo: 'CLAIM COMPILER CODE: RETOOLFREE',
        img: 'https://images.unsplash.com/photo-1587829741301-dc798b83add3?auto=format&fit=crop&w=200&h=200&q=80'
    }
];

let adsDisabled = false;
let interactionCount = 0;

// --- 1. Dynamic Code Diffing Algorithm ---
function computeLineDiff() {
    const leftVal = leftText.value;
    const rightVal = rightText.value;

    if (!leftVal && !rightVal) {
        output.innerHTML = '<div class="placeholder-msg">❌ Please paste some code strings to execute comparison.</div>';
        return;
    }

    const leftLines = leftVal.split('\n');
    const rightLines = rightVal.split('\n');
    
    output.innerHTML = '';
    
    // Simplistic but high-contrast line diffing algorithm
    let i = 0, j = 0;
    while (i < leftLines.length || j < rightLines.length) {
        if (i < leftLines.length && j < rightLines.length) {
            if (leftLines[i] === rightLines[j]) {
                // Unchanged
                const line = document.createElement('div');
                line.className = 'diff-line';
                line.textContent = `  ${leftLines[i]}`;
                output.appendChild(line);
                i++;
                j++;
            } else {
                // Removed then added
                const removedLine = document.createElement('div');
                removedLine.className = 'diff-line removed';
                removedLine.textContent = `- ${leftLines[i]}`;
                output.appendChild(removedLine);
                i++;

                const addedLine = document.createElement('div');
                addedLine.className = 'diff-line added';
                addedLine.textContent = `+ ${rightLines[j]}`;
                output.appendChild(addedLine);
                j++;
            }
        } else if (i < leftLines.length) {
            // Remainder removed
            const line = document.createElement('div');
            line.className = 'diff-line removed';
            line.textContent = `- ${leftLines[i]}`;
            output.appendChild(line);
            i++;
        } else if (j < rightLines.length) {
            // Remainder added
            const line = document.createElement('div');
            line.className = 'diff-line added';
            line.textContent = `+ ${rightLines[j]}`;
            output.appendChild(line);
            j++;
        }
    }
}

if (compareBtn) {
    compareBtn.addEventListener('click', () => {
        // Trigger standard skip interstitial before running comparison matrix
        showSessionInterstitialAd(() => {
            computeLineDiff();
        });
    });
}

if (clearBtn) {
    clearBtn.addEventListener('click', () => {
        leftText.value = '';
        rightText.value = '';
        output.innerHTML = '<div class="placeholder-msg">Your comparison results will appear here.</div>';
    });
}


// --- 2. Programmatic Rotating Sponsor Banner ---
let bannerIndex = 0;
function startRotatingBanner() {
    const banner = document.getElementById('floating-ad-banner');
    if (!banner || adsDisabled) return;

    const campaign = DEV_CAMPAIGNS[bannerIndex];
    bannerIndex = (bannerIndex + 1) % DEV_CAMPAIGNS.length;

    banner.innerHTML = `
        <div class="ad-sponsor-container">
            <img src="${campaign.img}" alt="${campaign.title}">
            <div class="banner-content">
                <p>Curated DevOps Sponsor</p>
                <strong>${campaign.title}</strong>
            </div>
        </div>
        <div class="banner-actions">
            <button class="btn-banner-action" id="btn-banner-claim">Claim Discount</button>
            <button class="btn-banner-close" id="btn-banner-close">×</button>
        </div>
    `;

    banner.style.display = 'flex';

    // Hook listeners
    document.getElementById('btn-banner-claim')?.addEventListener('click', () => {
        alert(`🎉 Copied promo code: "${campaign.promo.split('"')[1] || 'SNYK45'}" to clipboard!`);
        window.open('#', '_blank');
    });

    document.getElementById('btn-banner-close')?.addEventListener('click', () => {
        banner.style.display = 'none';
    });
}

// Initial banner launch and rotate every 10 seconds
setTimeout(() => {
    startRotatingBanner();
    setInterval(startRotatingBanner, 10000);
}, 2000);


// --- 3. Decoupled Timed Interstitial Countdown System ---
let interstitialCallback = null;
let interstitialTimer = null;
const interstitialModal = document.getElementById('interstitialModal');
const btnSkipAd = document.getElementById('btn-skip-ad');
const btnClaimAd = document.getElementById('btn-claim-ad');

function showSessionInterstitialAd(onClosed) {
    if (adsDisabled || !interstitialModal) {
        onClosed();
        return;
    }
    
    interstitialCallback = onClosed;
    
    // Choose a random campaign
    const campaign = DEV_CAMPAIGNS[Math.floor(Math.random() * DEV_CAMPAIGNS.length)];
    const imgEl = document.getElementById('interstitial-ad-img');
    const titleEl = document.getElementById('interstitial-ad-title');
    const descEl = document.getElementById('interstitial-ad-desc');
    const promoEl = document.getElementById('interstitial-ad-promo');
    
    if (imgEl) imgEl.src = campaign.img;
    if (titleEl) titleEl.innerText = campaign.title;
    if (descEl) descEl.innerText = campaign.desc;
    if (promoEl) promoEl.innerText = campaign.promo;

    interstitialModal.style.display = 'flex';
    
    btnSkipAd.disabled = true;
    btnSkipAd.style.opacity = '0.4';
    btnSkipAd.style.cursor = 'not-allowed';
    btnSkipAd.innerText = 'Skip Ad in 5s';
    
    let count = 5;
    if (interstitialTimer) clearInterval(interstitialTimer);
    
    interstitialTimer = setInterval(() => {
        count--;
        if (count > 0) {
            btnSkipAd.innerText = `Skip Ad in ${count}s`;
        } else {
            clearInterval(interstitialTimer);
            btnSkipAd.innerText = 'Skip Ad';
            btnSkipAd.disabled = false;
            btnSkipAd.style.opacity = '1';
            btnSkipAd.style.cursor = 'pointer';
        }
    }, 1000);
}

if (btnSkipAd) {
    btnSkipAd.addEventListener('click', () => {
        interstitialModal.style.display = 'none';
        
        // Trigger success synchronization celebration modal!
        const celebrationModal = document.getElementById('celebrationModal');
        if (celebrationModal) {
            celebrationModal.style.display = 'flex';
        } else if (interstitialCallback) {
            interstitialCallback();
        }
    });
}

if (btnClaimAd) {
    btnClaimAd.addEventListener('click', () => {
        alert('🎉 DevOps discount registered! Redirecting to partner form.');
        interstitialModal.style.display = 'none';
        
        const celebrationModal = document.getElementById('celebrationModal');
        if (celebrationModal) {
            celebrationModal.style.display = 'flex';
        } else if (interstitialCallback) {
            interstitialCallback();
        }
    });
}

// Celebration close handler
const btnCloseCelebrationModal = document.getElementById('btn-close-celebration');
if (btnCloseCelebrationModal) {
    btnCloseCelebrationModal.addEventListener('click', () => {
        document.getElementById('celebrationModal').style.display = 'none';
        if (interstitialCallback) {
            interstitialCallback();
            interstitialCallback = null;
        }
    });
}


// --- 4. Scarcity Upgrade Tier & Timer Engine ---
let upgradeTimer = null;
const premiumUpgradeModal = document.getElementById('premiumUpgradeModal');

function triggerUpgradeModal() {
    if (adsDisabled || !premiumUpgradeModal) return;
    
    premiumUpgradeModal.style.display = 'flex';
    let duration = 600; // 10 minutes
    const countdownEl = document.getElementById('scarcity-countdown');

    if (upgradeTimer) clearInterval(upgradeTimer);

    upgradeTimer = setInterval(() => {
        duration--;
        const minutes = Math.floor(duration / 60);
        const seconds = duration % 60;
        if (countdownEl) {
            countdownEl.innerText = `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
        }
        if (duration <= 0) {
            clearInterval(upgradeTimer);
            premiumUpgradeModal.style.display = 'none';
        }
    }, 1000);
}

// Trigger upgrade modal after 40 seconds of active diff management
setTimeout(triggerUpgradeModal, 40000);

document.getElementById('btn-skip-upgrade')?.addEventListener('click', () => {
    premiumUpgradeModal.style.display = 'none';
    clearInterval(upgradeTimer);
});

// Acknowledge upgrade purchase (disable ads)
document.getElementById('btn-upgrade-now')?.addEventListener('click', () => {
    alert('🏆 Welcome to DiffCheck Platinum! Premium compiler integration active, ads silenced.');
    adsDisabled = true;
    premiumUpgradeModal.style.display = 'none';
    const banner = document.getElementById('floating-ad-banner');
    if (banner) banner.style.display = 'none';
    clearInterval(upgradeTimer);
});


// --- 5. Exit Intent & Mock Ad-Blocker Overlays ---
let exitIntentShown = false;
document.addEventListener("mouseout", (e) => {
    if (e.clientY < 0 && !exitIntentShown && !adsDisabled) {
        exitIntentShown = true;
        const exitModal = document.getElementById("exitIntentModal");
        if (exitModal) exitModal.style.display = "flex";
    }
});

document.getElementById("closeExitIntent")?.addEventListener("click", () => {
    document.getElementById("exitIntentModal").style.display = "none";
});
document.getElementById("declineExitIntent")?.addEventListener("click", (e) => {
    e.preventDefault();
    document.getElementById("exitIntentModal").style.display = "none";
});

// Ad Blocker whitelisting check
setTimeout(() => {
    if (adsDisabled) return;
    const isAdBlockerActive = Math.random() < 0.15; // 15% simulation chance
    if (isAdBlockerActive) {
        const adBlockModal = document.getElementById("adBlockModal");
        if (adBlockModal) adBlockModal.style.display = "flex";
    }
}, 5000);

document.getElementById('btn-adblock-premium')?.addEventListener('click', () => {
    alert('🏆 Pro Activated! Ad overlays disabled.');
    adsDisabled = true;
    document.getElementById("adBlockModal").style.display = "none";
    const banner = document.getElementById('floating-ad-banner');
    if (banner) banner.style.display = 'none';
});

// Action hooks for leaderboard/anchor
document.getElementById('btn-leaderboard-claim')?.addEventListener('click', () => {
    alert('🎉 ShipIt webinar seat reserved! Free DevOps guide copied to clipboard.');
});
document.getElementById('btn-anchor-claim')?.addEventListener('click', () => {
    alert('🎉 Platinum discount coupon synced with checkout!');
});
document.querySelector('.close-anchor')?.addEventListener('click', () => {
    document.querySelector('.sticky-anchor-ad').style.display = 'none';
});

// Footer direct premium activation
document.getElementById('footer-adblock-premium-btn')?.addEventListener('click', (e) => {
    e.preventDefault();
    alert('🏆 Pro Activated! DevOps ads silenced.');
    adsDisabled = true;
    const banner = document.getElementById('floating-ad-banner');
    if (banner) banner.style.display = 'none';
});
