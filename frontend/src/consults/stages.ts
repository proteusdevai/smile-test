import { ConfigurationContextValue } from '../root/ConfigurationContext';
import { Consult } from '../types';

export type ConsultsByStage = Record<Consult['stage'], Consult[]>;

export const getConsultsByStage = (
    unorderedConsults: Consult[],
    stages: ConfigurationContextValue['stages']
) => {
    if (!stages) return {};
    const consultsByStage: Record<Consult['stage'], Consult[]> =
        unorderedConsults.reduce(
            (acc, consult) => {
                acc[consult.stage].push(consult);
                return acc;
            },
            // ...obj syntax is to preserve immutability and to avoid re-rendering.
            stages.reduce(
                (obj, stage) => ({ ...obj, [stage.value]: [] }),
                {} as Record<Consult['stage'], Consult[]>
            )
        );
    stages.forEach(stage => {
        const consults = consultsByStage[stage.value];

        if (Array.isArray(consults)) {
            consultsByStage[stage.value] = consults.sort(
                (recordA: Consult, recordB: Consult) =>
                    (recordA.index ?? 0) - (recordB.index ?? 0) // Handle null or undefined index
            );
        }
    });

    return consultsByStage;
};
