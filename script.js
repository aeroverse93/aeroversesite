const menuBtn = document.querySelector('.menu-btn');
const navLinks = document.querySelector('.nav-links');

menuBtn.addEventListener('click', () => {
  navLinks.classList.toggle('open');
});

document.querySelectorAll('.nav-links a').forEach(link => {
  link.addEventListener('click', () => navLinks.classList.remove('open'));
});

document.getElementById('year').textContent = new Date().getFullYear();

// Fetch Daily Aviation News
async function fetchNews() {
  const newsContainer = document.getElementById('news-container');
  if (!newsContainer) return;

  const rssUrl = 'https://simpleflying.com/feed/';
  const apiUrl = `https://api.rss2json.com/v1/api.json?rss_url=${encodeURIComponent(rssUrl)}`;

  try {
    const response = await fetch(apiUrl);
    const data = await response.json();

    if (data.status === 'ok') {
      newsContainer.innerHTML = ''; // Clear loading text
      // Take top 3 news items
      const items = data.items.slice(0, 3);

      items.forEach(item => {
        const article = document.createElement('article');
        article.className = 'news-card';

        // Format date to something simpler (e.g. "Oct 1, 2023")
        const pubDate = new Date(item.pubDate);
        const dateOptions = { month: 'short', day: 'numeric', year: 'numeric' };
        const formattedDate = pubDate.toLocaleDateString(undefined, dateOptions);

        article.innerHTML = `
          <div class="news-date">${formattedDate}</div>
          <h3><a href="${item.link}" target="_blank" rel="noopener noreferrer">${item.title}</a></h3>
          <p>${item.description.replace(/<[^>]*>?/gm, '').substring(0, 120)}...</p>
        `;
        newsContainer.appendChild(article);
      });
    } else {
      newsContainer.innerHTML = '<p>Failed to load news.</p>';
    }
  } catch (error) {
    console.error('Error fetching news:', error);
    newsContainer.innerHTML = '<p>Error loading news.</p>';
  }
}

// Call fetchNews on load
fetchNews();
