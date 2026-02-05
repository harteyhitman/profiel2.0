# UI Audit Checklist

Use this checklist every time you touch dashboard or card UI. Paste into Cursor and check off.

## Layout
- [ ] Cards in same row have equal height
- [ ] Titles align horizontally across cards
- [ ] Gutters are consistent
- [ ] Nothing touches card edges visually

## Typography
- [ ] Only 3 text sizes per card max
- [ ] Numbers visually dominate labels
- [ ] Subtitles are muted but readable
- [ ] No accidental bold text

## Color
- [ ] No random hex values (use `src/styles/design-tokens.css`)
- [ ] One primary green only (`--green-primary`)
- [ ] Light green used for inactive states (`--green-light`)
- [ ] Grid lines barely visible (`--border-subtle`)

## Charts
- [ ] Lines are thin and calm
- [ ] Bars have rounded tops
- [ ] No harsh contrast
- [ ] Empty states don't look broken

## Navigation & loading
- [ ] Every dashboard segment has a `loading.tsx` that uses `DashboardLoadingSkeleton`
- [ ] Skeleton has clear pulse so users see loading is in progress
- [ ] No full-page auth spinner after first load (only on initial auth check)

## “Feels Right” Test
- [ ] Nothing feels crowded
- [ ] Nothing feels empty
- [ ] Eye knows where to look first
- [ ] Looks like a real SaaS product
