# Ionic 8.8 Modal `applyFullscreenSafeArea()` Regression

**Reproduction repo for [ionic-team/ionic-framework#31015](https://github.com/ionic-team/ionic-framework/issues/31015)**

## Bug Description

In Ionic 8.8.x, fullscreen modals that contain `<ion-content>` but **no** `<ion-footer>` have their `.modal-wrapper` height reduced by `safe-area-inset-bottom` pixels. This causes the bottom portion of the modal content to be clipped behind the device's home indicator area.

The regression was introduced in **PR [#30949](https://github.com/ionic-team/ionic-framework/pull/30949)** which added the `applyFullscreenSafeArea()` method in `modal.tsx`. The method detects that `ion-content` exists without `ion-footer` and applies `calc(100% - safe-area-inset-bottom)` to the wrapper height. However, `ion-content` already handles bottom safe-area padding internally via its `::part(scroll)`, resulting in **double safe-area compensation**.

## Versions

| Package | Version |
|---|---|
| `@ionic/angular` | 8.8.1 |
| `@ionic/core` | 8.8.1 |
| `@angular/core` | 19.x |
| `@capacitor/core` | 7.x |

## How to Reproduce

### Prerequisites
- macOS with Xcode installed
- Node.js 18+
- An **iOS Simulator** with a notched device (iPhone 15, 16, etc.)

### Steps

```bash
# 1. Clone and install
git clone https://github.com/a-hazaiti/ionic-8.8-modal-safe-area-repro.git
cd ionic-8.8-modal-safe-area-repro
npm install

# 2. Add iOS platform and build
npx cap add ios
ionic build
npx cap sync ios

# 3. Open in Xcode and run on a notched iPhone simulator
npx cap open ios
```

4. In the app, tap **"Open Buggy Modal (no ion-footer)"**
5. Scroll to the bottom of the modal content
6. Observe: the red text at the bottom is **clipped/hidden** behind the home indicator area

### Expected Behavior

The modal should display at full height. `ion-content` already handles safe-area bottom padding internally — the wrapper height should remain at `100%`.

### Actual Behavior

The `.modal-wrapper` height is set to `calc(100% - env(safe-area-inset-bottom))`, reducing the usable modal area by ~34px on notched iPhones. Content at the bottom is cut off.

### Workaround Comparison

Tap **"Open Fixed Modal (empty ion-footer)"** to see the workaround in action. Adding an empty `<ion-footer></ion-footer>` triggers an early return in `applyFullscreenSafeArea()`, bypassing the height reduction.

## Quick Browser Preview

You can also see the layout via `ionic serve`, though `env(safe-area-inset-bottom)` resolves to `0px` in desktop browsers so the visual bug won't manifest. To see the actual regression, you must test on a **real iOS device or simulator** with safe-area insets.

```bash
ionic serve
```

## Root Cause Analysis

In `core/src/components/modal/modal.tsx`, the `applyFullscreenSafeArea()` method:

```typescript
private applyFullscreenSafeArea() {
  const el = this.el;
  const content = el.querySelector('ion-content');
  const hasContent = content !== null;
  const hasFooter = el.querySelector('ion-footer') !== null;

  // Early return if no content or has footer
  if (!hasContent || hasFooter) return;

  // BUG: Reduces wrapper height, but ion-content already handles
  // safe-area padding via its internal ::part(scroll) styles
  const wrapper = el.querySelector('.modal-wrapper');
  wrapper.style.height = 'calc(100% - env(safe-area-inset-bottom))';
}
```

The logic assumes that without `ion-footer`, the content needs safe-area protection at the wrapper level. But `ion-content` already provides `padding-bottom: env(safe-area-inset-bottom)` on its scrollable area, leading to double compensation.

## File Structure

```
src/app/
├── home/
│   ├── home.page.ts          # Home page with buttons to open modals
│   ├── home.page.html
│   └── home.page.scss
├── example-modal/
│   └── example-modal.component.ts   # BUG: Modal with ion-content, NO ion-footer
└── fixed-modal/
    └── fixed-modal.component.ts     # WORKAROUND: Same modal + empty ion-footer
```
