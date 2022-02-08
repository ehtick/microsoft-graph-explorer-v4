import { IDropdownOption, Dropdown } from '@fluentui/react';
import React from 'react';
import { injectIntl } from 'react-intl';
import { useDispatch, useSelector } from 'react-redux';
import { httpMethods, IQueryInputProps } from '../src/types/query-runner';

import { IRootState } from '../src/types/root';
import { setSampleQuery } from '../src/app/services/actions/query-input-action-creators';
import { getStyleFor } from '../src/app/utils/http-methods.utils';
import { parseSampleUrl } from '../src/app/utils/sample-url-generation';
import { translateMessage } from '../src/app/utils/translate-messages';
import SubmitButton from '../src/app/views/common/submit-button/SubmitButton';
import { queryRunnerStyles } from '../src/app/views/query-runner/QueryRunner.styles';
import { AutoComplete } from '../src/app/views/query-runner/query-input/auto-complete';

const QueryInput = (props: IQueryInputProps) => {
  const {
    handleOnRunQuery,
    handleOnMethodChange,
    handleOnVersionChange
  } = props;

  const dispatch = useDispatch();


  const urlVersions: IDropdownOption[] = [
    { key: 'v1.0', text: 'v1.0' },
    { key: 'beta', text: 'beta' }
  ];

  const { sampleQuery, authToken,
    isLoadingData: submitting } = useSelector((state: IRootState) => state);
  const authenticated = !!authToken.token;

  const showError = !authenticated && sampleQuery.selectedVerb !== 'GET';
  const verbSelector: any = queryRunnerStyles().verbSelector;
  verbSelector.title = {
    ...verbSelector.title,
    background: getStyleFor(sampleQuery.selectedVerb)
  };

  const contentChanged = (value: string) => {
    const query = { ...sampleQuery, ...{ sampleUrl: value } };
    changeUrlVersion(value);
    dispatch(setSampleQuery(query));
  };

  const changeUrlVersion = (newUrl: string) => {
    const query = { ...sampleQuery };
    const { queryVersion: newQueryVersion } = parseSampleUrl(newUrl);
    const { queryVersion: oldQueryVersion } = parseSampleUrl(query.sampleUrl);

    if (newQueryVersion !== oldQueryVersion) {
      if (newQueryVersion === 'v1.0' || newQueryVersion === 'beta') {
        const sampleQueryToSet = { ...query };
        sampleQueryToSet.selectedVersion = newQueryVersion;
        sampleQueryToSet.sampleUrl = newUrl;
        dispatch(setSampleQuery(sampleQueryToSet));
      }
    }
  }

  const runQuery = () => {
    if (!sampleQuery.sampleUrl) {
      return;
    }
    // allows the state to be populated with the new url before running it
    setTimeout(() => {
      handleOnRunQuery();
    }, 500);
  };

  return (
    <div className='row'>
      <div className='col-xs-12 col-lg-2'>
        <Dropdown
          ariaLabel={translateMessage('HTTP request method option')}
          selectedKey={sampleQuery.selectedVerb}
          options={httpMethods}
          styles={verbSelector}
          errorMessage={showError ? translateMessage('Sign in to use this method') : undefined}
          onChange={(event, method) => handleOnMethodChange(method)}
        />
      </div>
      <div className='col-xs-12 col-lg-2'>
        <Dropdown
          ariaLabel={translateMessage('Microsoft Graph API Version option')}
          selectedKey={sampleQuery.selectedVersion || 'v1.0'}
          options={urlVersions}
          onChange={(event, method) => handleOnVersionChange(method)}
        />
      </div>
      <div className='col-xs-12 col-lg-6'>
        <AutoComplete
          contentChanged={contentChanged}
          runQuery={runQuery}
        />
      </div>
      <div className='col-xs-12 col-lg-2'>
        <SubmitButton
          className='run-query-button'
          text={translateMessage('Run Query')}
          disabled={showError || !sampleQuery.sampleUrl}
          role='button'
          handleOnClick={() => runQuery()}
          submitting={submitting}
          allowDisabledFocus={true}
        />
      </div>
    </div>)
}

// @ts-ignore
const IntlQueryInput = injectIntl(QueryInput);
// @ts-ignore
export default IntlQueryInput;