# GG4G Clue

The page the QR code on ChUMMY's Part 1 label opens: one photo of where the
next puzzle object is, at **https://gg4g-labs.github.io/GG4G-Clue/**.

It lives on GitHub Pages rather than on the overlay so a phone on mobile data
can open it without joining the venue wifi. This repo is **public** because
Pages on the Free plan only serves public repos. It holds this page and, from
the day, one photo. Nothing else goes in it.

## On the day

1. Take the photo of where the battery (or the next object) is hidden.
2. On the stream PC, drop the photo onto **Publish clue photo.bat** in this
   folder, or double-click it and pick the photo.
3. It copies the photo in, sends it to GitHub, and waits until the page shows
   it, usually under a minute. Then scan the label's QR code on a phone, on
   mobile data, to check.

Publishing again replaces the photo. A phone that had the page open shows the
new one on reload; each photo gets its own address, so nothing stale is cached.

**Needs:** Node.js and git on the PC, a clone of this repo, and push access to
`GG4G-Labs/GG4G-Clue`. Git for Windows asks to sign in to GitHub on the first
push and remembers it, so do one test publish before the day.

Until a photo is published the page says "The picture is not here yet". After
the event, delete the photo (or the repo): it stays public until then.

## Files

- `index.html`: the page, in ChUMMY's colours. The photo's address carries a
  version between the `<!-- PHOTO -->` markers, which `publish.js` rewrites.
- `publish.js`: copy, commit, push, and wait for Pages.
- `Publish clue photo.bat`: the double-click and drag-and-drop front of it.

The QR code is printed by `GG4G-Overlay`'s `tools/make-puzzle-tags.py`, and the
operator steps are in that repo's `guides/PUZZLE-RUNBOOK.md`.
