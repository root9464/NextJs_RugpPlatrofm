import { zodResolver } from '@hookform/resolvers/zod';
import { SubmitHandler, useForm } from 'react-hook-form';
import { toast } from 'sonner';
import { ZodSchema } from 'zod';
import { composeTailwindRenderProps, FieldGroup } from './ui';

import SubmitArrow from '@assets/svg/send-arrow.svg';
import Image from 'next/image';

type SearchInputProps = {
  placeholder: string;
  className?: string;
  schema: ZodSchema<{ search: string }>;
  func: (data: string) => void;
};

export const SearchInput = ({ placeholder, className, func, schema }: SearchInputProps) => {
  const {
    register,
    handleSubmit,
    watch,
    reset,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(schema),
    defaultValues: { search: '' },
    mode: 'onSubmit',
  });

  const searchValue = watch('search');

  const onSubmit: SubmitHandler<{ search: string }> = ({ search }) => {
    func(search);
    reset({ search: '' });
  };

  const onError = () => {
    if (errors.search) {
      toast.error('Error on search', {
        description: errors.search.message,
        position: 'bottom-right',
        unstyled: true,
        classNames: {
          toast: 'bg-uiSecondaryBg rounded-lg px-3 py-2 w-[200px] shadow-lg flex flex-row items-center gap-2',
          title: 'text-white text-sm',
          description: 'text-red-500 text-xs',
          error: 'text-red-500',
        },
      });
    }
  };
  return (
    <FieldGroup className={composeTailwindRenderProps(className, 'border-uiMutedPrimary bg-uiSecondaryBg text-uiSecondaryText border pr-1 pl-3')}>
      <form onSubmit={handleSubmit(onSubmit, onError)} className='flex w-fit flex-row items-center justify-between gap-2'>
        <input
          placeholder={placeholder}
          {...register('search', { required: true })}
          autoComplete='off'
          className='placeholder:text-uiSecondaryText w-full bg-transparent text-white outline-none'
        />

        {searchValue && (
          <button type='submit' className='bg-uiMutedPrimary flex size-8 flex-row items-center justify-center rounded-lg'>
            <Image src={SubmitArrow} alt='Search' width={16} height={16} />
          </button>
        )}
      </form>
    </FieldGroup>
  );
};
