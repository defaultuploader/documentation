export const exampleSource = {
    images: [
        {
            src: 'https://api.defaultuploader.com/v1/image/upload/66c78a3b3438de9506dd5e93/gmEYbirrFzrPkAS4nVgTw1.png'
        },
        {
            src: 'https://api.defaultuploader.com/v1/image/upload/66c78a3b3438de9506dd5e93/nk1r2UBEB3LJL9m18jsR2d.png'
        }
    ], // [0] dark theme, [1] light theme
    animatedImages: [
        {
            src: 'https://api.defaultuploader.com/v1/image/upload/66c78a3b3438de9506dd5e93/isL7RaVwr7uLxiRknPpkjZ.webp'
        },
        {
            src: 'https://api.defaultuploader.com/v1/image/upload/66c78a3b3438de9506dd5e93/nSbySZRnR7fyMpFwiuvpCU.webp'
        }
    ], // [0] dark theme, [1] light theme
    videos: [
        {
            src: 'https://api.defaultuploader.com/v1/video/upload/66c78a3b3438de9506dd5e93/ih6ozsJa2ZxRJCzM3PYTLi.mov',
        },
        {
            src: 'https://api.defaultuploader.com/v1/video/upload/66c78a3b3438de9506dd5e93/ih6ozsJa2ZxRJCzM3PYTLi.mov',
        }
    ],
    audio: ''
}

export const createSources = (param: string) => {
    return exampleSource.images.map((image) => `${image.src}?${param}`)
}

export default { createSources }