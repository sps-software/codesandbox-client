import React, { useEffect } from 'react';
import { Stack } from '@codesandbox/components';
import css from '@styled-system/css';

import { useOvermind } from 'app/overmind';
import { CreateTeamParams, RegistryForm } from './RegistryForm';
import { Alert } from './Alert';

export const RegistrySettings = () => {
  const { actions, state } = useOvermind();
  const [loading, setLoading] = React.useState(true);
  const [submitting, setSubmitting] = React.useState(false);

  const loadCurrentNpmRegistry = React.useCallback(async () => {
    setLoading(true);

    try {
      await actions.dashboard.fetchCurrentNpmRegistry({});
    } finally {
      setLoading(false);
    }
  }, [setLoading, actions.dashboard]);

  useEffect(() => {
    loadCurrentNpmRegistry();
  }, [loadCurrentNpmRegistry]);

  const onSubmit = async (params: CreateTeamParams) => {
    setSubmitting(true);
    try {
      await actions.dashboard.createOrUpdateCurrentNpmRegistry(params);
    } finally {
      setSubmitting(false);
    }
  };

  let alert: { message: string } | null = null;

  if (!state.activeTeamInfo?.joinedPilotAt) {
    alert = {
      message:
        'Your workspace needs to be in the pilot to use a custom npm registry',
    };
  }

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <>
      {alert && <Alert message={alert.message} />}
      <Stack
        css={css({
          backgroundColor: 'grays.900',
          paddingY: 8,
          paddingX: 11,
          border: '1px solid',
          borderColor: 'grays.500',
          borderRadius: 'medium',
          position: 'relative',
        })}
      >
        {alert && (
          <div
            id="disabled-overlay"
            style={{
              position: 'absolute',
              top: 0,
              bottom: 0,
              left: 0,
              right: 0,
              backgroundColor: 'rgba(0, 0, 0, 0.4)',
              pointerEvents: 'none',
            }}
          />
        )}
        <RegistryForm
          onSubmit={onSubmit}
          isSubmitting={submitting}
          registry={state.dashboard.workspaceSettings.npmRegistry}
          disabled={Boolean(alert)}
        />
      </Stack>
    </>
  );
};
