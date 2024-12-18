import { Stage } from '../types';

export const findConsultLabel = (
    consultStages: Stage[],
    stagevalue: string
) => {
    return consultStages.find(consultStage => consultStage.value === stagevalue)
        ?.label;
};
