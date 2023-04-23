import React, { useState } from 'react';

function DropdownListItem(props) {

const [open, setOpen] = useState(false);

	return (
		<li>
			<div
				className='dropdown-item-header'
				onClick={()=>setOpen(!open)}>
				<p>{props.title}</p>
				{open?<p className='minus'>-</p>:<p className='plus'>+</p>}
			</div>
			<div
				className={`dropdown-item-detail ${open?'show':'hide'}`}>
				{props.children}
			</div>
		</li>
	);
}

export default DropdownListItem;
