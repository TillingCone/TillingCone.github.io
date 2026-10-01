/**
 * The ROM.
 *
 * Every screen is already in the DOM (rendered by Astro at build time) — this
 * only toggles which one is visible and where the cursor sits. That means the
 * full text of the site is present for search engines and screen readers even
 * though only one screen is ever on the LCD.
 */

type ScreenId = 'MENU' | 'STATS' | 'PROJECTS' | 'ABOUT' | 'CONTACT';
type Button = 'UP' | 'DOWN' | 'LEFT' | 'RIGHT' | 'A' | 'B' | 'START' | 'SELECT';

const host = document.querySelector<HTMLElement>('[data-screen-host]');
if (host) init(host);

function init(host: HTMLElement) {
  const screens = new Map<ScreenId, HTMLElement>();
  for (const el of host.querySelectorAll<HTMLElement>('[data-screen]')) {
    screens.set(el.dataset.screen as ScreenId, el);
  }

  let current: ScreenId = 'MENU';
  /** Cursor index per screen, so backing out of a list returns you where you were. */
  const cursor: Partial<Record<ScreenId, number>> = {};
  /** PROJECTS has a second layer: the detail card. */
  let detailOpen = false;

  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  // ── Screen switching ──────────────────────────────────────────────────

  function show(id: ScreenId) {
    for (const [key, el] of screens) el.hidden = key !== id;
    current = id;
    if (id === 'PROJECTS') setDetail(false);
    const body = screens.get(id)?.querySelector<HTMLElement>('.scr__body:not([hidden])');
    if (body) body.scrollTop = 0;
  }

  function items(id: ScreenId): HTMLElement[] {
    const screen = screens.get(id);
    if (!screen) return [];
    return [...screen.querySelectorAll<HTMLElement>('[data-list] .menu__item')];
  }

  function moveCursor(delta: number) {
    const list = items(current);
    if (!list.length) return scrollBody(delta);

    const next = clamp((cursor[current] ?? 0) + delta, 0, list.length - 1);
    cursor[current] = next;
    list.forEach((el, i) => el.setAttribute('aria-current', String(i === next)));
    list[next]?.scrollIntoView({ block: 'nearest' });
  }

  /** Screens with no list (STATS, ABOUT) scroll the panel instead. */
  function scrollBody(delta: number) {
    const body = screens.get(current)?.querySelector<HTMLElement>('[data-scroll]');
    body?.scrollBy({ top: delta * 40, behavior: reducedMotion ? 'auto' : 'smooth' });
  }

  function setDetail(open: boolean) {
    const screen = screens.get('PROJECTS');
    if (!screen) return;
    const list = screen.querySelector<HTMLElement>('[data-view="list"]');
    const detail = screen.querySelector<HTMLElement>('[data-view="detail"]');
    if (!list || !detail) return;

    detailOpen = open;
    list.hidden = open;
    detail.hidden = !open;

    if (open) {
      const index = cursor.PROJECTS ?? 0;
      for (const card of detail.querySelectorAll<HTMLElement>('[data-detail]')) {
        card.hidden = Number(card.dataset.detail) !== index;
      }
      detail.scrollTop = 0;
    }
  }

  function select() {
    if (current === 'MENU') {
      const list = items('MENU');
      const target = list[cursor.MENU ?? 0]?.dataset.goto as ScreenId | undefined;
      if (target) show(target);
      return;
    }
    if (current === 'PROJECTS' && !detailOpen) setDetail(true);
  }

  function back() {
    if (current === 'PROJECTS' && detailOpen) return setDetail(false);
    if (current !== 'MENU') show('MENU');
  }

  // ── Input ─────────────────────────────────────────────────────────────

  function press(button: Button) {
    switch (button) {
      case 'UP': return moveCursor(-1);
      case 'DOWN': return moveCursor(1);
      case 'A': return select();
      case 'B':
      case 'SELECT': return back();
      case 'START': return show('MENU');
    }
  }

  const KEYS: Record<string, Button> = {
    ArrowUp: 'UP', ArrowDown: 'DOWN', ArrowLeft: 'LEFT', ArrowRight: 'RIGHT',
    Enter: 'A', z: 'A', Z: 'A',
    Escape: 'B', Backspace: 'B', x: 'B', X: 'B',
  };

  document.addEventListener('keydown', (event) => {
    const button = KEYS[event.key];
    if (!button) return;
    // If a real link or button has keyboard focus, the browser already turns
    // Enter into a click on it — don't also fire the console's own action.
    const focused = document.activeElement?.tagName;
    if (button === 'A' && (focused === 'A' || focused === 'BUTTON')) return;
    event.preventDefault();
    flash(button);
    press(button);
  });

  // Touch and mouse both arrive as pointer events, so one set of handlers
  // covers a finger on a phone and a cursor on a laptop. Acting on
  // pointerdown rather than click makes a tap feel immediate instead of
  // waiting for the finger to lift.
  const HOLD_DELAY = 400; // before a held D-pad starts repeating
  const HOLD_RATE = 120; // and how fast it repeats after that

  for (const el of document.querySelectorAll<HTMLElement>('[data-btn]')) {
    const button = el.dataset.btn as Button;
    let holdStart: number | undefined;
    let holdRepeat: number | undefined;

    const release = () => {
      clearTimeout(holdStart);
      clearInterval(holdRepeat);
      delete el.dataset.pressed;
    };

    el.addEventListener('pointerdown', (event) => {
      // Stops the browser turning the tap into a click as well, and stops a
      // drag off the D-pad from selecting text or scrolling the page.
      event.preventDefault();
      el.dataset.pressed = '';
      press(button);

      if (button === 'UP' || button === 'DOWN') {
        holdStart = window.setTimeout(() => {
          holdRepeat = window.setInterval(() => press(button), HOLD_RATE);
        }, HOLD_DELAY);
      }
    });

    el.addEventListener('pointerup', release);
    el.addEventListener('pointercancel', release);
    el.addEventListener('pointerleave', release);

    // preventDefault above suppresses the pointer-driven click, so anything
    // still arriving here is a keyboard activation (detail === 0).
    el.addEventListener('click', (event) => {
      if (event.detail === 0) press(button);
    });
  }

  for (const button of host.querySelectorAll<HTMLButtonElement>('[data-goto]')) {
    button.addEventListener('click', () => show(button.dataset.goto as ScreenId));
  }

  for (const button of host.querySelectorAll<HTMLButtonElement>('[data-index]')) {
    button.addEventListener('click', () => {
      cursor.PROJECTS = Number(button.dataset.index);
      items('PROJECTS').forEach((item, i) => item.setAttribute('aria-current', String(i === cursor.PROJECTS)));
      setDetail(true);
    });
  }

  /** Light up the matching hardware button when the key is used. */
  function flash(button: Button) {
    const el = document.querySelector<HTMLElement>(`[data-btn="${button}"]`);
    if (!el) return;
    el.dataset.pressed = '';
    setTimeout(() => delete el.dataset.pressed, 110);
  }

  show('MENU');
}

function clamp(n: number, min: number, max: number) {
  return Math.min(max, Math.max(min, n));
}
