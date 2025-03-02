import { BalanceModule } from '@/modules/balance/module';
import { PageLayout } from '@components/layouts/page.layout';

export default function Home() {
  return (
    <PageLayout className='grid grid-cols-[73%_27%]'>
      <div className='flex h-full w-full flex-col gap-3' id='workspace'>
        <div className='grid h-full w-full grid-cols-[30%_70%]'>
          <div className='flex h-full w-full flex-col gap-5'>
            <div className='h-[280px] w-full bg-lime-400' />

            <BalanceModule />
          </div>
        </div>

        <div className='h-[108px] w-full bg-lime-400' id='line'>
          f
        </div>
      </div>
    </PageLayout>
  );
}
