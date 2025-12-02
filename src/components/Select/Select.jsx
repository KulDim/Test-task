import { useState, useEffect, useRef } from "react";
import "./Select.css";

function Select({ setData, options, searchKeys, selectOption, placeholder, setValueNot = false }) {
	const [value, setValue] = useState("");
	const [isOpen, setIsOpen] = useState(false);
	const [filteredOptions, setFilteredOptions] = useState(options);
	const selectRef = useRef(null);

	useEffect(() => {
		const handleClickOutside = (event) => {
			if (selectRef.current && !selectRef.current.contains(event.target)) {
				setIsOpen(false);
			}
		};

		document.addEventListener("mousedown", handleClickOutside);
		return () => {
			document.removeEventListener("mousedown", handleClickOutside);
		};
	}, []);

	useEffect(() => {
		if (!value.trim()) {
			setFilteredOptions(options);
			return;
		}

		const searchValue = value.toLowerCase();
		const filtered = options.filter((item) => {
			return searchKeys.some((key) => {
				const itemValue = item[key];
				if (itemValue && typeof itemValue === "string") {
					return itemValue.toLowerCase().includes(searchValue);
				}
				return false;
			});
		});

		setFilteredOptions(filtered);
	}, [value, options, searchKeys]);

	const handleSelectOption = (item) => {
		setData(item);
		if (setValueNot) {
			setValue("");
		} else {
			setValue(item[searchKeys[0]]);
		}
		setIsOpen(false);
	};

	return (
		<div ref={selectRef} className="select-wrapper">
			<div className="input-container">
				<input
					value={value}
					onChange={(e) => {
						setValue(e.target.value);
						setIsOpen(true);
					}}
					onClick={() => setIsOpen(true)}
					type="text"
					className="order-input"
					placeholder={placeholder}
				/>
				<div>
					{!options.length > 0 && (
						<div className="select-loader">
							<div className="spinner"></div>
						</div>
					)}
				</div>
			</div>
			{isOpen && filteredOptions.length > 0 && (
				<div className="select-container">
					{filteredOptions.map((item) => {
						return (
							<div key={item.id} className="select-item" onClick={() => handleSelectOption(item)}>
								{selectOption(item)}
							</div>
						);
					})}
				</div>
			)}
			{isOpen && filteredOptions.length === 0 && (
				<div className="select-container">
					<div className="select-item no-results">Ничего не найдено</div>
				</div>
			)}
		</div>
	);
}

export default Select;
