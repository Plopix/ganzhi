import React, {FunctionComponent} from 'react';
import {translator} from "../Translator";

const Sources: FunctionComponent = () => {
    return <div className={'container text-justify'}>
        <h1>{translator.t('title', 'thankyou')}</h1>
        <div dangerouslySetInnerHTML={{__html: translator.t('text', 'thankyou')}} />
    </div>;
}

export default Sources;
