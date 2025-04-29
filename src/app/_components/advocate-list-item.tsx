import { type Advocate } from "@/db/schema";
import { Phone } from "lucide-react";

const SpecialtyChip = ({ specialty }: { specialty: string }) => {
  return (
    <div className='inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs transition-colors bg-neutral-100 text-neutral-500 hover:bg-black/10 cursor-pointer max-w-full'>
      {specialty}
    </div>
  );
};

const formatPhoneNumber = (phoneNumber: number) =>
  phoneNumber.toString().replace(/(\d{3})(\d{3})(\d{4})/, "($1) $2-$3");

export default function AdvocateListItem({ advocate }: { advocate: Advocate }) {
  return (
    <div className='rounded-lg flex flex-col border bg-card text-card-foreground shadow-sm h-full overflow-hidden space-y-2 pt-6'>
      <div className='flex flex-col space-y-1.5 px-6'>
        <div className='flex items-center gap-4'>
          <span className='relative flex shrink-0 overflow-hidden rounded-full h-12 w-12 border border-neutral-200'>
            <span className='flex h-full w-full items-center justify-center rounded-full bg-cyan-50 text-cyan-500'>
              {advocate.firstName.charAt(0)}
              {advocate.lastName.charAt(0)}
            </span>
          </span>
          <div>
            <h3 className='text-lg font-semibold'>
              {advocate.firstName}
              <span className='text-cyan-500'> {advocate.lastName}</span>
              <span className='text-sm font-medium text-neutral-500 pl-2'>
                {advocate.degree}
              </span>
            </h3>
            <p className='text-sm text-neutral-800'>{advocate.city}</p>
          </div>
        </div>
      </div>

      <p className='text-sm font-medium text-neutral-500 px-6 flex-grow'>
        {advocate.yearsOfExperience} years of experience
      </p>

      <div className='flex flex-col items-start gap-2 px-6 py-2 flex-grow'>
        <span className='text-sm font-semibold text-neutral-600'>
          Specialties
        </span>
        <div className='flex items-center gap-2 text-sm flex-wrap'>
          {(advocate.specialties as string[])
            .slice(0, 4)
            .map((specialty: string) => (
              <SpecialtyChip key={specialty} specialty={specialty} />
            ))}
        </div>
      </div>
      <div className='flex items-center gap-2 text-sm border-t px-6 py-6 w-full bg-cyan-50'>
        <Phone className='w-4 h-4 text-neutral-500' />
        <a href={`tel:${advocate.phoneNumber}`} className='hover:underline'>
          {formatPhoneNumber(advocate.phoneNumber)}
        </a>
      </div>
    </div>
  );
}
