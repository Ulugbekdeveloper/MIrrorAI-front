import { GENDER_OPTIONS } from '../../options';
import type { GenderKey } from '../../types';
import { OptionList } from '../OptionList';
import { StepHeading } from '../StepHeading';

type Props = {
  selectedGender: GenderKey | null;
  onSelectGender: (gender: GenderKey) => void;
};

export function GenderStep({ selectedGender, onSelectGender }: Props) {
  return (
    <>
      <StepHeading
        title="What's your gender?"
        subtitle="We ask this to personalize the styling for you"
      />
      <OptionList
        options={GENDER_OPTIONS}
        selectedKey={selectedGender}
        onSelect={onSelectGender}
      />
    </>
  );
}
