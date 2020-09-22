import React from 'react'
import { useDrag, useDrop } from 'react-dnd';
import IconButton from '@material-ui/core/IconButton';
import DeleteIcon from '@material-ui/icons/Delete';
import RadioButtonUncheckedIcon from '@material-ui/icons/RadioButtonUnchecked';

const DragButtonAction: React.FC<{ itemId: number }> = ({ itemId }) => {
    return (
	<div>
	    <IconButton>
		<RadioButtonUncheckedIcon />
	    </IconButton>
	</div>
    );
}

export default DragButtonAction;
