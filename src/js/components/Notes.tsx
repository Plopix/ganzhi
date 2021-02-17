import React, { FunctionComponent } from 'react';
import { translator } from '../Translator';

const Notes: FunctionComponent = () => {
    return (
        <div className={'container text-justify'}>
            <h1 dangerouslySetInnerHTML={{ __html: translator.t('title', 'notes') }} />
            <div dangerouslySetInnerHTML={{ __html: translator.t('text', 'notes') }} />
        </div>
    );
};

export default Notes;
