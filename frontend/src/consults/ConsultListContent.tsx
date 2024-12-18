import { DragDropContext, OnDragEndResponder } from '@hello-pangea/dnd';
import { Box } from '@mui/material';
import isEqual from 'lodash/isEqual';
import { useEffect, useState } from 'react';
import { DataProvider, useDataProvider, useListContext } from 'react-admin';

import { Consult } from '../types';
import { ConsultColumn } from './ConsultColumn';
import { ConsultsByStage, getConsultsByStage } from './stages';
import { useConfigurationContext } from '../root/ConfigurationContext';

export const ConsultListContent = () => {
    const { stages } = useConfigurationContext();
    const {
        data: unorderedConsults,
        isPending,
        refetch,
    } = useListContext<Consult>();
    const dataProvider = useDataProvider();

    const [consultsByStage, setConsultsByStage] = useState<ConsultsByStage>(
        getConsultsByStage([], stages)
    );

    useEffect(() => {
        if (unorderedConsults) {
            const newConsultsByStage = getConsultsByStage(
                unorderedConsults,
                stages
            );
            if (!isEqual(newConsultsByStage, consultsByStage)) {
                setConsultsByStage(newConsultsByStage);
            }
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [unorderedConsults]);

    if (isPending) return null;

    const onDragEnd: OnDragEndResponder = result => {
        const { destination, source } = result;

        if (!destination) {
            return;
        }

        if (
            destination.droppableId === source.droppableId &&
            destination.index === source.index
        ) {
            return;
        }

        const sourceStage = source.droppableId;
        const destinationStage = destination.droppableId;
        const sourceConsult = consultsByStage[sourceStage][source.index]!;
        const destinationConsult = consultsByStage[destinationStage][
            destination.index
        ] ?? {
            stage: destinationStage,
            index: undefined, // undefined if dropped after the last item
        };

        // compute local state change synchronously
        setConsultsByStage(
            updateConsultStageLocal(
                sourceConsult,
                { stage: sourceStage, index: source.index },
                { stage: destinationStage, index: destination.index },
                consultsByStage
            )
        );

        // persist the changes
        updateConsultStage(
            sourceConsult,
            destinationConsult,
            dataProvider
        ).then(() => {
            refetch();
        });
    };

    return (
        <DragDropContext onDragEnd={onDragEnd}>
            <Box display="flex">
                {stages.map(stage => (
                    <ConsultColumn
                        stage={stage.value}
                        consults={consultsByStage[stage.value]}
                        key={stage.value}
                    />
                ))}
            </Box>
        </DragDropContext>
    );
};

const updateConsultStageLocal = (
    sourceConsult: Consult,
    source: { stage: string; index: number },
    destination: {
        stage: string;
        index?: number; // undefined if dropped after the last item
    },
    consultsByStage: ConsultsByStage
) => {
    if (source.stage === destination.stage) {
        // moving deal inside the same column
        const column = consultsByStage[source.stage];
        column.splice(source.index, 1);
        column.splice(destination.index ?? column.length + 1, 0, sourceConsult);
        return {
            ...consultsByStage,
            [destination.stage]: column,
        };
    } else {
        // moving deal across columns
        const sourceColumn = consultsByStage[source.stage];
        const destinationColumn = consultsByStage[destination.stage];
        sourceColumn.splice(source.index, 1);
        destinationColumn.splice(
            destination.index ?? destinationColumn.length + 1,
            0,
            sourceConsult
        );
        return {
            ...consultsByStage,
            [source.stage]: sourceColumn,
            [destination.stage]: destinationColumn,
        };
    }
};

const updateConsultStage = async (
    source: Consult,
    destination: {
        stage: string;
        index?: number; // undefined if dropped after the last item
    },
    dataProvider: DataProvider
) => {
    if (source.stage === destination.stage) {
        // moving deal inside the same column
        // Fetch all the deals in this stage (because the list may be filtered, but we need to update even non-filtered deals)
        const { data: columnConsults } = await dataProvider.getList(
            'consults',
            {
                sort: { field: 'index', order: 'ASC' },
                pagination: { page: 1, perPage: 100 },
                filter: { stage: source.stage },
            }
        );
        const destinationIndex = destination.index ?? columnConsults.length + 1;

        if (source.index > destinationIndex) {
            // deal moved up, eg
            // dest   src
            //  <------
            // [4, 7, 23, 5]
            await Promise.all([
                // for all deals between destinationIndex and source.index, increase the index
                ...columnConsults
                    .filter(
                        consult =>
                            consult.index >= destinationIndex &&
                            consult.index < source.index
                    )
                    .map(consult =>
                        dataProvider.update('consults', {
                            id: consult.id,
                            data: { index: consult.index + 1 },
                            previousData: consult,
                        })
                    ),
                // for the deal that was moved, update its index
                dataProvider.update('consults', {
                    id: source.id,
                    data: { index: destinationIndex },
                    previousData: source,
                }),
            ]);
        } else {
            // deal moved down, e.g
            // src   dest
            //  ------>
            // [4, 7, 23, 5]
            await Promise.all([
                // for all deals between source.index and destinationIndex, decrease the index
                ...columnConsults
                    .filter(
                        consult =>
                            consult.index <= destinationIndex &&
                            consult.index > source.index
                    )
                    .map(consult =>
                        dataProvider.update('consults', {
                            id: consult.id,
                            data: { index: consult.index - 1 },
                            previousData: consult,
                        })
                    ),
                // for the deal that was moved, update its index
                dataProvider.update('consults', {
                    id: source.id,
                    data: { index: destinationIndex },
                    previousData: source,
                }),
            ]);
        }
    } else {
        // moving deal across columns
        // Fetch all the deals in both stages (because the list may be filtered, but we need to update even non-filtered deals)
        const [{ data: sourceConsults }, { data: destinationConsults }] =
            await Promise.all([
                dataProvider.getList('consults', {
                    sort: { field: 'index', order: 'ASC' },
                    pagination: { page: 1, perPage: 100 },
                    filter: { stage: source.stage },
                }),
                dataProvider.getList('consults', {
                    sort: { field: 'index', order: 'ASC' },
                    pagination: { page: 1, perPage: 100 },
                    filter: { stage: destination.stage },
                }),
            ]);
        const destinationIndex =
            destination.index ?? destinationConsults.length + 1;

        await Promise.all([
            // decrease index on the deals after the source index in the source columns
            ...sourceConsults
                .filter(consult => consult.index > source.index)
                .map(consult =>
                    dataProvider.update('consults', {
                        id: consult.id,
                        data: { index: consult.index - 1 },
                        previousData: consult,
                    })
                ),
            // increase index on the deals after the destination index in the destination columns
            ...destinationConsults
                .filter(consult => consult.index >= destinationIndex)
                .map(consult =>
                    dataProvider.update('consults', {
                        id: consult.id,
                        data: { index: consult.index + 1 },
                        previousData: consult,
                    })
                ),
            // change the dragged deal to take the destination index and column
            dataProvider.update('consults', {
                id: source.id,
                data: {
                    index: destinationIndex,
                    stage: destination.stage,
                },
                previousData: source,
            }),
        ]);
    }
};
