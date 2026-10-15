# The Roaring Culture Museum — 11-1 Team D

A complete new game, ready for a new GitHub repository and Vercel. This replaces the previous navigation website; do not combine it with the old app.js or appended update blocks.

## Play

Open `index.html` in a modern browser, or use a local static server for testing hosted video. Click **Enter The Museum**.

| Control | Action |
| --- | --- |
| WASD or Arrow Keys | Walk |
| Shift + movement | Run |
| E or Space | Interact when near an exhibit or arcade cabinet |
| H | Need Help? Select an exhibit for gallery directions |
| J | Journal and accessible exhibit list |
| M | Museum map |
| Escape | Pause; close an open panel |
| Phone / tablet | On-screen direction buttons and Interact |

Walk left or right from the central hall to enter a gallery. Read its three exhibits, then interact with its challenge stand to earn a stamp. The arcade is south of the entrance. Teacher Reference and Replay Intro Video are desks at the entrance. Video Studio remains in the pause menu. The exit ticket is at the far end of the arcade.

## Included

- A scrolling, illustrated museum with a controllable character, walls, collision, doorways, mini-map, and touch controls.
- All six culture galleries, eighteen exhibits, archival photograph/audio/film links, evidence prompts, and exhibit citations from the original project.
- Six collectible gallery stamps; progress and arcade records saved in the visitor's browser when storage is available.
- Four games: **Jazz Club** (24-note rhythm game), **Babe’s Ballpark** (10-pitch timing game), **Museum Match** (six memory pairs), and **Rewind The Decade** (drag-and-drop timeline with keyboard and touch support).
- **Five-question multiple-choice exit ticket**, with explanations and score.
- **Five-entry bibliography**, displayed directly in Teacher Reference. Individual source links and historical photo attribution remain beside their exhibits.
- The exact Team D name, bold headings, and a game interface rather than website navigation tabs.
- Original, calm jazz-inspired background music with mute and volume controls. It starts only after a visitor interacts with the entrance. Music is synthesized locally, not streamed or sampled from an archival/commercial recording.
- A blank introductory-video slot, automatic unlocking after completion, captions/transcript options, and optional student narration.

## Update an existing GitHub repository

1. Extract the updated ZIP.
2. Keep a copy of your existing `config.js` if you have added music/video links. The ZIP leaves those slots blank. Copy your existing link values into the new config before uploading; keep the new `exhibitNarration` and `useDeviceNarration` settings.
3. In your existing repository, choose **Add file → Upload files**. Upload the extracted folder's contents at the repository root, replacing matching filenames. Do not upload the ZIP or the containing folder.
4. Commit the changes. Keep any media files you previously uploaded in `assets`; there is no need to delete or re-upload them.
5. Vercel will deploy the connected production branch. Wait for the new deployment to be Ready, then refresh the site.

For a minimal update, replace `index.html`, `game.js`, `panels.js`, and `music.js`, and merge the new narration settings from `config.js`. No other game files changed in this update. The new documentation and narration folder are optional aids.

## What changed in this update

- The Grand Hall video desk replays the configured intro, even after the visitor has already watched it.
- Stop Music immediately silences the score or recording. Completing a replay does not restart stopped music.
- The HUD's journal button is now **Need Help?**. Choose any of the 18 exhibits for gold arrows to its gallery. Arrows route around obstacles and disappear inside its doorway. The journal remains available in the pause menu and through J.
- Each exhibit can play your own MP3 instead of the device voice. See [RECORDING-GUIDE.md](RECORDING-GUIDE.md) for all filenames and passage scripts.

## New GitHub repository → Vercel

1. Extract the ZIP. Open the **roaring-museum-game** folder.
2. Create your new GitHub repository, for example `roaring-culture-game`.
3. Upload the **contents** of the folder to the repository root. You should see `index.html` immediately in the repository, alongside `game.js`, `panels.js`, `arcade.js`, `music.js`, `styles.css`, `content.js`, `config.js`, `vercel.json`, and `assets/`. Do not upload only the ZIP or nest everything inside an extra folder.
4. Commit the files.
5. In Vercel, add a new project and import that repository.
6. Framework preset: **Other**. Root Directory: the repository root. No install or build command is required. Output Directory: `.` (a single period). The supplied `vercel.json` declares the static configuration.
7. Deploy. Open the HTTPS address Vercel provides. Future commits to the connected production branch can update the website automatically.

Official deployment reference: https://vercel.com/docs/git

This is a static site: no packages, database, API keys, server functions, or monthly music service are needed. The project is packaged for upload; no GitHub repository or Vercel deployment has been created automatically.

GitHub Pages is also compatible: use the main branch and repository root as the publishing source. All file paths are relative.

## Use your own music recording

1. Rename your recording `jazz.mp3` and upload it inside the repository's `assets` folder.
2. Open `config.js`, click the pencil to edit, and change only this value:

```js
backgroundMusic: "assets/jazz.mp3",
```

3. Commit the change. The recording loops, supports the existing mute/volume controls, and becomes quieter during narration. It begins after the visitor interacts with the entrance. Leave the value empty (`""`) to use the built-in generated jazz again. Filenames and capitalization must match exactly. You do not need to edit `music.js`.

## Add the intro video later

Edit only the `introVideo` line in `config.js` in GitHub, preserving the other settings:

```js
introVideo: "https://www.youtube.com/watch?v=YOUR_VIDEO_ID",
```

Use a real YouTube link with embedding allowed, a direct public `.mp4`/`.webm` URL, or `assets/intro.mp4` if you add that file. The example placeholder is not a playable video. A normal Google Drive sharing page is not a direct video file.

Alternatively, visit **Video Studio** in the game, fill in the link and other fields, preview it, and download the replacement `config.js`. Commit that replacement to publish it. Changing the local preview alone does not update the hosted site.

Captions: an optional WebVTT file such as `assets/captions.vtt` for direct video, or the video's own YouTube captions. Student narration can be part of the opening video, or a separate `assets/narration.mp3` file. The site does not claim the device voice is student narration.

The game remains at the entrance until the configured video ends. A browser may require clicking Play for sound. The current browser session remembers completion of that video. When no video is set, Enter The Museum is available. If media is blocked, a clearly labeled recovery entrance keeps the project usable. This is a learning activity, not a secure video-watching test; seeking is allowed.

## Editing

| File | What to change |
| --- | --- |
| `content.js` | Exhibit information, room questions, original source records |
| `game.js` | Museum layout, character movement, drawing, progress |
| `arcade.js` | Arcade games and scoring |
| `panels.js` | Journal, bibliography, exit ticket, video setup, menus |
| `music.js` | Original instrumental accompaniment |
| `styles.css` | Interface colors, fonts, layouts |
| `config.js` | Introductory video, transcript, optional narration |

## Notes

The museum text addresses the Roaring Culture assignment's five content objectives, the effects of WWI, and questions about technology and unequal freedom. The former assignment-coverage panels and reference downloads are intentionally omitted. Add your own intro video/student narration and credit any new media you use before submitting.

The local game, drawings, and synthesized music do not require third-party servers. Online fonts have local fallbacks; the historical photograph, archive links, and external video require internet and can be affected by school filters. No analytics, login, or server collection of visitor answers is included.

The illustrations are newly drawn symbols, not authentic historical artifacts. The music is original and jazz-inspired, not a 1920s recording. Historical media is identified in the corresponding exhibit.

See `VERIFICATION.md` for checks and remaining external-media limits.
