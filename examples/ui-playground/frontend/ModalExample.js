// @flow
import React, {useState} from 'react';
import {Button, Modal} from '@airtable/blocks/ui';

export default function InputExample(props: void) {
    const [isModalOpen, setIsModalOpen] = useState(false);
    return (
        <React.Fragment>
            <Button onClick={() => setIsModalOpen(true)}>Open modal</Button>
            {isModalOpen && (
                <Modal
                    maxWidth="400px"
                    height="200px"
                    padding={4}
                    margin={2}
                    display="flex"
                    alignItems="center"
                    justifyContent="center"
                    onClose={() => setIsModalOpen(false)}
                >
                    Click outside to close
                </Modal>
            )}
        </React.Fragment>
    );
}
