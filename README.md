# rr-fancy-time

A small and fun project for a time-themed hackathon at [R&R WFM](https://github.com/rr-wfm). Using React and ThreeJS to create a cool visualization of the current time.
Got constantly sidetracked by cool and complex stuff involving GLSL shaders which I wasted most my time on, but also learned a lot. Probably will use them (and ThreeJS) again elsewhere.

If I didn't mess things up, it should be hosted on github pages here :) => https://tristanhollman.github.io/rr-fancy-time

## Getting Started

This is a [Next.js](https://nextjs.org/) project bootstrapped with [`create-next-app`](https://github.com/vercel/next.js/tree/canary/packages/create-next-app).

First, run the development server:

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

This project uses [`next/font`](https://nextjs.org/docs/basic-features/font-optimization) to automatically optimize and load Inter, a custom Google Font.

## Credits, Inspirations and Contributions

### Petal Shaders

I was inspired by one of [Paul's](https://codepen.io/prisoner849) CodePen projects and based some of the GLSL shader code on his amazing petal implementation :)

### Background images

Background images were either taken from [Unsplash.com](https://unsplash.com/) or generated with A.I. (StableDiffusion)

### Music

The song playing on the background is 'Sakura' by 'ANtarcticbreeze' and can be found [here](https://soundcloud.com/musicformedia-1/sakura-inspirational-hip-hop-lo-fi-no-copyright-claims-music).

## Todo's

- [x] Let the user toggle the background music from the UI.
- [ ] Get the sakura petal as a wallpaper in [Wallpaper Engine](https://www.wallpaperengine.io/).
- [ ] Improve the current globe/world-times implementation:
  - [ ] Don't use a shitty API (┬┬﹏┬┬)
  - [ ] Show the time as a fancy label/tooltip on the globe itself, instead of the separate side panels.
- [ ] Configure multiple presets with different (maybe even custom) background wallpapers for the sakura view.
