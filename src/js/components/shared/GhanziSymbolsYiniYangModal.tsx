import React, { FunctionComponent } from 'react';
import { useApp } from '../App/Provider';
import { Col, Container, Modal, Row } from 'react-bootstrap';
import { translator } from '../../Translator';
import { GetRank } from '../../functions';
import { SymbolsMap, symbolsmap } from '../../symbolsmap';

const GhanziSymbolsYinYangModal: FunctionComponent = () => {
    const [state] = useApp();
    const rank: number = GetRank(state.dayOfYear < 36 ? state.year - 1 : state.year);
    const onNewYearRank: number = GetRank(state.isInNewYear ? state.year : state.year - 1);
    const rankIndex: number = rank - 1;
    const onNewYearRankIndex: number = onNewYearRank - 1;

    const map: SymbolsMap = symbolsmap[translator.locale];
    return (
        <>
            <Modal.Header closeButton>
                <Modal.Title>
                    {state.year} - {translator.t('year')} {rank}
                </Modal.Title>
            </Modal.Header>
            <Modal.Body className={'ganzhi-symbols'}>
                <Container>
                    <Row className={'align-items-center'}>
                        <Col className={'text-center'}>
                            干支
                            <br />
                            gānzhī
                        </Col>
                        <Col className={'text-center'}>
                            {map.gan[rankIndex.realModulo(map.gan.length)][0]}{' '}
                            {map.zhi[rankIndex.realModulo(map.zhi.length)][0]}
                            <br />
                            {map.gan[rankIndex.realModulo(map.gan.length)][1]}{' '}
                            {map.zhi[rankIndex.realModulo(map.zhi.length)][1]}
                        </Col>
                    </Row>
                    <Row className={'align-items-center'}>
                        <Col className={'text-center'}>
                            {translator.t('symbol.year.energy')}
                            <br />
                            {translator.t('symbol.grand.meridien')}
                        </Col>
                        <Col className={'text-center'}>
                            {map.energies[rankIndex.realModulo(map.energies.length)][0]}
                            <br />
                            {map.energies[rankIndex.realModulo(map.energies.length)][1]}
                        </Col>
                    </Row>
                    <Row className={'align-items-center'}>
                        <Col className={'text-center'}>{translator.t('symbol.polarity')}</Col>
                        <Col className={'text-center'}>
                            {map.polarities[rankIndex.realModulo(map.polarities.length)][0]}
                            <br />
                            {map.polarities[rankIndex.realModulo(map.polarities.length)][1]}
                        </Col>
                    </Row>
                    <Row className={'align-items-center'}>
                        <Col className={'text-center'}>{translator.t('symbol.arrival.movement')}</Col>
                        <Col className={'text-center'}>
                            {map.elements[rankIndex.realModulo(map.elements.length)]} {translator.t('symbol.by')}{' '}
                            {map.directions[rankIndex.realModulo(map.directions.length)]}
                        </Col>
                    </Row>
                    <Row className={'align-items-center'}>
                        <Col className={'text-center'}>{translator.t('symbol.astro.sign')}</Col>
                        <Col className={'text-center'}>
                            {map.signs[onNewYearRankIndex.realModulo(map.signs.length)][0]}
                            <br />
                            {map.signs[onNewYearRankIndex.realModulo(map.signs.length)][1]}
                        </Col>
                    </Row>
                    <Row className={'align-items-center'}>
                        <Col className={'text-center'}>{translator.t('symbol.element')}</Col>
                        <Col className={'text-center'}>
                            {map.elementSigns[onNewYearRankIndex.realModulo(map.elementSigns.length)][0]}
                            <br />
                            {map.elementSigns[onNewYearRankIndex.realModulo(map.elementSigns.length)][1]}
                        </Col>
                    </Row>
                    <Row className={'align-items-center'}>
                        <Col className={'text-center'}>{translator.t('symbol.orientation')}</Col>
                        <Col className={'text-center'}>
                            {map.orientations[rankIndex.realModulo(map.orientations.length)]}
                        </Col>
                    </Row>
                </Container>
            </Modal.Body>
        </>
    );
};

export default GhanziSymbolsYinYangModal;
