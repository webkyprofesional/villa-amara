(async () => {
  let data;
  try {
    const res = await fetch('data/content.json', { cache: 'no-store' });
    data = await res.json();
  } catch (e) {
    return; // keep the hardcoded fallback content already in the HTML
  }

  const setText = (selector, value) => {
    if (value === undefined || value === null) return;
    document.querySelectorAll(selector).forEach(el => { el.textContent = value; });
  };

  setText('[data-cms="heroEyebrow"]', data.heroEyebrow);
  setText('[data-cms="heroTitle"]', data.heroTitle);
  setText('[data-cms="aboutText"]', data.aboutText);

  if (Array.isArray(data.stats)) {
    const statEls = document.querySelectorAll('[data-cms="stats"] .stat');
    data.stats.forEach((stat, i) => {
      if (!statEls[i]) return;
      const num = statEls[i].querySelector('.stat-num');
      const label = statEls[i].querySelector('.stat-label');
      if (num) num.textContent = stat.num;
      if (label) label.textContent = stat.label;
    });
  }

  if (Array.isArray(data.gallery)) {
    const imgs = document.querySelectorAll('[data-cms="gallery"] .gallery-item img');
    data.gallery.forEach((item, i) => {
      if (!imgs[i]) return;
      if (item.image) imgs[i].src = item.image;
      if (item.alt) imgs[i].alt = item.alt;
    });
  }

  if (Array.isArray(data.amenities)) {
    const spans = document.querySelectorAll('[data-cms="amenities"] li span');
    data.amenities.forEach((text, i) => {
      if (spans[i]) spans[i].textContent = text;
    });
  }

  if (typeof data.quote === 'string') {
    const q = document.querySelector('[data-cms="quote"] em');
    if (q) {
      const [line1, line2] = data.quote.split('\n');
      q.innerHTML = line2 ? `${line1}<br>${line2}` : line1;
    }
  }

  if (data.contact) {
    const emailEl = document.querySelector('[data-cms-field="email"]');
    if (emailEl && data.contact.email) {
      emailEl.textContent = data.contact.email;
      emailEl.href = `mailto:${data.contact.email}`;
    }
    const phoneEl = document.querySelector('[data-cms-field="phone"]');
    if (phoneEl && data.contact.phone) {
      phoneEl.textContent = data.contact.phone;
      phoneEl.href = `tel:${data.contact.phoneHref || data.contact.phone}`;
    }
    const locationEl = document.querySelector('[data-cms-field="location"]');
    if (locationEl && data.contact.location) {
      locationEl.textContent = data.contact.location;
    }
  }
})();
