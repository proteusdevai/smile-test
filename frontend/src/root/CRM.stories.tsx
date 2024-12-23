import type { Meta, StoryObj } from '@storybook/react';

import { PMS } from './PMS';
import { dataProvider, authProvider } from '../providers/fakerest';

const meta: Meta<typeof PMS> = {
    component: PMS,
};

export default meta;
type Story = StoryObj<typeof PMS>;

export const Basic: Story = {
    args: {
        dataProvider,
        authProvider,
    },
};

export const Layout: Story = {
    args: {
        dataProvider,
        authProvider,
        layout: ({ children }) => <div>{children}</div>,
    },
};
