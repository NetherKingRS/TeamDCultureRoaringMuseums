# Verification

- Browser preview: entrance, WASD movement, exhibit interaction, journal, five bibliography entries, challenge gating, pause menu, arcade interaction, and invalid video URL validation checked.
- Responsive preview: 390 x 844 viewport with touch controls and no horizontal page overflow.
- Browser error log was empty during the completed checks.
- Automated game checks: all 32 interaction locations reachable; movement, wall collision, and modal pause checked.
- Automated arcade checks: rhythm scoring, ten-pitch baseball scoring, saved records, and input cleanup checked.
- Custom recording control tested with an audio test double; actual recording playback needs your uploaded file.
- No student intro video was provided, so its real hosted playback must be checked after upload.
- Further browser checks were stopped by the automatic approval review usage limit. Full exit-ticket scoring was not verified in the browser.

No repository or deployment was created. Local browser progress is not included in this package.

## October 13 update checks

- Browser verified: Need Help? lists all 18 exhibits; a selected route appears as gold arrows; walking through the gallery doorway clears the route and shows arrival.
- Browser verified: HUD and pause-menu music toggle between Play Music and Stop Music; stopped state persists during navigation. Audio output was not independently recorded/measured.
- Browser verified: Grand Hall video desk opens the intro rather than Video Studio. With no configured URL it explains how to add one.
- Automated regressions: routes from the entrance, arcade, and other galleries avoid walls/furniture and clear on arrival or cancellation.
- Automated regressions: stopping during a pending audio start cancels both synth and recording playback state; synth gain is set immediately to zero and its context suspended.
- Automated regressions with media test doubles: Grand Hall replay bypasses session completion and creates a fresh player; exhibit recordings support play/stop/cleanup; device voice opt-out works.
- Actual student recordings and intro video remain to be checked after they are supplied.
