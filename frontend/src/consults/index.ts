/* eslint-disable import/no-anonymous-default-export */
import * as React from 'react';
const DealList = React.lazy(() => import('./ConsultList'));

export default {
    list: DealList,
};
