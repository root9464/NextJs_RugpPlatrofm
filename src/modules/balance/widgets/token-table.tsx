'use client';

import TEST_BALANCE_DATA from '@/shared/tmp/balance.json';
import { Table } from '@components/ui';

export const TokenTable = () => {
  return (
    <Table aria-label='Table' selectionMode='none' className='bg-uiSecondaryBg rounded-lg border-0 border-none text-white'>
      <Table.Header>
        <Table.Column>#</Table.Column>
        <Table.Column isRowHeader>Token</Table.Column>
        <Table.Column>Balance</Table.Column>
        <Table.Column>Value</Table.Column>
      </Table.Header>
      <Table.Body>
        {TEST_BALANCE_DATA.map((token, index) => (
          <Table.Row key={index}>
            <Table.Cell>{index}</Table.Cell>
            <Table.Cell>{token.symbol}</Table.Cell>
            <Table.Cell>{token.balance}</Table.Cell>
            <Table.Cell>{token.price_ton}</Table.Cell>
          </Table.Row>
        ))}
      </Table.Body>
    </Table>
  );
};
