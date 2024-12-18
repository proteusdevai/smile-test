import AttachMoneyIcon from '@mui/icons-material/AttachMoney';
import { Box, Stack, Typography, Skeleton } from '@mui/material';
import { ResponsiveBar } from '@nivo/bar';
import { format, startOfMonth } from 'date-fns';
import { useMemo } from 'react';
import { useGetList } from 'react-admin';

import { Consult } from '../types';

const multiplier = {
    opportunity: 0.2,
    'proposal-sent': 0.5,
    'in-negociation': 0.8,
    delayed: 0.3,
};

const threeMonthsAgo = new Date(
    new Date().setMonth(new Date().getMonth() - 6)
).toISOString();

export const ConsultsChart = () => {
    const { data, isPending } = useGetList<Consult>('consults', {
        pagination: { perPage: 100, page: 1 },
        sort: {
            field: 'created_at',
            order: 'ASC',
        },
        filter: {
            'created_at@gte': threeMonthsAgo,
        },
    });
    const months = useMemo(() => {
        if (!data) return [];
        const consultsByMonth = data.reduce((acc, consult) => {
            const month = startOfMonth(
                consult.created_at ?? new Date()
            ).toISOString();
            if (!acc[month]) {
                acc[month] = [];
            }
            acc[month].push(consult);
            return acc;
        }, {} as any);

        const amountByMonth = Object.keys(consultsByMonth).map(month => {
            return {
                date: format(month, 'MMM'),
                won: consultsByMonth[month]
                    .filter((consult: Consult) => consult.stage === 'won')
                    .reduce((acc: number, consult: Consult) => {
                        acc += consult.amount;
                        return acc;
                    }, 0),
                pending: consultsByMonth[month]
                    .filter(
                        (consult: Consult) =>
                            !['won', 'lost'].includes(consult.stage)
                    )
                    .reduce((acc: number, consult: Consult) => {
                        // @ts-ignore
                        acc += consult.amount * multiplier[consult.stage];
                        return acc;
                    }, 0),
                lost: consultsByMonth[month]
                    .filter((consult: Consult) => consult.stage === 'lost')
                    .reduce((acc: number, consult: Consult) => {
                        acc -= consult.amount;
                        return acc;
                    }, 0),
            };
        });

        return amountByMonth;
    }, [data]);

    if (isPending)
        return (
            <>
                <Skeleton variant="rectangular" width="100%" height={50} />
                <Skeleton variant="rectangular" width="100%" height={50} />
                <Skeleton variant="rectangular" width="100%" height={50} />
            </>
        );
    const range = months.reduce(
        (acc, month) => {
            acc.min = Math.min(acc.min, month.lost);
            acc.max = Math.max(acc.max, month.won + month.pending);
            return acc;
        },
        { min: 0, max: 0 }
    );
    return (
        <Stack>
            <Box display="flex" alignItems="center" mb={1}>
                <Box mr={1} display="flex">
                    <AttachMoneyIcon color="disabled" fontSize="medium" />
                </Box>
                <Typography variant="h5" color="textSecondary">
                    Revenue
                </Typography>
            </Box>
            <Box height={400}>
                <ResponsiveBar
                    data={months}
                    indexBy="date"
                    keys={['won', 'pending', 'lost']}
                    colors={['#61cdbb', '#97e3d5', '#e25c3b']}
                    margin={{ top: 30, right: 50, bottom: 30, left: 0 }}
                    padding={0.3}
                    valueScale={{
                        type: 'linear',
                        min: range.min * 1.2,
                        max: range.max * 1.2,
                    }}
                    indexScale={{ type: 'band', round: true }}
                    enableGridX={true}
                    enableGridY={false}
                    enableLabel={false}
                    axisTop={{
                        tickSize: 0,
                        tickPadding: 12,
                    }}
                    axisBottom={{
                        legendPosition: 'middle',
                        legendOffset: 50,
                        tickSize: 0,
                        tickPadding: 12,
                    }}
                    axisLeft={null}
                    axisRight={{
                        format: (v: any) => `${Math.abs(v / 1000)}k`,
                        tickValues: 8,
                    }}
                    markers={
                        [
                            {
                                axis: 'y',
                                value: 0,
                                lineStyle: { strokeOpacity: 0 },
                                textStyle: { fill: '#2ebca6' },
                                legend: 'Won',
                                legendPosition: 'top-left',
                                legendOrientation: 'vertical',
                            },
                            {
                                axis: 'y',
                                value: 0,
                                lineStyle: {
                                    stroke: '#f47560',
                                    strokeWidth: 1,
                                },
                                textStyle: { fill: '#e25c3b' },
                                legend: 'Lost',
                                legendPosition: 'bottom-left',
                                legendOrientation: 'vertical',
                            },
                        ] as any
                    }
                />
            </Box>
        </Stack>
    );
};
