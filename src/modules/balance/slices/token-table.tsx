import { Table } from '@components/ui/table';

type TokenTableProps = {
  symbol: string;
  balance: number;
  priceUsd: number;
};

export const TokenTable = ({ data }: { data: TokenTableProps[] }) => {
  return (
    <div className='h-full max-h-48 overflow-y-scroll rounded-lg'>
      <Table aria-label='Table' selectionMode='none' className='bg-uiSecondaryBg border-0 border-none text-white'>
        <Table.Header className='bg-uiMutedPrimary'>
          <Table.Column>#</Table.Column>
          <Table.Column isRowHeader>Token</Table.Column>
          <Table.Column>Balance</Table.Column>
          <Table.Column>Price Ton</Table.Column>
        </Table.Header>
        <Table.Body>
          {data.map((token, index) => (
            <Table.Row key={index}>
              <Table.Cell>{index}</Table.Cell>
              <Table.Cell>{token.symbol}</Table.Cell>
              <Table.Cell>{token.balance}</Table.Cell>
              <Table.Cell>{token.priceUsd}$</Table.Cell>
            </Table.Row>
          ))}
        </Table.Body>
      </Table>
    </div>
  );
};
