import { useEffect, useState } from "react";
import "./Order.css";
import { createApiClient } from "../../services/api";
import Select from "./Select/Select";

function Order() {
	const [token, setToken] = useState(localStorage.getItem("token") || "");
	const [isAuth, setisAuth] = useState(false);

	const [phone, setPhone] = useState({});
	const [payboxe, setPayboxe] = useState({});
	const [warehouse, setWarehouse] = useState({});
	const [organization, setOrganization] = useState({});
	const [price_type, setPrice_type] = useState({});
	const [webapp, setWebapp] = useState({});

	const [contacts, setContacts] = useState([]);
	const [payboxes, setPayboxes] = useState([]);
	const [warehouses, setWarehouses] = useState([]);
	const [organizations, setOrganizations] = useState([]);
	const [price_types, setPrice_types] = useState([]);
	const [webapps, setWebapps] = useState([]);

	const [basket, setBasket] = useState([]);

	async function onSubmitToken() {
		if (!token) return;
		const apiClient = createApiClient(token);
		const result = await apiClient.checkToken();
		if (result.isValid) {
			localStorage.setItem("token", token);
			setisAuth(true);
		}
	}

	useEffect(() => {
		if (!webapp) return;
		if (Object.keys(webapp).length === 0) return;

		const exists = basket.some((item) => item.id === webapp.id);

		setWebapp({});

		if (exists) {
			return;
		}

		const productWithQuantity = {
			...webapp,
			quantity: 1,
		};

		setBasket([...basket, productWithQuantity]);
	}, [webapp]);

	// async function getDataProduct(id) {
	// 	const apiClient = await createApiClient(token);
	//     const alt_prices = await apiClient.alt_prices(id);
	// 	console.log(alt_prices);
	// }

	async function getDataToServer() {
		const apiClient = await createApiClient(token);

		const contragents = await apiClient.contragents();
		setContacts(contragents.result);

		const payboxes = await apiClient.payboxes();
		setPayboxes(payboxes.result);

		const warehouses = await apiClient.warehouses();
		setWarehouses(warehouses.result);

		const organizations = await apiClient.organizations();
		setOrganizations(organizations.result);

		const price_types = await apiClient.price_types();
		setPrice_types(price_types.result);

		const webapps = await apiClient.webapps();
		setWebapps(webapps.result);

		console.log(webapps.result);

		// contragents
	}

	useEffect(() => {
		if (token) setisAuth(true);
		if (!isAuth) return;
		getDataToServer();
		console.log(isAuth);
	}, [isAuth]);

	function selectContact(item) {
		return (
			<>
				<div>
					{item.phone} - {item.name}
				</div>
			</>
		);
	}

	function selectDeff(item) {
		return (
			<>
				<div>{item.name}</div>
			</>
		);
	}

	function selecOrganization(item) {
		return (
			<>
				<div>{item.full_name}</div>
			</>
		);
	}

	const increaseQuantity = (id) => {
		setBasket(basket.map((item) => (item.id === id ? { ...item, quantity: item.quantity + 1 } : item)));
	};

	const decreaseQuantity = (id) => {
		setBasket(
			basket.map((item) => {
				if (item.id === id) {
					const newQuantity = Math.max(1, item.quantity - 1);
					return { ...item, quantity: newQuantity };
				}
				return item;
			})
		);
	};

    const calculateTotal = () => {
		return basket.reduce((sum, item) => {
			const price = item.prices?.[0]?.price || 0;
			return sum + (price * item.quantity);
		}, 0);
	};

	return (
		<div className="order-page">
			<div className="order-title">Токен</div>
			<input
				type="text"
				className="order-input"
				placeholder="Введите токен"
				value={token}
				onChange={(e) => setToken(e.target.value)}
			/>
			<button className="order-button" onClick={onSubmitToken}>
				Продолжить
			</button>
			{isAuth && (
				<>
					<div className="order-title">Контрагент (поиск по телефону)</div>
					<Select
						setData={(e) => setPhone(e)}
						options={contacts}
						searchKeys={["phone", "name"]}
						selectOption={selectContact}
						placeholder={"Введите номер телефона"}
					/>
					{phone && (
						<div className="order-phone">
							Выбран контрагент: <span className="weight">{phone.name}</span>
						</div>
					)}

					<div className="order-title">Счёт поступления</div>
					<Select
						setData={(e) => setPayboxe(e)}
						options={payboxes}
						searchKeys={["name"]}
						selectOption={selectDeff}
						placeholder={"Выберите..."}
					/>

					<div className="order-title">Склад отгрузки</div>
					<Select
						setData={(e) => setWarehouse(e)}
						options={warehouses}
						searchKeys={["name"]}
						selectOption={selectDeff}
						placeholder={"Выберите..."}
					/>

					<div className="order-title">Организация</div>
					<Select
						setData={(e) => setOrganization(e)}
						options={organizations}
						searchKeys={["full_name"]}
						selectOption={selecOrganization}
						placeholder={"Выберите..."}
					/>

					<div className="order-title">Тип цены</div>
					<Select
						setData={(e) => setPrice_type(e)}
						options={price_types}
						searchKeys={["name"]}
						selectOption={selectDeff}
						placeholder={"Выберите..."}
					/>

					<div className="order-title">Поиск товара</div>
					<Select
						setData={(e) => setWebapp(e)}
						options={webapps}
						searchKeys={["name"]}
						selectOption={selectDeff}
						placeholder={"Выберите..."}
						setValueNot={true}
					/>

					{basket.map((item) => {
						const price = item.prices?.[0]?.price || 0;
						const totalPrice = price * item.quantity;
						return (
							<div className="basket-item">
								<div>
									<div className="basket-title">{item.name}</div>
									<div>{totalPrice} ₽</div>
								</div>
								<div className="basket-control">
									<button className="basket-button" onClick={() => decreaseQuantity(item.id)}>
										-
									</button>
									<span>{item.quantity}</span>
									<button className="basket-button" onClick={() => increaseQuantity(item.id)}>
										+
									</button>
								</div>
							</div>
						);
					})}
				</>
			)}

			<div className="basket-summary">
				<div className="basket-summary-item">
					<div>Контрагент:</div>
					<div className="weight">{phone.name}</div>
				</div>
				<div className="basket-summary-item">
					<div>Итого товаров:</div>
					<div className="weight">{basket.length}</div>
				</div>
				<div className="basket-summary-item">
					<div>Сумма:</div>
					<div className="weight">{calculateTotal()} ₽</div>
				</div>
			</div>
			<button className="order-button">Создать продажу</button>
			<button className="order-button" style={{ background: "#f3f4f6", color: "#000" }}>Создать и провести</button>
		</div>
	);
}

export default Order;