import React, {FunctionComponent, useEffect} from 'react';
import {
    Container,
    Row,
    Col,
    Nav,
    Navbar, Button,
} from 'react-bootstrap';
import GanzhiYear from "../GanzhiYear";
import Ganzhi from "../Ganzhi";
import GMoon from "../GMoon";
import Jieqi from "../Jieqi";
import moment from "moment";
import 'rc-slider/assets/index.css';
import Slider from 'rc-slider';
import {useSwipeable} from 'react-swipeable';
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import {YearCycleRange} from "../../functions";
import {Provider, useApp} from "./Provider";
import {Page} from "./Type";
import {writeStorage, useLocalStorage} from "@rehooks/local-storage";

const MoonPhase = require('moonphase-js');

const App: FunctionComponent = () => {
    const [savedState] = useLocalStorage('state', null);
    return (
        <Provider savedState={savedState}>
            <InnerApp />
        </Provider>
    );
}

const InnerApp: FunctionComponent = () => {
    const [state, dispatch] = useApp();
    const year = state.year;
    const dayOfYear = state.dayOfYear;
    const yearCycleStep = 60;
    const page = state.page;
    const date = moment().year(year).dayOfYear(dayOfYear);
    const moonphase = new MoonPhase(date.toDate());
    const handlers = useSwipeable({
        onSwipedRight: () => {
            if (page === Page.GANZHI) {
                dispatch.updatePage(Page.JIEQI);
            }
            if (page === Page.GANZHIYEAR) {
                dispatch.updatePage(Page.GANZHI);
            }
            if (page === Page.JIEQI) {
                dispatch.updatePage(Page.GANZHIYEAR);
            }

        },
        onSwipedLeft: () => {
            if (page === Page.GANZHI) {
                dispatch.updatePage(Page.GANZHIYEAR);
            }
            if (page === Page.GANZHIYEAR) {
                dispatch.updatePage(Page.JIEQI);
            }
            if (page === Page.JIEQI) {
                dispatch.updatePage(Page.GANZHI);
            }

        },
        preventDefaultTouchmoveEvent: true,
        trackMouse: true
    });

    useEffect(() => {
        writeStorage('state', state)
    }, [state]);


    const pageSwitch = () => {
        switch (page) {
            case Page.GANZHIYEAR:
                return <GanzhiYear />;
            case Page.GANZHI:
                return <Ganzhi />;
            case Page.JIEQI:
                return <Jieqi />;
            default:
                return null;
        }
    };
    const setFromDate = (date) => dispatch.updateDate(moment(date));

    const sliderRange = YearCycleRange(year, yearCycleStep);

    return <>
        <Navbar bg="dark" variant="dark">
            <Navbar.Brand onClick={() => setFromDate(moment().toDate())}>
                <img width="30" src='/images/apple-icon.png' alt={"Gan and Zhi"} />
            </Navbar.Brand>
            <Nav className="mr-auto">
                <Nav.Link className={(page === Page.GANZHI ? 'active' : '')} onClick={() => dispatch.updatePage(Page.GANZHI)}>Ganzhi</Nav.Link>
                <Nav.Link className={(page === Page.GANZHIYEAR ? 'active' : '')} onClick={() => dispatch.updatePage(Page.GANZHIYEAR)}>Energies</Nav.Link>
                <Nav.Link className={(page === Page.JIEQI ? 'active' : '')} onClick={() => dispatch.updatePage(Page.JIEQI)}>Jieqi</Nav.Link>
                <Nav.Link className="d-none d-md-block current-header-date">
                    <DatePicker showYearDropdown scrollableYearDropdown showMonthDropdown selected={date.toDate()} dateFormat={"MMMM dd, yyyy"} onChange={setFromDate} />
                </Nav.Link>
                <Nav.Link className="moon-phase"><GMoon phase={+moonphase.phase} size={36} /></Nav.Link>
            </Nav>
        </Navbar>
        <Container>
            <Row className="justify-content-md-center d-md-none d-lg-blockd-none row-current-header-date">
                <Col md="1">
                    <DatePicker showYearDropdown scrollableYearDropdown showMonthDropdown selected={date.toDate()} dateFormat={"MMMM dd, yyyy"} onChange={setFromDate} />
                </Col>
            </Row>
            <Row className="justify-content-md-center">
                <Col md="12" {...handlers}>
                    {pageSwitch()}
                </Col>
            </Row>

            <Row className="justify-content-md-center mb-11px" style={{visibility: page === Page.GANZHI ? 'hidden' : 'visible'}}>
                <Col md="12">
                    <p className="slider-title">Day of year: {dayOfYear} - {date.format("MMMM Do")}</p>
                    <Slider
                        min={1}
                        max={state.isLeapYear ? 366 : 365}
                        value={dayOfYear}
                        onChange={(value) => {
                            dispatch.updateDayOfYear(value);
                        }} />

                </Col>
            </Row>
            <Row className="justify-content-md-center">
                <Col md="12">
                    <p className="slider-cycle float-right">
                        Cycles: <Button
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
                    <p className="slider-title">Year: {year} - Astrological Year: {state.isInNewYear ? state.year : state.year - 1}</p>
                    <Slider
                        min={sliderRange.min}
                        max={sliderRange.max}
                        value={year}
                        onChange={(value) => {
                            dispatch.updateYear(value);
                        }} />
                </Col>
            </Row>
        </Container>
    </>;
};

export default App;
