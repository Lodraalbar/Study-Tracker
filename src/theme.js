export const THEME_FIELDS = [
  { key: 'pageBg', label: 'Latar halaman' },
  { key: 'navBg', label: 'Navbar' },
  { key: 'panelBg', label: 'Panel' },
  { key: 'panelStrong', label: 'Panel kuat' },
  { key: 'accent', label: 'Aksen utama' },
  { key: 'accentSoft', label: 'Aksen lembut' },
  { key: 'textMain', label: 'Teks utama' },
  { key: 'textMuted', label: 'Teks sekunder' },
  { key: 'border', label: 'Border' },
  { key: 'success', label: 'Berhasil' },
  { key: 'warning', label: 'Peringatan' },
  { key: 'danger', label: 'Bahaya' },
];

export const DEFAULT_THEME = {
  dark: {
    pageBg: '#151326',
    navBg: '#04050f',
    panelBg: '#0b0a18',
    panelStrong: '#2e1757',
    accent: '#853dfa',
    accentSoft: '#b99cff',
    textMain: '#ffffff',
    textMuted: '#9ca3af',
    border: '#4b5563',
    success: '#6ee7b7',
    warning: '#fcd34d',
    danger: '#fca5a5',
  },
  light: {
    pageBg: '#fff5fb',
    navBg: '#ffffff',
    panelBg: '#ffd9ea',
    panelStrong: '#ffb8d5',
    accent: '#e5488b',
    accentSoft: '#9f426c',
    textMain: '#3d2133',
    textMuted: '#8a6075',
    border: '#f2b9d2',
    success: '#16805c',
    warning: '#a16207',
    danger: '#b42318',
  },
};

export const cloneTheme = (theme) => JSON.parse(JSON.stringify(theme));

export function applyTheme(theme = DEFAULT_THEME) {
  const root = document.documentElement;
  const dark = { ...DEFAULT_THEME.dark, ...(theme.dark || {}) };
  const light = { ...DEFAULT_THEME.light, ...(theme.light || {}) };

  Object.entries(dark).forEach(([key, value]) => root.style.setProperty(`--theme-dark-${key}`, value));
  Object.entries(light).forEach(([key, value]) => root.style.setProperty(`--theme-light-${key}`, value));
}
