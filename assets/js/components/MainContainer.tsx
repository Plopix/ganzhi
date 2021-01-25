import React, {FunctionComponent, useState} from 'react';
import {
    Container,
    Row,
    Col,
    Nav,
    Navbar, Button,
} from 'react-bootstrap';
import GanzhiYear from "./GanzhiYear";
import Ganzhi from "./Ganzhi";
import GMoon from "./GMoon";
import Jieqi from "./Jieqi";
import moment from "moment";
import 'rc-slider/assets/index.css';
import Slider from 'rc-slider';
import {useSwipeable} from 'react-swipeable';
import DatePicker from "react-datepicker";

import "react-datepicker/dist/react-datepicker.css";
import {recalculateNewMoons, YearCycleRange} from "../functions";

const MoonPhase = require('moonphase-js');

const MainContainer: FunctionComponent = () => {
    const [year, setYear] = useState(+(new Date().getFullYear()));
    const yearCycleStep = 60;
    const [newMoons, setNewMoons] = useState(recalculateNewMoons(year));
    const [dayOfYear, setDayOfTheYear] = useState(moment().dayOfYear());
    const [page, setPage] = useState('ganzhi');
    const isLeapYear = (year % 4) === 0;
    const date = moment().dayOfYear(dayOfYear).year(year);
    const moonphase = new MoonPhase(date.toDate());
    const handlers = useSwipeable({
        onSwipedLeft: () => {
            if (page === 'ganzhi') {
                setPage('energies');
            }
            if (page === 'jieqi') {
                setPage('ganzhi');
            }
            if (page === 'energies') {
                setPage('jieqi');
            }
        },
        onSwipedRight: () => {
            if (page === 'ganzhi') {
                setPage('jieqi');
            }
            if (page === 'jieqi') {
                setPage('energies');
            }
            if (page === 'energies') {
                setPage('ganzhi');
            }
        },
        preventDefaultTouchmoveEvent: true,
        trackMouse: true
    });

    const pageSwitch = () => {
        switch (page) {
            case 'energies':
                return <GanzhiYear year={year} dayOfYear={dayOfYear} isLeapYear={isLeapYear} newMoons={newMoons} />;
            case 'ganzhi':
                return <Ganzhi year={year} />;
            case 'jieqi':
                return <Jieqi year={year} dayOfYear={dayOfYear} isLeapYear={isLeapYear} />;
            default:
                return null;
        }
    };

    const setFromDate = (date) => {
        wrapSetYear(moment(date).year())
        setNewMoons(recalculateNewMoons(moment(date).year()));
    };


    const wrapSetYear = (year) => {
        setYear(year);
        setNewMoons(recalculateNewMoons(year));
    }

    const sliderRange = YearCycleRange(year, yearCycleStep);

    return <>
        <Navbar bg="dark" variant="dark">
            <Navbar.Brand onClick={() => setFromDate(moment().toDate())}>Gan and Zhi</Navbar.Brand>
            <Nav className="mr-auto">
                <Nav.Link className={(page === 'energies' ? 'active' : '')} onClick={() => setPage('energies')}>Energies</Nav.Link>
                <Nav.Link className={(page === 'ganzhi' ? 'active' : '')} onClick={() => setPage('ganzhi')}>Ganzhi</Nav.Link>
                <Nav.Link className={(page === 'jieqi' ? 'active' : '')} onClick={() => setPage('jieqi')}>Jieqi</Nav.Link>
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

            <Row className="justify-content-md-center" style={{visibility: page === 'ganzhi' ? 'hidden' : 'visible'}}>
                <Col md="12">
                    <p className="slider-title">Day of year: {dayOfYear}</p>
                    <Slider
                        min={1}
                        max={366}
                        defaultValue={dayOfYear}
                        onChange={(value) => {
                            setDayOfTheYear(value);
                        }} />

                </Col>
            </Row>
            <Row className="justify-content-md-center">
                <Col md="12">
                    <p className="slider-cycle float-right">
                        Cycles: <Button
                        variant={'outline-dark'}
                        onClick={() => {
                            wrapSetYear(year - yearCycleStep);
                        }}
                        size={'sm'}>&lt;</Button>
                        <Button
                            variant={'outline-dark'}
                            onClick={() => {
                                wrapSetYear(year + yearCycleStep);
                            }}
                            size={'sm'}>&gt;</Button>
                    </p>
                    <p className="slider-title">Year: {year}</p>
                    <Slider
                        min={sliderRange.min}
                        max={sliderRange.max}
                        value={year}
                        onChange={(value) => {
                            wrapSetYear(value);
                        }} />
                </Col>
            </Row>
        </Container>
    </>;
};

export default MainContainer;
