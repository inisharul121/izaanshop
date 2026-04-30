import './bootstrap';

import Alpine from 'alpinejs';

window.Alpine = Alpine;

Alpine.start();

// Bundle Lucide icons via Vite (replaces the slow unpkg.com CDN script)
import { createIcons, icons } from 'lucide';

// Expose globally so any blade template calling lucide.createIcons() still works
window.lucide = { createIcons: (opts) => createIcons({ icons, ...opts }) };

// Initialize icons on DOM ready
document.addEventListener('DOMContentLoaded', () => {
    createIcons({ icons });
});
