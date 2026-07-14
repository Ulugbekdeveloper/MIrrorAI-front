import { STYLE_GOAL_OPTIONS } from '../../options';
import type { StyleGoalKey } from '../../types';
import { OptionList } from '../OptionList';
import { StepHeading } from '../StepHeading';

type Props = {
  selectedGoal: StyleGoalKey | null;
  onSelectGoal: (goal: StyleGoalKey) => void;
};

export function StyleGoalStep({ selectedGoal, onSelectGoal }: Props) {
  return (
    <>
      <StepHeading title="What do you want most from Stylo?" />
      <OptionList
        options={STYLE_GOAL_OPTIONS}
        selectedKey={selectedGoal}
        onSelect={onSelectGoal}
      />
    </>
  );
}
