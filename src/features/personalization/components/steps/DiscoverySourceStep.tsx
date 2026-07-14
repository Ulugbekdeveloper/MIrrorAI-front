import { DISCOVERY_SOURCE_OPTIONS } from '../../options';
import type { DiscoverySourceKey } from '../../types';
import { OptionList } from '../OptionList';
import { StepHeading } from '../StepHeading';

type Props = {
  selectedSource: DiscoverySourceKey | null;
  onSelectSource: (source: DiscoverySourceKey) => void;
};

export function DiscoverySourceStep({ selectedSource, onSelectSource }: Props) {
  return (
    <>
      <StepHeading title="How did you find out about us?" />
      <OptionList
        options={DISCOVERY_SOURCE_OPTIONS}
        selectedKey={selectedSource}
        onSelect={onSelectSource}
      />
    </>
  );
}
