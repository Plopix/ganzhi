import React, { CSSProperties, FunctionComponent } from 'react';

declare let window: any;
declare let safari: any;

const supportWebp = (() => {
    const elem = document.createElement('canvas');
    if (!!(elem.getContext && elem.getContext('2d'))) {
        return elem.toDataURL('image/webp').indexOf('data:image/webp') == 0;
    } else {
        return false;
    }
})();

const isSafari =
    window.navigator.userAgent.match(/iPad/i) ||
    window.navigator.userAgent.match(/iPhone/i) ||
    /constructor/i.test(window.HTMLElement) ||
    (function (p) {
        return p.toString() === '[object SafariRemoteNotification]';
    })(!window['safari'] || (typeof safari !== 'undefined' && safari.pushNotification));

const getResponsivePath = (src: string, windowWidth: number): string => {
    const weWantWebp = supportWebp && !isSafari;
    if (windowWidth < 641) {
        if (weWantWebp) {
            return src.replace('/images/', '/images/mobile/webp/').replace('.png', '.webp');
        }
        return src.replace('/images/', '/images/mobile/png/');
    }

    if (weWantWebp) {
        return src.replace('/images/', '/images/desktop/webp/').replace('.png', '.webp');
    }
    return src.replace('/images/', '/images/desktop/png/');
};

const ResponsiveImage: FunctionComponent<{ src: string; className?: string; alt?: string; style?: CSSProperties }> = ({
    src,
    className,
    alt,
    style
}) => {
    return (
        <img
            loading="lazy"
            src={getResponsivePath(src, window.innerWidth)}
            className={className}
            alt={alt}
            style={style}
        />
    );
};
export default ResponsiveImage;
