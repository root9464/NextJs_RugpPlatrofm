import { PageLayout } from '@/components/layouts/page.layout';
import { TimeLineModule } from '@/modules/timeline/module';
import { BalanceModule } from '@modules/balance/module';
import { HistoryBalanceModule } from '@modules/history-balance/module';
import { HistoryTransactionsModule } from '@modules/history-transactions/module';
import { ProfileModule } from '@modules/profile/module';

export default function IndexatorPage({ params }: { params: { address: string } }) {
  return (
    <PageLayout className='z-0 grid grid-cols-[73%_27%] gap-4'>
      <div className='flex h-full w-full flex-col gap-3' id='workspace'>
        <div className='grid h-full w-full grid-cols-[calc(30%-10px)_calc(70%-10px)] gap-5'>
          <div className='flex h-full w-full flex-col gap-5'>
            <ProfileModule />
            <BalanceModule address={params.address} />
          </div>

          <HistoryBalanceModule />
        </div>

        <TimeLineModule />
      </div>

      <HistoryTransactionsModule />
    </PageLayout>
  );
}
