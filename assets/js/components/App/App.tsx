import React, { FunctionComponent, useEffect } from 'react';
import {
    Container,
    Row,
    Col,
    Nav,
    Navbar, Button, Dropdown, NavItem,
} from 'react-bootstrap';
import GMoon from "../GMoon";
import moment from "moment";
import 'rc-slider/assets/index.css';
import Slider from 'rc-slider';
import { useSwipeable } from 'react-swipeable';
import DatePicker, { registerLocale } from "react-datepicker";
import fr from "date-fns/locale/fr";
import en from "date-fns/locale/en-US";

import "react-datepicker/dist/react-datepicker.css";
import { YearCycleRange } from "../../functions";
import { Provider, useApp } from "./Provider";
import { Page } from "./Type";
import { writeStorage, useLocalStorage } from "@rehooks/local-storage";
import { BrowserRouter as Router, Switch, Route, Link, useLocation, NavLink, useHistory } from 'react-router-dom';
import Routes from "./Routing";
import { translator } from "../../Translator";

const MoonPhase = require('moonphase-js');

registerLocale("fr", fr);
registerLocale("en", en);
const App: FunctionComponent = () => {
    const [savedState] = useLocalStorage('state', null);
    return (
        <Router>
            <Provider savedState={savedState}>
                <InnerApp />
            </Provider>
        </Router>
    );
}

const InnerApp: FunctionComponent = () => {
    const [state, dispatch] = useApp();
    const year = state.year;
    const dayOfYear = state.dayOfYear;
    const yearCycleStep = 60;
    const date = moment().year(year).dayOfYear(dayOfYear);
    const moonphase = new MoonPhase(date.toDate());
    const location = useLocation();
    const history = useHistory();

    const handlers = useSwipeable({
        onSwipedRight: () => {
            if (location.pathname === Page.GANZHI) {
                history.push(Page.JIEQI);
            }
            if (location.pathname === Page.GANZHIYEAR) {
                history.push(Page.GANZHI);
            }
            if (location.pathname === Page.JIEQI) {
                history.push(Page.GANZHIYEAR);
            }

        },
        onSwipedLeft: () => {
            if (location.pathname === Page.GANZHI) {
                history.push(Page.GANZHIYEAR);
            }
            if (location.pathname === Page.GANZHIYEAR) {
                history.push(Page.JIEQI);
            }
            if (location.pathname === Page.JIEQI) {
                history.push(Page.GANZHI);
            }

        },
        preventDefaultTouchmoveEvent: true,
        trackMouse: true
    });

    useEffect(() => {
        writeStorage('state', state)
    }, [state]);

    const setFromDate = (date) => dispatch.updateDate(moment(date));
    const sliderRange = YearCycleRange(year, yearCycleStep);

    return <>
        <Navbar bg="dark" variant="dark">
            <Navbar.Brand onClick={() => setFromDate(moment().toDate())}>
                <img width="30" src='/images/apple-icon.png' alt={"Gan and Zhi"} />
            </Navbar.Brand>
            <Nav className="mr-auto d-flex flex-row flex-fill">
                <div className={'d-flex flex-row flex-fill'}>
                    <Nav.Link as={NavLink} to={Page.GANZHI}>Ganzhi</Nav.Link>
                    <Nav.Link as={NavLink} to={Page.GANZHIYEAR}>Énergies</Nav.Link>
                    <Nav.Link as={NavLink} to={Page.JIEQI}>Jieqi</Nav.Link>
                    <Nav.Link className="d-none d-md-block current-header-date">
                        <DatePicker locale={translator.locale} showYearDropdown scrollableYearDropdown showMonthDropdown selected={date.toDate()} dateFormat={"MMMM dd, yyyy"} onChange={setFromDate} />
                    </Nav.Link>
                    <Dropdown as={NavItem}>
                        <Dropdown.Toggle variant={'secondary'} size={'sm'} as={'div'}>
                            <div className="moon-phase"><GMoon phase={+moonphase.phase} size={36} /></div>
                        </Dropdown.Toggle>
                        <Dropdown.Menu>
                            <Dropdown.Item as={'span'}>{moonphase.phaseName()} - {moonphase.phase.toFixed(2)}</Dropdown.Item>
                        </Dropdown.Menu>
                    </Dropdown>

                </div>
                <div className={'help-dropdown'}>
                    <Dropdown as={NavItem} drop={'left'}>
                        <Dropdown.Toggle variant={'secondary'} size={'sm'}><img src={"/images/tips.png"} height={24} alt={"help"} /></Dropdown.Toggle>
                        <Dropdown.Menu>
                            <Dropdown.Item as={NavLink} to={Page.SOURCES}>Sources</Dropdown.Item>
                            <Dropdown.Item as={NavLink} to={Page.GUIDE}>Guide</Dropdown.Item>
                            <Dropdown.Item as={NavLink} to={Page.NOTES}>Notes</Dropdown.Item>
                        </Dropdown.Menu>
                    </Dropdown>
                </div>
            </Nav>
        </Navbar>
        <Container>
            <Row className="justify-content-md-center d-md-none d-lg-blockd-none row-current-header-date">
                <Col md="1">
                    <DatePicker locale={translator.locale} showYearDropdown scrollableYearDropdown showMonthDropdown selected={date.toDate()} dateFormat={"MMMM dd, yyyy"} onChange={setFromDate} />
                </Col>
            </Row>
            <Row className="justify-content-md-center">
                <Col md="12" {...handlers}>
                    <Switch>
                        {Routes.map((route) => (
                            <Route key={route.path} path={route.path} exact={route.exact} component={route.main} />
                        ))}
                    </Switch>
                </Col>
            </Row>

            {![Page.SOURCES, Page.GUIDE, Page.NOTES].includes(location.pathname) &&
            <Row className="justify-content-md-center mb-11px" style={{ visibility: location.pathname === Page.GANZHI ? 'hidden' : 'visible' }}>
                <Col xs={1} md={1} className={'d-flex align-self-center justify-content-center'}>
                    <Button
                        variant={'outline-dark'}
                        onClick={() => {
                            if (dayOfYear - 1 >= 1) {
                                dispatch.updateDayOfYear(dayOfYear - 1);
                            }
                        }}
                        size={'sm'}>&lt;</Button>
                </Col>
                <Col xs={10} md={10}>
                    <p className="slider-title">{translator.t('dayofyear')}{translator.t('column.punct')}{dayOfYear} - {date.format("LL")}</p>
                    <Slider
                        min={1}
                        max={state.isLeapYear ? 366 : 365}
                        value={dayOfYear}
                        onChange={(value) => {
                            dispatch.updateDayOfYear(value);
                        }} />

                </Col>
                <Col xs={1} md={1} className={'d-flex align-self-center justify-content-center'}>
                    <Button
                        variant={'outline-dark'}
                        onClick={() => {
                            if (dayOfYear + 1 <= (state.isLeapYear ? 366 : 365)) {
                                dispatch.updateDayOfYear(dayOfYear + 1);
                            }
                        }}
                        size={'sm'}>&gt;</Button>
                </Col>
            </Row>}
            {![Page.SOURCES, Page.GUIDE, Page.NOTES].includes(location.pathname) &&
            <Row className="justify-content-md-center">
                <Col xs={1} md={1} className={'d-flex align-self-center justify-content-center'}>
                    <Button
                        variant={'outline-dark'}
                        onClick={() => {
                            dispatch.updateYear(year - 1);
                        }}
                        size={'sm'}>&lt;</Button>
                </Col>
                <Col xs={10} md={10}>
                    <p className="slider-cycle float-right">
                        Cycles{translator.t('column.punct')}<Button
                        variant={'outline-dark'}
                        onClick={() => {
                            dispatch.updateYear(year - yearCycleStep);
                        }}
                        size={'sm'}>&lt;</Button>
                        <Button
                            variant={'outline-dark'}
                            onClick={() => {
                                dispatch.updateYear(year + yearCycleStep);
                            }}
                            size={'sm'}>&gt;</Button>
                    </p>
                    <p className="slider-title">{translator.t('year')}{translator.t('column.punct')}{year} - {translator.t('astro.year')}{translator.t('column.punct')}{state.isInNewYear ? state.year : state.year - 1}</p>
                    <Slider
                        min={sliderRange.min}
                        max={sliderRange.max}
                        value={year}
                        onChange={(value) => {
                            dispatch.updateYear(value);
                        }} />
                </Col>
                <Col xs={1} md={1} className={'d-flex align-self-center justify-content-center'}>
                    <Button
                        variant={'outline-dark'}
                        onClick={() => {
                            dispatch.updateYear(year + 1);
                        }}
                        size={'sm'}>&gt;</Button>
                </Col>
            </Row>}
        </Container>
        <footer>
            <p><i className="fas fa-code" /> with <i className="fas fa-heart" /> by Plopix.</p>
            <p>Designed and propulsed by Guillaume Sor and Plopix in California</p>
            <p>
                <Link to={Page.SOURCES}>Sources</Link> - <Link to={Page.GUIDE}>Guide</Link> - <Link to={Page.NOTES}>Notes</Link>
            </p>
        </footer>
    </>;
};

export default App;
