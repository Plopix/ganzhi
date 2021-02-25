import React, { FunctionComponent } from 'react';
import { useApp } from '../App/Provider';
import { Modal } from 'react-bootstrap';
import { translator } from '../../Translator';
import { GetRank } from '../../functions';
import { SymbolsMap, symbolsmap } from '../../symbolsmap';

const GanzhiSymbolsModal: FunctionComponent = () => {
    const [state] = useApp();
    const rank: number = GetRank(state.dayOfYear < 36 ? state.year - 1 : state.year);
    const map: SymbolsMap = symbolsmap[translator.locale];
    return (
        <>
            <Modal.Header closeButton>
                <Modal.Title>
                    {state.year} - {translator.t('year')} {rank}
                </Modal.Title>
            </Modal.Header>
            <Modal.Body className={'ganzhi-symbols'}>
                <p className={'text-center'}>
                    {map.gan[rank.realModulo(map.gan.length)][0]} {map.zhi[rank.realModulo(map.zhi.length)][0]} <br />
                    {map.gan[rank.realModulo(map.gan.length)][1]} {map.zhi[rank.realModulo(map.zhi.length)][1]}
                </p>
                <p className={'text-center'}>
                    <strong>{translator.t('symbol')}</strong>
                    <br />
                    {map.symbols[rank.realModulo(map.symbols.length)]}
                </p>
            </Modal.Body>
        </>
    );
};

export default GanzhiSymbolsModal;
