import { IButtonProps, TeachingBubble } from '@fluentui/react';
import React from 'react';
import { FormattedMessage } from 'react-intl';
import { ITourTooltipRenderProps } from '../utils/types'
import { ADVANCED_TOUR_LENGTH, BEGINNER_TOUR_LENGTH } from '../utils/steps';


export const TourTip = ( { tooltipProps, index, step, backProps, primaryProps, skipProps }
: ITourTooltipRenderProps ) => {
  const tourLength = step.advancedStep ? ADVANCED_TOUR_LENGTH-1 : BEGINNER_TOUR_LENGTH-1;

  const tipPrimaryButton : IButtonProps = React.useMemo(
    () => ({
      children: <FormattedMessage id={index === tourLength ? 'Close Tour' : 'Next'} />,
      onClick: primaryProps.onClick
    }),[]
  )

  const tipSecondaryButton : IButtonProps = React.useMemo(
    () => ({
      children: <FormattedMessage id={index > 0 ? 'Previous' : '' } /> ,
      onClick: backProps.onClick,
      style: {color: 'white'}
    }),[]
  )

  const closeTour : IButtonProps = React.useMemo(
    () => ({
      children: <FormattedMessage id='Close Tour' />,
      onClick: skipProps.onClick,
      style: {color: 'white'}
    }),[]
  )

  return(
    <div {...tooltipProps} >
      <TeachingBubble
        target={step.target}
        headline={step.title as string}
        calloutProps={{
          directionalHint: step.directionalHint,
          preventDismissOnScroll: true,
          preventDismissOnLostFocus: true,
          preventDismissOnResize: true,
          setInitialFocus: true
        }}
        hasCloseButton={true}
        onDismiss={skipProps.onClick}
        isWide={true}
        primaryButtonProps={tipPrimaryButton}
        secondaryButtonProps={ index> 0 ? tipSecondaryButton : closeTour}
        footerContent={ step.infoStep ? ' ' : <span >{index} of {tourLength} </span> }
      >
        <div style={{textAlign: 'left', lineHeight:'1.5'}}>
          {step.content}
        </div>

      </TeachingBubble>
    </div>
  )

};