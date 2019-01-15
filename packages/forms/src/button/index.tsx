import * as mdiIcons from '@mdi/js';
import Icon from '@mdi/react';
import { Theme } from '@meetfranz/theme';
import classnames from 'classnames';
import CSS from 'csstype';
import { observer } from 'mobx-react';
import React, { Component } from 'react';
import injectStyle from 'react-jss';
import Loader from 'react-loader';

import { IFormField, IWithStyle } from '../typings/generic';

type ButtonType = 'primary' | 'secondary' | 'success' | 'danger' | 'warning' | 'inverted';

interface IProps extends React.InputHTMLAttributes<HTMLButtonElement>, IFormField, IWithStyle {
  buttonType?: ButtonType;
  stretch?: boolean;
  loaded?: boolean;
  busy?: boolean;
  icon?: keyof typeof mdiIcons;
}

interface IState {
  busy: boolean;
}

const styles = (theme: Theme) => ({
  button: {
    borderRadius: theme.borderRadiusSmall,
    border: 'none',
    display: 'flex',
    position: 'relative' as CSS.PositionProperty,
    transition: 'background .5s',
    textAlign: 'center' as CSS.TextAlignProperty,
    outline: 'none',
    alignItems: 'center',
    padding: 0,
    width: (props: IProps) => (props.stretch ? '100%' : 'auto') as CSS.WidthProperty<string>,
    fontSize: theme.uiFontSize,
  },
  label: {
    margin: '10px 20px',
    width: '100%',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  primary: {
    background: theme.buttonPrimaryBackground,
    color: theme.buttonPrimaryTextColor,

    '& svg': {
      fill: theme.buttonPrimaryTextColor,
    },
  },
  secondary: {
    background: theme.buttonSecondaryBackground,
    color: theme.buttonSecondaryTextColor,

    '& svg': {
      fill: theme.buttonSecondaryTextColor,
    },
  },
  success: {
    background: theme.buttonSuccessBackground,
    color: theme.buttonSuccessTextColor,

    '& svg': {
      fill: theme.buttonSuccessTextColor,
    },
  },
  danger: {
    background: theme.buttonDangerBackground,
    color: theme.buttonDangerTextColor,

    '& svg': {
      fill: theme.buttonDangerTextColor,
    },
  },
  warning: {
    background: theme.buttonWarningBackground,
    color: theme.buttonWarningTextColor,

    '& svg': {
      fill: theme.buttonWarningTextColor,
    },
  },
  inverted: {
    background: theme.buttonInvertedBackground,
    color: theme.buttonInvertedTextColor,
    border: theme.buttonInvertedBorder,

    '& svg': {
      fill: theme.buttonInvertedTextColor,
    },
  },
  disabled: {
    opacity: theme.inputDisabledOpacity,
  },
  loader: {
    position: 'relative' as CSS.PositionProperty,
    width: 20,
    height: 18,
    zIndex: 9999,
  },
  loaderContainer: {
    width: (props: IProps): string => (!props.busy ? '0' : '40px'),
    height: 20,
    overflow: 'hidden',
    transition: 'all 0.3s',
    marginLeft: (props: IProps): number => !props.busy ? 10 : 20,
    marginRight: (props: IProps): number => !props.busy ? -10 : -20,
    position: (props: IProps): CSS.PositionProperty => props.stretch ? 'absolute' : 'inherit',
  },
  icon: {
    marginLeft: -5,
    marginRight: 10,
  },
});

@observer
class ButtonComponent extends Component<IProps> {
  public static defaultProps = {
    type: 'button',
    disabled: false,
    onClick: () => null,
    buttonType: 'primary' as ButtonType,
    stretch: false,
    busy: false,
  };

  state = {
    busy: false,
  };

  componentWillMount() {
    this.setState({ busy: this.props.busy });
  }

  componentWillReceiveProps(nextProps: IProps) {
    if (nextProps.busy !== this.props.busy) {
      if (this.props.busy) {
        setTimeout(() => {
          this.setState({ busy: nextProps.busy });
        },         300);
      } else {
        this.setState({ busy: nextProps.busy });
      }
    }
  }

  render() {
    const {
      classes,
      className,
      theme,
      disabled,
      id,
      label,
      type,
      onClick,
      buttonType,
      loaded,
      icon: iconName,
      busy: busyProp,
    } = this.props;

    const {
      busy,
    } = this.state;

    let icon = '';
    if (iconName && mdiIcons[iconName]) {
      icon = mdiIcons[iconName];
    } else if (iconName && !mdiIcons[iconName]) {
      console.warn(`Icon '${iconName}' was not found`);
    }

    let showLoader = false;
    if (loaded) {
      showLoader = !loaded;
      console.warn('Franz Button prop `loaded` will be deprecated in the future. Please use `busy` instead');
    }
    if (busy) {
      showLoader = busy;
    }

    return (
      <button
        id={id}
        type={type}
        onClick={onClick}
        className={classnames({
          [`${classes.button}`]: true,
          [`${classes[buttonType as ButtonType]}`]: true,
          [`${classes.disabled}`]: disabled,
          [`${className}`]: className,
        })}
        disabled={disabled}
      >
        <div className={classes.loaderContainer}>
          {showLoader && (
            <Loader
              loaded={false}
              width={4}
              scale={0.45}
              color={theme.buttonLoaderColor[buttonType!]}
              parentClassName={classes.loader}
            />
          )}
        </div>
        <div className={classes.label}>
          {icon && (
            <Icon
              path={icon}
              size={1}
              className={classes.icon}
            />
          )}
          {label}
        </div>
      </button>
    );
  }
}

export const Button = injectStyle(styles)(ButtonComponent);
