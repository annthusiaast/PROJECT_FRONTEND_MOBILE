import React from 'react';
import { Modal, View, Pressable } from 'react-native';
import { colors } from '../../constants/styles/colors';

/**
 * Reusable modal shell (kebab-case filename version).
 * Props:
 *  - visible (bool)
 *  - onClose (fn)
 *  - children
 *  - dismissOnBackdrop (default true)
 *  - animationType (default 'fade')
 *  - overlayStyle, cardStyle (style overrides)
 */
const ModalWrapper = ({
	visible,
	onClose,
	children,
	dismissOnBackdrop = true,
	animationType = 'fade',
	overlayStyle,
	cardStyle,
}) => {
	return (
		<Modal
			transparent
			animationType={animationType}
			visible={!!visible}
			onRequestClose={onClose}
		>
			<View
				style={[
					{
						flex: 1,
						backgroundColor: 'rgba(0,0,0,0.45)',
						padding: 20,
						justifyContent: 'center',
						alignItems: 'center',
					},
					overlayStyle,
				]}
				accessible
			>
				{dismissOnBackdrop ? (
					<Pressable
						onPress={onClose}
						style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0 }}
					/>
				) : null}
				<View
					style={[
						{
							backgroundColor: colors?.white || '#fff',
							width: '92%',
							maxHeight: '85%',
							borderRadius: 14,
							padding: 20,
							shadowColor: '#000',
							shadowOpacity: 0.18,
							shadowRadius: 8,
							shadowOffset: { width: 0, height: 4 },
							elevation: 5,
						},
						cardStyle,
					]}
				>
					{children}
				</View>
			</View>
		</Modal>
	);
};

export default ModalWrapper;
