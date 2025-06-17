// Replace with your own NewsAPI key
const apiKey = '166c7ccf4cfa421593c1a815ef9f82b7';
const newsContainer = document.getElementById('news-container');
const searchInput = document.getElementById('search-input');
const searchBtn = document.getElementById('search-btn');
const categoryButtons = document.querySelectorAll('.category-btn');
const prevBtn = document.getElementById('prev-btn');
const nextBtn = document.getElementById('next-btn');
const themeToggle = document.getElementById('theme-toggle');

let currentPage = 1;
let totalPages = 1;

// Fetch and display news from API
async function fetchNews(query = '', category = '', page = 1) {
  newsContainer.innerHTML = `
    <div class="grid grid-cols-1 gap-4">
      <div class="skeleton h-48 rounded"></div>
      <div class="skeleton h-48 rounded"></div>
      <div class="skeleton h-48 rounded"></div>
    </div>
  `;

  try {
    let url = `https://newsapi.org/v2/top-headlines?country=us&pageSize=6&page=${page}&apiKey=${apiKey}`;

    if (query) {
      url = `https://newsapi.org/v2/everything?q=${encodeURIComponent(query)}&language=en&pageSize=6&page=${page}&apiKey=${apiKey}`;
    } else if (category) {
      url = `https://newsapi.org/v2/top-headlines?country=us&category=${category}&pageSize=6&page=${page}&apiKey=${apiKey}`;
    }

    const response = await fetch(url);
    const data = await response.json();

    if (data.status !== 'ok') {
      newsContainer.innerHTML = `<p class="text-center text-red-600 font-semibold">Failed to load news. Try again later.</p>`;
      return;
    }

    if (!data.articles.length) {
      newsContainer.innerHTML = `<p class="text-center text-gray-600">No articles found for this query.</p>`;
      return;
    }

    totalPages = Math.ceil(data.totalResults / 6);
    displayNews(data.articles);
  } catch (error) {
    newsContainer.innerHTML = `<p class="text-center text-red-600">Error fetching news. Check your connection.</p>`;
    console.error('Fetch error:', error);
  }
}

// Render the news articles
function displayNews(articles) {
  newsContainer.innerHTML = '';

  articles.forEach(article => {
    const card = document.createElement('div');
    card.className = `
      news-card rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden cursor-pointer
    `;
    card.setAttribute('data-aos', 'fade-up');

    card.innerHTML = `
      <img class="w-full h-48 object-cover" src="${article.urlToImage || 'https://via.placeholder.com/400x200?text=No+Image'}" alt="News image" />
      <div class="p-4">
        <h2 class="text-lg font-bold mb-2">${article.title}</h2>
        <p class="text-sm mb-3">${article.description || 'No description available.'}</p>
        <a href="${article.url}" target="_blank" class="text-shrutBlue hover:underline text-sm font-semibold">Read Full Article →</a>
      </div>
    `;

    newsContainer.appendChild(card);
  });

  AOS.refresh();
  updatePagination();
}

// Update pagination buttons
function updatePagination() {
  prevBtn.disabled = currentPage === 1;
  nextBtn.disabled = currentPage === totalPages;
}

// Event Listeners
searchBtn.addEventListener('click', () => {
  const query = searchInput.value.trim();
  currentPage = 1; // Reset to first page
  fetchNews(query);
});

categoryButtons.forEach(button => {
  button.addEventListener('click', () => {
    const category = button.dataset.category;
    searchInput.value = '';
    currentPage = 1; // Reset to first page
    fetchNews('', category);
    
    // Update active button style
    categoryButtons.forEach(btn => btn.classList.remove('active'));
    button.classList.add('active');
  });
});

prevBtn.addEventListener('click', () => {
  if (currentPage > 1) {
    currentPage--;
    fetchNews(searchInput.value.trim(), '', currentPage);
  }
});

nextBtn.addEventListener('click', () => {
  if (currentPage < totalPages) {
    currentPage++;
    fetchNews(searchInput.value.trim(), '', currentPage);
  }
});

// Dark mode toggle
themeToggle.addEventListener('click', () => {
  document.body.classList.toggle('dark');
});

// Initial fetch on load
window.addEventListener('load', () => {
  fetchNews();
});
