import React, { CSSProperties, FunctionComponent } from 'react';

declare let window: any;
declare let safari: any;

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

    const isSafari =
        /constructor/i.test(window.HTMLElement) ||
        (function (p) {
            return p.toString() === '[object SafariRemoteNotification]';
        })(!window['safari'] || (typeof safari !== 'undefined' && safari.pushNotification));

    return (
        <picture>
            {!isSafari && <source type="image/webp" srcSet={mobilePathWEBP} media="(max-width: 640px)" />}
            {!isSafari && <source type="image/webp" srcSet={desktopPathWEBP} media="(min-width: 641px)" />}
            <source srcSet={mobilePathPNG} media="(max-width: 640px)" />
            <source srcSet={desktopPathPNG} media="(min-width: 641px)" />
            <img loading="lazy" src="//:0" className={className} srcSet={mobilePathPNG} alt={alt} style={style} />
        </picture>
    );
};
export default ResponsiveImage;
