import { Table } from '@components/ui/table';
import { UserBalance } from '../helpers/serialize-balance';

export const TokenTable = ({ tokens }: { tokens: UserBalance[] }) => {
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
          {tokens.map((token, index) => (
            <Table.Row key={index}>
              <Table.Cell>{index}</Table.Cell>
              <Table.Cell>{token.metadata.symbol}</Table.Cell>
              <Table.Cell>{token.wallet_info.balance}</Table.Cell>
              <Table.Cell>0$</Table.Cell>
            </Table.Row>
          ))}
        </Table.Body>
      </Table>
    </div>
  );
};
