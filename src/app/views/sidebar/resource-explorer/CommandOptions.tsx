import { CommandBar, CommandBarButton, getTheme, IButtonProps, ICommandBarItemProps, ICommandBarStyles,
  IComponentAs, IContextualMenuItemStyles, PrimaryButton } from '@fluentui/react';
import React, { useState } from 'react';
import { FormattedMessage } from 'react-intl';

import { translateMessage } from '../../../utils/translate-messages';
import PathsReview from './panels/PathsReview';

interface ICommandOptions {
  version: string;
}

const CommandOptions = (props: ICommandOptions) => {
  const [isOpen, setIsOpen] = useState(false);
  const { version } = props;
  const theme = getTheme();
  const options: ICommandBarItemProps[] = [
    {
      key: 'preview',
      text: translateMessage('Preview collection'),
      iconProps: { iconName: 'View' },
      onClick: () => toggleSelectedResourcesPreview()
    }
  ];

  const toggleSelectedResourcesPreview = () => {
    let open = isOpen;
    open = !open;
    setIsOpen(open);
  }

  const itemStyles: Partial<IContextualMenuItemStyles> = {
    root: {
      border: '1px solid',
      borderColor: theme.palette.themePrimary,
      marginLeft: '-15px'
    }
  };
  const CustomButton: React.FunctionComponent<IButtonProps> = (props_: any) => {
    return <CommandBarButton {...props_} onClick={toggleSelectedResourcesPreview} styles={itemStyles}/>;
  };

  return (
    <div>
      <CommandBar
        items={options}
        ariaLabel='Selection actions'
        primaryGroupAriaLabel='Selection actions'
        farItemsGroupAriaLabel='More selection actions'
        buttonAs={CustomButton}
      />
      <PathsReview
        isOpen={isOpen}
        version={version}
        toggleSelectedResourcesPreview={toggleSelectedResourcesPreview}
      />
    </div>
  )
}

export default CommandOptions;
