import React, { useState } from 'react';
import { GetDayOfTheYear } from '../functions';
import {
    Button,
    Container,
    Row,
    Col,
    Form,
    Nav,
    FormControl,
    ButtonToolbar,
    InputGroup,
    Navbar,
    ButtonGroup
} from 'react-bootstrap';
import GanzhiYear from "./GanzhiYear";
import Ganzhi from "./Ganzhi";
import Jieqi from "./Jieqi";
import moment from "moment";

export default function MainContainer () {
    const [year, setYear] = useState(+(new Date().getFullYear()));
    const [page, setPage] = useState('ganzhi');

    const isLeapYear = (year % 4) === 0;

    const dayOfYear = GetDayOfTheYear(isLeapYear);

    const increment = (incr: number) => {
        const newValue = year + incr;
        if (newValue < 10000 && newValue > 0) {
            setYear(newValue);
        }
    };

    const set = (newValue: string) => {
        const passedYear = +newValue;
        if (passedYear < 10000 && passedYear > 0) {
            setYear(+passedYear);
        }
    };

    const date = moment().format('MMMM Do, YYYY');

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

    return <>
        <Navbar bg="dark" variant="dark">
            <Navbar.Brand>Gan and Zhi</Navbar.Brand>
            <Nav className="mr-auto">
                <Nav.Link onClick={() => setPage('energies')}>Energies</Nav.Link>
                <Nav.Link onClick={() => setPage('ganzhi')}>Ganzhi</Nav.Link>
                <Nav.Link onClick={() => setPage('jieqi')}>Jieqi</Nav.Link>
                <Nav.Link><small className="d-none d-md-block current-header-date">{date}</small></Nav.Link>
            </Nav>
            <div className="d-none d-md-block">
                <Form inline>
                    <InputGroup>
                        <InputGroup.Prepend>
                            <InputGroup.Text>Year</InputGroup.Text>
                        </InputGroup.Prepend>
                        <Form.Control
                            type="number"
                            onChange={(e) => set((e.target as HTMLTextAreaElement).value)} value={year.toString()}
                            required
                        />
                    </InputGroup>
                    <ButtonToolbar className="year-change">
                        <ButtonGroup>
                            <Button variant="outline-light" id="minusone" onClick={() => increment(-1)}>-1</Button>
                            <Button variant="outline-light" id="plusone" onClick={() => increment(+1)}>+1</Button>
                        </ButtonGroup>
                    </ButtonToolbar>
                </Form>
            </div>
        </Navbar>
        <Container>
            <Row className="justify-content-md-center d-md-none d-lg-blockd-none row-current-header-date">
                <Col md="1">
                    We are: {date}
                </Col>
            </Row>
            <Row className="justify-content-md-center d-md-none d-lg-blockd-none row-year-change">
                <Col md="4">
                    <InputGroup>
                        <InputGroup.Prepend>
                            <InputGroup.Text>Year</InputGroup.Text>
                        </InputGroup.Prepend>
                        <Form.Control
                            type="number"
                            onChange={(e) => set((e.target as HTMLTextAreaElement).value)} value={year.toString()}
                            required
                        />
                    </InputGroup>
                    <div className="d-flex flex-column">
                        <ButtonGroup>
                            <Button variant="outline-dark" id="minusone" onClick={() => increment(-1)}>-1</Button>
                            <Button variant="outline-dark" id="plusone" onClick={() => increment(+1)}>+1</Button>
                        </ButtonGroup>
                    </div>
                </Col>
            </Row>
            <Row className="justify-content-md-center">
                <Col md="12">
                    {pageSwitch()}
                </Col>
            </Row>
        </Container>
    </>;
}
