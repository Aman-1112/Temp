import React, { useEffect, useState, useRef } from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import Slider from '@mui/material/Slider';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';

import Card from '../Card';
import DropdownListItem from './DropsdownListItem';
import { fetchSearchedProducts } from '../actions';
import './SearchList.css';

function SearchList(props) {
	const [selectedCategory, setSelectedCategory] = useState([]);
	const [searchList, setSearchList] = useState([]);
	const [filteredSearchList, setFilteredSearchList] = useState([]);
	const [initial, setInitial] = useState(true); //   Just to check if filter button has been clicked once
	let List;

	/**********material UI slider****/
	const [value1, setValue1] = useState([0, 200]);
	const minDistance = 10;
	const handleChange1 = (event, newValue, activeThumb) => {
		if (!Array.isArray(newValue)) {
			return;
		}

		if (activeThumb === 0) {
			setValue1([Math.min(newValue[0], value1[1] - minDistance), value1[1]]);
		} else {
			setValue1([value1[0], Math.max(newValue[1], value1[0] + minDistance)]);
		}
	};
	/*********************/

	const searchItem = props.match.params.searchItem;
	useEffect(() => {
		//TODO	making req for searched item and then match current redux store for matching items so to discard them
		props.fetchSearchedProducts(searchItem);
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, []);

	const firstUpdate = useRef(true);
	const regex = new RegExp(searchItem, 'ig');
	useEffect(() => {
		//once searched item has been fetched so from second time it will run
		if (firstUpdate.current) {
			firstUpdate.current = false;
			return;
		}

		let newProductList = props.ProductList.filter((ele) =>
			//fetching from redux store by matching with regex
			ele.name.match(regex)
		);
		setSearchList(newProductList);
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [props]); //! if props didn't change coz if it is already there in redux store then what

	function handleClick() {
		setInitial(false);
		/***Filter Over Range****/
		let min = value1[0];
		let max = value1[1];
		let productList = searchList.filter(
			(ele) => ele.price >= min && ele.price <= max
		);

		/***Filter Over Category****/
		if (selectedCategory.length)
			productList = productList.filter((ele) =>
				selectedCategory.includes(ele.category)
			);

		/***Filter Over Order****/
		var select = document.querySelector('.form-select');
		var value = select.options[select.selectedIndex].value;
		// console.log(value);
		if (value === 'Desc')
			productList = productList.sort((a, b) => b.price - a.price);
		else productList = productList.sort((a, b) => a.price - b.price);

		setFilteredSearchList(productList);
	}

	function toggle(e) {
		if (selectedCategory.includes(e.target.id)) {
			let x = selectedCategory.filter((ele) => ele !== e.target.id);
			setSelectedCategory(x);
		} else {
			setSelectedCategory([...selectedCategory, e.target.id]);
		}
	}

	if (searchList.length !== 0) {
		if (initial) {
			//Only initial time show searchList ,every other time show filteredList
			List = searchList;
		} else {
			List = filteredSearchList;
		}
		return (
			<>
				<Link to='/' className='btn btn-light'>
					<ArrowBackIcon />
				</Link>
				<div className='d-flex flex-row'>
					<div className='border-end w-25'>
						<ul className='filter-tools'>
							<DropdownListItem name='price-range' title='Price Range'>
								<Slider
									getAriaLabel={() => 'Minimum distance'}
									value={value1}
									onChange={handleChange1}
									min={0}
									max={200}
									valueLabelDisplay='auto'
									disableSwap
								/>
								Min{' '}
								<input
									className='w-25 text-center'
									type='text'
									value={value1[0]}
									readOnly></input>{' '}
								- Max{' '}
								<input
									className='w-25 text-center'
									type='text'
									value={value1[1]}
									readOnly></input>
							</DropdownListItem>
							<DropdownListItem name='category' title='Category'>
								<input id='men' onClick={toggle} type='checkbox'></input>
								<label htmlFor='men'>Men</label>
								<input id='women' onClick={toggle} type='checkbox'></input>
								<label htmlFor='women'>Women</label>
								<input
									id='electronics'
									onClick={toggle}
									type='checkbox'></input>
								<label htmlFor='electronics'>Electronics</label>
							</DropdownListItem>
							<DropdownListItem name='sort-by-price' title='Sort by price'>
								<select
									className='form-select'
									style={{ width: '20%', display: 'inline-block' }}>
									<option value='Asc'>Low to High</option>
									<option value='Desc'>High to Low</option>
								</select>
								<button onClick={handleClick}>Apply Filter</button>
							</DropdownListItem>
						</ul>
					</div>
					<div className='text-center'>
						<p>Showing results for {searchItem} ...</p>
						{List.map((ele, index) => (
							<Card
								key={index}
								id={ele._id}
								name={ele.name}
								imageUrl={ele.image}
								brand={ele.brand}
								price={ele.price}
								rating={ele.rating}
							/>
						))}
					</div>
				</div>
			</>
		);
	} else {
		return (
			<>
				<Link to='/' className='btn btn-secondary'>
					<ArrowBackIcon />
				</Link>
				<div className='m-5 d-flex justify-content-center'>
					<div className='spinner-border' role='status'>
						<span className='visually-hidden'>Loading...</span>
					</div>
				</div>
			</>
		);
	}
}
function mapStateToProps(state) {
	return { ProductList: state.fetchProductReducer };
}
export default connect(mapStateToProps, { fetchSearchedProducts })(SearchList);
