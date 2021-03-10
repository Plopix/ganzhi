import React, { CSSProperties, FunctionComponent } from 'react';

const ResponsiveImage: FunctionComponent<{ src: string; className?: string; alt?: string; style?: CSSProperties }> = ({
    src,
    className,
    alt,
    style
}) => {
    const desktopPathPNG = src.replace('/images/', '/images/desktop/png/');
    const mobilePathPNG = src.replace('/images/', '/images/mobile/png/');
    const desktopPathWEBP = src.replace('/images/', '/images/desktop/webp/').replace('.png', '.webp');
    const mobilePathWEBP = src.replace('/images/', '/images/mobile/webp/').replace('.png', '.webp');

    return (
        <picture>
            <source type="image/webp" srcSet={mobilePathWEBP} media="(max-width: 640px)" />
            <source type="image/webp" srcSet={desktopPathWEBP} media="(min-width: 641px)" />
            <source srcSet={mobilePathPNG} media="(max-width: 640px)" />
            <source srcSet={desktopPathPNG} media="(min-width: 641px)" />
            <img loading="lazy" src="//:0" className={className} srcSet={mobilePathPNG} alt={alt} style={style} />
        </picture>
    );
};
export default ResponsiveImage;
