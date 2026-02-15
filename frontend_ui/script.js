// API Configuration
const API_BASE_URL = 'http://127.0.0.1:8000';

// DOM Elements
const claimInput = document.getElementById('claim-input');
const analyzeBtn = document.getElementById('analyze-btn');
const loadingContainer = document.getElementById('loading');
const resultsSection = document.getElementById('results');
const errorMessage = document.getElementById('error-message');
const errorText = document.getElementById('error-text');

// Result Elements
const scoreValue = document.getElementById('score-value');
const verdictBadge = document.getElementById('verdict-badge');
const verdictIcon = document.getElementById('verdict-icon');
const verdictValue = document.getElementById('verdict-value');
const biasValue = document.getElementById('bias-value');
const reasoningContent = document.getElementById('reasoning-content');
const sourcesContainer = document.getElementById('sources-container');

// Event Listeners
analyzeBtn.addEventListener('click', analyzeClaim);
claimInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter' && e.ctrlKey) {
        analyzeClaim();
    }
});

// Main Analysis Function
async function analyzeClaim() {
    const claim = claimInput.value.trim();

    // Validation
    if (!claim) {
        showError('Please enter a claim to verify.');
        return;
    }

    if (claim.length < 10) {
        showError('Please enter a more detailed claim (at least 10 characters).');
        return;
    }

    // Reset UI
    hideError();
    hideResults();
    showLoading();
    disableButton();

    try {
        // Make API Request
        const response = await fetch(`${API_BASE_URL}/analyze`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ text: claim }),
        });

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();

        // Display Results
        displayResults(data);

    } catch (error) {
        console.error('Error analyzing claim:', error);
        
        if (error.message.includes('Failed to fetch') || error.message.includes('NetworkError')) {
            showError('🔌 Cannot connect to backend. Please ensure the backend server is running on port 8000.');
        } else if (error.message.includes('timeout')) {
            showError('⏱️ Request timed out. The analysis is taking longer than expected.');
        } else {
            showError(`❌ Error: ${error.message}`);
        }
    } finally {
        hideLoading();
        enableButton();
    }
}

// Display Results Function
function displayResults(data) {
    // Truth Score
    animateScore(data.final_truth_score);

    // Verdict
    const verdict = data.verification.verdict;
    const verdictConfig = getVerdictConfig(verdict);
    
    verdictIcon.textContent = verdictConfig.emoji;
    verdictValue.textContent = verdict;
    verdictBadge.style.background = verdictConfig.bg;
    verdictBadge.style.color = verdictConfig.color;
    verdictBadge.style.borderColor = verdictConfig.color;
    verdictBadge.style.boxShadow = `0 8px 32px ${verdictConfig.shadow}, 0 0 0 1px ${verdictConfig.color}40 inset`;

    // Bias Level
    biasValue.textContent = data.bias_level;

    // Reasoning
    reasoningContent.textContent = data.verification.reasoning;

    // Sources
    displaySources(data.verification.sources);

    // Show Results
    showResults();
    
    // Smooth scroll to results
    setTimeout(() => {
        resultsSection.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    }, 300);
}

// Animate Score Counter
function animateScore(targetScore) {
    const duration = 1500; // 1.5 seconds
    const startTime = Date.now();
    const startScore = 0;

    function updateScore() {
        const currentTime = Date.now();
        const elapsed = currentTime - startTime;
        const progress = Math.min(elapsed / duration, 1);

        // Easing function (easeOutCubic)
        const easeProgress = 1 - Math.pow(1 - progress, 3);
        const currentScore = Math.round(startScore + (targetScore - startScore) * easeProgress);

        scoreValue.textContent = `📊 ${currentScore} / 100`;

        if (progress < 1) {
            requestAnimationFrame(updateScore);
        }
    }

    updateScore();
}

// Get Verdict Configuration
function getVerdictConfig(verdict) {
    const configs = {
        'TRUE': {
            color: '#10b981',
            emoji: '✓',
            bg: 'rgba(16, 185, 129, 0.15)',
            shadow: 'rgba(16, 185, 129, 0.3)'
        },
        'FALSE': {
            color: '#ef4444',
            emoji: '✗',
            bg: 'rgba(239, 68, 68, 0.15)',
            shadow: 'rgba(239, 68, 68, 0.3)'
        },
        'UNCERTAIN': {
            color: '#f59e0b',
            emoji: '⚠',
            bg: 'rgba(245, 158, 11, 0.15)',
            shadow: 'rgba(245, 158, 11, 0.3)'
        }
    };

    return configs[verdict] || {
        color: 'white',
        emoji: '?',
        bg: 'rgba(255, 255, 255, 0.1)',
        shadow: 'rgba(255, 255, 255, 0.2)'
    };
}

// Display Sources
function displaySources(sources) {
    sourcesContainer.innerHTML = '';

    if (!sources || sources.length === 0) {
        sourcesContainer.innerHTML = `
            <div class="no-sources">
                <div class="no-sources-icon">📭</div>
                <div class="no-sources-text">No sources available</div>
            </div>
        `;
        return;
    }

    sources.forEach((source, index) => {
        const credibilityClass = `credibility-${source.credibility.toLowerCase()}`;
        const delay = index * 0.1;

        const sourceCard = document.createElement('div');
        sourceCard.className = 'source-card';
        sourceCard.style.animationDelay = `${delay}s`;
        sourceCard.innerHTML = `
            <div class="source-header">
                <div class="source-number">SOURCE ${index + 1}</div>
                <div class="credibility-badge ${credibilityClass}">
                    ${source.credibility} CREDIBILITY
                </div>
            </div>
            <a href="${escapeHtml(source.url)}" target="_blank" rel="noopener noreferrer" class="source-title">
                ${escapeHtml(source.title)}
            </a>
        `;

        sourcesContainer.appendChild(sourceCard);
    });
}

// Utility Functions
function showLoading() {
    loadingContainer.classList.remove('hidden');
}

function hideLoading() {
    loadingContainer.classList.add('hidden');
}

function showResults() {
    resultsSection.classList.remove('hidden');
}

function hideResults() {
    resultsSection.classList.add('hidden');
}

function showError(message) {
    errorText.textContent = message;
    errorMessage.classList.remove('hidden');
    
    // Auto-hide after 5 seconds
    setTimeout(() => {
        hideError();
    }, 5000);
}

function hideError() {
    errorMessage.classList.add('hidden');
}

function disableButton() {
    analyzeBtn.disabled = true;
    analyzeBtn.style.opacity = '0.6';
}

function enableButton() {
    analyzeBtn.disabled = false;
    analyzeBtn.style.opacity = '1';
}

function escapeHtml(text) {
    const map = {
        '&': '&amp;',
        '<': '&lt;',
        '>': '&gt;',
        '"': '&quot;',
        "'": '&#039;'
    };
    return text.replace(/[&<>"']/g, m => map[m]);
}

// Add smooth scroll behavior
document.documentElement.style.scrollBehavior = 'smooth';

// Add input character counter (optional enhancement)
claimInput.addEventListener('input', () => {
    const length = claimInput.value.length;
    const minLength = 10;
    
    if (length > 0 && length < minLength) {
        claimInput.style.borderColor = 'rgba(245, 158, 11, 0.5)';
    } else if (length >= minLength) {
        claimInput.style.borderColor = 'rgba(16, 185, 129, 0.5)';
    } else {
        claimInput.style.borderColor = 'rgba(255, 255, 255, 0.2)';
    }
});

// Add keyboard shortcuts info
console.log('%c🚀 AI Truth Engine', 'font-size: 20px; font-weight: bold; color: #6366f1;');
console.log('%cKeyboard Shortcuts:', 'font-size: 14px; font-weight: bold;');
console.log('Ctrl + Enter: Analyze claim');
console.log('\n%c⚡ Backend API:', 'font-size: 14px; font-weight: bold;');
console.log(`${API_BASE_URL}/analyze`);

// Add copy button functionality for reasoning (optional enhancement)
document.addEventListener('DOMContentLoaded', () => {
    // Add subtle animations on scroll
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            }
        });
    }, observerOptions);

    // Observe elements when they come into view
    document.querySelectorAll('.source-card, .info-card').forEach(el => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(20px)';
        el.style.transition = 'opacity 0.5s ease, transform 0.5s ease';
        observer.observe(el);
    });
});

// Add favicon change on different states
function updateFavicon(state) {
    // This would update the favicon based on the state
    // 'loading', 'success', 'error', 'default'
    // Implementation depends on having different favicon files
}

// Handle network status
window.addEventListener('online', () => {
    hideError();
    console.log('✅ Connection restored');
});

window.addEventListener('offline', () => {
    showError('🔌 No internet connection. Please check your network.');
    console.log('⚠️ Connection lost');
});

// Performance monitoring (optional)
if ('performance' in window) {
    window.addEventListener('load', () => {
        const perfData = performance.getEntriesByType('navigation')[0];
        if (perfData) {
            console.log(`%c⚡ Page loaded in ${Math.round(perfData.loadEventEnd - perfData.fetchStart)}ms`, 
                'color: #10b981; font-weight: bold;');
        }
    });
}
