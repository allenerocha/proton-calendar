import React from 'react';
import {
    SubTitle,
    PrimaryButton,
    useModals,
    Tooltip,
    ConfirmModal,
    Alert,
    useApi,
    useEventManager,
    useNotifications,
    useLoading
} from 'react-components';
import { c } from 'ttag';
import { noop } from 'proton-shared/lib/helpers/function';

import CalendarsTable from './CalendarsTable';
import CalendarModal from '../CalendarModal';
import { removeCalendar } from 'proton-shared/lib/api/calendars';

const notReady = true;

const CalendarsSection = ({ calendars }) => {
    const api = useApi();
    const { call } = useEventManager();
    const { createNotification } = useNotifications();
    const { createModal } = useModals();
    const [loading, withLoading] = useLoading();

    const handleCreate = () => {
        createModal(<CalendarModal />);
    };

    const handleEdit = (calendar) => {
        createModal(<CalendarModal calendar={calendar} />);
    };

    const handleDelete = async ({ ID }) => {
        await new Promise((resolve, reject) => {
            createModal(
                <ConfirmModal title={c('Title').t`Confirm delete`} onClose={reject} onConfirm={resolve}>
                    <Alert>{c('Info').t`Are you sure you want to delete this calendar?`}</Alert>
                </ConfirmModal>
            );
        });
        await api(removeCalendar(ID));
        await call();
        createNotification({ text: c('Success').t`Calendar removed` });
    };

    return (
        <>
            <SubTitle>{c('Title').t`Calendars`}</SubTitle>
            <div className="mb1">
                <Tooltip title={c('Info').t`Feature coming soon`}>
                    <PrimaryButton disabled={notReady} onClick={notReady ? noop : handleCreate}>{c('Action')
                        .t`Add calendar`}</PrimaryButton>
                </Tooltip>
            </div>
            <CalendarsTable
                calendars={calendars}
                onDelete={(calendar) => withLoading(handleDelete(calendar))}
                onEdit={handleEdit}
                loading={loading}
            />
        </>
    );
};

export default CalendarsSection;
