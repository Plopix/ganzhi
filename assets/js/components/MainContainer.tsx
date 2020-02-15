import React, {useState} from 'react';
import {
    Container,
    Row,
    Col,
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
const MoonPhase = require('moonphase-js');

export default function MainContainer() {
    const [year, setYear] = useState(+(new Date().getFullYear()));
    const [page, setPage] = useState('ganzhi');
    const [dayOfYear, setDayOfTheYear] = useState(moment().dayOfYear());
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
        setDayOfTheYear(value);
        return (
            <Slider.Handle value={value} {...restProps} />
        );
    };

    const handleYear = (props) => {
        const {value, dragging, index, ...restProps} = props;
        setYear(value);
        return (
            <Slider.Handle value={value} {...restProps} />
        );
    };

    return <>
        <Navbar bg="dark" variant="dark">
            <Navbar.Brand>Gan and Zhi</Navbar.Brand>
            <Nav className="mr-auto">
                <Nav.Link onClick={() => setPage('energies')}>Energies</Nav.Link>
                <Nav.Link onClick={() => setPage('ganzhi')}>Ganzhi</Nav.Link>
                <Nav.Link onClick={() => setPage('jieqi')}>Jieqi</Nav.Link>
                <Nav.Link><small className="d-none d-md-block current-header-date">{dateString}</small></Nav.Link>
                <Nav.Link className="moon-phase"><GMoon phase={+moonphase.phase} size={36} /></Nav.Link>
            </Nav>
        </Navbar>
        <Container>
            <Row className="justify-content-md-center d-md-none d-lg-blockd-none row-current-header-date">
                <Col md="1">{dateString}}</Col>
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
                    <Slider min={1900} max={moment().year() + 50} defaultValue={year} handle={handleYear}/>
                </Col>
            </Row>
        </Container>
    </>;
}
