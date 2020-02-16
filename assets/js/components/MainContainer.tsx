import React, {FunctionComponent, useState} from 'react';
import {
    Container,
    Row,
    Col,
    NavDropdown,
    Nav,
    Navbar,
} from 'react-bootstrap';
import GanzhiYear from "./GanzhiYear";
import Ganzhi from "./Ganzhi";
import GMoon from "./GMoon";
import Jieqi from "./Jieqi";
import moment from "moment";
import 'rc-slider/assets/index.css';
import Slider from 'rc-slider';

import DatePicker from "react-datepicker";

import "react-datepicker/dist/react-datepicker.css";

const MoonPhase = require('moonphase-js');

const MainContainer: FunctionComponent = () => {
    const [year, setYear] = useState(+(new Date().getFullYear()));
    const [dayOfYear, setDayOfTheYear] = useState(moment().dayOfYear());
    const [page, setPage] = useState('ganzhi');
    const isLeapYear = (year % 4) === 0;

    const date = moment().dayOfYear(dayOfYear).year(year);
    const dateString = date.format('MMMM Do, YYYY');
    const moonphase = new MoonPhase(date.toDate());

    const pageSwitch = () => {
        switch (page) {
            case 'energies':
                return <GanzhiYear year={year} dayOfYear={dayOfYear} isLeapYear={isLeapYear}/>;
            case 'ganzhi':
                return <Ganzhi year={year}/>;
            case 'jieqi':
                return <Jieqi year={year} dayOfYear={dayOfYear} isLeapYear={isLeapYear}/>;
            default:
                return null;
        }
    };


    const handleDay = (props) => {
        const {value, dragging, index, ...restProps} = props;
        if (dragging) {
            setDayOfTheYear(value);
        }
        return (
            <Slider.Handle value={value} {...restProps} />
        );
    };

    const setFromDate = (date) => {
        setYear(moment(date).year());
        setDayOfTheYear(moment(date).dayOfYear());
    };

    const handleYear = (props) => {
        const {value, dragging, index, ...restProps} = props;
        if (dragging) {
            setYear(value);
        }
        return (
            <Slider.Handle value={value} {...restProps} />
        );
    };

    return <>
        <Navbar bg="dark" variant="dark">
            <Navbar.Brand onClick={() => setFromDate(moment().toDate())}>Gan and Zhi</Navbar.Brand>
            <Nav className="mr-auto">
                <Nav.Link onClick={() => setPage('energies')}>Energies</Nav.Link>
                <Nav.Link onClick={() => setPage('ganzhi')}>Ganzhi</Nav.Link>
                <Nav.Link onClick={() => setPage('jieqi')}>Jieqi</Nav.Link>
                <Nav.Link className="d-none d-md-block current-header-date">
                    <DatePicker showYearDropdown scrollableYearDropdown showMonthDropdown selected={date.toDate()} dateFormat={"MMMM dd, yyyy"} onChange={setFromDate}/>
                </Nav.Link>
                <Nav.Link className="moon-phase"><GMoon phase={+moonphase.phase} size={36}/></Nav.Link>
            </Nav>
        </Navbar>
        <Container>
            <Row className="justify-content-md-center d-md-none d-lg-blockd-none row-current-header-date">
                <Col md="1">
                    <DatePicker showYearDropdown scrollableYearDropdown showMonthDropdown selected={date.toDate()} dateFormat={"MMMM dd, yyyy"} onChange={setFromDate}/>
                </Col>
            </Row>
            <Row className="justify-content-md-center">
                <Col md="12">
                    {pageSwitch()}
                </Col>
            </Row>

            <Row className="justify-content-md-center">
                <Col md="12">
                    <p className="slider-title">Day of year: {dayOfYear}</p>
                    <Slider min={1} max={366} defaultValue={dayOfYear} handle={handleDay}/>
                </Col>
            </Row>
            <Row className="justify-content-md-center">
                <Col md="12">
                    <p className="slider-title">Year: {year}</p>
                    <Slider min={1924} max={2104} defaultValue={year} handle={handleYear}/>
                </Col>
            </Row>
        </Container>
    </>;
};

export default MainContainer;
