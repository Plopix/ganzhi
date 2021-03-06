import React, { FunctionComponent, useState } from 'react';
import { Dropdown, Modal, Nav, Navbar, NavItem } from 'react-bootstrap';
import moment, { Moment } from 'moment';
import { Page } from '../App/Type';
import GMoon from './GMoon';
import { NavLink } from 'react-router-dom';
import MoonPhase from 'moonphase-js';
import { useApp } from '../App/Provider';
import DatePicker, { registerLocale } from 'react-datepicker';
import fr from 'date-fns/locale/fr';
import en from 'date-fns/locale/en-US';
import { translator } from '../../Translator';
import ImportDataModal from './Modals/ImportDataModal';

registerLocale('fr', fr);
registerLocale('en', en);

const Header: FunctionComponent = () => {
    const [state, dispatch] = useApp();
    const [importModalVisible, setImportModalVisible] = useState<boolean>(false);
    const year: number = state.year;
    const dayOfYear: number = state.dayOfYear;
    const date: Moment = moment().year(year).dayOfYear(dayOfYear);
    const moonphase: MoonPhase = new MoonPhase(date.toDate());
    const setFromDate = (date) => dispatch.updateDate(moment(date));

    const exportData = (event) => {
        const myBlob = new Blob([JSON.stringify({ ...state, moons: null })], { type: 'application/json' });
        const url = window.URL.createObjectURL(myBlob);
        event.target.href = url;
        event.target.download = 'ganzhidata.json';
        setTimeout(function () {
            window.URL.revokeObjectURL(url);
        }, 0);
    };

    return (
        <Navbar bg="dark" variant="dark">
            <Navbar.Brand onClick={() => setFromDate(moment().toDate())}>
                <img width="30" src="/images/apple-icon.png" alt={'Gan and Zhi'} />
            </Navbar.Brand>
            <Nav className="mr-auto d-flex flex-row flex-fill">
                <div className={'d-flex flex-row flex-fill'}>
                    <Nav.Link as={NavLink} to={Page.GANZHI}>
                        {translator.t(Page.GANZHI, 'pages')}
                    </Nav.Link>
                    <Nav.Link as={NavLink} to={Page.GANZHIYEAR}>
                        {translator.t(Page.GANZHIYEAR, 'pages')}
                    </Nav.Link>
                    <Nav.Link as={NavLink} to={Page.JIEQI}>
                        {translator.t(Page.JIEQI, 'pages')}
                    </Nav.Link>
                    <Nav.Link className="d-none d-md-block current-header-date">
                        <DatePicker
                            locale={translator.locale}
                            showYearDropdown
                            scrollableYearDropdown
                            showMonthDropdown
                            selected={date.toDate()}
                            dateFormat={'MMMM dd, yyyy'}
                            onChange={setFromDate}
                        />
                    </Nav.Link>
                    <Dropdown className={'moon-dropdown'} as={NavItem} drop={'left'}>
                        <Dropdown.Toggle variant={'secondary'} size={'sm'} as={'div'}>
                            <div className="moon-phase">
                                <GMoon phase={+moonphase.phase} size={36} />
                            </div>
                        </Dropdown.Toggle>
                        <Dropdown.Menu>
                            <Dropdown.Item as={'span'}>
                                {moonphase.phaseName()} - {moonphase.phase.toFixed(2)}
                            </Dropdown.Item>
                        </Dropdown.Menu>
                    </Dropdown>
                </div>
                <div className={'help-dropdown'}>
                    <Dropdown as={NavItem} drop={'left'}>
                        <Dropdown.Toggle variant={'secondary'} size={'sm'}>
                            <img src={'/images/tips.png'} height={24} alt={'help'} />
                        </Dropdown.Toggle>
                        <Dropdown.Menu>
                            <Dropdown.Item as={NavLink} to={Page.SOURCES}>
                                <i className="fas fa-quote-right" /> {translator.t(Page.SOURCES, 'pages')}
                            </Dropdown.Item>
                            <Dropdown.Item as={NavLink} to={Page.GUIDE}>
                                <i className={'fas fa-map-signs'} /> {translator.t(Page.GUIDE, 'pages')}
                            </Dropdown.Item>
                            <Dropdown.Item as={NavLink} to={Page.NOTES}>
                                <i className={'fas fa-info-circle'} /> {translator.t(Page.NOTES, 'pages')}
                            </Dropdown.Item>
                            <Dropdown.Divider />
                            <Dropdown.Item as={'a'} href={'#'} onClick={exportData}>
                                <i className={'fas fa-cloud-download-alt'} /> {translator.t('export', 'pages')}
                            </Dropdown.Item>
                            <Dropdown.Item as={'a'} href={'#'} onClick={() => setImportModalVisible(true)}>
                                <i className={'fas fa-upload'} /> {translator.t('import', 'pages')}
                            </Dropdown.Item>
                            <Dropdown.Divider />
                            <Dropdown.Item as={'a'} href={'https://github.com/plopix/ganzhi'}>
                                <i className={'fab fa-github'} /> {translator.t('github', 'pages')}
                            </Dropdown.Item>
                        </Dropdown.Menu>
                    </Dropdown>
                    <Modal show={importModalVisible} onHide={() => setImportModalVisible(false)} centered>
                        <ImportDataModal onClose={() => setImportModalVisible(false)} />
                    </Modal>
                </div>
            </Nav>
        </Navbar>
    );
};

export default Header;
