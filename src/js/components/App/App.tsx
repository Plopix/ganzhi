import React, { FunctionComponent, useEffect } from 'react';
import { Container, Row, Col, Button } from 'react-bootstrap';
import moment, { Moment } from 'moment';
import 'rc-slider/assets/index.css';
import Slider from 'rc-slider';
import { useSwipeable } from 'react-swipeable';
import DatePicker, { registerLocale } from 'react-datepicker';
import fr from 'date-fns/locale/fr';
import en from 'date-fns/locale/en-US';
import 'react-datepicker/dist/react-datepicker.css';
import { YearCycleRange } from '../../functions';
import { Provider, useApp } from './Provider';
import { Page, SimplePages } from './Type';
import { writeStorage, useLocalStorage } from '@rehooks/local-storage';
import { BrowserRouter as Router, Switch, Route, useLocation, useHistory } from 'react-router-dom';
import Routes from './Routing';
import { translator } from '../../Translator';
import Header from '../shared/Header';
import Footer from '../shared/Footer';
registerLocale('fr', fr);
registerLocale('en', en);

const App: FunctionComponent = () => {
    const [savedState] = useLocalStorage('state', null);
    const hostname = location.hostname;
    if (hostname === 'ganzhi.plopix.net') {
        return (
            <Container>
                <Row className="justify-content-md-center">
                    <Col className={'text-center mt-5'}>
                        <h1>{translator.t('title', 'migration')}</h1>
                        <a href={'https://ganzhi.io'}>
                            <img width="120" src="/images/apple-icon.png" alt={'Gan and Zhi'} />
                        </a>
                        <h2>
                            <a href={'https://ganzhi.io'}>https://ganzhi.io</a>
                        </h2>
                        <p>{translator.t('description', 'migration')}</p>
                    </Col>
                </Row>
            </Container>
        );
    }
    return (
        <Router>
            <Provider savedState={savedState}>
                <InnerApp />
            </Provider>
        </Router>
    );
};

const InnerApp: FunctionComponent = () => {
    const [state, dispatch] = useApp();
    const year: number = state.year;
    const dayOfYear: number = state.dayOfYear;
    const yearCycleStep = 60;
    const date: Moment = moment().year(year).dayOfYear(dayOfYear);
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
        writeStorage('state', state);
    }, [state]);

    const setFromDate = (date) => dispatch.updateDate(moment(date));
    const sliderRange = YearCycleRange(year, yearCycleStep);

    return (
        <>
            <Header />
            <Container>
                <Row className="justify-content-md-center d-md-none d-lg-blockd-none row-current-header-date">
                    <Col md="1">
                        <DatePicker
                            locale={translator.locale}
                            showYearDropdown
                            scrollableYearDropdown
                            showMonthDropdown
                            selected={date.toDate()}
                            dateFormat={'MMMM dd, yyyy'}
                            onChange={setFromDate}
                        />
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

                {!SimplePages.includes(location.pathname) && (
                    <Row
                        className="justify-content-md-center mb-11px row-slider"
                        style={{ visibility: location.pathname === Page.GANZHI ? 'hidden' : 'visible' }}
                    >
                        <Col xs={1} md={1} className={'d-flex align-self-center justify-content-center'}>
                            <Button
                                variant={'outline-dark'}
                                onClick={() => {
                                    if (dayOfYear - 1 >= 1) {
                                        dispatch.updateDayOfYear(dayOfYear - 1);
                                    }
                                }}
                                size={'sm'}
                            >
                                -1
                            </Button>
                        </Col>
                        <Col xs={10} md={10}>
                            <p className="slider-title">
                                {translator.t('dayofyear')}
                                {translator.t('column.punct')}
                                {dayOfYear} - {date.format('LL')}
                            </p>
                            <Slider
                                min={1}
                                max={state.isLeapYear ? 366 : 365}
                                value={dayOfYear}
                                onChange={(value) => {
                                    dispatch.updateDayOfYear(value);
                                }}
                            />
                        </Col>
                        <Col xs={1} md={1} className={'d-flex align-self-center justify-content-center right-button'}>
                            <Button
                                variant={'outline-dark'}
                                onClick={() => {
                                    if (dayOfYear + 1 <= (state.isLeapYear ? 366 : 365)) {
                                        dispatch.updateDayOfYear(dayOfYear + 1);
                                    }
                                }}
                                size={'sm'}
                            >
                                +1
                            </Button>
                        </Col>
                    </Row>
                )}
                {!SimplePages.includes(location.pathname) && (
                    <Row className="justify-content-md-center row-slider">
                        <Col xs={1} md={1} className={'d-flex align-self-center justify-content-center'}>
                            <Button
                                variant={'outline-dark'}
                                onClick={() => {
                                    dispatch.updateYear(year - 1);
                                }}
                                size={'sm'}
                            >
                                -1
                            </Button>
                        </Col>
                        <Col xs={10} md={10}>
                            <p className="slider-title">
                                {translator.t('year')}
                                {translator.t('column.punct')}
                                {year} - {translator.t('astro.year')}
                                {translator.t('column.punct')}
                                {state.isInNewYear ? state.year : state.year - 1}
                            </p>
                            <Slider
                                min={sliderRange.min}
                                max={sliderRange.max}
                                value={year}
                                onChange={(value) => {
                                    dispatch.updateYear(value);
                                }}
                            />
                            <p className="slider-cycle">
                                <Button
                                    variant={'outline-dark'}
                                    onClick={() => {
                                        dispatch.updateYear(year - yearCycleStep);
                                    }}
                                    size={'sm'}
                                >
                                    <i className={'fas fa-angle-double-left'} />
                                </Button>{' '}
                                Cycles{' '}
                                <Button
                                    variant={'outline-dark'}
                                    onClick={() => {
                                        dispatch.updateYear(year + yearCycleStep);
                                    }}
                                    size={'sm'}
                                >
                                    <i className={'fas fa-angle-double-right'} />
                                </Button>
                            </p>
                        </Col>
                        <Col xs={1} md={1} className={'d-flex align-self-center justify-content-center right-button'}>
                            <Button
                                variant={'outline-dark'}
                                onClick={() => {
                                    dispatch.updateYear(year + 1);
                                }}
                                size={'sm'}
                            >
                                +1
                            </Button>
                        </Col>
                    </Row>
                )}
            </Container>
            <Footer />
        </>
    );
};

export default App;
