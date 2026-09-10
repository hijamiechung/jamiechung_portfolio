# Environmental light preview

Experimental homepage renderer; awaiting visual approval. Cursor interaction is disabled.

| State | Preview URL |
|---|---|
| Clear Day | http://localhost:3001/?atmosphere=clear-day |
| Partly Cloudy | http://localhost:3001/?atmosphere=partly-cloudy |
| Overcast | http://localhost:3001/?atmosphere=overcast |
| Rain | http://localhost:3001/?atmosphere=rain |
| Thunderstorm | http://localhost:3001/?atmosphere=thunderstorm |
| Golden Hour | http://localhost:3001/?atmosphere=golden-hour |
| Clear Night | http://localhost:3001/?atmosphere=clear-night |
| Cloudy Night | http://localhost:3001/?atmosphere=cloudy-night |

Append `&hour=18.75` or `&hour=0` to any preview to combine its weather with golden hour or night. Preview solar times are fixed at 06:30/19:30; wind is fixed at 8 mph from 270° for comparisons. Previews hold the clock position but continue light/density motion. They do not modify the weather readout or persist settings. Remove the query to resume the real selected environment.

For rapid lightning QA: http://localhost:3001/?atmosphere=thunderstorm&lightning=qa

Fast timing (5–12 seconds) requires a development build. A production build ignores `lightning=qa` and always uses rare 60–180 second intervals. Reduced motion disables flashes and continuous flow. Flash intervals count visible animation time, so returning from a hidden tab does not trigger missed events.

`model.mjs` combines weather responses with continuous local-time weights. Sunrise has structural support but awaits art-direction tuning. Fog and Snow remain distinct reserved states with temporary Overcast rendering. No temperature data is requested, validated, or displayed. Missing solar times use an approximate local schedule; moonlight direction is an authored abstraction. Light/Dark themes control exposure independently of environmental day/night.

`material.mjs` evaluates illumination and density separately. Daylight enters in clearer, narrower bands that spread downward and change position even when density is zero. Wind advects three larger, higher, differently sized, softly rounded cumulus bodies across the upper-middle window, with visible gaps and translucent thickness that obscures sunlight. The lower half stays free of clouds. Wind speed is roughly one third of the earlier pass. Daylight is clearer ivory with a warm core; cool shadows remain. Rain and thunderstorms add sparser, lower-opacity 0.55px wind-slanted streaks at the top, gradually disappearing before mid-screen. Golden Hour mixes restrained blue-gray, dusty rose and champagne through irregular vertical light. Fourteen small fixed stars twinkle on staggered cycles and are attenuated by cloud density. Weather updates interpolate without reseeding. Reduced motion freezes all movement and twinkling and disables lightning.

Environmental night stays dark in both appearance themes. Light-mode cards and sidebar remain light; exposed home headings switch to readable light text through experiment-scoped CSS.

The composition-root `ENABLE_ATMOSPHERE_EXPERIMENT` flag still selects this renderer or the preserved original particle renderer. No layout/content component depends on this module.

Home cards use a 48% surface fill (56% on hover) over the image area, reaching 84% behind the reading area, with 40px backdrop blur only while the atmosphere canvas is present. Core card layout and typography are untouched. Thumbnail placeholders use a 20% fill so the blurred backdrop remains visible. The weather/source readout is a small translucent pill, fixed 24px from the home viewport's top-right corner: 32px visible surface within a 44px target, 16px icon and 11px text. Only Light/Dark remain in the footer: thin icons, quiet selection borders, 44px click targets and 8px spacing. Sound and its playback code are removed. The sidebar sits 8px from the viewport edges with 16px corners and no shadow. Its base material stays 68% fill / 32px blur; the active homepage experiment uses 50% fill / 40px blur and strengthens secondary text when Light appearance shows environmental night.

## Weather sources and glass

The top-right source menu contains **Pittsburgh** and **My Location**. Pittsburgh is the default; My Location requests location permission only after selection. Nature was removed on 2026-09-10. The eight weather previews above remain available.

`glassMaterial.ts` combines a clear sample with a diffused sample using locally varying refraction and clarity. Its fixed irregular field has no circular lens or cursor interaction. Weather moves behind the pane. Reduced motion freezes the renderer. Card secondary text is strengthened locally for the more transparent material.

Clouds retain separate rounded bodies, with broader locally varying diffusion and restrained fine grain across the weather field. Glass refraction is reduced to avoid a warped surface pattern.

Palette white points are split by family, not shared: light-source colors (`daylight`, `warm`, `cloud-light`) run warm; water/night/electricity colors (`rain-streak`, `flash`, `moon`, `night-shadow`) run cool. UI chrome tokens stay neutral and do not shift with weather — see `DESIGN_DECISIONS.md`.
