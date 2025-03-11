import { Table } from '@components/ui/table';
import { Jetton } from '../hooks/useUserBalance';

export const TokenTable = ({ tokens }: { tokens: Jetton[] }) => {
  return (
    <Table aria-label='Table' selectionMode='none' className='bg-uiSecondaryBg rounded-lg border-0 border-none text-white'>
      <Table.Header>
        <Table.Column>#</Table.Column>
        <Table.Column isRowHeader>Token</Table.Column>
        <Table.Column>Balance</Table.Column>
        <Table.Column>Price Ton</Table.Column>
      </Table.Header>
      <Table.Body>
        {tokens.map((token, index) => (
          <Table.Row key={index}>
            <Table.Cell>{index}</Table.Cell>
            <Table.Cell>{token.symbol}</Table.Cell>
            <Table.Cell>{token.balance}</Table.Cell>
            <Table.Cell>{token.price_ton.toFixed(4)}</Table.Cell>
          </Table.Row>
        ))}
      </Table.Body>
    </Table>
  );
};
