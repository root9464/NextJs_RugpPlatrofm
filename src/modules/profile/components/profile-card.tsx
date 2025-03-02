/* eslint-disable @next/next/no-img-element */
export const ProfileCard = () => {
  return (
    <div className='bg-uiSecondaryBg flex h-20 w-full flex-row items-center gap-4 rounded-lg px-4 py-2.5 text-white'>
      <img
        src='https://avatars.mds.yandex.net/i?id=eb4dd1a6259e2f73ae4fa926bb3106ac_l-3689421-images-thumbs&n=13'
        className='rounded-full object-cover object-center'
        alt='avatar'
        width={60}
        height={60}
      />

      <div className='flex flex-col'>
        <h3>ChannelName</h3>
        <p className='text-uiPrimaryText'>Chanel name</p>
        <p className='text-uiPrimaryText'>Chanel stat</p>
      </div>
    </div>
  );
};
