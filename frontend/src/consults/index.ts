/* eslint-disable import/no-anonymous-default-export */
import * as React from 'react';
const ConsultList = React.lazy(() => import('./ConsultList'));

export default {
    list: ConsultList,
};
