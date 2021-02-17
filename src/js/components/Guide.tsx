import React, {FunctionComponent} from 'react';
import {translator} from "../Translator";

const Guide: FunctionComponent = () => {
    return <div className={'container text-justify'}>
        <h1>{translator.t('title', 'guide')}</h1>
        <div dangerouslySetInnerHTML={{__html: translator.t('text', 'guide')}} />
    </div>;
}

export default Guide;
