import React, { FunctionComponent } from 'react';
import { translator } from '../Translator';

const SimplePage: FunctionComponent<{ page: string }> = ({ page }) => {
    return (
        <div className={'container text-justify'}>
            <h1 dangerouslySetInnerHTML={{ __html: translator.t('title', page) }} />
            <div dangerouslySetInnerHTML={{ __html: translator.t('text', page) }} />
        </div>
    );
};

export default SimplePage;
