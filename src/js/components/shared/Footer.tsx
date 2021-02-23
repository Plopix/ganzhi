import React, { FunctionComponent } from 'react';
import { SimplePages } from '../App/Type';
import { translator } from '../../Translator';
import { Link } from 'react-router-dom';

const Footer: FunctionComponent = () => {
    return (
        <footer>
            <p>
                <i className="fas fa-code" /> with <i className="fas fa-heart" /> by Plopix.
            </p>
            <p>Designed and propulsed by Guillaume Sor and Plopix in California</p>
            <p>
                {SimplePages.map((page, index) => (
                    <React.Fragment key={page}>
                        {index > 0 && ' - '}
                        <Link to={page}>{translator.t(page, 'pages')}</Link>
                    </React.Fragment>
                ))}{' '}
                -{' '}
                <a href={'https://github.com/plopix/ganzhi'} target={'_blank'} rel="noreferrer">
                    Github
                </a>
            </p>
        </footer>
    );
};

export default Footer;
