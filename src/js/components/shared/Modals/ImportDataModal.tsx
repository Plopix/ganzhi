import React, { FunctionComponent, useState } from 'react';
import { translator } from '../../../Translator';
import { Alert, Button, Form, Modal } from 'react-bootstrap';
import { useApp } from '../../App/Provider';

const ImportDataModal: FunctionComponent<{ onClose: Function }> = ({ onClose }) => {
    const [, dispatch] = useApp();
    const [uploadedJson, setUploadedJson] = useState(null);

    const handleFileChosen = (file) => {
        const fileReader = new FileReader();
        fileReader.onloadend = () => {
            try {
                const data = JSON.parse(fileReader.result as string);
                if (Object.keys(data).includes('journal')) {
                    setUploadedJson(data);
                }
            } catch (exception) {
                console.log(exception.message);
                setUploadedJson(false);
            }
        };
        fileReader.readAsText(file);
    };

    return (
        <>
            <Modal.Header closeButton>
                <Modal.Title>{translator.t('import', 'pages')}</Modal.Title>
            </Modal.Header>
            <Modal.Body className={'journal'}>
                <Form>
                    <p>{translator.t('import.data.description')}</p>
                    <Form.Group>
                        <Form.File
                            accept="applicatin/json"
                            onChange={(event) => handleFileChosen(event.target.files[0])}
                        />
                    </Form.Group>
                </Form>

                {uploadedJson === false && <Alert variant={'danger'}>{translator.t('import.invalid.file')}</Alert>}
                {uploadedJson !== false && uploadedJson !== null && (
                    <Alert variant={'success'}>{translator.t('import.valid.file')}</Alert>
                )}
            </Modal.Body>
            <Modal.Footer>
                <Button variant="secondary" onClick={() => onClose()}>
                    {translator.t('close')}
                </Button>
                <Button
                    variant="dark"
                    disabled={uploadedJson === false || uploadedJson === null}
                    onClick={() => {
                        dispatch.updateState(uploadedJson);
                        onClose();
                    }}
                >
                    {translator.t('save')}
                </Button>
            </Modal.Footer>
        </>
    );
};

export default ImportDataModal;
