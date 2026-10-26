# Scandbury living-scene overlay test

Copy the generated motion loop into the app's public asset tree as:

`/assets/scenes/001-scandbury-mansion/scandbury-front-motion.mp4`

The canonical `exterior-main.png` remains the scene underneath. The video is a
subordinate overlay at 0.34 opacity and hides itself if it cannot load.

The old CSS foliage cutouts are retained in `sceneData.js` as `legacyFoliage`
but are deliberately not rendered during this test, so the video can be judged
on its own. `driftingLeaves` is also off for the test.

An optional future `maskImage` setting is already documented in the motionPlate
configuration so architecture can be excluded if the full-frame blend ghosts.
