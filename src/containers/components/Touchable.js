import React from 'react'
import PropTypes from 'prop-types'
import {
  StyleSheet,
  Platform,
  TouchableOpacity,
  TouchableNativeFeedback
} from 'react-native'
import { isAndroid } from '../../constants/constants'
import { View } from '../'

const Android21Plus = isAndroid && Platform.Version >= 21

const TouchableComponent = !isAndroid
  ? TouchableOpacity
  : TouchableNativeFeedback

export default class Touchable extends React.PureComponent {
  constructor(props) {
    super(props)

    this.useForeground =
      isAndroid && TouchableNativeFeedback.canUseNativeForeground()
  }

  render() {
    const { isEnabled, style, contentContainerStyle } = this.props
    const content = (
      <View
        justifyCenter
        alignCenter
        style={[
          style,
          contentContainerStyle
        ]}
      >
        {this.props.children}
      </View>
    )

    return isEnabled ? this._wrapTouchable(content) : content
  }

  _wrapTouchable = content => {
    const {
      style,
      borderless,
      touchStyle,
      touchColor,
      light,
      ...props
    } = this.props

    let background = undefined
    if (Android21Plus) {
      background = TouchableNativeFeedback.SelectableBackgroundBorderless()
    } else if (isAndroid) {
      background = TouchableNativeFeedback.SelectableBackground()
    }

    return (
      <TouchableComponent
        onPress={this.props.onPress}
        onLongPress={this.props.onLongPress}
        onPressIn={this.props.onPressIn}
        onPressOut={this.props.onPressOut}
        useForeground={this.useForeground && !borderless}
        background={background}
        style={[style, touchStyle]}
        {...props}
      >
        {content}
      </TouchableComponent>
    )
  }
}

Touchable.propTypes = {
  onPress: PropTypes.func,
  onLongPress: PropTypes.func,
  onPressIn: PropTypes.func,
  onPressOut: PropTypes.func,
  color: PropTypes.any,
  touchColor: PropTypes.string,
  light: PropTypes.bool, // eslint-disable-line react/boolean-prop-naming
  isEnabled: PropTypes.bool
}

Touchable.defaultProps = {
  isEnabled: true
}
