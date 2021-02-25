import React, { FunctionComponent } from 'react';
import { translator } from '../Translator';
import { Helmet } from 'react-helmet';

const SimplePage: FunctionComponent<{ page: string }> = ({ page }) => {
    return (
        <div className={'container text-justify'}>
            <Helmet>
                <title>{translator.t('title', page)} - Ganzhi App</title>
            </Helmet>
            <h1 dangerouslySetInnerHTML={{ __html: translator.t('title', page) }} />
            <div dangerouslySetInnerHTML={{ __html: translator.t('text', page) }} />
        </div>
    );
};

export default SimplePage;
