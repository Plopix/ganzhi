import React, { FunctionComponent } from 'react';
import { translator } from '../../Translator';
import { Modal } from 'react-bootstrap';
import { useApp } from '../App/Provider';
import moment from 'moment';

const CelebrationDaysModal: FunctionComponent<{ celebrations: number[]; setCelebrationVisible: Function }> = ({
    celebrations,
    setCelebrationVisible
}) => {
    const [state, dispatch] = useApp();

    return (
        <Modal.Body>
            <ul className={'list-group'}>
                {celebrations.map((celebrationDay, index) => {
                    const celebration = moment().year(state.year).dayOfYear(celebrationDay);
                    const [fr, ch, pin] = translator.t('celebration.' + index, 'celebrations').split('-');
                    const extraButtons = [];
                    if (index >= 2 && index <= 4) {
                        if (index === 2) {
                            extraButtons.push(
                                <button
                                    key={index + 1}
                                    className={'btn btn-sm btn-danger mb-1'}
                                    onClick={() => {
                                        dispatch.updateDayOfYear(celebrationDay + 1);
                                        setCelebrationVisible(false);
                                    }}
                                >
                                    {moment()
                                        .year(state.year)
                                        .dayOfYear(celebrationDay + 1)
                                        .format('LL')}
                                </button>
                            );
                            extraButtons.push(
                                <button
                                    key={index + 2}
                                    className={'btn btn-sm btn-danger'}
                                    onClick={() => {
                                        dispatch.updateDayOfYear(celebrationDay + 2);
                                        setCelebrationVisible(false);
                                    }}
                                >
                                    {moment()
                                        .year(state.year)
                                        .dayOfYear(celebrationDay + 2)
                                        .format('LL')}
                                </button>
                            );
                        }
                        if (index > 2) {
                            return null;
                        }
                    }
                    return (
                        <li key={index} className={'list-group-item d-flex flex-row justify-content-between'}>
                            <div>
                                {fr.trim()}
                                <br />
                                {ch.trim()} {pin.trim()}
                            </div>
                            <div className={'d-flex flex-column'}>
                                <button
                                    className={'btn btn-sm btn-danger mb-1'}
                                    onClick={() => {
                                        dispatch.updateDayOfYear(celebrationDay);
                                        setCelebrationVisible(false);
                                    }}
                                >
                                    {celebration.format('LL')}
                                </button>
                                {extraButtons.map((button) => button)}
                            </div>
                        </li>
                    );
                })}
            </ul>
        </Modal.Body>
    );
};

export default CelebrationDaysModal;
