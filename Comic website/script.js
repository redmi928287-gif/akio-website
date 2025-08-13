// Global variables
let isAdminMode = false;
let comics = [];
let ads = [];
let userLikes = new Set(); // Track which comics user has liked
let users = []; // Array to store all users

// Admin credentials
const ADMIN_CREDENTIALS = {
    username: 'admin',
    password: '21268012'
};

// Random username generators
const usernamePrefixes = [
    'Comic', 'Manga', 'Anime', 'Hero', 'Villain', 'Super', 'Dark', 'Light', 
    'Shadow', 'Star', 'Moon', 'Sun', 'Fire', 'Ice', 'Thunder', 'Storm', 'Wind',
    'Earth', 'Water', 'Nature', 'Magic', 'Tech', 'Cyber', 'Neo', 'Ultra', 'Mega'
];

const usernameSuffixes = [
    'Lover', 'Reader', 'Fan', 'Collector', 'Enthusiast', 'Explorer', 'Adventurer',
    'Warrior', 'Knight', 'Mage', 'Archer', 'Ninja', 'Samurai', 'Wizard', 'Dragon',
    'Phoenix', 'Wolf', 'Tiger', 'Eagle', 'Lion', 'Bear', 'Fox', 'Cat', 'Dog'
];

const randomNames = [
    'Alex', 'Sam', 'Jordan', 'Taylor', 'Casey', 'Riley', 'Morgan', 'Quinn',
    'Avery', 'Blake', 'Cameron', 'Drew', 'Emery', 'Finley', 'Gray', 'Harper',
    'Indigo', 'Jules', 'Kai', 'Lane', 'Mickey', 'Nova', 'Ocean', 'Parker'
];

// Generate random username
function generateRandomUsername() {
    const prefix = usernamePrefixes[Math.floor(Math.random() * usernamePrefixes.length)];
    const suffix = usernameSuffixes[Math.floor(Math.random() * usernameSuffixes.length)];
    const randomName = randomNames[Math.floor(Math.random() * randomNames.length)];
    
    // Randomly choose format
    const formats = [
        `${prefix}${suffix}`,
        `${randomName}${prefix}`,
        `${prefix}${randomName}`,
        `${randomName}${suffix}`,
        `${prefix}_${suffix}`,
        `${randomName}_${prefix}`
    ];
    
    return formats[Math.floor(Math.random() * formats.length)];
}

// Generate random user
function generateRandomUser() {
    const now = new Date();
    const startDate = new Date('2023-01-01');
    const endDate = new Date('2024-12-31');
    
    // Generate random date between 2023-2024
    const randomTime = startDate.getTime() + Math.random() * (endDate.getTime() - startDate.getTime());
    const joinDate = new Date(randomTime);
    
    // 20% chance of being premium user
    const isPremium = Math.random() < 0.2;
    
    return {
        id: Date.now() + Math.random(),
        username: generateRandomUsername(),
        joinDate: joinDate.toLocaleDateString('en-US', { 
            year: 'numeric', 
            month: 'short', 
            day: 'numeric' 
        }),
        status: Math.random() > 0.1 ? 'active' : 'inactive', // 90% active, 10% inactive
        type: isPremium ? 'premium' : 'normal'
    };
}

// Initialize users with some random data
function initializeUsers() {
    // Generate 15-25 random users
    const userCount = Math.floor(Math.random() * 11) + 15;
    users = [];
    
    for (let i = 0; i < userCount; i++) {
        users.push(generateRandomUser());
    }
    
    // Sort by join date (newest first)
    users.sort((a, b) => new Date(b.joinDate) - new Date(a.joinDate));
}

// Display users in the table
function displayUsers() {
    const tableBody = document.getElementById('usersTableBody');
    if (!tableBody) return;
    
    tableBody.innerHTML = '';
    
    users.forEach(user => {
        const row = document.createElement('tr');
        const userTypeClass = user.type === 'premium' ? 'premium-user' : 'normal-user';
        const userTypeIcon = user.type === 'premium' ? '💎' : '👤';
        
        row.innerHTML = `
            <td>#${user.id.toString().slice(-6)}</td>
            <td>
                <span class="user-type ${userTypeClass}">
                    ${userTypeIcon} ${user.username}
                </span>
            </td>
            <td>${user.joinDate}</td>
            <td><span class="user-status ${user.status}">${user.status}</span></td>
            <td><span class="user-type-badge ${userTypeClass}">${user.type.toUpperCase()}</span></td>
        `;
        tableBody.appendChild(row);
    });
}

// Refresh users
function refreshUsers() {
    initializeUsers();
    displayUsers();
    showNotification('Users refreshed with new random data!', 'success');
}

// DOM elements
const modeToggle = document.getElementById('modeToggle');
const adminLink = document.getElementById('adminLink');
const adminPanel = document.getElementById('admin');
const comicsGrid = document.getElementById('comicsGrid');
const comicUploadForm = document.getElementById('comicUploadForm');
const adsForm = document.getElementById('adsForm');
const adsContainer = document.getElementById('adsContainer');
const adminLoginModal = document.getElementById('adminLoginModal');
const adminLoginForm = document.getElementById('adminLoginForm');

// Debug DOM elements
console.log('DOM Elements found:', {
    modeToggle: !!modeToggle,
    adminLink: !!adminLink,
    adminPanel: !!adminPanel,
    comicsGrid: !!comicsGrid,
    comicUploadForm: !!comicUploadForm,
    adsForm: !!adsForm,
    adsContainer: !!adsContainer,
    adminLoginModal: !!adminLoginModal,
    adminLoginForm: !!adminLoginForm
});

// Initialize the application
document.addEventListener('DOMContentLoaded', function() {
    // Check if we're on the comics page
    const isComicsPage = window.location.pathname.includes('comics.html');
    
    // Start clock immediately on all pages
    startClock();
    
    initializeApp();
    setupEventListeners();
    
    if (isComicsPage) {
        // On comics page, only load comics data
        loadSampleData();
        displayComics();
    } else {
        // On main page, load all data
        loadSampleData();
        initializeUsers();
        updateDashboard();
        startRandomUpdates();
    }
});

// Initialize the application
function initializeApp() {
    // Check if admin mode is stored in localStorage
    const savedMode = localStorage.getItem('adminMode');
    if (savedMode === 'true') {
        toggleAdminMode();
    }

    // Load user likes from localStorage
    const savedLikes = localStorage.getItem('userLikes');
    if (savedLikes) {
        userLikes = new Set(JSON.parse(savedLikes));
    }
    
    // Set initial dashboard values to prevent NaN
    const onlineUsersElement = document.getElementById('onlineUsers');
    if (onlineUsersElement) {
        const initialOnlineUsers = getTimeBasedOnlineUsers();
        onlineUsersElement.textContent = initialOnlineUsers.toLocaleString();
    }
    
    const dailyViewsElement = document.getElementById('dailyViews');
    if (dailyViewsElement) {
        const initialDailyViews = Math.floor(Math.random() * 2000) + 4000;
        dailyViewsElement.textContent = initialDailyViews.toLocaleString();
    }
}

// Setup event listeners
function setupEventListeners() {
    // Admin mode toggle
    if (modeToggle) {
        modeToggle.addEventListener('click', showAdminLoginModal);
    }
    
    // Comic upload form
    if (comicUploadForm) {
        comicUploadForm.addEventListener('submit', handleComicUpload);
    }
    
    // Ads upload form
    if (adsForm) {
        adsForm.addEventListener('submit', handleAdUpload);
    }
    
    // Admin login form
    if (adminLoginForm) {
        adminLoginForm.addEventListener('submit', handleAdminLogin);
    }
    
    // User management event listeners - only refresh users
    document.getElementById('refreshUsers')?.addEventListener('click', refreshUsers);
}

// Show admin login modal
function showAdminLoginModal() {
    if (isAdminMode) {
        // If already in admin mode, toggle back to user mode
        toggleAdminMode();
    } else {
        // Show login modal
        adminLoginModal.style.display = 'flex';
        document.getElementById('adminUsername').focus();
    }
}

// Close admin login modal
function closeAdminModal() {
    adminLoginModal.style.display = 'none';
    adminLoginForm.reset();
}

// Handle admin login
function handleAdminLogin(e) {
    e.preventDefault();
    
    const username = document.getElementById('adminUsername').value.trim();
    const password = document.getElementById('adminPassword').value;
    
    if (username === ADMIN_CREDENTIALS.username && password === ADMIN_CREDENTIALS.password) {
        // Successful login
        closeAdminModal();
        toggleAdminMode();
        showNotification('Admin access granted! Welcome back.', 'success');
    } else {
        // Failed login
        showNotification('Invalid credentials. Please try again.', 'error');
        document.getElementById('adminPassword').value = '';
        document.getElementById('adminPassword').focus();
    }
}

// Toggle between admin and user mode
function toggleAdminMode() {
    isAdminMode = !isAdminMode;
    
    if (isAdminMode) {
        modeToggle.textContent = 'Admin Mode';
        modeToggle.style.background = '#dc3545';
        adminLink.style.display = 'inline';
        adminPanel.style.display = 'block';
        displayUsers(); // Display users when entering admin mode
        addClearDataButton(); // Add clear data button
        showNotification('Admin Mode activated', 'success');
    } else {
        modeToggle.textContent = 'User Mode';
        modeToggle.style.background = '#667eea';
        adminLink.style.display = 'none';
        adminPanel.style.display = 'none';
        showNotification('Switched to User Mode', 'info');
    }
    
    localStorage.setItem('adminMode', isAdminMode);
}

// Handle comic upload
async function handleComicUpload(e) {
    e.preventDefault();
    console.log('Comic upload started...');
    
    // Get form elements
    const titleInput = document.getElementById('comicTitle');
    const descriptionInput = document.getElementById('comicDescription');
    const linkInput = document.getElementById('comicLink');
    const thumbnailInput = document.getElementById('thumbnailFile');
    
    if (!titleInput || !descriptionInput || !linkInput || !thumbnailInput) {
        console.error('Comic upload form elements not found');
        showNotification('Error: Upload form not properly loaded', 'error');
        return;
    }
    
    const title = titleInput.value.trim();
    const description = descriptionInput.value.trim();
    const link = linkInput.value.trim();
    const thumbnailFile = thumbnailInput.files[0];
    
    console.log('Form data:', { title, description, link, thumbnailFile });
    
    // Validate inputs
    if (!title) {
        showNotification('Please enter a comic title', 'error');
        titleInput.focus();
        return;
    }
    
    if (!description) {
        showNotification('Please enter a comic description', 'error');
        descriptionInput.focus();
        return;
    }
    
    if (!link) {
        showNotification('Please enter a comic link', 'error');
        linkInput.focus();
        return;
    }
    
    if (!thumbnailFile) {
        showNotification('Please select a thumbnail image', 'error');
        thumbnailInput.focus();
        return;
    }
    
    try {
        // Check if Supabase is available
        if (!window.supabaseService) {
            console.error('Supabase service not available, using local storage');
            // Fallback to local storage
            handleComicUploadLocal(title, description, link, thumbnailFile);
            return;
        }
        
        // Upload image to Supabase Storage first
        const imagePath = `comics/${Date.now()}_${thumbnailFile.name}`;
        const imageUrl = await window.supabaseService.uploadImage(thumbnailFile, imagePath);
        
        console.log('Image uploaded to Supabase:', imageUrl);
        
        // Create comic data for database
        const comicData = {
            title: title,
            description: description,
            link: link,
            thumbnail: imageUrl,
            views: Math.floor(Math.random() * 4000) + 5000,
            likes: Math.floor(Math.random() * 2000) + 2000
        };
        
        // Add comic to Supabase database
        const newComic = await window.supabaseService.addComic(comicData);
        
        console.log('Comic added to database:', newComic);
        
        // Add to local comics array for immediate display
        comics.unshift(newComic);
        
        // Save to localStorage for persistence
        saveComicsToLocalStorage();
        
        // Update display
        displayComics();
        
        // Reset form
        const form = document.getElementById('comicUploadForm');
        if (form) {
            form.reset();
        }
        
        // Show success message
        showNotification('Comic uploaded successfully to cloud database!', 'success');
        console.log('Comic upload completed successfully');
        
    } catch (error) {
        console.error('Error uploading comic to Supabase:', error);
        
        // Fallback to local storage if Supabase fails
        console.log('Falling back to local storage...');
        handleComicUploadLocal(title, description, link, thumbnailFile);
    }
}

// Fallback function for local storage upload
function handleComicUploadLocal(title, description, link, thumbnailFile) {
    // Create a preview of the uploaded image
    const reader = new FileReader();
    reader.onload = function(e) {
        const thumbnailUrl = e.target.result;
        console.log('Thumbnail loaded locally');
        
        // Create new comic object
        const newComic = {
            id: Date.now(),
            title: title,
            description: description,
            link: link,
            thumbnail: thumbnailUrl,
            views: Math.floor(Math.random() * 4000) + 5000,
            uploadDate: new Date().toLocaleDateString(),
            likes: Math.floor(Math.random() * 2000) + 2000
        };
        
        console.log('New comic created locally:', newComic);
        
        // Add to comics array
        comics.unshift(newComic);
        
        // Save to localStorage for persistence
        saveComicsToLocalStorage();
        
        // Update display
        displayComics();
        
        // Reset form
        comicUploadForm.reset();
        
        // Show success message
        showNotification('Comic uploaded successfully to local storage!', 'success');
        console.log('Local comic upload completed successfully');
    };
    
    reader.onerror = function() {
        console.error('Error reading thumbnail file');
        alert('Error reading thumbnail file. Please try again.');
    };
    
    reader.readAsDataURL(thumbnailFile);
}

// Handle ad upload
async function handleAdUpload(e) {
    e.preventDefault();
    console.log('Ad upload started...');
    
    // Get form elements
    const titleInput = document.getElementById('adTitle');
    const linkInput = document.getElementById('adLink');
    const imageInput = document.getElementById('adImage');
    
    if (!titleInput || !linkInput || !imageInput) {
        console.error('Ad upload form elements not found');
        showNotification('Error: Upload form not properly loaded', 'error');
        return;
    }
    
    const title = titleInput.value.trim();
    const link = linkInput.value.trim();
    const imageFile = imageInput.files[0];
    
    // Validate inputs
    if (!title) {
        showNotification('Please enter an ad title', 'error');
        titleInput.focus();
        return;
    }
    
    if (!link) {
        showNotification('Please enter an ad link', 'error');
        linkInput.focus();
        return;
    }
    
    if (!imageFile) {
        showNotification('Please select an ad image', 'error');
        imageInput.focus();
        return;
    }
    
    try {
        // Check if Supabase is available
        if (!window.supabaseService) {
            console.error('Supabase service not available, using local storage');
            // Fallback to local storage
            handleAdUploadLocal(title, link, imageFile);
            return;
        }
        
        // Upload image to Supabase Storage first
        const imagePath = `ads/${Date.now()}_${imageFile.name}`;
        const imageUrl = await window.supabaseService.uploadImage(imageFile, imagePath);
        
        console.log('Ad image uploaded to Supabase:', imageUrl);
        
        // Create ad data for database
        const adData = {
            title: title,
            link: link,
            image: imageUrl
        };
        
        // Add ad to Supabase database
        const newAd = await window.supabaseService.addAd(adData);
        
        console.log('Ad added to database:', newAd);
        
        // Add to local ads array for immediate display
        ads.push(newAd);
        
        // Save to localStorage for persistence
        saveAdsToLocalStorage();
        
        // Update display
        displayAds();
        
        // Reset form
        const form = document.getElementById('adsForm');
        if (form) {
            form.reset();
        }
        
        // Show success message
        showNotification('Ad uploaded successfully to cloud database!', 'success');
        
    } catch (error) {
        console.error('Error uploading ad to Supabase:', error);
        
        // Fallback to local storage if Supabase fails
        console.log('Falling back to local storage...');
        handleAdUploadLocal(title, link, imageFile);
    }
}

// Fallback function for local storage ad upload
function handleAdUploadLocal(title, link, imageFile) {
    // Create a preview of the uploaded image
    const reader = new FileReader();
    reader.onload = function(e) {
        const imageUrl = e.target.result;
        
        // Create new ad object
        const newAd = {
            id: Date.now(),
            title: title,
            link: link,
            image: imageUrl
        };
        
        // Add to ads array
        ads.push(newAd);
        
        // Save to localStorage for persistence
        saveAdsToLocalStorage();
        
        // Update display
        displayAds();
        
        // Reset form
        adsForm.reset();
        
        // Show success message
        showNotification('Ad uploaded successfully to local storage!', 'success');
    };
    
    reader.readAsDataURL(imageFile);
}

// Display comics in the grid
function displayComics() {
    const comicsGrid = document.getElementById('comicsGrid');
    if (!comicsGrid) {
        console.log('Comics grid not found on this page');
        return;
    }
    
    comicsGrid.innerHTML = '';
    
    comics.forEach(comic => {
        const comicCard = document.createElement('div');
        comicCard.className = 'comic-card';
        comicCard.onclick = (e) => {
            // Don't open link if clicking on like button
            if (!e.target.closest('.like-btn')) {
                openComicLink(comic.link);
            }
        };
        
        const isLiked = userLikes.has(comic.id);
        const likeIcon = isLiked ? '❤️' : '🤍';
        const likeClass = isLiked ? 'liked' : '';
        
        comicCard.innerHTML = `
            <img src="${comic.thumbnail}" alt="${comic.title}" class="comic-thumbnail">
            <div class="comic-info">
                <h3 class="comic-title">${comic.title}</h3>
                <p class="comic-description">${comic.description}</p>
                <div class="comic-stats">
                    <span class="comic-views">👁️ ${comic.views.toLocaleString()} views</span>
                    <div class="like-section">
                        <span class="comic-likes">${likeIcon} ${comic.likes.toLocaleString()} likes</span>
                        <button class="like-btn ${likeClass}" onclick="toggleLike(${comic.id})">
                            ${isLiked ? '❤️' : '🤍'}
                        </button>
                    </div>
                </div>
                <button class="read-view-btn">
                    📖 Read and View
                </button>
            </div>
        `;
        comicsGrid.appendChild(comicCard);
    });
}

// Display ads
function displayAds() {
    adsContainer.innerHTML = '';
    
    ads.forEach(ad => {
        const adItem = document.createElement('div');
        adItem.className = 'ad-item';
        adItem.innerHTML = `
            <img src="${ad.image}" alt="${ad.title}">
            <h4>${ad.title}</h4>
            <div class="ad-actions">
                <button class="view-btn" onclick="openComicLink('${ad.link}')">
                    View Ad
                </button>
                <button class="delete-btn" onclick="deleteAd(${ad.id})">
                    Delete
                </button>
            </div>
        `;
        adsContainer.appendChild(adItem);
    });
    
    // Also update the main page ads banner
    displayMainPageAds();
}

// Display ads on the main page banner
function displayMainPageAds() {
    const adsSlider = document.getElementById('adsSlider');
    if (!adsSlider) return;
    
    adsSlider.innerHTML = '';
    
    if (ads.length === 0) {
        // Show empty state message
        adsSlider.innerHTML = `
            <div class="empty-ads-message">
                <h3 class="animated-text">📢 လူကြီးမင်းတို့၏ကြော်ညာများထည့်သွင်းနိုင်ပါပြီ</h3>
            </div>
        `;
        return;
    }
    
    ads.forEach(ad => {
        const adCard = document.createElement('div');
        adCard.className = 'main-page-ad';
        adCard.onclick = () => openComicLink(ad.link);
        
        adCard.innerHTML = `
            <img src="${ad.image}" alt="${ad.title}">
            <h3>${ad.title}</h3>
            <div class="ad-link">Click to view →</div>
        `;
        
        adsSlider.appendChild(adCard);
    });
}

// Delete ad function
function deleteAd(adId) {
    if (confirm('Are you sure you want to delete this ad? This action cannot be undone.')) {
        // Remove ad from array
        ads = ads.filter(ad => ad.id !== adId);
        
        // Update display
        displayAds();
        
        // Show success message
        showNotification('Ad deleted successfully!', 'success');
    }
}

// Open comic or ad link
function openComicLink(link) {
    window.open(link, '_blank');
}

// Contact Telegram function
function contactTelegram() {
    window.open('https://t.me/beast_is_kum', '_blank');
}

// Update dashboard with random statistics
function updateDashboard() {
    // Total users is fixed at 66,472
    const totalUsersElement = document.getElementById('totalUsers');
    totalUsersElement.textContent = '66,472';
    
    // Daily views random between 4k-6k
    const dailyViewsElement = document.getElementById('dailyViews');
    const newDailyViews = Math.floor(Math.random() * 2000) + 4000;
    animateNumberChange(dailyViewsElement, newDailyViews);
    
    // Online users with time-based increases at night
    const onlineUsersElement = document.getElementById('onlineUsers');
    const newOnlineUsers = getTimeBasedOnlineUsers();
    animateNumberChange(onlineUsersElement, newOnlineUsers);
}

// Get time-based online users (more users at night)
function getTimeBasedOnlineUsers() {
    const now = new Date();
    const hour = now.getHours();
    
    // Base online users between 2k-4k
    let baseUsers = Math.floor(Math.random() * 2000) + 2000;
    
    // Night time boost (8 PM to 6 AM) - increase by 30-60%
    if (hour >= 20 || hour <= 6) {
        const nightBoost = Math.random() * 0.3 + 0.3; // 30% to 60% increase
        baseUsers = Math.floor(baseUsers * (1 + nightBoost));
        
        // Add night mode indicator to the online users card
        const onlineUsersCard = document.querySelector('.stat-card:has(#onlineUsers)');
        if (onlineUsersCard) {
            onlineUsersCard.classList.add('night-mode');
        }
    } else {
        // Remove night mode indicator during day
        const onlineUsersCard = document.querySelector('.stat-card:has(#onlineUsers)');
        if (onlineUsersCard) {
            onlineUsersCard.classList.remove('night-mode');
        }
    }
    
    // Peak hours (7 PM to 11 PM) - additional 20-40% boost
    if (hour >= 19 && hour <= 23) {
        const peakBoost = Math.random() * 0.2 + 0.2; // 20% to 40% increase
        baseUsers = Math.floor(baseUsers * (1 + peakBoost));
    }
    
    // Weekend boost (Friday evening to Sunday) - additional 15-25%
    const dayOfWeek = now.getDay(); // 0 = Sunday, 6 = Saturday
    if (dayOfWeek === 5 || dayOfWeek === 6 || dayOfWeek === 0) { // Friday, Saturday, Sunday
        if (hour >= 18 || hour <= 2) { // Evening/night on weekends
            const weekendBoost = Math.random() * 0.1 + 0.15; // 15% to 25% increase
            baseUsers = Math.floor(baseUsers * (1 + weekendBoost));
        }
    }
    
    return baseUsers;
}

// Animate number changes with visual feedback
function animateNumberChange(element, newValue) {
    let currentValue = parseInt(element.textContent.replace(/,/g, ''));
    
    // Handle NaN or invalid values
    if (isNaN(currentValue)) {
        currentValue = 0;
    }
    
    const card = element.closest('.stat-card');
    
    // Add updating animation class
    card.classList.add('updating');
    
    // Animate the number change
    let startValue = currentValue;
    const endValue = newValue;
    const duration = 600; // 600ms to match CSS animation
    const startTime = performance.now();
    
    function updateNumber(currentTime) {
        const elapsed = currentTime - startTime;
        const progress = Math.min(elapsed / duration, 1);
        
        // Easing function for smooth animation
        const easeOutQuart = 1 - Math.pow(1 - progress, 4);
        const currentNumber = Math.floor(startValue + (endValue - startValue) * easeOutQuart);
        
        element.textContent = currentNumber.toLocaleString();
        
        if (progress < 1) {
            requestAnimationFrame(updateNumber);
        } else {
            // Remove updating class after animation completes
            setTimeout(() => {
                card.classList.remove('updating');
            }, 100);
        }
    }
    
    requestAnimationFrame(updateNumber);
}

// Start random updates for dashboard with enhanced timing
function startRandomUpdates() {
    // Update every 8 seconds for more frequent changes
    setInterval(updateDashboard, 8000);
    
    // Also add some random micro-updates for more dynamic feel
    setInterval(() => {
        const cards = document.querySelectorAll('.stat-card');
        const randomCard = cards[Math.floor(Math.random() * cards.length)];
        
        if (randomCard && !randomCard.classList.contains('updating')) {
            // Add subtle pulse effect
            randomCard.style.transform = 'scale(1.02)';
            setTimeout(() => {
                randomCard.style.transform = '';
            }, 300);
        }
    }, 3000);
    
    // Update comic view counts randomly
    setInterval(() => {
        comics.forEach(comic => {
            // Randomly increase views by 1-5
            const increase = Math.floor(Math.random() * 5) + 1;
            comic.views += increase;
        });
        displayComics();
    }, 15000); // Every 15 seconds
}

// Update clock display
function updateClock() {
    const now = new Date();
    const timeString = now.toLocaleTimeString('en-US', {
        hour12: false,
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit'
    });
    
    const clockElement = document.getElementById('currentTime');
    if (clockElement) {
        clockElement.textContent = timeString;
    } else {
        console.log('Clock element not found');
    }
}

// Start clock updates
function startClock() {
    console.log('Starting clock...');
    updateClock(); // Update immediately
    const interval = setInterval(updateClock, 1000); // Update every second
    console.log('Clock interval set:', interval);
}

// Load sample data for demonstration
function loadSampleData() {
    // Try to load comics from localStorage first
    const comicsLoaded = loadComicsFromLocalStorage();
    
    // Try to load ads from localStorage first
    const adsLoaded = loadAdsFromLocalStorage();
    
    // If no comics in localStorage, load sample comics
    if (!comicsLoaded || comics.length === 0) {
        console.log('Loading sample comics...');
        comics = [
            {
                id: 1,
                title: "The Adventure Begins",
                description: "An epic journey through magical realms with stunning artwork and compelling storytelling.",
                link: "https://t.me/beast_is_kum",
                thumbnail: "https://via.placeholder.com/300x200/667eea/ffffff?text=Comic+1",
                views: Math.floor(Math.random() * 4000) + 5000,
                uploadDate: "2024-01-15",
                likes: Math.floor(Math.random() * 2000) + 2000
            },
            {
                id: 2,
                title: "Mystery of the Dark Forest",
                description: "A thrilling mystery comic that will keep you on the edge of your seat until the very end.",
                link: "https://t.me/beast_is_kum",
                thumbnail: "https://via.placeholder.com/300x200/764ba2/ffffff?text=Comic+2",
                views: Math.floor(Math.random() * 4000) + 5000,
                uploadDate: "2024-01-14",
                likes: Math.floor(Math.random() * 2000) + 2000
            },
            {
                id: 3,
                title: "Heroes Unite",
                description: "When the world needs them most, these heroes must put aside their differences and work together.",
                link: "https://t.me/beast_is_kum",
                thumbnail: "https://via.placeholder.com/300x200/ff6b6b/ffffff?text=Comic+3",
                views: Math.floor(Math.random() * 4000) + 5000,
                uploadDate: "2024-01-13",
                likes: Math.floor(Math.random() * 2000) + 2000
            },
            {
                id: 4,
                title: "The Last Stand",
                description: "In the final battle between good and evil, only one side can emerge victorious.",
                link: "https://t.me/beast_is_kum",
                thumbnail: "https://via.placeholder.com/300x200/28a745/ffffff?text=Comic+4",
                views: Math.floor(Math.random() * 4000) + 5000,
                uploadDate: "2024-01-12",
                likes: Math.floor(Math.random() * 2000) + 2000
            }
        ];
        
        // Save sample comics to localStorage
        saveComicsToLocalStorage();
    }
    
    // If no ads in localStorage, start with empty array
    if (!adsLoaded) {
        ads = [];
        saveAdsToLocalStorage();
    }
    
    console.log('Data loaded - Comics:', comics.length, 'Ads:', ads.length);
    
    // Display the data
    displayComics();
    displayAds();
    displayMainPageAds();
    
    // Ensure dashboard has initial values
    updateDashboard();
}

// Show notification
function showNotification(message, type = 'info') {
    // Create notification element
    const notification = document.createElement('div');
    notification.className = `notification ${type}`;
    notification.textContent = message;
    
    // Style the notification
    let backgroundColor, textColor;
    switch (type) {
        case 'success':
            backgroundColor = '#28a745';
            textColor = 'white';
            break;
        case 'error':
            backgroundColor = '#dc3545';
            textColor = 'white';
            break;
        default:
            backgroundColor = '#17a2b8';
            textColor = 'white';
    }
    
    notification.style.cssText = `
        position: fixed;
        top: 100px;
        right: 20px;
        background: ${backgroundColor};
        color: ${textColor};
        padding: 1rem 2rem;
        border-radius: 8px;
        box-shadow: 0 4px 12px rgba(0,0,0,0.15);
        z-index: 10000;
        animation: slideIn 0.3s ease;
    `;
    
    // Add to body
    document.body.appendChild(notification);
    
    // Remove after 3 seconds
    setTimeout(() => {
        notification.style.animation = 'slideOut 0.3s ease';
        setTimeout(() => {
            if (notification.parentNode) {
                notification.parentNode.removeChild(notification);
            }
        }, 300);
    }, 3000);
}

// Add CSS animations for notifications
const style = document.createElement('style');
style.textContent = `
    @keyframes slideIn {
        from { transform: translateX(100%); opacity: 0; }
        to { transform: translateX(0); opacity: 1; }
    }
    @keyframes slideOut {
        from { transform: translateX(0); opacity: 1; }
        to { transform: translateX(100%); opacity: 0; }
    }
`;
document.head.appendChild(style);

// Contact admin button functionality
document.getElementById('contactAdmin').addEventListener('click', function() {
    contactTelegram();
});

// Add smooth scrolling for navigation links (only on main page)
if (!window.location.pathname.includes('comics.html')) {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });
}

// Add loading animation for forms
function showLoading(form) {
    const submitBtn = form.querySelector('button[type="submit"]');
    const originalText = submitBtn.textContent;
    submitBtn.textContent = 'Uploading...';
    submitBtn.disabled = true;
    
    return () => {
        submitBtn.textContent = originalText;
        submitBtn.disabled = false;
    };
}

// Enhanced comic upload with loading
if (comicUploadForm) {
    comicUploadForm.addEventListener('submit', function(e) {
        e.preventDefault();
        const hideLoading = showLoading(this);
        
        // Simulate upload delay
        setTimeout(() => {
            handleComicUpload(e);
            hideLoading();
        }, 1500);
    });
}

// Enhanced ad upload with loading
if (adsForm) {
    adsForm.addEventListener('submit', function(e) {
        e.preventDefault();
        const hideLoading = showLoading(this);
        
        // Simulate upload delay
        setTimeout(() => {
            handleAdUpload(e);
            hideLoading();
        }, 1500);
    });
}

// Add view count increment when comic is clicked
function incrementComicViews(comicId) {
    const comic = comics.find(c => c.id === comicId);
    if (comic) {
        comic.views += 1;
        displayComics();
    }
}

// Toggle like for a comic
function toggleLike(comicId) {
    const comic = comics.find(c => c.id === comicId);
    if (!comic) return;
    
    if (userLikes.has(comicId)) {
        // Unlike
        userLikes.delete(comicId);
        comic.likes--;
    } else {
        // Like
        userLikes.add(comicId);
        comic.likes++;
    }
    
    // Update display
    displayComics();
    
    // Save to localStorage
    localStorage.setItem('userLikes', JSON.stringify(Array.from(userLikes)));
}

// Add keyboard shortcuts for admin mode
document.addEventListener('keydown', function(e) {
    // Ctrl + Shift + A to toggle admin mode
    if (e.ctrlKey && e.shiftKey && e.key === 'A') {
        e.preventDefault();
        showAdminLoginModal();
    }
    
    // Escape key to close modal
    if (e.key === 'Escape' && adminLoginModal.style.display === 'flex') {
        closeAdminModal();
    }
});

// Close modal when clicking outside
adminLoginModal.addEventListener('click', function(e) {
    if (e.target === adminLoginModal) {
        closeAdminModal();
    }
}); 

// Save comics to localStorage
function saveComicsToLocalStorage() {
    try {
        localStorage.setItem('akioComics', JSON.stringify(comics));
        console.log('Comics saved to localStorage:', comics.length);
        return true;
    } catch (error) {
        console.error('Error saving comics to localStorage:', error);
        return false;
    }
}

// Load comics from localStorage
function loadComicsFromLocalStorage() {
    try {
        const savedComics = localStorage.getItem('akioComics');
        if (savedComics) {
            const parsedComics = JSON.parse(savedComics);
            comics = parsedComics;
            console.log('Comics loaded from localStorage:', comics.length);
            return true;
        }
    } catch (error) {
        console.error('Error loading comics from localStorage:', error);
    }
    return false;
}

// Save ads to localStorage
function saveAdsToLocalStorage() {
    try {
        localStorage.setItem('akioAds', JSON.stringify(ads));
        console.log('Ads saved to localStorage:', ads.length);
        return true;
    } catch (error) {
        console.error('Error saving ads to localStorage:', error);
        return false;
    }
}

// Load ads from localStorage
function loadAdsFromLocalStorage() {
    try {
        const savedAds = localStorage.getItem('akioAds');
        if (savedAds) {
            const parsedAds = JSON.parse(savedAds);
            ads = parsedAds;
            console.log('Ads loaded from localStorage:', ads.length);
            return true;
        }
    } catch (error) {
        console.error('Error loading ads from localStorage:', error);
    }
    return false;
} 

// Clear all data and reset to sample data
function clearAllData() {
    if (confirm('Are you sure you want to clear all uploaded comics and ads? This will reset to sample data.')) {
        // Clear localStorage
        localStorage.removeItem('akioComics');
        localStorage.removeItem('akioAds');
        
        // Reset arrays
        comics = [];
        ads = [];
        
        // Reload sample data
        loadSampleData();
        
        showNotification('All data cleared and reset to sample data!', 'success');
    }
}

// Add clear data button to admin panel
function addClearDataButton() {
    const adminPanel = document.getElementById('admin');
    if (adminPanel && !document.getElementById('clearDataBtn')) {
        const clearButton = document.createElement('button');
        clearButton.id = 'clearDataBtn';
        clearButton.className = 'control-btn clear-btn';
        clearButton.innerHTML = '<i class="fas fa-trash"></i> Clear All Data';
        clearButton.onclick = clearAllData;
        
        // Insert after the first admin section
        const firstSection = adminPanel.querySelector('.admin-section');
        if (firstSection) {
            firstSection.parentNode.insertBefore(clearButton, firstSection.nextSibling);
        }
    }
} 