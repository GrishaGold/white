import { Fragment } from 'inferno';
import { useBackend } from '../backend';
import { Box, Button, Icon, NoticeBox, ProgressBar, Section } from '../components';
import { Window } from '../layouts';

export const Gateway = () => {
  return (
    <Window resizable>
      <Window.Content scrollable>
        <GatewayContent />
      </Window.Content>
    </Window>
  );
};

const GatewayContent = (props, context) => {
  const { act, data } = useBackend(context);
  const {
    gateway_present = false,
    gateway_status = false,
    current_target = null,
    destinations = [],
  } = data;
  if (!gateway_present) {
    return (
      <Section>
        <NoticeBox>
          Не привязаны врата
        </NoticeBox>
        <Button
          fluid
          onClick={() => act('linkup')}>
          Привязка
        </Button>
      </Section>
    );
  }
  if (current_target) {
    return (
      <Section
        title={current_target.name}>
        <Icon name="rainbow" size={4} color="green" />
        <Button
          fluid
          onClick={() => act("deactivate")}>
          Деактивация
        </Button>
      </Section>
    );
  }
  if (!destinations.length) {
    return (
      <Section>
        Не обнаружено других врат.
      </Section>
    );
  }
  return (
    <Fragment>
      {!gateway_status && (
        <NoticeBox>
          Врата не запитаны
        </NoticeBox>
      )}
      {destinations.map(dest => (
        <Section
          key={dest.ref}
          title={dest.name}>
          {dest.availible && (
            <Button
              fluid
              onClick={() => act('activate', {
                destination: dest.ref,
              })}>
              Активировать
            </Button>
          ) || (
            <Fragment>
              <Box m={1} textColor="bad">
                {dest.reason}
              </Box>
              {!!dest.timeout && (
                <ProgressBar
                  value={dest.timeout}>
                  Калибровка...
                </ProgressBar>
              )}
            </Fragment>
          )}
        </Section>
      ))}
    </Fragment>
  );
};
