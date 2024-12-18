import { Draggable } from '@hello-pangea/dnd';
import { Box, Card, Typography } from '@mui/material';
import { ReferenceField, useRedirect } from 'react-admin';
import { Consult } from '../types';

export const ConsultCard = ({
    consult,
    index,
}: {
    consult: Consult;
    index: number;
}) => {
    if (!consult) return null;

    return (
        <Draggable draggableId={String(consult.id)} index={index}>
            {(provided, snapshot) => (
                <ConsultCardContent
                    provided={provided}
                    snapshot={snapshot}
                    consult={consult}
                />
            )}
        </Draggable>
    );
};

export const ConsultCardContent = ({
    provided,
    snapshot,
    consult,
}: {
    provided?: any;
    snapshot?: any;
    consult: Consult;
}) => {
    const redirect = useRedirect();
    const handleClick = () => {
        redirect(
            `/consults/${consult.id}/show`,
            undefined,
            undefined,
            undefined,
            {
                _scrollToTop: false,
            }
        );
    };

    return (
        <Box
            sx={{ marginBottom: 1, cursor: 'pointer' }}
            {...provided?.draggableProps}
            {...provided?.dragHandleProps}
            ref={provided?.innerRef}
            onClick={handleClick}
        >
            <Card
                style={{
                    opacity: snapshot?.isDragging ? 0.9 : 1,
                    transform: snapshot?.isDragging ? 'rotate(-2deg)' : '',
                }}
                elevation={snapshot?.isDragging ? 3 : 1}
            >
                <Box padding={1} display="flex">
                    <Box sx={{ marginLeft: 1 }}>
                        <Typography variant="body2" gutterBottom>
                            {consult.name}
                        </Typography>
                        <Typography variant="caption" color="textSecondary">
                            {consult.amount.toLocaleString('en-US', {
                                notation: 'compact',
                                style: 'currency',
                                currency: 'USD',
                                currencyDisplay: 'narrowSymbol',
                                minimumSignificantDigits: 3,
                            })}
                            {consult.category ? `, ${consult.category}` : ''}
                        </Typography>
                    </Box>
                </Box>
            </Card>
        </Box>
    );
};
