/**
 * Palette switch. The initial value is applied by an inline script in <head>
 * (see BaseHead.astro) so there is no flash of the wrong palette; this only
 * handles the toggle afterwards.
 */
const NEXT = { dmg: 'pocket', pocket: 'dmg' } as const;
type Palette = keyof typeof NEXT;

const button = document.querySelector<HTMLButtonElement>('[data-palette-toggle]');
const label = document.querySelector<HTMLElement>('[data-palette-label]');

function render(palette: Palette) {
  document.documentElement.dataset.palette = palette;
  if (label) label.textContent = palette.toUpperCase();
}

render((document.documentElement.dataset.palette as Palette) ?? 'dmg');

button?.addEventListener('click', () => {
  const next = NEXT[(document.documentElement.dataset.palette as Palette) ?? 'dmg'];
  render(next);
  try { localStorage.setItem('palette', next); } catch { /* private mode */ }
  // Hand focus back so the next Enter presses A, not the toggle again.
  button.blur();
});
